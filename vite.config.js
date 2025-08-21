import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 将允许的主机放入一个数组中
    allowedHosts: ['frp-fit.com']
  }
})
