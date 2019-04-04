import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading/heading.component';
import Button from 'react-components/shared/button';
import Table from 'react-components/dashboard-element/dashboard-widget/table-modal//table';
import 'react-components/dashboard-element/dashboard-widget/table-modal/table-modal.scss';

function TableModal({ title, tableData }) {
  return (
    <div className="c-table-modal">
      <Heading size="md" align="center">
        {title}
      </Heading>
      {tableData && (
        <Table
          className="table"
          width={760}
          height={520}
          data={tableData.data}
          headers={tableData.headers}
        />
      )}
      <div className="table-modal-footer">
        <Button color="pink" size="sm" disabled>
          Download CSV
        </Button>
      </div>
    </div>
  );
}

TableModal.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.object
};

export default TableModal;
