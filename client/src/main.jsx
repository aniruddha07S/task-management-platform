import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store.js';
import ThemeProvider from './context/ThemeProvider.jsx';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2500,
              style: {
                borderRadius: '14px',
                background: 'var(--color-elevated)',
                color: 'var(--color-ink)',
                border: '1px solid var(--color-line)',
                boxShadow: '0 10px 30px rgb(0 0 0 / 0.14)',
                fontSize: '13px',
                fontWeight: 500,
                padding: '10px 14px',
              },
              success: { iconTheme: { primary: '#34c759', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ff3b30', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
