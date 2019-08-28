import React from 'react';
import PropTypes from 'prop-types';
import ColumnSelector from 'react-components/tool/column-selector/column-selector.container';
import Heading from 'react-components/shared/heading';
import cx from 'classnames';

import 'react-components/tool/columns-selector-group/columns-selector-group.scss';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';

function ColumnsSelectorGroup(props) {
  const { sankeySize, columns } = props;
  const loading = !columns || columns.length === 0;

  const styles = { width: `${sankeySize[0] + 8}px` };

  return (
    <div
      style={styles}
      className={cx('c-columns-selector-group', 'is-absolute', { '-loading': loading })}
    >
      {loading && (
        <>
          <Heading variant="mono" size="sm" weight="bold">
            Loading...
          </Heading>
          <ShrinkingSpinner className="-dark columns-spinner -small" />
        </>
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
