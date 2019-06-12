import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import 'react-components/tool/titlebar/titlebar.scss';

const Titlebar = ({ showTitles }) => (
  <div className="c-titlebar">
    <div className={cx('c-node-title-group js-nodes-titles', { 'is-hidden': !showTitles })}>
      <div className="js-nodes-titles-container" />
      <div className="c-nodes-clear js-nodes-titles-clear is-hidden">
        <div className="button icon-button">
          <svg className="icon">
            <use xlinkHref="#icon-close" />
          </svg>
        </div>
        <div className="button text-button js-text-button">Clear selection</div>
      </div>
    </div>
  </div>
);

Titlebar.propTypes = {
  showTitles: PropTypes.bool
};

export default Titlebar;
