import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Hero from 'react-components/shared/hero.component';
import NewsletterForm from 'react-components/shared/newsletter/newsletter.container';
import SliderSection from './slider-section.component';

function Home(props) {
  const {
    tweets,
    posts,
    testimonials,
    features,
    promotedPost
  } = props;
  return (
    <div className="l-homepage">
      <div className="c-homepage">
        <Hero story={promotedPost} tweets={tweets} />
        <div className="splitted">
          <div className="row">
            <div className="column small-12 medium-6">
              <Link to={{ type: 'profiles' }} className="splitted-column-wrapper">
                <h3 className="subtitle">Profile</h3>
                <p className="splitted-text">Can companies and governments meet their 2020 sustainability goals?</p>
              </Link>
              <div className="screenshot -half" />
            </div>
            <div className="column small-12 medium-6">
              <Link to={{ type: 'tool' }} className="splitted-column-wrapper">
                <h3 className="subtitle">Supply Chain</h3>
                <p className="splitted-text">
                  Explore the supply chains and find the impacts and
                  opportunities for a more sustainable production.
                </p>
              </Link>
              <div className="screenshot -end" />
            </div>
          </div>
        </div>
        <div className="sliders">
          <SliderSection name="News and Blogs" slides={features} />
          <SliderSection name="Insights" slides={posts} />
          <SliderSection className="-small" name="Testimonials" slides={testimonials} />
        </div>
        <NewsletterForm />
      </div>
    </div>
  );
}


Home.propTypes = {
  features: PropTypes.array,
  testimonials: PropTypes.array,
  tweets: PropTypes.array,
  posts: PropTypes.array,
  promotedPost: PropTypes.object
};

export default Home;
