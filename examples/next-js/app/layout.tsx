import { EstimtestCore, defineCustomElements } from 'estimtest-react';
import './globals.css';

defineCustomElements();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {children}
        {window && 
          <EstimtestCore
            active={true}
            // full-screen is a css class defined in `index.css`
            className='full-screen'
          />
        }
      </body>
    </html>
  )
}
