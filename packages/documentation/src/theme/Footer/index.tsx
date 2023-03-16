import React from 'react';
import Footer from '@theme-original/Footer';
import { EstimtestCore, defineCustomElements } from 'estimtest-react';

defineCustomElements();

export default function FooterWrapper(props) {
  return (
    <>
      <EstimtestCore active={true}/>
      <Footer {...props} />
    </>
  );
}
