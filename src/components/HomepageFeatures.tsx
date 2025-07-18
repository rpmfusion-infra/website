import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import Link from '@docusaurus/Link';
import { isMobile } from "react-device-detect";


type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
  version: string;
  download_url: string;
}

const FeatureList: FeatureItem[] = [
  {
    title: 'Free Repository ',
    Svg: require('../../static/img/logo.svg').default,
    description: (
      <>
        For Open Source Software (as defined by the Fedora Licensing Guidelines)
        which the Fedora project cannot ship due to other reasons
      </>
    ),
    version: '42',
    download_url: 'https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-42.noarch.rpm',
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
    version: '42',
    download_url: 'https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-42.noarch.rpm',
  },
];

function Feature({Svg, title, description, version, download_url}: FeatureItem) {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role='img' />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      { !isMobile ?
      <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            href={download_url} content='application/x-rpm'>
            Enable on Fedora {version}
          </Link>
      </div>
      : null }
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
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
