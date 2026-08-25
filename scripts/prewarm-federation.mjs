/**
 * Pre-aquece o cache de pacotes compartilhados do Native Federation.
 *
 * Antes de servir um MFE, o Native Federation empacota via esbuild todos os
 * pacotes compartilhados (`shareAll` no federation.config.js). Com o cache
 * frio, subir os seis MFEs em paralelo dispara seis desses empacotamentos ao
 * mesmo tempo e o processo do esbuild morre por falta de memoria, resultando
 * em "Error bundling shared npm package" / "The service was stopped: write EOF".
 *
 * Um build sequencial de cada app popula `node_modules/.cache/native-federation`
 * uma unica vez. Combinado com `cacheExternalArtifacts: true` no angular.json,
 * os dev servers reaproveitam esse cache em vez de reempacotar tudo de novo.
 *
 * Falhas individuais nao interrompem o pre-aquecimento: o app problematico
 * apenas volta a empacotar sozinho quando for servido.
 */
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const APPS = [
  'shell',
  'mfe-simulacao',
  'mfe-forms',
  'mfe-uploads',
  'mfe-proposta',
  'mfe-tracking',
];

export function prewarmFederation() {
  const failed = [];

  for (const app of APPS) {
    process.stdout.write(`\n[prewarm] ${app}\n`);

    const result = spawnSync('npx', ['ng', 'build', app, '-c', 'development'], {
      stdio: 'inherit',
      shell: true,
    });

    if (result.status !== 0) {
      failed.push(app);
      process.stdout.write(`[prewarm] ${app} falhou — sera empacotado ao ser servido\n`);
    }
  }

  if (failed.length > 0) {
    process.stdout.write(`\n[prewarm] concluido com falhas em: ${failed.join(', ')}\n`);
  } else {
    process.stdout.write('\n[prewarm] cache de federacao pronto\n');
  }

  return failed;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  prewarmFederation();
}
