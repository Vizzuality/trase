import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import { getSummaryEndpoint } from 'utils/getURLFromParams';
import camelCase from 'lodash/camelCase';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import ReactIframeResizer from 'react-iframe-resizer-super';

class TableComponent extends React.PureComponent {
  renderSpinner() {
    return (
      <div className="section-placeholder">
        <ShrinkingSpinner className="-large" />
      </div>
    );
  }

  render() {
    const { year, nodeId, contextId, profileType, renderIframes } = this.props;
    const params = { node_id: nodeId, context_id: contextId, profile_type: profileType, year };
    return (
      <Widget params={[params]} query={[getSummaryEndpoint(profileType)]}>
        {({ data, error, loading }) => {
          if (error) {
            // TODO: display a proper error message to the user
            console.error('Error loading summary data for profile page', error);
            return null;
          }

          if (loading || !renderIframes) {
            return this.renderSpinner();
          }

          return null;
        }}
      </Widget>
    );
  }
}

TableComponent.propTypes = {
  year: PropTypes.number,
  nodeId: PropTypes.number,
  contextId: PropTypes.number,
  renderIframes: PropTypes.bool,
  profileType: PropTypes.string
};

export default TableComponent;
