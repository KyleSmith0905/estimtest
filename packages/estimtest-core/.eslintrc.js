/*eslint-disable */
module.exports = {
  parserOptions: {
    project: './tsconfig.json',
  },
	extends: [
    'plugin:@stencil-community/recommended',
  ],
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "single", { "allowTemplateLiterals": true }],
    indent: ['error', 'tab'],
    'brace-style': ['error', 'stroustrup'],
    'react/jsx-no-bind': ['error', {
      allowArrowFunctions: true,
    }],
  }
}
