import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {
      REACT_APP_MAPBOX_ACCESS_TOKEN:
        'pk.eyJ1IjoiaGVhZGJpdHMiLCJhIjoiY2xhYThmaWRvMDIzYjNxcXI5bXRqc2x2bCJ9.CvLyCCk0cRO2EjbPooYKCQ',
    },
  },
});
