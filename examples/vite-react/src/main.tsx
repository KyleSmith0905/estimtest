import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { EstimtestCore, defineCustomElements } from 'estimtest-react';

defineCustomElements();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <EstimtestCore
      active={true}
      config={JSON.stringify({
        tests: [
          {
            name: 'Large Font Size',
            fontSize: 24,
          }
        ],
      })}
      // full-screen is a css class defined in `index.css`
      className='full-screen'
    />
  </React.StrictMode>,
)
