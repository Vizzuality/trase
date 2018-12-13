import React from 'react';
import PropTypes from 'prop-types';
import TeamPageMessage from 'react-components/team/team-page-message.component';
import Link from 'redux-first-router-link';
import MarkdownRenderer from 'react-components/static-content/markdown-renderer/markdown-renderer.component';
import TeamProfilePicture from 'react-components/team/team-profile-picture/team-profile-picture.component';

import 'scripts/react-components/team/team-member/team-member.scss';
import Heading from 'react-components/shared/heading/heading.component';

const TeamMember = props => {
  const { member, errorMessage } = props;

  if (errorMessage !== null) {
    return (
      <TeamPageMessage message={`An error occurred while loading the team info: ${errorMessage}`} />
    );
  }

  return (
    <div className="c-team-member">
      <div className="row">
        <div className="column small-12 medium-4">
          <div className="team-member-profile-picture-container">
            <Heading as="h3" variant="mono" color="grey-faded" size="sm">
              <Link to={{ type: 'team' }}>back to trase team</Link>
            </Heading>
            <TeamProfilePicture imageUrl={member.smallImageUrl} />
          </div>
        </div>
        <div className="column small-12 medium-8">
          <div className="team-member-details">
            <Heading size="lg">{member.name}</Heading>
            <Heading as="h3" variant="mono" color="pink" size="sm">
              {member.group}
            </Heading>
            <MarkdownRenderer className="team-member-bio" content={member.bio} />
          </div>
        </div>
      </div>
    </div>
  );
};

TeamMember.propTypes = {
  member: PropTypes.object.isRequired,
  errorMessage: PropTypes.string
};

export default TeamMember;
