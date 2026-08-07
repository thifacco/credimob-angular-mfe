# Credito Imobiliário — Monorepo Angular 21 + Native Federation

Guia de arquitetura e setup do workspace de micro front-ends para simulação de crédito imobiliário.

## 1. Visão geral da arquitetura

```
credimob-angular-mfe/
├── apps/
│   ├── shell/               # Host (porta 4200) — orquestra os MFEs, roteamento raiz, shell layout
│   ├── mfe-simulacao/       # Remote (porta 4201) — simulação de financiamento (SAC/PRICE, taxas, prazos)
│   ├── mfe-forms/           # Remote (porta 4202) — formulários de dados pessoais/financeiros do proponente
│   ├── mfe-uploads/         # Remote (porta 4203) — upload/validação de documentos
│   ├── mfe-proposta/        # Remote (porta 4204) — geração/resumo da proposta final
│   └── mfe-tracking/        # Remote (porta 4205) — acompanhamento do status da proposta
├── libs/
│   ├── shared-ui/           # Componentes visuais compartilhados (design system sobre Angular Material)
│   ├── shared-models/       # Interfaces/DTOs/tipos compartilhados entre os MFEs
│   ├── shared-utils/        # Pipes, validators, funções utilitárias (ex: cálculo financeiro, máscaras)
│   └── shared-state/        # Comunicação entre MFEs (bus de eventos / signals compartilhados)
├── .husky/
├── angular.json
├── tsconfig.base.json
├── eslint.config.js
├── .prettierrc
├── commitlint.config.js
└── package.json
```

**Princípios de design:**

- `shell` é o único host (`dynamic-host`); os 5 MFEs são `remote`.
- Cada MFE é standalone, roteável isoladamente (permite rodar sozinho em dev) e exposto via Native Federation.
- Comunicação entre MFEs feita só via `libs/shared-models` (contratos) e `libs/shared-state` (nunca imports diretos entre apps).
- Cada MFE tem seu próprio `environment.ts`/`environment.prod.ts` — nenhuma URL fixa hardcoded fora deles.

---

## 2. Criação do workspace

```bash
npm install -g @angular/cli@21

ng new credito-imobiliario-mfe --create-application=false --package-manager=npm --strict
cd credito-imobiliario-mfe
```

### 2.1 Configurar `newProjectRoot` em `angular.json`

```jsonc
{
  "newProjectRoot": "apps",
  // ...
}
```

---

## 3. Geração das aplicações

```bash
ng generate application shell          --routing --style=scss --standalone --prefix=shl
ng generate application mfe-simulacao  --routing --style=scss --standalone --prefix=sim
ng generate application mfe-forms      --routing --style=scss --standalone --prefix=frm
ng generate application mfe-uploads    --routing --style=scss --standalone --prefix=upl
ng generate application mfe-proposta   --routing --style=scss --standalone --prefix=prp
ng generate application mfe-tracking   --routing --style=scss --standalone --prefix=trk
```

Isso cria `apps/shell`, `apps/mfe-simulacao`, `apps/mfe-forms`, `apps/mfe-uploads`, `apps/mfe-proposta`, `apps/mfe-tracking`, cada um com seu `project.json`/entry em `angular.json`.

### 3.1 Portas de dev (`angular.json` → `architect["serve-original"].options.port` de cada projeto)

| App           | Porta |
| ------------- | ----- |
| shell         | 4200  |
| mfe-simulacao | 4201  |
| mfe-forms     | 4202  |
| mfe-uploads   | 4203  |
| mfe-proposta  | 4204  |
| mfe-tracking  | 4205  |

```jsonc
// apps/mfe-simulacao -> angular.json
"serve-original": {
  "options": { "port": 4201 }
}
```

(repita para cada app com sua porta correspondente; a porta é definida automaticamente pelo schematic de init do Native Federation via `--port`, ver seção 4.1)

---

## 4. Native Federation

```bash
npm install @angular-architects/native-federation --save-dev
```

### 4.1 Inicializar host e remotes

```bash
ng g @angular-architects/native-federation:init --project shell --port 4200 --type dynamic-host

ng g @angular-architects/native-federation:init --project mfe-simulacao --port 4201 --type remote
ng g @angular-architects/native-federation:init --project mfe-forms     --port 4202 --type remote
ng g @angular-architects/native-federation:init --project mfe-uploads   --port 4203 --type remote
ng g @angular-architects/native-federation:init --project mfe-proposta  --port 4204 --type remote
ng g @angular-architects/native-federation:init --project mfe-tracking  --port 4205 --type remote
```

