import React, { PureComponent } from 'react';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';
import Siema from 'react-siema';
import kebabCase from 'lodash/kebabCase';
import TeamPageMessage from 'react-components/team/team-page-message.component';
import ResizeListener from 'react-components/shared/resize-listener.component';
import TeamProfilePicture from 'react-components/team/team-profile-picture/team-profile-picture.component';

import 'scripts/react-components/team/team.scss';
import Heading from 'react-components/shared/heading/heading.component';

class Team extends PureComponent {
  renderTeamMember(slug) {
    const { members } = this.props;

    return (
      <div
        key={members[slug].position + members[slug].name}
        className="column small-12 medium-6 large-4"
      >
        <div className="team-list-item">
          <Link to={{ type: 'teamMember', payload: { member: kebabCase(slug) } }}>
            <TeamProfilePicture imageUrl={members[slug].smallImageUrl} />
            <h3 className="team-list-item-title title -medium -light">{members[slug].name}</h3>
            <Heading as="h4" variant="mono" color="grey-faded" size="sm">
              <span className="team-list-item-subtitle">See More</span>
            </Heading>
          </Link>
        </div>
      </div>
    );
  }

  renderTeamGroupDesktop(group) {
    return (
      <div className="row -equal-height">
        {group.staffMembers.map(slug => this.renderTeamMember(slug))}
      </div>
    );
  }

  renderTeamGroupMobile(group, windowWidth) {
    const perPage = windowWidth <= 500 ? 1.3 : 2.3;

    return (
      <Siema loop={false} perPage={perPage}>
        {group.staffMembers.map(slug => this.renderTeamMember(slug))}
      </Siema>
    );
  }

  renderTeamGroup(group) {
    if (group.staffMembers.length === 0) return null;

    return (
      <section className="team-group" key={group.name}>
        <Heading variant="mono" color="pink" size="sm">
          {group.name}
        </Heading>
        <div className="team-list">
          <ResizeListener>
            {({ resolution, windowWidth }) =>
              resolution.isSmall
                ? this.renderTeamGroupMobile(group, windowWidth)
                : this.renderTeamGroupDesktop(group)
            }
          </ResizeListener>
        </div>
      </section>
    );
  }

  render() {
    const { groups, errorMessage } = this.props;

    if (errorMessage !== null) {
      return (
        <TeamPageMessage
          message={`An error occurred while loading the team info: ${errorMessage}`}
        />
      );
    }
    return (
      groups && (
        <div className="c-team">
          {groups.length === 0 && <TeamPageMessage message="No team members found." />}
          {groups.map(group => this.renderTeamGroup(group))}
        </div>
      )
    );
  }
}

Team.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      position: PropTypes.number.isRequired,
      staffMembers: PropTypes.array.isRequired
    })
  ),
  members: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      position: PropTypes.number.isRequired,
      smallImageUrl: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired
    })
  ),
  errorMessage: PropTypes.string
};

export default Team;
