import React from 'react';
import StoryTile from 'react-components/home/story-tile.component';
// import PropTypes from 'prop-types';
// import cx from 'classnames';

function Dashboards(props) {
  const { posts } = props;
  return (
    <div className="l-dashboards">
      <div className="c-dashboards">
        <div className="row">
          {posts.slice(0, 5).map(post => (
            <div className="column medium-4">
              <div className="slide">
                <StoryTile slide={post} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Dashboards.propTypes = {};

export default Dashboards;
