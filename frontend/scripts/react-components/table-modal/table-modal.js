import { connect } from 'react-redux';
import TableModalComponent from 'react-components/table-modal/table-modal.component';
import { makeGetTableData } from 'react-components/table-modal/table-modal.selectors';

const mapStateToProps = (state, { meta, data, chartType }) => {
  const getTableData = makeGetTableData();
  return { tableData: getTableData(state, { meta, data, chartType }) };
};

export default connect(mapStateToProps)(TableModalComponent);
