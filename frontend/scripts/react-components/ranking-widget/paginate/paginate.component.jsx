import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-components/shared/button/button.component';

import './paginate-styles.scss';

class Paginate extends PureComponent {
  render() {
    const { pageSize, count, onClickChange, className, page } = this.props;
    const showPrev = page > 0;
    const showNext = count > pageSize * (page + 1);
    return (
      <div className={`c-paginate ${className || ''}`}>
        {showPrev && (
          <Button
            onClick={() => onClickChange(-1)}
            icon="icon-arrow-up"
            color="charcoal"
            variant="circle"
            className="previous-button"
          />
        )}
        {showNext && (
          <Button
            onClick={() => onClickChange(1)}
            icon="icon-arrow"
            color="charcoal"
            variant="circle"
          />
        )}
      </div>
    );
  }
}

Paginate.propTypes = {
  pageSize: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  onClickChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default Paginate;
