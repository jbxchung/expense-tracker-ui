import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sassDts(), tsconfigPaths()],
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
})
