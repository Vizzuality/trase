import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import TwitterFeed from 'react-components/home/twitter-feed.component';

// old school name: https://en.wikipedia.org/wiki/Hero_image
function Hero(props) {
  const { className, closeStoryBox, visitStory, story, tweets } = props;
  const StoryBox = storyObj => (
    <div className="story-box">
      <button className="story-box-close" onClick={closeStoryBox} />
      <figure className="story-box-image" style={{ backgroundImage: `url(${storyObj.image})` }} />
      <figcaption className="story-box-content">
        <p className="story-box-title">{storyObj.title}</p>
        <button className="story-box-link" onClick={() => visitStory(storyObj)}>See It Here</button>
      </figcaption>
    </div>
  );

  return (
    <div className={cx('c-hero', className)}>
      <div className="row align-middle">
        <div className="column small-12">
          <div className="hero-logo-container">
            <img src="images/logos/new-logo-trase.svg" alt="TRASE" />
          </div>
          <h1 className="hero-title">
            Transparent supply chains for sustainable economies
          </h1>
          <div className="hero-play-container">
            <button className="hero-play-button" />
            TRASE in 2’
          </div>
        </div>
        {story &&
          <div className="layover">
            <StoryBox {...story} />
          </div>
        }
        {tweets &&
          <div className="layover">
            <TwitterFeed tweets={tweets} />
          </div>
        }
      </div>
    </div>
  );
}

Hero.propTypes = {
  className: PropTypes.string,
  closeStoryBox: PropTypes.func,
  visitStory: PropTypes.func,
  story: PropTypes.object,
  tweets: PropTypes.array
};

export default Hero;
