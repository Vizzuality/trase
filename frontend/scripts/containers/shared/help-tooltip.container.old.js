import connect from 'base/connect';
import Tooltip from 'components/shared/help-tooltip.component';

const mapMethodsToState = state => ({
  checkTooltip: state.app.tooltipCheck
});

export default connect(
  Tooltip,
  mapMethodsToState
);
