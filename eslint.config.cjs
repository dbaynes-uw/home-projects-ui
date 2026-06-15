const js = require('@eslint/js')
const pluginVue = require('eslint-plugin-vue')
const vueParser = require('vue-eslint-parser')
const babelParser = require('@babel/eslint-parser')

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/public/**',
      '**/.yarn/**',
      '**/coverage/**',
      '**/.git/**',
      '**/.vscode/**',
      '**/.idea/**',
      '*.config.js',
      'vue.config.js',
      'babel.config.js',
      'vite.config.js',
      'vitest.config.js',
      'jest.config.js'
    ]
  },
  
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  
  // JavaScript files
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false
      },
      globals: {
        // Node.js
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',  // ✅ ADDED
        
        // Browser
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        location: 'readonly',  // ✅ ADDED - Browser location object
        URL: 'readonly',       // ✅ ADDED - URL API
        Blob: 'readonly'       // ✅ ADDED - Blob API
      }
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }]
    }
  },
  
  // Vue files
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: babelParser,
        ecmaVersion: 2021,
        sourceType: 'module',
        requireConfigFile: false
      },
      globals: {
        // Vue 3 compiler macros
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        defineOptions: 'readonly',
        defineSlots: 'readonly',
        withDefaults: 'readonly',
        
        // Node.js (for require in components)
        require: 'readonly',  // ✅ ADDED
        process: 'readonly',
        
        // Browser
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        location: 'readonly',  // ✅ ADDED
        URL: 'readonly',       // ✅ ADDED
        Blob: 'readonly'       // ✅ ADDED
      }
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'vue/no-unused-vars': ['warn', {
        ignorePattern: '^_'
      }]
    }
  }
]