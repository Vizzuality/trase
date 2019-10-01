import { connect, batch } from 'react-redux';
import ToolModal from 'react-components/tool/tool-modal/tool-modal.component';
import { setActiveModal } from 'react-components/tool/tool.actions';

import {
  selectRecolorBy,
  setToolFlowsLoading
} from 'react-components/tool-links/tool-links.actions';
import {
  getActiveModal,
  getItems,
  getSelectedItem
} from 'react-components/tool/tool-modal/tool-modal.selectors';

const mapStateToProps = state => ({
  activeModal: getActiveModal(state),
  items: getItems(state),
  selectedItem: getSelectedItem(state)
});

const mapDispatchToProps = dispatch => ({
  onChange: recolorBy => {
    batch(() => {
      dispatch(setToolFlowsLoading(true));
      dispatch(selectRecolorBy(recolorBy));
      dispatch(setActiveModal(null));
    });
  },
  setActiveModal: activeModal => dispatch(setActiveModal(activeModal))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolModal);
