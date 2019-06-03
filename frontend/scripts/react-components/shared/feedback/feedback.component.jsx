import React from 'react';
import Icon from 'react-components/shared/icon';
import 'react-components/shared/feedback/feedback.scss';

export default () =>
  window._urq ? (
    <button className="c-feedback" onClick={() => window._urq.push(['Feedback_Open'])}>
      <Icon icon="icon-bulb" color="white" size="lg" />
      <span className="feedback-label">Feedback</span>
    </button>
  ) : null;
