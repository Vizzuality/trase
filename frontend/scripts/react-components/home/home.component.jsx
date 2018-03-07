import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Hero from 'react-components/shared/hero.component';
import NewsletterForm from 'react-components/shared/newsletter/newsletter.container';
import SliderSection from './slider-section.component';
import SentenceSelector from './sentence-selector.component';

const commodities = {
  valueList: ['Palm Oil'],
  value: 'Palm Oil'
};

const countries = {
  valueList: ['Indonesia'],
  value: 'Indonesia'
};
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
          <SentenceSelector connector="of" selectors={[commodities, countries]}>
            What are the sustainability risks associated with the trading
          </SentenceSelector>
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
