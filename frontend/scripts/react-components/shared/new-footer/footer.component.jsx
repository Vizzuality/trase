import React from 'react';
import cx from 'classnames';
import Link from 'redux-first-router-link';
import Img from 'react-components/shared/img';

import './footer.scss';


const partners = [
  {
    className: 'gcp-logo',
    href: 'http://globalcanopy.org/',
    image: '/images/footer/partnership/gc@2x.png',
    alt: 'Global Canopy Programme',
    imageClassName: 'gcp-img'
  },
  {
    className: 'sei-logo',
    href: 'https://sei-international.org/',
    image: '/images/footer/partnership/sei@2x.png',
    alt: 'Stockholm Environment Institute',
    imageClassName: null
  }
];

const donors = [
  {
    className: 'ggp-logo',
    href: 'https://goodgrowthpartnership.com/',
    image: '/images/footer/donors/ggp@2x.png',
    alt: 'Good growth partnership',
    imageClassName: null
  },
  {
    className: 'moore-logo',
    href: 'https://www.moore.org/',
    image: '/images/footer/donors/moore-white@2x.png',
    alt: 'Gordon and Betty Moore Foundation',
    imageClassName: null
  },
  {
    className: 'nicfi-logo',
    href:
      'https://www.regjeringen.no/en/topics/climate-and-environment/climate/climate-and-forest-initiative/id2000712/',
    image: '/images/footer/donors/nicfi@2x.png',
    alt: "Norway's International Climate and Forest Initiative (NICFI)",
    imageClassName: null
  }
];

const Footer = () => (
  <div className="c-footer">
    <div className="footer-high row">
      <div className="contain-logos-footer">
        <div className="main-footer">
          <div className="logo-container">
            <Img src="/images/logos/new-logo-trase.svg" alt="TRASE" />
          </div>
          <ul className="logo-list">
            {partners.map(logo => (
              <li key={logo.className} className={cx('logo-item', logo.className)}>
                <a href={logo.href} target="_blank" rel="noopener noreferrer">
                  <Img src={logo.image} alt={logo.alt} />
                </a>
              </li>
            ))}
          </ul>
          <div className="partnership-text">
            <div>A partnership between Global Canopy and the Stockholm Environment Institute.</div>
            <div>
              In collaboration with
              <a
                className="partnership-link"
                href="http://www.vizzuality.com/"
                target="_blank"
                alt="vizzuality"
                rel="noopener noreferrer"
              >
                Vizzuality
              </a>
              ,{' '}
              <a
                className="partnership-link"
                href="http://www.efi.int/portal/"
                target="_blank"
                alt="vizzuality"
                rel="noopener noreferrer"
              >
                EFI
              </a>
              , and many other organizations and individuals. Find out more{' '}
              <Link
                className="partnership-link"
                to={{ type: 'about', payload: { section: 'partners' } }}
              >
                here
              </Link>
              .
            </div>
          </div>
        </div>
        <div className="footer-menu">Menu</div>
        <div className="sign-up">Sign up for our Newsletter</div>
      </div>
    </div>
    <div className="section-separator" />
    <div className="footer-low-container row">
      <div className="footer-low">
        <div className="link-list-container">
          <ul className="social-links-list">
            <li className="social-link-item">
              <a className="social-link" href="https://twitter.com/traseearth">
                <Img src="/images/footer/social/twitter.svg" alt="twitter link" />
              </a>
            </li>
            <li className="social-link-item">
              <a
                className="social-link"
                href="https://www.linkedin.com/company/trase-transparency-for-sustainable-economies"
              >
                <Img src="/images/footer/social/linkedin.svg" alt="linkedin link" />
              </a>
            </li>
          </ul>
          <ul className="links-list">
            <li className="link-item">
              <Link
                className="privacy-menu-link"
                to={{ type: 'about', payload: { section: 'terms-of-use' } }}
              >
                Terms of Use
              </Link>
            </li>
            <>
              <li className="separator"> · </li>
              <li className="link-item">
                <Link
                  className="privacy-menu-link"
                  to={{ type: 'about', payload: { section: 'privacy-policy' } }}
                >
                  Privacy policy
                </Link>
              </li>
              <li className="separator"> · </li>
              <li className="link-item">
                <Link
                  className="privacy-menu-link"
                  to={{ type: 'about', payload: { section: 'cookie-policy' } }}
                >
                  Cookie policy
                </Link>
              </li>
            </>
            <li className="separator"> · </li>
            <li className="link-item">
              <a className="privacy-menu-link" href="mailto:info@trase.earth">
                Contact us
              </a>
            </li>
          </ul>
        </div>
        <div className="donors-logos-container row">
          <ul className="donors-logos">
            {donors.map(logo => (
              <li key={logo.className} className={cx('logo-item', logo.className)}>
                <a href={logo.href} target="_blank" rel="noopener noreferrer">
                  <Img src={logo.image} alt={logo.alt} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
