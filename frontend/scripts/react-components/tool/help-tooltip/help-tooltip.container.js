import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import Tooltip from 'react-components/tool/help-tooltip/help-tooltip.component';

const mapStateToProps = state => ({
  tooltip: state.app.tooltipCheck
});

const methodProps = [{ name: 'checkTooltip', compared: ['tooltip'], returned: ['tooltip'] }];

export default connect(
  mapStateToProps,
  null
)(mapToVanilla(Tooltip, methodProps, []));
