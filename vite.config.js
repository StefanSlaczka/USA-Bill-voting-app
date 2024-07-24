import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY ? process.env.API_KEY.replace(/"/g, '') : '';

export default defineConfig({
  plugins: [svelte()],
  define: {
    'process.env.API_KEY': JSON.stringify(API_KEY),
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Proxy API requests to the backend server
    },
  },
});
