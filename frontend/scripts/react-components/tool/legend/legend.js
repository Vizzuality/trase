import { connect } from 'react-redux';
import {
  getChoroplethOptions,
  getCurrentHighlightedChoroplethBucket
} from 'react-components/tool-layers/tool-layers.selectors';
import { toggleMapLayerMenu } from 'actions/app.actions';
import Legend from './legend.component';

const mapStateToProps = state => {
  const { choroplethLegend } = getChoroplethOptions(state);
  return {
    choroplethLegend,
    currentHighlightedChoroplethBucket: getCurrentHighlightedChoroplethBucket(state)
  };
};

const mapDispatchToProps = { toggleMapLayerMenu };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Legend);
