import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Retrieve the API_KEY from process.env and remove surrounding double quotes if present
const API_KEY = process.env.API_KEY.replace(/"/g, '');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  define: {
    // Pass the API_KEY to the Svelte app without surrounding double quotes
    'process.env.API_KEY': JSON.stringify(API_KEY),
  },
});
