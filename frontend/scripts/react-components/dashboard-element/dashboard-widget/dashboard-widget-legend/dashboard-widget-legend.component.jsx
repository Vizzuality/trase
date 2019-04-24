import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Paginate from 'react-components/shared/paginate';
import 'react-components/dashboard-element/dashboard-widget/dashboard-widget-legend/dashboard-widget-legend.scss';
import Ellipsis from 'react-components/shared/ellipsis';
import Media from 'react-media';
import { BREAKPOINTS } from 'constants';

class DashboardWidgetLegend extends React.PureComponent {
  largePageSize = 6;

  smallPageSize = 2;

  state = { page: 0, pageSize: this.largePageSize };

  handlePageChange = pageChange => {
    this.setState(state => ({ page: state.page + pageChange }));
  };

  renderWithMedia = content => (
    <Media query={`(min-width: ${BREAKPOINTS.small}px) and (max-width: 1000px)`}>
      {matches => {
        const { pageSize } = this.state;
        if (matches && pageSize === this.largePageSize)
          this.setState({ pageSize: this.smallPageSize });
        if (!matches && pageSize === this.smallPageSize)
          this.setState({ pageSize: this.largePageSize });
        return content;
      }}
    </Media>
  );

  render() {
    const { colors } = this.props;
    const { page, pageSize } = this.state;
    if (colors.length < 2) return null;
    const pageData = colors.slice(page * pageSize, (page + 1) * pageSize);
    const hasPagination = colors.length > pageSize;
    return this.renderWithMedia(
      <div
        className={cx('c-dashboard-widget-legend', {
          '-paginated': hasPagination
        })}
      >
        <div className="dashboard-widget-legend-list">
          {pageData.map((d, i) => (
            <div key={i} className="dashboard-widget-item">
              <div className="dashboard-widget-key-item">
                <span style={{ backgroundColor: d.color || 'white' }} />
                <p>
                  <Ellipsis>{d.label}</Ellipsis>
                </p>
              </div>
            </div>
          ))}
        </div>
        {hasPagination && (
          <Paginate
            page={page}
            pageSize={pageSize}
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
  colors: PropTypes.array.isRequired
};

export default DashboardWidgetLegend;
