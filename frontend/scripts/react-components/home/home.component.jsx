import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Hero from 'react-components/shared/hero/hero.component';
import NewsletterForm from 'react-components/shared/newsletter/newsletter.container';
import SliderSection from 'react-components/home/slider-section/slider-section.component';
import WorldMap from 'react-components/shared/world-map/world-map.container';
import SentenceSelector from 'react-components/shared/sentence-selector/sentence-selector.container';
import Entrypoints from 'react-components/home/entrypoints/entrypoints.component';
import Button from 'react-components/shared/button/button.component';
import InView from 'react-components/shared/in-view.component';
import cx from 'classnames';

import 'scripts/react-components/home/homepage.scss';

const Home = props => {
  const {
    tweets,
    blogPosts,
    homeVideo,
    promotedPost,
    testimonials,
    insightsPosts,
    onPlayVideo,
    clickEntrypoint,
    clickNextEntrypoint,
    selectedContext,
    goToContextPage,
    getTopCountries,
    destinationCountries,
    selectedYears
  } = props;

  useEffect(() => {
    getTopCountries();
  }, [getTopCountries, selectedContext, selectedYears]);

  return (
    <div className="l-homepage">
      <div className="c-homepage">
        <Hero
          story={promotedPost}
          tweets={tweets}
          homeVideo={homeVideo}
          onPlayVideo={onPlayVideo}
        />
        <div className={cx('homepage-entrypoints', { '-hide-profiles': DISABLE_PROFILES })}>
          <Entrypoints onClickNext={clickNextEntrypoint} onClick={clickEntrypoint} />
        </div>
        <InView triggerOnce>
          {({ ref, inView }) => (
            <div className="homepage-map" ref={ref}>
              <div className="row">
                <div className="column small-12">
                  <SentenceSelector className="homepage-map-sentence-selector" />
                  <div className="homepage-map-container">
                    {inView && (
                      <WorldMap
                        context={selectedContext}
                        destinationCountries={destinationCountries}
                      />
                    )}
                  </div>
                  <div className="homepage-map-link-container">
                    <Button
                      color="pink"
                      size="lg"
                      className="homepage-map-link"
                      onClick={goToContextPage}
                    >
                      Find out more
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </InView>
        <div className="sliders">
          <NewsletterForm />
          <SliderSection name="News and Blogs" slides={blogPosts} />
          <SliderSection name="Insights" slides={insightsPosts} />
          <SliderSection className="-small" name="Testimonials" slides={testimonials} />
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  insightsPosts: PropTypes.array,
  testimonials: PropTypes.array,
  tweets: PropTypes.array,
  blogPosts: PropTypes.array,
  promotedPost: PropTypes.object,
  homeVideo: PropTypes.string,
  goToContextPage: PropTypes.func,
  onPlayVideo: PropTypes.func.isRequired,
  clickNextEntrypoint: PropTypes.func.isRequired,
  clickEntrypoint: PropTypes.func.isRequired,
  getTopCountries: PropTypes.func.isRequired,
  selectedContext: PropTypes.object,
  destinationCountries: PropTypes.array,
  selectedYears: PropTypes.array
};

export default Home;
