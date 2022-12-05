import React from 'react';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import './methods-disclaimer.scss';

function MethodsDisclaimer() {
  return (
    <div className="c-disclaimer">
      <Heading color="pink" size="sm" weight="bold" className="disclaimer-title">
        <svg className="icon disclaimer-icon">
          <use xlinkHref="#icon-warning" />
        </svg>
        Attention needed
      </Heading>
      <Text size="rg" color="pink" lineHeight="md">
        Please note there are changes in methods before and after 2018 that are relevant for data
        interpretation.{' '}
        <a
          title="Brazil Soy method document"
          href="https://resources.trase.earth/documents/data_methods/SEI_PCS_Brazil_soy_2.6._EN.pdf"
          target="_blank"
          rel="noopener noreferrer"
          // eslint-disable-next-line react/no-unknown-property
          tx-content="translate_urls"
          className="pink-link"
        >
          Check the method document
        </a>{' '}
        for more information.
      </Text>
    </div>
  );
}

export default MethodsDisclaimer;
