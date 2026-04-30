export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true
      }
    }
  }
}
