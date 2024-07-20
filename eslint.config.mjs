import antfu from '@antfu/eslint-config';

export default 
  antfu({
    stylistic: false,
    typescript: {
      overrides: {
        'ts/consistent-type-definitions': ['error', 'type'],
      },
      parserOptions: {
        projectService: true,
      },
    },
  });
