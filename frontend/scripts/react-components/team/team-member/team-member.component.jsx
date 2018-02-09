import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import MarkdownRenderer from 'react-components/static-content/markdown-renderer/markdown-renderer.component';
import cx from 'classnames';

const TeamMember = props => {
  const { member } = props;
  return (
    <div className="c-team-member">
      <div className="row">
        <div className="column small-12 medium-4">
          <div className="team-member-profile-picture-container">
            <Link className="subtitle -gray" to={{ type: 'team' }}>
              SEE ALL TEAM
            </Link>
            <div
              className={cx('c-team-profile-picture', { '-placeholder': !member.smallImageUrl })}
              style={{ backgroundImage: `url(${member.smallImageUrl})` }}
            />
          </div>
        </div>
        <div className="column small-12 medium-8">
          <div className="team-member-details">
            <h2 className="team-member-name title -medium -regular">{member.name}</h2>
            <h3 className="subtitle team-member-group">{member.group}</h3>
            <MarkdownRenderer className="team-member-bio" content={member.bio} />
          </div>
        </div>
      </div>
    </div>
  );
};

TeamMember.propTypes = {
  member: PropTypes.object.isRequired
};

export default TeamMember;
