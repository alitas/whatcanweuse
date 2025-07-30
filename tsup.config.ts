import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],

  dts: true,
  target: ['es6', 'node20'],
  format: ['cjs', 'esm'],
  clean: true,
});
