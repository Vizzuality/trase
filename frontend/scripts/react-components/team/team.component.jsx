import cx from 'classnames';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Link from 'redux-first-router-link';

class Team extends Component {
  renderNoTeamMembersMessage() {
    return (
      <section className="not-found">
        <div className="row column">
          <p className="not-found-text">No team members found.</p>
        </div>
      </section>
    );
  }

  renderTeamMember(slug) {
    const { members } = this.props;

    return (
      <div key={members[slug].position + members[slug].name} className="column small-12 medium-4">
        <div className="team-list-item">
          <Link to={{ type: 'teamMember', payload: { member: kebabCase(slug) } }}>
            <div
              className={cx('c-team-profile-picture', {
                '-placeholder': !members[slug].smallImageUrl
              })}
              style={{ backgroundImage: `url(${members[slug].smallImageUrl})` }}
            />
            <h3 className="team-list-item-title title -medium">{members[slug].name}</h3>
            <span className="team-list-item-subtitle subtitle -gray">See More</span>
          </Link>
        </div>
      </div>
    );
  }

  renderTeamGroup(group) {
    if (group.staffMembers.length === 0) return null;

    return (
      <section className="team-group" key={group.name}>
        <h3 className="subtitle">{group.name}</h3>
        <div className="team-list">
          <div className="row -equal-height">
            {group.staffMembers.map(slug => this.renderTeamMember(slug))}
          </div>
        </div>
      </section>
    );
  }

  render() {
    const { groups } = this.props;

    return (
      groups && (
        <div className="c-team">
          {groups.length === 0 && this.renderNoTeamMembersMessage()}
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
  )
};

export default Team;
