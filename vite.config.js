import { defineConfig } from "vite";

export default defineConfig({
    root:".",
    publicDir: "src/pages/assets",
    build: {
        copyPublicDir:true,
        outDir:"dist/pages",
        emptyOutDir: true,
        minify: false,
        cssCodeSplit: false,
        rollupOptions: {
            input: {
                main: "src/pages/scripts/script.ts"
            },
            output: {
                entryFileNames: "bundle.js",
                assetFileNames: "bundle.[ext]"
            }
        }
    }
})