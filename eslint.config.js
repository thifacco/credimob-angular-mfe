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
        { type: 'attribute', prefix: ['shl', 'sim', 'frm', 'upl', 'prp'], style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: ['shl', 'sim', 'frm', 'upl', 'prp'], style: 'kebab-case' },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['apps/*/src/**'],
              message: 'Não importe diretamente de outro app. Use libs/ para código compartilhado.',
            },
            {
              group: ['libs/*/src/lib/**'],
              message: 'Importe apenas via public-api.ts da lib.',
            },
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
