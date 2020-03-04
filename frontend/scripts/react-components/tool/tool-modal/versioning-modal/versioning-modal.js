import { connect } from 'react-redux';
import VersioningModal from 'react-components/tool/tool-modal/versioning-modal/versioning-modal.component';
import { getSelectedContext } from 'app/app.selectors';
import {
  getVersionData,
  getTableData
} from 'react-components/tool/tool-modal/versioning-modal/versioning-modal.selectors';

const mapStateToProps = state => ({
  data: getVersionData(state),
  context: getSelectedContext(state),
  tableData: getTableData(state)
});

export default connect(
  mapStateToProps,
  null
)(VersioningModal);
