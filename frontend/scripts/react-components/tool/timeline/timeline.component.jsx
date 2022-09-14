import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Text from 'react-components/shared/text';
import Icon from 'react-components/shared/icon';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';

import { translateText } from 'utils/transifex';

import { useSlider } from './timeline.hooks';

import './timeline.scss';

function Timeline(props) {
  const { years, subNationalYears, showBackground, disabled, selectYears, selectedYears } = props;

  const { refs, hasNextPage, hasPrevPage, transform, onNext, onPrevious } = useSlider(props);
  const [hoveredYear, setHoveredYear] = useState();
  return (
    <div className={cx('c-timeline', { '-show-background': showBackground })}>
      <Icon icon="icon-calendar" color="elephant" />
      <Text variant="sans" weight="bold" size="rg" as="span" className="year-label">
        YEAR
      </Text>
      <div
        ref={refs.container}
        className={cx('timeline-container', {
          '-button-left': hasPrevPage,
          '-button-right': hasNextPage
        })}
      >
        <button
          className={cx('timeline-page-button', '-next', {
            '-visible': hasNextPage
          })}
          onClick={onNext}
        />
        <button
          className={cx('timeline-page-button', '-prev', {
            '-visible': hasPrevPage
          })}
          onClick={onPrevious}
        />
        <ul ref={refs.contentList} className="timeline-years-list" style={{ transform }}>
          {years.map((year, i) => {
            const isActive = year === selectedYears[0];
            const isSubNational = subNationalYears?.indexOf(year) > -1;
            const isHovered = hoveredYear === year;
            return (
              <li
                ref={i === 0 ? refs.item : undefined}
                key={year}
                className={cx({
                  'timeline-year-item': true,
                  '-sub-national': isSubNational,
                  '-hovered': isHovered,
                  '-active': selectedYears[0] === year
                })}
              >
                <button
                  disabled={disabled || isActive}
                  className="timeline-year-button"
                  onMouseLeave={() => setHoveredYear(null)}
                  onMouseEnter={() => setHoveredYear(year)}
                  onClick={() => selectYears([year, year])}
                  data-test={`timeline-year-button-${year}`}
                >
                  {!isSubNational && (
                    <Tooltip
                      showInfoIcon={false}
                      text={translateText(
                        'This data is currently only available at a national scale.'
                      )}
                      className="size-sm"
                    >
                      <Text
                        as="span"
                        weight="bold"
                        variant="sans"
                        color={isActive || isHovered ? 'white' : 'grey'}
                      >
                        {year}
                      </Text>
                    </Tooltip>
                  )}
                  {isSubNational && (
                    <Text
                      as="span"
                      weight="bold"
                      variant="sans"
                      color={isActive || isHovered ? 'white' : 'grey'}
                    >
                      {year}
                    </Text>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

Timeline.defaultProps = {
  showBackground: true
};

Timeline.propTypes = {
  showBackground: PropTypes.bool,
  years: PropTypes.array.isRequired,
  subNationalYears: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  selectYears: PropTypes.func.isRequired, // eslint-disable-line
  selectedYears: PropTypes.array.isRequired // eslint-disable-line
};

export default Timeline;
