import React, { Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import Hero from 'react-components/shared/hero/hero.component';
import SliderSection from 'react-components/home/slider-section/slider-section.component';
import SentenceSelector from 'react-components/shared/sentence-selector/sentence-selector.container';
import Entrypoints from 'react-components/home/entrypoints/entrypoints.component';
import Button from 'react-components/shared/button/button.component';
import InView from 'react-components/shared/in-view.component';
import cx from 'classnames';

import 'scripts/react-components/home/homepage.scss';

const WorldMap = React.lazy(() => import('../shared/world-map/world-map.container'));

const getConsolidatedInsights = (insights, blogs) =>
  sortBy([...insights, ...blogs], post => -new Date(post.date).getTime());

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

  const entryPoints = (
    <div className={cx('homepage-entrypoints', { '-hide-profiles': DISABLE_PROFILES })}>
      <Entrypoints onClickNext={clickNextEntrypoint} onClick={clickEntrypoint} />
    </div>
  );

  const map = (
    <InView triggerOnce>
      {({ ref, inView }) => (
        <div className={cx('homepage-map', { '-bottom': CONSOLIDATE_INSIGHTS })} ref={ref}>
          <div className="row">
            <div className="column small-12">
              <SentenceSelector className="homepage-map-sentence-selector" />
              <div className="homepage-map-container">
                {inView && (
                  <Suspense fallback={null}>
                    <WorldMap
                      id="home"
                      context={selectedContext}
                      destinationCountries={destinationCountries}
                    />
                  </Suspense>
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
  );

  const sliders = (
    <div className="sliders -banner">
      {CONSOLIDATE_INSIGHTS === false && (
        <>
          <SliderSection name="News and Blogs" slides={blogPosts} />
          <SliderSection name="Insights" slides={insightsPosts} />
        </>
      )}
      {CONSOLIDATE_INSIGHTS === true && (
        <SliderSection name="Insights" slides={getConsolidatedInsights(insightsPosts, blogPosts)} />
      )}
      <SliderSection className="-small" name="Testimonials" slides={testimonials} />
    </div>
  );

  let content = CONSOLIDATE_INSIGHTS ? [sliders, entryPoints] : [entryPoints, sliders];

  if (!ENABLE_TOOL_PANEL) {
    content = CONSOLIDATE_INSIGHTS ? [sliders, entryPoints, map] : [entryPoints, map, sliders];
  }

  return (
    <div className="l-homepage">
      <div className="c-homepage">
        <Hero
          story={promotedPost}
          tweets={tweets}
          homeVideo={homeVideo}
          onPlayVideo={onPlayVideo}
        />
        {content.map((section, index) => (
          <React.Fragment key={index}>{section}</React.Fragment>
        ))}
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
