/**
 * Sobe o mock-api e todos os MFEs para desenvolvimento local.
 *
 * Envolve o `concurrently` porque duas coisas precisam acontecer antes dos dev
 * servers subirem em paralelo:
 *
 * 1. O cache de pacotes compartilhados do Native Federation precisa estar
 *    quente (ver prewarm-federation.mjs), senao os seis MFEs disparam o mesmo
 *    empacotamento esbuild ao mesmo tempo e estouram a memoria.
 * 2. Cada build do Angular abre por padrao ate 4 workers. Multiplicado por seis
 *    apps, isso sozinho ja esgota a memoria em maquinas menores, entao
 *    reduzimos o paralelismo interno de cada build.
 *
 * Ambas as variaveis podem ser sobrescritas pelo ambiente em maquinas folgadas.
 */
import { spawn } from 'node:child_process';
import { prewarmFederation } from './prewarm-federation.mjs';

process.env.NG_BUILD_MAX_WORKERS ??= '1';
process.env.NG_BUILD_PARALLEL_TS ??= '0';

const SERVERS = [
  { name: 'mock-api', color: 'white', script: 'npm:mock-api' },
  { name: 'shell', color: 'blue', script: 'npm:start:shell' },
  { name: 'simulacao', color: 'green', script: 'npm:start:simulacao' },
  { name: 'forms', color: 'yellow', script: 'npm:start:forms' },
  { name: 'uploads', color: 'magenta', script: 'npm:start:uploads' },
  { name: 'proposta', color: 'cyan', script: 'npm:start:proposta' },
  { name: 'tracking', color: 'red', script: 'npm:start:tracking' },
];

prewarmFederation();

const child = spawn(
  'npx',
  [
    'concurrently',
    '-n',
    SERVERS.map(s => s.name).join(','),
    '-c',
    SERVERS.map(s => s.color).join(','),
    ...SERVERS.map(s => `"${s.script}"`),
  ],
  { stdio: 'inherit', shell: true },
);

child.on('exit', code => process.exit(code ?? 0));
