import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // QUAN TRỌNG: Thay đổi '<TEN-REPO-CUA-BAN>' thành tên repository trên GitHub của bạn.
  // Ví dụ: nếu URL repo là https://github.com/user/my-app, thì base là '/my-app/'
  base: '/bao_cao_khao_sat/',
  plugins: [react()],
  // Thêm mục này để tránh lỗi "process is not defined" trên trình duyệt.
  // Điều này cần thiết cho các thư viện sử dụng process.env, như Gemini API SDK.
  define: {
    'process.env': {}
  },
  build: {
    rollupOptions: {
      // Mark @google/genai as an external module.
      // This tells Rollup not to bundle it, as it will be provided by the importmap in index.html at runtime.
      external: ['@google/genai'],
    },
  },
})
