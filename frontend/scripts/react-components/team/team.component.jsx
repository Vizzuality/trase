import React from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';
import Link from 'redux-first-router-link';

const Team = props => {
  const { content } = props;
  return (
    <div className="c-team">
      <div className="team-list row">
        {content.map(member => (
          <div
            key={member.position + member.staffGroup.name}
            className="team-list-item column small-12 medium-4"
          >
            <Link to={{ type: 'teamMember', payload: { member: kebabCase(member.name) } }}>
              <div
                className="c-team-profile-picture"
                style={{ backgroundImage: `url(${member.smallImageUrl})` }}
              />
              <h3 className="title -medium">{member.name}</h3>
              <span className="subtitle -gray">See More</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

Team.propTypes = {
  content: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.number,
      name: PropTypes.string,
      bio: PropTypes.string,
      smallImageUrl: PropTypes.string,
      staffGroup: PropTypes.shape({
        position: PropTypes.number,
        name: PropTypes.string
      })
    })
  ).isRequired
};

export default Team;
