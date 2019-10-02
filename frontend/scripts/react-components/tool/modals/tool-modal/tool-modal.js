import { connect, batch } from 'react-redux';
import ToolModal from 'react-components/tool/modals/tool-modal/tool-modal.component';
import {
  selectRecolorBy,
  setToolFlowsLoading
} from 'react-components/tool-links/tool-links.actions';
import {
  getSelectedRecolorByValue,
  getRecolorByOptions
} from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-selector.selectors';

const mapStateToProps = state => ({
  items: getRecolorByOptions(state),
  selectedItem: getSelectedRecolorByValue(state),
  tooltip: state.app.tooltips?.sankey.nav.colorBy.main
});

const mapDispatchToProps = dispatch => ({
  onChange: recolorBy => {
    batch(() => {
      dispatch(setToolFlowsLoading(true));
      dispatch(selectRecolorBy(recolorBy));
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolModal);
