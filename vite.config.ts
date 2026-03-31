import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => {
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "druplicon-art";

  return {
    base: command === "build" ? `/${repoName}/` : "/",
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
