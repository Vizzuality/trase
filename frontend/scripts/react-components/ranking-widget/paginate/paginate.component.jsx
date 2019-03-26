import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-components/shared/button/button.component';

import './paginate-styles.scss';

class Paginate extends PureComponent {
  render() {
    const { settings, count, onClickChange, className } = this.props;
    const { page, pageSize } = settings;
    const showPrev = page > 0;
    const showNext = count > pageSize * (page + 1);
    const arrowDownIcon = (
      <svg className="icon icon-arrow-down">
        <use xlinkHref="#icon-arrow-down" />
      </svg>
    );
    return (
      <div className={`c-paginate ${className || ''}`}>
        {showPrev && (
          <Button
            className="button-up square theme-button-small theme-button-grey"
            onClick={() => onClickChange(-1)}
          >
            {arrowDownIcon}
          </Button>
        )}
        {showNext && (
          <Button
            className="button-down square theme-button-small theme-button-grey"
            onClick={() => onClickChange(1)}
          >
            {arrowDownIcon}
          </Button>
        )}
      </div>
    );
  }
}

Paginate.propTypes = {
  settings: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onClickChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default Paginate;
