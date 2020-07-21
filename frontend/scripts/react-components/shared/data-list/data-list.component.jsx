import React from 'react';
import PropTypes from 'prop-types';

import './data-list.scss';

function DataList(props) {
  const { data } = props;

  return (
    <div className="c-data-list">
      <ul className="data-list">
        {data.map(d => (
          <li key={d.label} className="data-list--items">
            {d.label} <span className="data-list--value">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

DataList.propTypes = {
  data: PropTypes.array.isRequired
};

export default DataList;