Isso gera `federation.config.js` na raiz de cada app e ajusta `angular.json` para usar o `esbuild`-based builder do Native Federation (`@angular-architects/native-federation:build` / `:serve`).

### 4.2 `apps/mfe-simulacao/federation.config.js` (padrão dos 4 remotes)

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'mfeSimulacao',

  exposes: {
    './Routes': './apps/mfe-simulacao/src/app/remote-entry/entry.routes.ts',
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },

  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],
});
```

Repita trocando apenas `name` e o caminho do `exposes` para `mfeForms`, `mfeUploads`, `mfeProposta`, `mfeTracking`.

### 4.3 `apps/shell/federation.config.js`

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },

  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],
});
```

### 4.4 Manifest de remotes (dev)

`apps/shell/public/federation.manifest.json`:

```json
{
  "mfeSimulacao": "http://localhost:4201/remoteEntry.json",
  "mfeForms": "http://localhost:4202/remoteEntry.json",
  "mfeUploads": "http://localhost:4203/remoteEntry.json",
  "mfeProposta": "http://localhost:4204/remoteEntry.json",
  "mfeTracking": "http://localhost:4205/remoteEntry.json"
}
```

`apps/shell/public/federation.manifest.prod.json` (pensado para ser trocado via `fileReplacements` no build de produção — ver nota no fim desta seção):

```json
{
  "mfeSimulacao": "https://simulacao.creditoimobiliario.exemplo.com/remoteEntry.json",
  "mfeForms": "https://forms.creditoimobiliario.exemplo.com/remoteEntry.json",
  "mfeUploads": "https://uploads.creditoimobiliario.exemplo.com/remoteEntry.json",
  "mfeProposta": "https://proposta.creditoimobiliario.exemplo.com/remoteEntry.json",
  "mfeTracking": "https://tracking.creditoimobiliario.exemplo.com/remoteEntry.json"
}
```

> **Nota:** o `angular.json` do projeto `shell` atualmente **não** possui o `fileReplacements` abaixo configurado — é uma lacuna pré-existente (anterior a este remote), fora do escopo da adição do `mfe-tracking`.

`angular.json` (projeto `shell`, configuração `production`):

```jsonc
"fileReplacements": [
  {
    "replace": "public/federation.manifest.json",
    "with": "public/federation.manifest.prod.json"
  }
]
```

### 4.5 `apps/shell/src/main.ts`

```typescript
import { initFederation } from '@angular-architects/native-federation';

initFederation('/federation.manifest.json')
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
```

### 4.6 Roteamento do shell (`apps/shell/src/app/app.routes.ts`)

```typescript
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: 'simulacao',
    loadChildren: () => loadRemoteModule('mfeSimulacao', './Routes').then(m => m.SIMULACAO_ROUTES),
  },
  {
    path: 'dados',
    loadChildren: () => loadRemoteModule('mfeForms', './Routes').then(m => m.FORMS_ROUTES),
  },
  {
    path: 'documentos',
    loadChildren: () => loadRemoteModule('mfeUploads', './Routes').then(m => m.UPLOADS_ROUTES),
  },
  {
    path: 'proposta',
    loadChildren: () => loadRemoteModule('mfeProposta', './Routes').then(m => m.PROPOSTA_ROUTES),
  },
  {
    path: 'acompanhamento',
    loadChildren: () => loadRemoteModule('mfeTracking', './Routes').then(m => m.TRACKING_ROUTES),
  },
  { path: '', redirectTo: 'simulacao', pathMatch: 'full' },
];
```

### 4.7 Entry point exposto por cada remote (`apps/mfe-simulacao/src/app/remote-entry/entry.routes.ts`)

```typescript
import { Routes } from '@angular/router';

export const SIMULACAO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../simulacao-shell/simulacao-shell.component').then(m => m.SimulacaoShellComponent),
  },
];
```

Cada MFE também mantém `app.routes.ts` próprio para rodar isolado em `ng serve` standalone (útil no desenvolvimento e nos testes de portfólio).

---

## 5. Libraries compartilhadas (`libs/`)

