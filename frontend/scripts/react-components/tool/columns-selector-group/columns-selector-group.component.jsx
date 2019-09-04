import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import ColumnSelector from 'react-components/tool/column-selector/column-selector.container';
import Heading from 'react-components/shared/heading';
import cx from 'classnames';

import 'react-components/tool/columns-selector-group/columns-selector-group.scss';

function ColumnsSelectorGroup(props) {
  const { sankeySize, columns, flowsLoading } = props;
  const loading = !columns || columns.length === 0 || flowsLoading;
  const [dots, setDots] = useState(1);
  useLayoutEffect(() => {
    const interval = setInterval(() => setDots(d => (d + 1) % 4), 300);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  const styles = { width: `${sankeySize[0] + 8}px` };

  return (
    <div
      style={styles}
      className={cx('c-columns-selector-group', 'is-absolute', { '-loading': loading })}
    >
      {loading && (
        <Heading variant="mono" size="md" weight="bold">
          Loading{Array.from({ length: dots }).map(() => '.')}
        </Heading>
      )}

      {!loading && Array.from({ length: 4 }).map((_, i) => <ColumnSelector group={i} />)}
    </div>
  );
}

ColumnsSelectorGroup.propTypes = {
  sankeySize: PropTypes.array,
  columns: PropTypes.object
};

export default ColumnsSelectorGroup;
