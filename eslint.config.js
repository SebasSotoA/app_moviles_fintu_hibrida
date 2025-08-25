// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          caseSensitive: false, // Resuelve el problema de casing en Mac
        },
      },
    },
    rules: {
      'import/no-unresolved': 'off', // Desactiva temporalmente el error de casing
    },
  },
]);