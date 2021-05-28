import React from 'react';
import PropTypes from 'prop-types';
import Entrypoints from 'react-components/new-home/entrypoints/entrypoints.component';

import 'scripts/react-components/new-home/homepage.scss';

const Home = props => {
  const { clickEntrypoint, defaultContext } = props;

  return (
    <div className="l-homepage">
      <div className="c-new-homepage">
        <div className="homepage-entrypoints">
          <Entrypoints onClick={clickEntrypoint} defaultContext={defaultContext} />
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  clickEntrypoint: PropTypes.func.isRequired
};

export default Home;
