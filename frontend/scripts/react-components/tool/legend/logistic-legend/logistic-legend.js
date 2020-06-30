import { connect } from 'react-redux';
import * as actions from 'react-components/tool-layers/tool-layers.actions';
import LogisticLegend from './logistic-legend.component';

import { getInspectionLevelOptions, getSelectedInspectionLevel } from './logistic-legend.selectors';

const mapStateToProps = state => ({
  inspectionLevelOptions: getInspectionLevelOptions(state),
  selectedInspectionLevel: getSelectedInspectionLevel(state)
});

const mapDispatchToProps = {
  setLogisticInspectionLevel: actions.setLogisticInspectionLevel
};

export default connect(mapStateToProps, mapDispatchToProps)(LogisticLegend);
