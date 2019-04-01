import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading/heading.component';
import Button from 'react-components/shared/button';
import 'react-components/table-modal/table-modal.scss';

function TableModal({ title }) {
  return (
    <div className="c-table-modal">
      <Heading size="md" align="center">
        {title}
      </Heading>
      Table
      <div className="table-modal-footer">
        <Button color="pink" size="sm" disabled>
          Download CSV
        </Button>
      </div>
    </div>
  );
}

TableModal.propTypes = {
  title: PropTypes.string
};

export default TableModal;
