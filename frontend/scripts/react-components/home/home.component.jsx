import React from 'react';
import PropTypes from 'prop-types';
import NewsletterForm from './newsletter-form.component';

function Home(props) {
  const { submitForm } = props;
  return (
    <div className="c-homepage">
      <div className="row column">
        <div className="hero">
          This is my hero
        </div>
      </div>
      <div className="row">
        <div className="column small-12 medium-6">
          Column 1
        </div>
        <div className="column small-12 medium-6">
          Column 2
        </div>
      </div>
      <div className="row column">
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
