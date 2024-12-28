import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "image/public",
    rollupOptions: {
      output: {
        format: "es",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        manualChunks(id) {
          if (/projectEnv.ts/.test(id)) {
            return "projectEnv";
          }
        },
      },
    },
  },
});
