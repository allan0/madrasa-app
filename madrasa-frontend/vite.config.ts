import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path remains '/madrasa-app/' for the URL structure
  base: '/madrasa-app/',
  // Server config for development
  server: {
      port: 5173,
  },
  // --- ADD THIS BUILD CONFIGURATION ---
  build: {
    // Output directory relative to this vite.config.ts file (in madrasa-frontend)
    // '../docs' means "go up one level, then into a folder named docs"
    outDir: '../docs',
    // Good practice to clear the output directory before each build
    emptyOutDir: true,
  }
  // -----------------------------------
});
