import { connect } from 'react-redux';
import TableModalComponent from 'react-components/shared/table-modal/table-modal.component';
import { getTableData } from 'react-components/shared/table-modal//table-modal.selectors';

const mapStateToProps = (state, { meta, data, chartType }) => ({
  tableData: getTableData(state, { meta, data, chartType })
});

export default connect(mapStateToProps)(TableModalComponent);
