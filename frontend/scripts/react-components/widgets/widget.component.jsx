import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getWidgetData, getWidgetState } from 'react-components/widgets/widgets.actions';
import isEqual from 'lodash/isEqual';

const mapStateToProps = (state, { query, params }) => {
  const { endpoints } = state.widgets;
  const widget = getWidgetState(query, endpoints);
  return {
    params,
    widget
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({ getWidgetData }, dispatch);

class Widget extends React.PureComponent {
  static propTypes = {
    raw: PropTypes.array,
    params: PropTypes.array,
    widget: PropTypes.shape({
      data: PropTypes.any,
      error: PropTypes.any,
      loading: PropTypes.bool
    }),
    query: PropTypes.array.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    getWidgetData: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    widget: {
      data: {},
      error: null,
      loading: true
    },
    raw: []
  };

  componentDidMount() {
    const { query, params, raw } = this.props;
    query.forEach((endpoint, i) => this.props.getWidgetData(endpoint, params[i], raw[i]));
  }

  componentDidUpdate(prev) {
    const { query, params, raw } = this.props;
    query.forEach((endpoint, i) => {
      if (prev.query[i] !== query[i] || !isEqual(params[i], prev.params[i])) {
        this.props.getWidgetData(endpoint, params[i], raw[i]);
      }
    });
  }

  render() {
    const { widget, children } = this.props;
    return children(widget);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Widget);
