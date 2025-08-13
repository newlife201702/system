module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  parser: "vue-eslint-parser",
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': 0,
    'no-undef':'off',
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": ["off"],
    // 去除ts类型检测
    "@typescript-eslint/no-inferrable-types": "off" ,
    // 关闭定义未引用的变量的引用
    '@typescript-eslint/no-unused-vars': ['off'],
    "@typescript-eslint/no-this-alias": ["off"],
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
}
