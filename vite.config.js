import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      host: true,
      port: 5173
    },
    define: {
      '__GEMINI_API_KEY__': JSON.stringify(env.VITE_GEMINI_API_KEY || '')
    }
  };
});
