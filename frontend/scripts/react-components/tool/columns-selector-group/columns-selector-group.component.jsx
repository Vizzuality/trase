import React from 'react';
import PropTypes from 'prop-types';
import ColumnSelector from 'react-components/tool/column-selector/column-selector.container';
import cx from 'classnames';

import 'react-components/tool/columns-selector-group/columns-selector-group.scss';

function ColumnsSelectorGroup(props) {
  const { sankeySize, columns } = props;
  const loading = !columns || columns.length === 0;

  const styles = { width: `${sankeySize[0] + 8}px` };

  return (
    <div style={styles} className={cx('c-columns-selector-group', { '-loading': loading })}>
      {!loading && Array.from({ length: 4 }).map((_, i) => <ColumnSelector key={i} group={i} />)}
    </div>
  );
}

ColumnsSelectorGroup.propTypes = {
  sankeySize: PropTypes.array,
  columns: PropTypes.object
};

export default ColumnsSelectorGroup;
