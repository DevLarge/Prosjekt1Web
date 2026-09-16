import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  server: {
    // Tillat at dev-serveren nås via en tunnel-URL (f.eks. trycloudflare.com).
    // Greit for et lokalt læringsprosjekt.
    allowedHosts: true,
  },

  base: '/project1',
});
