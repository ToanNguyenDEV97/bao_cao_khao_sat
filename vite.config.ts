import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // QUAN TRỌNG: Thay đổi '<TEN-REPO-CUA-BAN>' thành tên repository trên GitHub của bạn.
  // Ví dụ: nếu URL repo là https://github.com/user/my-app, thì base là '/my-app/'
  base: '/<TEN-REPO-CUA-BAN>/',
  plugins: [react()],
})