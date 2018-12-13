/* eslint-disable jsx-a11y/no-static-element-interactions */
import '../../profiles/chord/chord.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import 'scripts/react-components/data-portal/bulk-downloads-block/bulk-downloads.scss';

class BulkDownloadsBlock extends Component {
  onBulkDownloadButtonClicked(contextId) {
    if (!this.props.enabled) return;
    this.props.onButtonClicked(contextId);
  }

  render() {
    return (
      <div className="c-bulk-downloads">
        <div className="c-bulk-downloads__title">BULK DOWNLOADS</div>
        <div className="row">
          {this.props.contexts.map(context => (
            <div key={context.id} className="small-4 columns">
              <div
                className={classnames('c-bulk-downloads__item', {
                  '-disabled': !this.props.enabled
                })}
                data-value="{context.id}"
                onClick={() => this.onBulkDownloadButtonClicked(context.id)}
              >
                <span>
                  {context.countryName} - {context.commodityName} (all years)
                </span>
                <svg className="icon icon-download">
                  <use xlinkHref="#icon-download" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

BulkDownloadsBlock.propTypes = {
  contexts: PropTypes.array,
  enabled: PropTypes.bool,
  onButtonClicked: PropTypes.func
};

export default BulkDownloadsBlock;
