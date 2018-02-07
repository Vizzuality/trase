import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import kebabCase from 'lodash/kebabCase';

const Team = props => {
  const { content } = props;
  return (
    <div className="c-team row">
      {content.map(member => (
        <div
          key={member.position + member.staffGroup.name}
          className="column small-11 medium-5 large-4"
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Link to={{ type: 'teamMember', payload: { member: kebabCase(member.name) } }}>
            <div
              className="team-profile-picture"
              style={{
                height: '260px',
                width: '100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundImage: `url(${member.smallImageUrl})`
              }}
            />
            <h3>{member.name}</h3>
            <span className="subtitle -gray">See More</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

Team.propTypes = {
  content: PropTypes.array.isRequired
};

export default Team;