```bash
ng generate library shared-ui      --directory=libs/shared-ui
ng generate library shared-models  --directory=libs/shared-models
ng generate library shared-utils   --directory=libs/shared-utils
ng generate library shared-state   --directory=libs/shared-state
```

### 5.1 Path mapping — `tsconfig.base.json`

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@credito/shared-ui": ["libs/shared-ui/src/public-api.ts"],
      "@credito/shared-models": ["libs/shared-models/src/public-api.ts"],
      "@credito/shared-utils": ["libs/shared-utils/src/public-api.ts"],
      "@credito/shared-state": ["libs/shared-state/src/public-api.ts"],
    },
  },
}
```

Cada lib expõe sua API pública apenas via `public-api.ts` — nenhum import de caminho profundo (`libs/.../src/lib/...`) entre projetos.

---

## 6. Angular Material

```bash
ng add @angular/material --project shell --theme=custom --typography --animations=enabled
ng add @angular/material --project mfe-simulacao --theme=custom --typography --animations=enabled
ng add @angular/material --project mfe-forms --theme=custom --typography --animations=enabled
ng add @angular/material --project mfe-uploads --theme=custom --typography --animations=enabled
ng add @angular/material --project mfe-proposta --theme=custom --typography --animations=enabled
ng add @angular/material --project mfe-tracking --theme=custom --typography --animations=enabled
```

- O tema (`libs/shared-ui/styles/_theme.scss`) é centralizado na lib `shared-ui` e importado por todos os apps, garantindo consistência visual.
- `@angular/material` e `@angular/cdk` entram no `shareAll` do `federation.config.js` como singleton — evita módulos duplicados entre host/remotes em runtime.
- O schematic `ng add @angular/material` gera um `material-theme.scss` próprio no app — descarte-o e aponte o `styles.scss` do app para o tema compartilhado (`@use '../../../libs/shared-ui/styles/theme' as theme; @include theme.apply-theme;`), como feito nos demais MFEs.

---

## 7. ESLint (flat config)

```bash
ng add @angular-eslint/schematics
npm install -D eslint-config-prettier
```

`eslint.config.js` (raiz):

```javascript
const nx = require('@angular-eslint/eslint-plugin');
const angular = require('angular-eslint');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: ['shl', 'sim', 'frm', 'upl', 'prp', 'trk'],
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['shl', 'sim', 'frm', 'upl', 'prp', 'trk'],
          style: 'kebab-case',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['apps/*/src/**'],
              message: 'Não importe diretamente de outro app. Use libs/ para código compartilhado.',
            },
            { group: ['libs/*/src/lib/**'], message: 'Importe apenas via public-api.ts da lib.' },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
  prettierConfig,
);
```

---

## 8. Prettier

```bash
npm install -D prettier
```

`.prettierrc`:

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

`.prettierignore`:

```
dist
.angular
apps/*/federation.manifest*.json
node_modules
```

`package.json` (script):

```json
{
  "scripts": {
    "format": "prettier --write \"apps/**/*.{ts,html,scss}\" \"libs/**/*.{ts,html,scss}\""
  }
}
```

---

## 9. Husky + lint-staged

```bash
npm install -D husky lint-staged
npx husky init
```

`.husky/pre-commit`:

```bash
npx lint-staged
```

`package.json`:

```json
{
  "lint-staged": {
    "*.{ts,html}": ["eslint --fix"],
    "*.{ts,html,scss,json,md}": ["prettier --write"]
  }
}
```

---

## 10. Commitlint (Conventional Commits)

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

`commitlint.config.js`:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'shell',
        'simulacao',
        'forms',
        'uploads',
        'proposta',
        'tracking',
        'shared-ui',
        'shared-models',
        'shared-utils',
        'shared-state',
        'workspace',
      ],
    ],
  },
};
```

`.husky/commit-msg`:

```bash
npx --no -- commitlint --edit "$1"
```

Padrão de commit: `feat(simulacao): adiciona cálculo de amortização SAC`

---

## 11. Scripts de execução (`package.json`)

```bash
npm install -D concurrently
```

