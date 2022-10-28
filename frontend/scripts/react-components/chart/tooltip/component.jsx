import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Styles
import './styles.scss';

class Tooltip extends PureComponent {
  static propTypes = {
    payload: PropTypes.arrayOf(PropTypes.shape({})),
    settings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    hideZeros: PropTypes.bool
  };

  static defaultProps = {
    payload: [],
    hideZeros: false
  };

  getValue = (item, value) => {
    const { format, suffix = '', preffix = '' } = item;
    let val = value;

    if (format && typeof format === 'function') {
      val = format(val);
    }

    return `${preffix}${val}${suffix}`;
  };

  render() {
    const { payload, settings, hideZeros } = this.props;
    const values = payload && payload.length > 0 && payload[0].payload;
    return (
      <div>
        {settings &&
          settings.length && (
            <div className="c-chart-tooltip">
              {settings.map(
                d =>
                  hideZeros && !values[d.key] ? null : (
                    <div key={d.key} className={`data-line ${d.position || ''}`}>
                      {/* LABEL */}
                      {(d.label || d.labelKey) && (
                        <div className="data-label">
                          {d.color && (
                            <div className="data-color" style={{ backgroundColor: d.color }} />
                          )}

                          {d.key === 'break' ? (
                            <span className="break-label">{d.label}</span>
                          ) : (
                            <span>{d.label || values[d.labelKey]}</span>
                          )}
                        </div>
                      )}

                      {/* UNIT */}
                      <div className="data-value">{this.getValue(d, values[d.key])}</div>
                    </div>
                  )
              )}
            </div>
          )}
      </div>
    );
  }
}

export default Tooltip;
