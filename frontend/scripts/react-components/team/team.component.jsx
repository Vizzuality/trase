import React from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';
import Link from 'redux-first-router-link';
import cx from 'classnames';

const Team = props => {
  const { groups, members } = props;
  return (
    <div className="c-team">
      {groups.map(group => (
        <section className="team-group" key={group.name}>
          <h3 className="subtitle">{group.name}</h3>
          <div className="team-list">
            <div className="row -equal-height">
              {group.staffMembers.map(slug => (
                <div
                  key={members[slug].position + members[slug].name}
                  className="column small-12 medium-4"
                >
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

Team.defaultProps = {
  groups: [],
  members: {}
};

export default Team;
