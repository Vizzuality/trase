import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Hero from 'react-components/shared/hero.component';
import NewsletterForm from 'react-components/shared/newsletter/newsletter.container';
import SliderSection from 'react-components/home/slider-section.component';
import WorldMap from 'react-components/shared/world-map/world-map.container';
import SentenceSelector from 'react-components/home/sentence-selector';

function Home(props) {
  const { tweets, blogPosts, testimonials, insightsPosts, promotedPost, homeVideo } = props;
  return (
    <div className="l-homepage">
      <div className="c-homepage">
        <Hero story={promotedPost} tweets={tweets} homeVideo={homeVideo} />
        <div className="splitted">
          <div className="row">
            <div className="column small-12 medium-6">
              <Link to={{ type: 'profileRoot' }} className="splitted-column-wrapper">
                <h3 className="subtitle">Profile</h3>
                <p className="splitted-text">
                  View the trade and sustainability profile of a particular company or production
                  region.
                </p>
              </Link>
              <div className="screenshot -half" />
            </div>
            <div className="column small-12 medium-6">
              <Link to={{ type: 'tool' }} className="splitted-column-wrapper">
                <h3 className="subtitle">Supply Chain</h3>
                <p className="splitted-text">
                  Follow trade flows to identify sourcing regions, profile supply chain risks and
                  assess opportunities for sustainable production.
                </p>
              </Link>
              <div className="screenshot -end" />
            </div>
          </div>
        </div>
        <div className="homepage-map">
          <SentenceSelector />
          <div className="homepage-map-container">
            <WorldMap />
          </div>
        </div>
        <div className="sliders">
          <NewsletterForm />
          <SliderSection name="News and Blogs" slides={blogPosts} />
          <SliderSection name="Insights" slides={insightsPosts} />
          <SliderSection className="-small" name="Testimonials" slides={testimonials} />
        </div>
      </div>
    </div>
  );
}

Home.propTypes = {
  insightsPosts: PropTypes.array,
  testimonials: PropTypes.array,
  tweets: PropTypes.array,
  blogPosts: PropTypes.array,
  promotedPost: PropTypes.object,
  homeVideo: PropTypes.string
};

export default Home;
