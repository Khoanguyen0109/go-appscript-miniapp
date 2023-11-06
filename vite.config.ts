import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import reactRefresh from "@vitejs/plugin-react-refresh";
import macrosPlugin from "vite-plugin-babel-macros";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [tsconfigPaths(), reactRefresh(), macrosPlugin()],
    build: {
      target: "es2020",
    },
  });
};
