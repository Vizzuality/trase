import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import MarkdownRenderer from 'react-components/static-content/markdown-renderer/markdown-renderer.component';

const TeamMember = props => {
  const { member } = props;
  return (
    <div className="c-team-member row">
      <div className="team-member-profile-picture-container column small-12 medium-4">
        <Link className="subtitle -gray" to={{ type: 'team' }}>
          SEE ALL TEAM
        </Link>
        <div
          className="c-team-profile-picture"
          style={{ backgroundImage: `url(${member.smallImageUrl})` }}
        />
      </div>
      <div className="team-member-details column small-12 medium-8">
        <h2 className="team-member-name title -medium -regular">{member.name}</h2>
        <h3 className="subtitle team-member-group">{member.staffGroup.name}</h3>
        <MarkdownRenderer className="team-member-bio" content={member.bio} />
      </div>
    </div>
  );
};

TeamMember.propTypes = {
  member: PropTypes.object.isRequired
};

export default TeamMember;
