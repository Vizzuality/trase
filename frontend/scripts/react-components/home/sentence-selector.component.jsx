import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-components/shared/dropdown.component';

const SentenceSelector = props => {
  const { children, connector, selectors } = props;
  const [firstSelector, secondSelector] = selectors;
  return (
    <React.Fragment>
      <span>{children}</span>
      <Dropdown {...firstSelector} />
      <span>{connector}</span>
      <Dropdown {...secondSelector} />
    </React.Fragment>
  );
};

SentenceSelector.propTypes = {
  children: PropTypes.string,
  connector: PropTypes.string,
  selectors: PropTypes.array
};

export default SentenceSelector;
