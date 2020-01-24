import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getWidgetData as getWidgetDataFn,
  getWidgetState
} from 'react-components/widgets/widgets.register';

const mapStateToProps = (state, { query, params }) => {
  const { endpoints } = state.widgets;
  const widget = getWidgetState(query, endpoints);
  return {
    params,
    widget
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ getWidgetData: getWidgetDataFn }, dispatch);

function Widget(props) {
  const { widget, children, query, params, raw, getWidgetData } = props;
  const sources = useRef([]);

  useEffect(() => {
    const currentSources = sources.current;
    query.forEach((endpoint, i) => {
      const getCancelPolicy = getWidgetData(endpoint, params[i], raw[i]);
      if (getCancelPolicy) {
        sources.current.push(getCancelPolicy);
      }
    });

    return () => {
      currentSources.forEach(getCancelPolicy => {
        const cancelPolicy = getCancelPolicy();
        if (cancelPolicy.shouldCancel) {
          cancelPolicy.source.cancel();
        }
      });
    };
  }, [query, params, raw, getWidgetData]);

  return children(widget);
}

Widget.defaultProps = {
  widget: {
    data: {},
    error: null,
    loading: true
  },
  raw: []
};

Widget.propTypes = {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Widget);
