import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Provider } from 'react-redux';
import appStore from './utils/appStore.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={appStore}>
    <PrimeReactProvider>
    <App />
    </PrimeReactProvider>
    </Provider>
  </StrictMode>,
)
