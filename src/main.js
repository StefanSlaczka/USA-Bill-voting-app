import App from './api_script.svelte'

require('dotenv').config();
console.log(process.env);

const app = new App({
  target: document.getElementById('app'),
})

export default app
