import { connect } from 'react-redux';
import ToolModalButton from 'react-components/nav/filters-nav/tool-modal-button/tool-modal-button.component';

import { setActiveModal } from 'react-components/tool/tool.actions';
import { getSelectedRecolorByValue } from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-selector.selectors';

const mapStateToProps = state => ({
  selectedItem: getSelectedRecolorByValue(state),
  tooltip: state.app.tooltips?.sankey.nav.colorBy.main
});

const mapDispatchToProps = { setActiveModal };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolModalButton);
