import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import Link from '@docusaurus/Link';
import { isMobile } from "react-device-detect";


const FeatureList = [
  {
    title: 'Free Repository ',
    Svg: require('../../static/img/logo.svg').default,
    description: (
      <>
        For Open Source Software (as defined by the Fedora Licensing Guidelines)
        which the Fedora project cannot ship due to other reasons
      </>
    ),
    version: '34',
    download_url: '',
  },
  {
    title: 'Non-Free Repository',
    Svg: require('../../static/img/logo.svg').default,
    description: (
      <>
        For redistributable software that is not Open Source Software
        that has "no commercial use"-like restrictions
      </>
    ),
    version: '34',
    download_url: '',
  },
];

function Feature({Svg, title, description, version, download_url}) {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      { !isMobile ?
      <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to={download_url}>
            Enable on Fedora {version}
          </Link>
      </div>
      : null }
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
