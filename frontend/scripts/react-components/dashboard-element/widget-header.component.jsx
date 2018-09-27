import React from 'react';
import PropTypes from 'prop-types';

function WidgetHeader(props) {
  const { title } = props;
  return (
    <div className="dashboard-element-widgets-title-container">
      <h3 className="dashboard-element-widgets-title">
        {title}
      </h3>
      <div className="dashboard-element-widgets-actions">
        <button type="button" />
        <button type="button" />
        <button type="button" />
      </div>
    </div>
  );
}

export default WidgetHeader;
