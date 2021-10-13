import React from 'react';

import Button from 'react-components/shared/button';
import Icon from 'react-components/shared/icon';
import './cta-styles.scss';

function CTA({ handleOnRequestClose, data }) {
  const { text, releaseNotesText } = data || {};
  console.log({ text, releaseNotesText });
  return (
    <div className="c-cta">
      <div className="cta-main-text">{text}</div>
      <div>{releaseNotesText}</div>
      <Button className="close-button" onClick={handleOnRequestClose}>
        <Icon icon="icon-close" />
      </Button>
    </div>
  );
}

export default CTA;
