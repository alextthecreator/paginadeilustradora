import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    // The existing gallery uses ref-based scroll hysteresis. Keep its geometry
    // algorithm unchanged during the framework upgrade; React Compiler is off.
    files: ['src/app/**/work/page.tsx'],
    rules: { 'react-hooks/refs': 'off' },
  },
  globalIgnores(['.next/**', 'node_modules/**', 'docs/**']),
]);
