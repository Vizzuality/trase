/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import cx from 'classnames';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';
import Icon from 'react-components/shared/icon';

import formatValue from 'utils/formatValue';
import { UNITLESS_UNITS } from 'constants';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';

import 'react-components/profile/profile-components/table/profiles-table.scss';

class ProfilesTable extends Component {
  renderTopImportsHeader() {
    const { data, testId } = this.props;
    return (
      <thead>
        <tr className="table-row">
          {data.includedColumns.map((elem, index) => (
            <th
              key={index}
              className={cx({
                'header-cell': true,
                'header-cell-large': true,
                '_text-align-left': data.includedColumns.length - 1 !== index,
                '_text-align-right': data.includedColumns.length - 1 === index
              })}
              data-test={`${testId}-header-name`}
            >
              {elem.name}
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  highlightRow(row) {
    const {
      data: { highlight = null }
    } = this.props;
    return highlight && row[highlight.index] === highlight.value;
  }

  renderTopImportsTable() {
    const { data, testId } = this.props;
    const columns = data.included_columns || data.includedColumns;
    return (
      <tbody>
        {data.rows.map((entry, entryIndex) => (
          <tr
            key={`top-imports-table-entry-${entryIndex}`}
            className={cx({
              'table-row': true,
              '-highlight': this.highlightRow(entry)
            })}
            data-test={`${testId}-row`}
          >
            {entry.map((row, rowIndex) => {
              const hasUnit = !UNITLESS_UNITS.includes(columns[rowIndex].unit);
              return (
                <td
                  key={`top-imports-table-row-${entryIndex}-${rowIndex}`}
                  className={cx('cell-score', {
                    '_text-align-left': entry.length - 1 !== rowIndex,
                    '_text-align-right': entry.length - 1 === rowIndex
                  })}
                >
                  <span className="node-name">{formatValue(row, columns[rowIndex].name)}</span>
                  <span className="unit">{hasUnit ? columns[rowIndex].unit : null}</span>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  }

  renderPlacesTableHeader() {
    const { data, testId } = this.props;

    return (
      <thead>
        <tr className="table-row">
          <th className="header-cell">
            <span className="only-for-print">{data.name}</span>
          </th>
          {data.rows.map((elem, index) => (
            <th
              key={index}
              className="header-cell _text-align-right"
              data-test={`${testId}-header-name`}
            >
              {elem.name}
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  renderPlacesTable() {
    const { data, testId } = this.props;
    const columns = data.included_columns || data.includedColumns;

    return (
      <tbody>
        {data.rows[0].values.map((value, valueKey) => (
          <tr key={valueKey} className="table-row" data-test={`${testId}-row`}>
            <td className="cell-name">
              <span className="node-name">
                {columns[valueKey].name}
                {columns[valueKey].year}
              </span>
              {columns[valueKey].tooltip && <Tooltip text={columns[valueKey].tooltip} />}
            </td>
            {data.rows.map((row, rowKey) => (
              <td key={rowKey} className="cell-score _text-align-right">
                <span
                  className="unit"
                  data-unit={
                    row.have_unit && !UNITLESS_UNITS.includes(columns[valueKey].unit)
                      ? columns[valueKey].unit
                      : null
                  }
                >
                  {formatValue(row.values[valueKey], columns[valueKey].name)}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  renderActorsTableHeader() {
    const { testId, data } = this.props;

    return (
      <thead>
        <tr className="table-row">
          {data.included_columns.map((column, columnIndex) => (
            <th key={columnIndex} className="header-cell">
              <div className={cx({ 'align-content-right': columnIndex > 0 })}>
                <span className="header-name" data-test={`${testId}-header-name`}>
                  {column.name}
                </span>
                {column.tooltip && <Tooltip text={column.tooltip} />}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  renderActorsTable() {
    const { data, target, year, targetPayload, contextId, testId } = this.props;

    const linkTo = id => ({
      type: target,
      payload: {
        ...(targetPayload || {}),
        query: { year, contextId, nodeId: id }
      }
    });
    const hasLink = value =>
      value !== null &&
      target !== null &&
      typeof value.value !== 'number' &&
      value.id !== undefined;

    const renderLink = (value, children) => (
      <>
        <Link className="node-link" to={linkTo(value.id)} data-test={`${testId}-cell-link`}>
          <Icon icon="icon-outside-link" className="icon-outside-link" />
          {children}
        </Link>
        <span className="only-for-print">{children}</span>
      </>
    );

    const formattedValue = (value, valueIndex) =>
      formatValue(value.value, data.included_columns[valueIndex].name);
    return (
      <tbody>
        {data.rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="table-row" data-test={`${testId}-row`}>
            {row.is_total === true && (
              <td className="cell-score">
                <span className="node-name">Total</span>
              </td>
            )}
            {row.values.map((value, valueIndex) => (
              <td
                key={valueIndex}
                className={cx({
                  'cell-score': valueIndex > 0,
                  'cell-name': valueIndex === 0,
                  '_text-align-right': valueIndex > 0 || row.is_total === true
                })}
              >
                {value === null && <span>N/A</span>}
                {value !== null && (
                  <>
                    <span className="node-name">
                      {hasLink(value)
                        ? renderLink(value, formattedValue(value, valueIndex))
                        : formattedValue(value, valueIndex)}
                    </span>
                    {valueIndex > 0 && (
                      <span className="unit">{data.included_columns[valueIndex].unit}</span>
                    )}
                  </>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  renderOtherTable() {
    const { data, target, targetPayload, year, contextId } = this.props;
    const linkTo = id => ({
      type: target,
      payload: {
        ...(targetPayload || {}),
        query: { year, contextId, nodeId: id }
      }
    });
    return (
      <tbody>
        {data.map((elem, dataIndex) => (
          <tr key={dataIndex} className="table-row">
            <td className="cell-name">
              <span className="node-name">
                {dataIndex + 1}.{elem.name}
              </span>
              {target !== null && (
                <Link className="node-link" to={linkTo(elem.id)}>
                  <svg className="icon icon-check">
                    <use xlinkHref="#icon-outside-link" />
                  </svg>
                </Link>
              )}
            </td>
            <td className="cell-score _text-align-right">
              <span className="unit" data-unit={dataIndex === 0 && '%'}>
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
        {type === 't_head_top_imports' && this.renderTopImportsHeader()}
        {type === 't_head_top_imports' && this.renderTopImportsTable()}
        {type === 't_head_places' && this.renderPlacesTableHeader()}
        {type === 't_head_places' && this.renderPlacesTable()}
        {type === 't_head_actors' && this.renderActorsTableHeader()}
        {type === 't_head_actors' && this.renderActorsTable()}
        {type !== 't_head_actors' &&
          type !== 't_head_places' &&
          type !== 't_head_top_imports' &&
          this.renderOtherTable()}
      </table>
    );
  }
}

ProfilesTable.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string,
  target: PropTypes.string,
  testId: PropTypes.string,
  year: PropTypes.number,
  highlight: PropTypes.object,
  targetPayload: PropTypes.object,
  contextId: PropTypes.number
};

export default ProfilesTable;
