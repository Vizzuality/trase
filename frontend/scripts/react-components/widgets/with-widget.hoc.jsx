import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getWidgetData } from 'react-components/widgets/widgets.actions';

function withWidget(Component) {
  const mapStateToProps = (state, { endpoint, params, ...ownProps }) => {
    const { endpoints } = state.widgets;
    return {
      params,
      ownProps,
      widget: endpoints[endpoint]
    };
  };
  const mapDispatchToProps = dispatch => bindActionCreators({ getWidgetData }, dispatch);

  class Widget extends React.PureComponent {
    static propTypes = {
      params: PropTypes.object,
      widget: PropTypes.shape({
        data: PropTypes.any,
        error: PropTypes.any,
        loading: PropTypes.bool
      }),
      ownProps: PropTypes.any,
      endpoint: PropTypes.string.isRequired,
      getWidgetData: PropTypes.func.isRequired
    };

    static defaultProps = {
      widget: {
        data: {},
        error: null,
        loading: true
      }
    };

    componentDidMount() {
      const { endpoint, params } = this.props;
      this.props.getWidgetData(endpoint, params);
    }

    render() {
      const { widget, ownProps } = this.props;
      return <Component {...widget} {...ownProps} />;
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Widget);
}

export default withWidget;
