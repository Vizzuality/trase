import React from 'react';
import Icon from 'react-components/shared/icon';
// TODO: Use this component to replace all feedback templates and move styles to this folder

export default () =>
  window._urq ? (
    <button className="user-report-feedback" onClick={() => window._urq.push(['Feedback_Open'])}>
      <Icon icon="icon-bulb" color="white" />
      <span className="feedback-label">Feedback</span>
    </button>
  ) : null;
