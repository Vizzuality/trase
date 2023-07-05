import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import cx from 'classnames';
import Tippy from '@tippy.js/react';
import ConfidenceWarning from 'react-components/shared/confidence-warning';
import 'react-components/shared/tool-bar/edit-filter/edit-filter.scss';

const ConfidenceWarningButton = () => (
  <Tippy
    content={
      <div className="warning-tooltip">
        <ConfidenceWarning variant="sankey" />
      </div>
    }
    placement="bottom-start"
    arrow={false}
    animation="none"
    theme="green"
    duration={0}
    zIndex={202}
    distance={0}
  >
    <svg className="icon warning-bell-icon">
      <use xlinkHref="#icon-warning-bell" />
    </svg>
  </Tippy>
);

function EditFilter(props) {
  const { id, title, subtitle, onClick, className, label, hasConfidenceWarning } = props;
  return (
    <button onClick={() => onClick(id)} className={cx('c-edit-filter', className)}>
      <Text as="span" size="rg" variant="sans" transform="uppercase" className="options-menu-label">
        {label}
      </Text>
      <Heading as="h2" color="white" weight="bold" size="rg" className="edit-title">
        <span className="title-text">{title}</span>
        {subtitle && (
          <Heading as="span" color="white" size="sm" weight="bold" className="edit-subtitle">
            {subtitle}
          </Heading>
        )}
        {hasConfidenceWarning && <ConfidenceWarningButton />}
      </Heading>
    </button>
  );
}

EditFilter.propTypes = {
  id: PropTypes.string,
  subtitle: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  hasConfidenceWarning: PropTypes.bool
};

export default EditFilter;
