import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';
import ExampleCode from '../components/example-code';
import OptionsGrid from '../components/options-grid';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started"
          >
            Getting Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout>
      <HomepageHeader />
      <main>
        <div className={styles.codeAndCaption}>
          <div>
            <img className={styles.undraw} src='undraw/discoverable.svg'/>
            <h2>Get Started Instantly</h2>
            <p>With minimal configuration and unlimited customization, getting started is simple.</p>
          </div>
          <ExampleCode/>
        </div>
        <h2 className={clsx('text--center', styles.header)}>Unlimited Customization</h2>
        <OptionsGrid/>
      </main>
    </Layout>
  );
}
