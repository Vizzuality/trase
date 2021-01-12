import React from 'react';
import cx from 'classnames';
import Link from 'redux-first-router-link';
import Img from 'react-components/shared/img';
import NewsletterForm from 'react-components/shared/newsletter/newsletter.container';

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

const Footer = () => {
  const renderMainFooter = () => (
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
          In collaboration with{' '}
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
  );

  const renderLinkMenu = () => {
    const menuItems = [
      {
        title: 'Home',
        items: [
          {
            title: 'About',
            link: 'about'
          }
        ]
      },
      {
        title: 'Supply Chains',
        items: [
          {
            title: 'Data Tools',
            link: 'tool'
          },
          {
            title: 'Profiles',
            link: 'profiles'
          },
          {
            title: 'Logistics Maps',
            link: 'logistics maps'
          },
          {
            title: 'Downloads',
            link: 'downloads'
          }
        ]
      },
      {
        title: 'Finance',
        items: [
          {
            title: 'Explore',
            href: 'https://trase.finance/explore'
          },
          {
            title: 'Search',
            href: 'https://trase.finance/search'
          },
          {
            title: 'Watchlists',
            href: 'https://trase.finance/watchlists'
          },
          {
            title: 'Methodology',
            href: 'https://trase.finance/methodology'
          },
          {
            title: 'FAQs',
            href: 'https://trase.finance/faqs'
          }
        ]
      },
      {
        title: 'Insights',
        items: [
          {
            title: 'Yearbook',
            href: 'https://insights.trase.earth/yearbook'
          },
          {
            title: 'Collections',
            href: 'https://insights.trase.earth/collections'
          },
          {
            title: 'Publications',
            href: 'https://insights.trase.earth/publications'
          }
        ]
      }
    ];

    const renderTitle = (title) => (
      <div className="menu-title">{title}</div>
    );

    const renderItems = items =>
      items.map(i =>
        i.link ? (
          <Link className="menu-link" to={{ type: i.link }}>
            {i.title}
          </Link>
        ) : (
          <a target="_blank" className="menu-link" href={i.href} alt={i.title}>
            {i.title}
          </a>
        )
      );

    return (
      <div className="footer-menu">
        {menuItems.map(i => (
         <div className="footer-menu-item">
           {renderTitle(i.title)}
           {renderItems(i.items)}
         </div>
        ))}
      </div>
    );
  }

  const renderFooterHigh = () => (
    <div className="footer-high row">
      {renderMainFooter()}
      {renderLinkMenu()}
      <div className="sign-up">
        <div className="sign-up-title">Sign up for our Newsletter</div>
        <NewsletterForm variant="simple" />
      </div>
    </div>
  );

  const renderFooterLow = () => (
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
  );

  return (
    <div className="c-new-footer">
      {renderFooterHigh()}
      <div className="section-separator" />
      {renderFooterLow()}
    </div>
  );
}

export default Footer;