```json
{
  "scripts": {
    "start:shell": "ng serve shell",
    "start:simulacao": "ng serve mfe-simulacao",
    "start:forms": "ng serve mfe-forms",
    "start:uploads": "ng serve mfe-uploads",
    "start:proposta": "ng serve mfe-proposta",
    "start:tracking": "ng serve mfe-tracking",
    "start:all": "concurrently -n shell,simulacao,forms,uploads,proposta,tracking -c blue,green,yellow,magenta,cyan,red \"npm:start:shell\" \"npm:start:simulacao\" \"npm:start:forms\" \"npm:start:uploads\" \"npm:start:proposta\" \"npm:start:tracking\"",
    "build:all": "ng build shell -c production && ng build mfe-simulacao -c production && ng build mfe-forms -c production && ng build mfe-uploads -c production && ng build mfe-proposta -c production && ng build mfe-tracking -c production",
    "lint": "eslint \"apps/**/*.ts\" \"libs/**/*.ts\"",
    "format": "prettier --write \"apps/**/*.{ts,html,scss}\" \"libs/**/*.{ts,html,scss}\""
  }
}
```

`npm run start:all` sobe os 6 projetos simultaneamente nas portas 4200–4205.

---

## 12. Environments por app

Exemplo `apps/mfe-simulacao/src/environments/environment.ts` (dev):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/simulacao',
};
```

`environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.creditoimobiliario.exemplo.com/simulacao',
};
```

`angular.json` (build config `production` de cada app) já inclui `fileReplacements` padrão gerado pelo CLI trocando `environment.ts` → `environment.prod.ts`.

---

## 13. Resumo dos comandos, em ordem

```bash
npm install -g @angular/cli@21
ng new credito-imobiliario-mfe --create-application=false --package-manager=npm --strict
cd credito-imobiliario-mfe

# ajustar "newProjectRoot": "apps" no angular.json

ng generate application shell         --routing --style=scss --standalone --prefix=shl
ng generate application mfe-simulacao --routing --style=scss --standalone --prefix=sim
ng generate application mfe-forms     --routing --style=scss --standalone --prefix=frm
ng generate application mfe-uploads   --routing --style=scss --standalone --prefix=upl
ng generate application mfe-proposta  --routing --style=scss --standalone --prefix=prp
ng generate application mfe-tracking  --routing --style=scss --standalone --prefix=trk

npm install @angular-architects/native-federation --save-dev
ng g @angular-architects/native-federation:init --project shell         --port 4200 --type dynamic-host
ng g @angular-architects/native-federation:init --project mfe-simulacao --port 4201 --type remote
ng g @angular-architects/native-federation:init --project mfe-forms     --port 4202 --type remote
ng g @angular-architects/native-federation:init --project mfe-uploads   --port 4203 --type remote
ng g @angular-architects/native-federation:init --project mfe-proposta  --port 4204 --type remote
ng g @angular-architects/native-federation:init --project mfe-tracking  --port 4205 --type remote

ng generate library shared-ui     --directory=libs/shared-ui
ng generate library shared-models --directory=libs/shared-models
ng generate library shared-utils  --directory=libs/shared-utils
ng generate library shared-state  --directory=libs/shared-state

ng add @angular/material --project shell
ng add @angular/material --project mfe-simulacao
ng add @angular/material --project mfe-forms
ng add @angular/material --project mfe-uploads
ng add @angular/material --project mfe-proposta
ng add @angular/material --project mfe-tracking

ng add @angular-eslint/schematics
npm install -D prettier eslint-config-prettier husky lint-staged @commitlint/cli @commitlint/config-conventional concurrently

npx husky init
# criar .husky/pre-commit, .husky/commit-msg, eslint.config.js, .prettierrc, commitlint.config.js
# conforme seções 7–10 acima

npm run start:all
```

---

## 14. Observações de senioridade para o portfólio

- Todos os `federation.config.js` usam `shareAll` com `singleton: true` — evita duplicar Angular/Material em runtime, prática recomendada para múltiplos remotes.
- `no-restricted-imports` no ESLint garante isolamento arquitetural entre MFEs desde o lint, não só por convenção.
- Cada MFE roda isolado (`ng serve mfe-x`) além de federado — importante para desenvolvimento paralelo por times diferentes.
- `fileReplacements` para o manifest de produção deixa explícito que URLs de remote em produção seriam servidas por domínios/CDNs distintos (ex: um bucket S3 + CloudFront por MFE), mesmo não sendo usado neste projeto além do localhost.
- Padrão de commits + Husky + Commitlint simula um pipeline real de CI, valorizando o repositório como peça de portfólio.
