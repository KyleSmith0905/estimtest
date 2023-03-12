import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const LazyEstimtest = lazy(async () => {
  if (import.meta.env.VITE_ESTIMTEST === 'true') {
    const { EstimtestCore, defineCustomElements } = await import('estimtest-react')
    defineCustomElements();

    return ({default: EstimtestCore});
  }
  else {
    return ({default: (() => <div/>) as any});
  }
});


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <Suspense>
      <LazyEstimtest
        active={true}
        experiments={[
          {name: "Hello World", description: "hello", fontSize: 32}
        ]}
        moveSelector="#root"
        // full-screen is a css class defined in `index.css`
        className='full-screen'
      />
    </Suspense>
  </React.StrictMode>,
)
