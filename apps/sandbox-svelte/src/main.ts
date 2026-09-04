import { mount } from 'svelte';
import App from './App.svelte';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';
import '@larose-ui/sandbox-shared/chrome.css';

mount(App, { target: document.getElementById('app')! });
