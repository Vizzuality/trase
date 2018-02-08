import React from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';
import Link from 'redux-first-router-link';

const Team = props => {
  const { groups } = props;
  return (
    <div className="c-team">
      {groups.map(content => (
        <section className="team-group">
          <h3 className="subtitle">{content[0].staffGroup.name}</h3>
          <div className="team-list">
            <div className="row -equal-height">
              {content.map(member => (
                <div
                  key={member.position + member.staffGroup.name}
                  className="column small-12 medium-4"
                >
                  <div className="team-list-item">
                    <Link to={{ type: 'teamMember', payload: { member: kebabCase(member.name) } }}>
                      <div
                        className="c-team-profile-picture"
                        style={{ backgroundImage: `url(${member.smallImageUrl})` }}
                      />
                      <h3 className="team-list-item-title title -medium">{member.name}</h3>
                      <span className="team-list-item-subtitle subtitle -gray">See More</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

Team.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.arrayOf(
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
    )
  ).isRequired
};

export default Team;
