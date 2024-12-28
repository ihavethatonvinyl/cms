import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "public",
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
          console.log(id);
          if (id.includes(".map")) {
            console.warn("*** HEY HEY HEY ***")
          }
          if (/projectEnv.ts/.test(id)) {
            return "projectEnv";
          }

          if (id.includes("node_modules/decap-cms")) {
            return "decap-cms";
          }

          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
