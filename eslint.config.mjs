import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';

export default [
    { ignores: ['out/**', 'dist/**', '.vscode-test/**', '**/*.d.ts'] },
    {
        files: ['src/**/*.ts'],
        languageOptions: { parser },
        plugins: { '@typescript-eslint': plugin },
        rules: {
            ...js.configs.recommended.rules,
            'no-undef': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/naming-convention': 'warn',
            'curly': 'warn',
            'eqeqeq': 'warn',
            'no-throw-literal': 'warn',
            'semi': ['warn', 'always']
        }
    }
];