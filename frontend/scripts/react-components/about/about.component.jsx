import React from 'react';
// import PropTypes from 'prop-types';
// import Link from 'redux-first-router-link';
import Hero from 'react-components/shared/hero.component';

function About() {
  return (
    <div className="c-about">
      <Hero className="-read-only" />
      <section className="about-content">
        <div className="row">
          <div className="column small-12 medium-6 medium-offset-3">
            <p className="paragraph">
              Trase is a powerful new sustainability platform that enables governments, companies,
              investors and others to better understand and address the environmental and social impacts
              linked to their supply chains.
            </p>
            <p className="paragraph">
              Its pioneering approach draws on vast sets of production, trade and customs data, for the
              first time laying bare the flows of globally-traded commodities from production landscapes
              to consumer countries at scale. Along the way it identifies the ports of export and import,
              and the producers, traders and transporters involved. These supply chain actors can then be
              linked back to environmental and social risk factors on the ground, as well as information
              on the social and governance factors necessary to improve conditions.
            </p>
            <p className="paragraph">
              Trase focuses on the handful of commodities – including soy, beef, palm oil and timber –
              that drive two thirds of deforestation globally. It comes as a direct response to the
              ambitious commitments made by leaders across sectors to achieve deforestation-free supply
              chains by 2020 - and the urgent need this creates for a breakthrough in assessing and
              monitoring sustainability performance.
            </p>
            <p className="paragraph">
              Over the next 5 years, Trase aims to map the trade and risks for over 70% of total
              production in major forest risk commodities, catalyzing a transformation in supply chain
              sustainability for the agricultural drivers of deforestation. Read our vision for Trase.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
