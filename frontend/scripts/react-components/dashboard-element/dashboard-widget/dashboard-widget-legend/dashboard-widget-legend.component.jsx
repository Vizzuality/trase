import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Paginate from 'react-components/shared/paginate';
import 'react-components/dashboard-element/dashboard-widget/dashboard-widget-legend/dashboard-widget-legend.scss';
import Text from 'react-components/shared/text';
import Ellipsis from 'react-components/shared/ellipsis';

class DashboardWidgetLegend extends React.PureComponent {
  state = { page: 0 };

  pageSize = 6;

  handlePageChange = pageChange => {
    this.setState(state => ({ page: state.page + pageChange }));
  };

  render() {
    const { colors, variant } = this.props;
    const { page } = this.state;
    if (colors.length < 2) return null;
    const hasPagination = colors.length > this.pageSize;
    const pageData = colors.slice(page * this.pageSize, (page + 1) * this.pageSize);
    const textColor = {
      dark: 'white',
      light: 'grey'
    }[variant];

    return (
      <div className={cx('c-dashboard-widget-legend', { '-paginated': hasPagination })}>
        <div className="dashboard-widget-legend-list">
          {pageData.map((d, i) => (
            <div key={i} className="dashboard-widget-item">
              <div className="dashboard-widget-key-item">
                <span style={{ backgroundColor: d.color || 'white' }} />
                <Text
                  variant="mono"
                  color={textColor}
                  transform="uppercase"
                  className="dashboard-widget-key-item-text"
                  weight="bold"
                >
                  <Ellipsis>{d.label}</Ellipsis>
                </Text>
              </div>
            </div>
          ))}
        </div>
        {hasPagination && (
          <Paginate
            page={page}
            pageSize={this.pageSize}
            count={colors.length}
            onClickChange={this.handlePageChange}
            variant="vertical"
            className="legend-pagination"
          />
        )}
      </div>
    );
  }
}

DashboardWidgetLegend.propTypes = {
  variant: PropTypes.string,
  colors: PropTypes.array.isRequired
};

export default DashboardWidgetLegend;
