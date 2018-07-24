import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getWidgetData } from 'react-components/widgets/widgets.actions';

function withWidget(Component) {
  const mapStateToProps = (state, { endpoint }) => {
    const { endpoints } = state.widgets;
    return { widget: endpoints[endpoint] };
  };
  const mapDispatchToProps = dispatch => bindActionCreators({ getWidgetData }, dispatch);

  class Widget extends React.PureComponent {
    static propTypes = {
      params: PropTypes.object,
      widget: PropTypes.shape({
        data: PropTypes.any,
        error: PropTypes.any,
        loading: PropTypes.bool.isRequired
      }),
      endpoint: PropTypes.string.isRequired,
      getWidgetData: PropTypes.func.isRequired
    };

    componentDidMount() {
      const { endpoint, params } = this.props;
      this.props.getWidgetData(endpoint, params);
    }

    render() {
      const { widget } = this.props;
      return <Component {...widget} />;
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Widget);
}

export default withWidget;
