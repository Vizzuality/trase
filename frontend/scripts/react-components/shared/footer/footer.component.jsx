import React from 'react';
import cx from 'classnames';
import Link from 'redux-first-router-link';
import Img from 'react-components/shared/img';

import './footer.scss';

const sections = [
  {
    title: 'Trase is a partnership between',
    text: null,
    logos: [
      [
        {
          className: 'sei-logo',
          href: 'https://sei-international.org/',
          image: '/images/footer/partnership/s-e-i@2x.png',
          alt: 'Stockholm Environment Institute',
          imageClassName: null
        }
      ],
      [
        {
          className: 'gcp-logo',
          href: 'http://globalcanopy.org/',
          image: '/images/footer/partnership/g-c-p@2x.png',
          alt: 'Global Canopy Programme',
          imageClassName: 'gcp-img'
        }
      ]
    ]
  },
  {
    title: 'In collaboration with',
    text: 'and many other organizations and individuals.',
    logosClassName: null,
    logos: [
      [
        {
          className: 'vizzuality-logo',
          href: 'http://www.vizzuality.com/',
          image: '/images/footer/collaboration/vizzuality@2x.png',
          alt: 'vizzuality',
          imageClassName: null
        }
      ],
      [
        {
          className: 'efi-logo',
          href: 'http://www.efi.int/portal/',
          image: '/images/footer/collaboration/e-f-i@2x.png',
          alt: 'The European Forest Institute',
          imageClassName: null
        }
      ]
    ]
  },
  {
    title: 'Donors',
    text: null,
    logos: [
      [
        {
          className: 'gef-logo',
          href: 'https://www.thegef.org/',
          image: '/images/footer/donors/gef@2x.png',
          alt: 'The Global Environment Facility',
          imageClassName: null
        },
        {
          className: 'wwf-logo',
          href: 'https://www.worldwildlife.org/',
          image: '/images/footer/donors/wwf@2x.png',
          alt: 'WWF',
          imageClassName: null
        },

        {
          className: 'eustars-logo',
          href: 'https://ec.europa.eu/',
          image: '/images/footer/donors/eu-stars-33@2x.png',
          alt: 'Europe',
          imageClassName: null
        }
      ],
      [
        {
          className: 'moore-logo',
          href: 'https://www.moore.org/',
          image: '/images/footer/donors/moore@2x.png',
          alt: 'Gordon and Betty Moore Foundation',
          imageClassName: null
        },
        {
          className: 'conservancy-logo',
          href: 'https://www.nature.org/',
          image: '/images/footer/donors/nature-conservancy@2x.png',
          alt: 'The Nature Conservancy',
          imageClassName: null
        }
      ],
      [
        {
          className: 'ukaidsv-logo',
          href:
            'https://www.gov.uk/government/organisations/department-for-international-development',
          image: '/images/footer/donors/u-kaidsvg@2x.png',
          alt: 'Department for International Development',
          imageClassName: null
        },
        {
          className: 'formas-logo',
          href: 'http://www.formas.se/en/',
          image: '/images/footer/donors/formas@2x.png',
          alt: 'Formas',
          imageClassName: null
        },
        {
          className: 'nicfi-logo',
          href:
            'https://www.regjeringen.no/en/topics/climate-and-environment/climate/climate-and-forest-initiative/id2000712/',
          image: '/images/footer/donors/nicfi_logo.svg',
          alt: "Norway's International Climate and Forest Initiative (NICFI)",
          imageClassName: null
        }
      ]
    ]
  }
];

const Footer = () => (
  <div className="c-footer">
    <div className="contain-logos-footer row">
      {sections.map(({ title, logos, text }) => (
        <div
          key={title}
          className={cx('contain-logos', `column small-12 large-${12 / sections.length}`)}
        >
          <h4 className="title -mono-font">{title}</h4>
          <div className="logo-list-container">
            {logos.map((list, listIndex) => (
              <ul key={title + listIndex} className="logo-list">
                {list.map(logo => (
                  <li key={logo.className} className={cx('logo-item', logo.className)}>
                    <a href={logo.href} target="_blank" rel="noopener noreferrer">
                      <Img src={logo.image} alt={logo.alt} />
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
          {text && (
            <div className="contain-text">
              <p className="title -mono-font">{text}</p>
            </div>
          )}
        </div>
      ))}
    </div>
    <div className="contain-link-list row column">
      <ul className="links-list">
        <li className="link-item">
          <Link
            className="title -mono-font"
            to={{ type: 'about', payload: { section: 'terms-of-use' } }}
          >
            Terms of Use
          </Link>
        </li>
        <>
          <li className="separator"> · </li>
          <li className="link-item">
            <Link
              className="title -mono-font"
              to={{ type: 'about', payload: { section: 'privacy-policy' } }}
            >
              Privacy policy
            </Link>
          </li>
          <li className="separator"> · </li>
          <li className="link-item">
            <Link
              className="title -mono-font"
              to={{ type: 'about', payload: { section: 'cookie-policy' } }}
            >
              Cookie policy
            </Link>
          </li>
        </>
        <li className="separator"> · </li>
        <li className="link-item">
          <a className="title -mono-font" href="mailto:info@trase.earth">
            Contact us
          </a>
        </li>
      </ul>
    </div>
  </div>
);

export default Footer;
