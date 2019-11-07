import { connect } from 'react-redux';
import ToolSelectionModalButton from 'react-components/nav/filters-nav/tool-selection-modal-button/tool-selection-modal-button.component';
import { setActiveModal } from 'react-components/tool/tool.actions';
import { editPanels } from 'react-components/nodes-panel/nodes-panel.actions';

import { getNodesPanelValues } from 'react-components/dashboard-element/dashboard-element.selectors';

const mapStateToProps = state => {
  const panelValues = getNodesPanelValues(state);
  return {
    countryName: panelValues.countries[0] && panelValues.countries[0].name,
    commodityName: panelValues.commodities[0] && panelValues.commodities[0].name
  };
};
const mapDispatchToProps = { setActiveModal, editPanels };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSelectionModalButton);
