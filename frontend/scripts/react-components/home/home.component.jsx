import React from 'react';
import PropTypes from 'prop-types';
import Hero from 'react-components/shared/hero.component';
import SliderSection from './slider-section.component';
import NewsletterForm from './newsletter-form.component';

const slides = Array(12)
  .fill(0)
  .map((zero, index) => ({ image: false, quote: `Lorem Ipsum${index}` }));

function Home(props) {
  const { submitForm } = props;
  return (
    <div className="c-homepage">
      <Hero />
      <div className="splitted">
        <div className="row">
          <div className="column small-12 medium-6 splitted-column">
            <h3 className="home-subtitle">Profile</h3>
            <p className="splitted-text">Can companies and governments meet their 2020 sustainability goals?</p>
          </div>
          <div className="column small-12 medium-6 splitted-column">
            <h3 className="home-subtitle">Supply Chain</h3>
            <p className="splitted-text">
              Explore the supply chains and find the impacts and
              opportunities for a more sustainable production.
            </p>
          </div>
        </div>
        <div className="screenshot -half" />
        <div className="screenshot -end" />
      </div>
      <div className="sliders">
        <SliderSection name="News and Insights" slides={slides} />
        <SliderSection name="Features" slides={slides} />
        <SliderSection className="-small" name="Testimonials" slides={slides} />
      </div>
      <NewsletterForm submitForm={submitForm} />
    </div>
  );
}

Home.propTypes = {
  submitForm: PropTypes.func.isRequired
};

export default Home;
