import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Button from 'react-components/shared/button';
import Icon from 'react-components/shared/icon';
import './cta-styles.scss';

function CTA({ handleOnRequestClose, data }) {
  const { text, releaseNotesText, fixed } = data || {};
  return (
    <div className="c-cta">
      <div className={cx({ 'cta-main-text-fixed': fixed, 'cta-main-text': !fixed })}>{text}</div>
      <div>{releaseNotesText}</div>
      {!fixed && (
        <Button className="close-button" onClick={handleOnRequestClose}>
          <Icon icon="icon-close" />
        </Button>
      )}
    </div>
  );
}

CTA.propTypes = {
  data: PropTypes.shape({
    text: PropTypes.node,
    releaseNotesText: PropTypes.node
  }),
  handleOnRequestClose: PropTypes.func.isRequired
};

export default CTA;
