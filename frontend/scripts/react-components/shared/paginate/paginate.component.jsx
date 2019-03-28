import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from 'react-components/shared/button/button.component';

import './paginate-styles.scss';

class Paginate extends PureComponent {
  render() {
    const { pageSize, count, onClickChange, className, page, variant } = this.props;
    const showPrev = page > 0;
    const showNext = count > pageSize * (page + 1);
    return (
      <div className={cx('c-paginate', className, { [`v-${variant}`]: variant })}>
        {(showPrev || variant === 'vertical') && (
          <Button
            onClick={() => onClickChange(-1)}
            icon="icon-arrow-up"
            color="charcoal"
            variant="circle"
            className="previous-button"
            disabled={!showPrev}
          />
        )}
        {(showNext || variant === 'vertical') && (
          <Button
            onClick={() => onClickChange(1)}
            icon="icon-arrow"
            color="charcoal"
            variant="circle"
            disabled={!showNext}
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
  className: PropTypes.string,
  variant: PropTypes.string
};

export default Paginate;
