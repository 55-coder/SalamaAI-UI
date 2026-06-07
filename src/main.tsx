import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupMockApiInterceptor } from './mockFetch.ts';

// Enable fully standalone local client-side offline mock database API interceptor
setupMockApiInterceptor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

