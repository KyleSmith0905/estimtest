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
    'brace-style': ['error', 'stroustrup'],
    'react/jsx-no-bind': ['error', {
      allowArrowFunctions: true,
    }],
  }
}
