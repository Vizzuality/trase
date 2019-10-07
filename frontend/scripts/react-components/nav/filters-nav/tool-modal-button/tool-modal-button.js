import { connect } from 'react-redux';
import ToolModalButton from 'react-components/nav/filters-nav/tool-modal-button/tool-modal-button.component';

import { setActiveModal } from 'react-components/tool/tool.actions';
import { getSelectedResizeBy } from 'react-components/tool-links/tool-links.selectors';
import { getSelectedRecolorByValue } from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-selector.selectors';
import {
  getHasMoreThanOneItem,
  getVersioningSelected
} from 'react-components/nav/filters-nav/tool-modal-button/tool-modal-button.selectors';

const mapStateToProps = (state, { modalId }) => {
  const selectedItem = {
    indicator: getSelectedRecolorByValue(state),
    unit: getSelectedResizeBy(state),
    version: getVersioningSelected(state)
  }[modalId];
  const tooltip = {
    indicator: state.app.tooltips?.sankey.nav.colorBy.main,
    unit: state.app.tooltips?.sankey.nav.resizeBy.main
  }[modalId];
  return {
    selectedItem,
    tooltip,
    hasMoreThanOneItem: getHasMoreThanOneItem(state, { modalId })
  };
};

const mapDispatchToProps = { setActiveModal };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolModalButton);
