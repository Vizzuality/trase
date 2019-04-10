import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading/heading.component';
import Button from 'react-components/shared/button';
import debounce from 'lodash/debounce';
import Table from 'react-components/dashboard-element/dashboard-widget/table-modal//table';
import 'react-components/dashboard-element/dashboard-widget/table-modal/table-modal.scss';

function TableModal({ title, tableData }) {
  const defaultHeight = 520;
  const modalRef = useRef(null);
  const [rect, setRect] = useState(null);
  const [height, setHeight] = useState(defaultHeight);
  const debouncedSetRect = useRef(
    debounce(() => {
      const currentRect = modalRef.current.getBoundingClientRect();
      setRect(currentRect);
    }, 300)
  );
  useEffect(() => {
    const callback = debouncedSetRect.current;
    window.addEventListener('resize', callback, {
      passive: true
    });
    return () => window.removeEventListener('resize', callback);
  }, []);
  useEffect(() => {
    if (modalRef !== null) {
      if (rect) {
        const currentHeight = Math.ceil(rect.height) - 200;
        if (currentHeight <= defaultHeight && height !== currentHeight) {
          setHeight(currentHeight);
        } else if (currentHeight > defaultHeight && height !== defaultHeight) {
          setHeight(defaultHeight);
        }
      } else {
        debouncedSetRect.current();
      }
    }
  }, [height, rect]);
  return (
    <div className="c-table-modal" ref={modalRef}>
      <Heading size="md" align="center">
        {title}
      </Heading>
      {tableData && (
        <Table
          width={760}
          height={height}
          className="table-modal-content"
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
