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
