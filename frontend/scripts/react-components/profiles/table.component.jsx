import formatValue from 'utils/formatValue';
import { UNITLESS_UNITS } from 'constants';
import React, { Component } from 'react';
import classnames from 'classnames';
import Link from 'redux-first-router-link';
import 'styles/components/profiles/area-table.scss';
import PropTypes from 'prop-types';

class Table extends Component {
  renderPlacesTableHeader() {
    const data = this.props.data;

    return (
      <thead>
        <tr className="table-row">
          <th className="header-cell" />
          {data.rows.map((elem, index) => (
            <th
              key={index}
              className="header-cell _text-align-right"
            >
              {elem.name}
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  renderPlacesTable() {
    const data = this.props.data;

    return (
      <tbody>
        {data.rows[0].values.map((value, valueKey) => (
          <tr
            key={valueKey}
            className="table-row"
          >
            <td className="cell-name">
              <span className="node-name">
                {data.included_columns[valueKey].name}
                {data.included_columns[valueKey].year}
              </span>
            </td>
            {data.rows.map((row, rowKey) => (
              <td
                key={rowKey}
                className="cell-score _text-align-right"
              >
                <span
                  className="unit"
                  data-unit={
                    row.have_unit
                    && !UNITLESS_UNITS.includes(data.included_columns[valueKey].unit)
                      ? data.included_columns[valueKey].unit
                      : null
                  }
                >
                  {
                    formatValue(row.values[valueKey], data.included_columns[valueKey].name)
                  }
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  renderActorsTableHeader() {
    const data = this.props.data;

    return (
      <thead>
        <tr className="table-row">
          {data.included_columns.map((column, columnIndex) => (
            <th
              key={columnIndex}
              className={classnames('header-cell', { '_text-align-right': columnIndex > 0 })}
            >
              {column.name}
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  renderActorsTable() {
    const { data, target, year } = this.props;

    return (
      <tbody>
        {data.rows.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="table-row"
          >
            {row.is_total === true &&
            <td className="cell-score">
              <span className="node-name">Total</span>
            </td>
            }
            {row.values.map((value, valueIndex) => (
              <td
                key={valueIndex}
                className={classnames('cell-score', { '_text-align-right': valueIndex > 0 || row.is_total === true })}
              >
                {value === null && <span className="unit">N/A</span>}
                {value !== null &&
                <span
                  className="unit"
                  data-unit={rowIndex === 0 ? data.included_columns[valueIndex].unit : null}
                >
                  {
                    formatValue(value.value, data.included_columns[valueIndex].name)
                  }
                  {target !== null && typeof value.value !== 'number' && value.id !== undefined &&
                    <Link className="node-link" to={{ type: target, payload: { query: { nodeId: value.id, year } } }}>
                      <svg className="icon icon-check">
                        <use xlinkHref="#icon-outside-link" />
                      </svg>
                    </Link>
                  }
                </span>
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  renderOtherTable() {
    const { data, target } = this.props;

    return (
      <tbody>
        {data.map((elem, dataIndex) => (
          <tr
            key={dataIndex}
            className="table-row"
          >
            <td className="cell-name">
              <span className="node-name">{dataIndex + 1}.{elem.name}</span>
              {target !== null &&
              <Link className="node-link" to={{ type: target, payload: { query: { nodeId: elem.id } } }}>
                <svg className="icon icon-check">
                  <use xlinkHref="#icon-outside-link" />
                </svg>
              </Link>
              }
            </td>
            <td className="cell-score _text-align-right">
              <span
                className="unit"
                data-unit={dataIndex === 0 && '%'}
              >
                {elem.value}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }


  render() {
    const { type } = this.props;

    return (
      <table>
        {type === 't_head_places' && this.renderPlacesTableHeader()}
        {type === 't_head_places' && this.renderPlacesTable()}
        {type === 't_head_actors' && this.renderActorsTableHeader()}
        {type === 't_head_actors' && this.renderActorsTable()}
        {type !== 't_head_actors' && type !== 't_head_places' && this.renderOtherTable()}
      </table>
    );
  }
}

Table.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string,
  target: PropTypes.string,
  year: PropTypes.number
};

export default Table;
