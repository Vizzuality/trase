import React from 'react';
import PropTypes from 'prop-types';
import Hero from 'react-components/shared/hero.component';
import NewsletterForm from './newsletter-form.component';

function Home(props) {
  const { submitForm } = props;
  return (
    <div className="c-homepage">
      <Hero />
      <div className="splitted">
        <div className="row">
          <div className="column small-12 medium-6 splitted-column">
            <h3 className="splitted-title">Profile</h3>
            <p className="splitted-text">Can companies and governments meet their 2020 sustainability goals?</p>
          </div>
          <div className="column small-12 medium-6 splitted-column">
            <h3 className="splitted-title">Supply Chain</h3>
            <p className="splitted-text">
              Explore the supply chains and find the impacts and
              opportunities for a more sustainable production.
            </p>
          </div>
        </div>
        <div className="screenshot -half" />
        <div className="screenshot -end" />
      </div>
      <div className="row column is-hidden">
        <div className="row">
          <div className="column small-4">
            Slide 1
          </div>
          <div className="column small-4">
            Slide 2
          </div>
          <div className="column small-4">
            Slide 3
          </div>
        </div>
      </div>
      <NewsletterForm submitForm={submitForm} />
    </div>
  );
}

Home.propTypes = {
  submitForm: PropTypes.func.isRequired
};

export default Home;
