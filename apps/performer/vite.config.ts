import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));

  return defineConfig({
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(
        process.env.npm_package_version,
      ) as string,
    },
    server: {
      hmr: { clientPort: 3205, port: 3205 },
      port: parseInt(process.env.VITE_PORT),
    },
  });
};
