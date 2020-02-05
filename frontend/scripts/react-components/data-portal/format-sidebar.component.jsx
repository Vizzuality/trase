import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import RadioButton from 'react-components/shared/radio-button/radio-button.component';
import cx from 'classnames';

import './format-sidebar.scss';

const outputTypes = ['pivot', 'table'];
const fileTypes = [
  {
    title: '.csv (comma separated)',
    extension: '.csv',
    separator: 'comma'
  },
  {
    title: '.csv (semicolon separated)',
    extension: '.csv',
    separator: 'semicolon'
  },
  {
    title: '.json',
    extension: '.json',
    separator: ''
  }
];

function FormatSidebar(props) {
  const {
    fileExtension,
    fileSeparator,
    outputType,
    dispatch,
    selectedCountry,
    selectedCommodity
  } = props;
  return (
    <div className="c-custom-dataset__format-sidebar">
      <div className="c-custom-dataset-selector" data-type="format">
        <div className="c-custom-dataset-selector__header">OUTPUT TYPE</div>
        <ul className="c-custom-dataset-selector__values">
          {outputTypes.map(type => (
            <li className="-selected">
              {capitalize(type)}
              <RadioButton
                noSelfCancel
                className="-grey"
                enabled={outputType === type}
                onClick={() => dispatch({ type: 'setOutputType', payload: type })}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="c-custom-dataset-selector" data-type="format">
        <div className="c-custom-dataset-selector__header">FILE</div>
        <ul className="c-custom-dataset-selector__values">
          {fileTypes.map(fileType => (
            <li className="-selected">
              {fileType.title}
              <RadioButton
                noSelfCancel
                className="-grey"
                enabled={
                  fileExtension === fileType.extension && fileSeparator === fileType.separator
                }
                onClick={() => dispatch({ type: 'setFormatType', payload: fileType })}
              />
            </li>
          ))}
        </ul>
      </div>
      <button
        className={cx('download-button', {
          '-disabled':
            !DATA_DOWNLOAD_ENABLED || selectedCountry === null || selectedCommodity === null
        })}
        onClick={() => dispatch({ type: 'setDownloadType', payload: 'custom' })}
      >
        <svg className="icon icon-download">
          <use xlinkHref="#icon-download" />
        </svg>
        DOWNLOAD DATA
      </button>
    </div>
  );
}

FormatSidebar.propTypes = {
  fileExtension: PropTypes.string.isRequired,
  fileSeparator: PropTypes.string.isRequired,
  outputType: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  selectedCountry: PropTypes.number.isRequired,
  selectedCommodity: PropTypes.number.isRequired
};

export default FormatSidebar;
