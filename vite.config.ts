import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.CODE_RUN_API_BASE_URL || 'http://172.105.58.24/api/v1'
  const apiKey = env.CODE_RUN_API_KEY || ''
  const upstreamOrigin = new URL(apiBaseUrl).origin
  const upstreamPath = new URL(apiBaseUrl).pathname.replace(/\/$/, '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/v1': {
          target: upstreamOrigin,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/v1/, upstreamPath),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (apiKey) {
                proxyReq.setHeader('X-API-KEY', apiKey)
              }
            })
          },
        },
      },
    },
  }
})
