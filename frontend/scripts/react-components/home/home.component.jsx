import React from 'react';
import PropTypes from 'prop-types';
import Hero from 'react-components/shared/hero/hero.component';
import NewsletterForm from 'react-components/shared/newsletter/newsletter.container';
import SliderSection from 'react-components/home/slider-section/slider-section.component';
import WorldMap from 'react-components/shared/world-map/world-map.container';
import SentenceSelector from 'react-components/home/sentence-selector/sentence-selector.container';
import Entrypoints from 'react-components/home/entrypoints/entrypoints.component';
import Button from 'react-components/shared/button/button.component';

import 'scripts/react-components/home/homepage.scss';

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onFindOutMore = this.onFindOutMore.bind(this);
  }

  onFindOutMore() {
    this.props.goToContextPage();
  }

  render() {
    const { tweets, blogPosts, homeVideo, promotedPost, testimonials, insightsPosts } = this.props;
    return (
      <div className="l-homepage">
        <div className="c-homepage">
          <Hero story={promotedPost} tweets={tweets} homeVideo={homeVideo} />
          <div className="homepage-entrypoints">
            <Entrypoints />
          </div>
          <div className="homepage-map">
            <div className="row">
              <div className="column small-12">
                <SentenceSelector />
                <div className="homepage-map-container">
                  <WorldMap />
                </div>
                <div className="homepage-map-link-container">
                  <Button
                    color="pink"
                    size="lg"
                    className="homepage-map-link"
                    onClick={this.onFindOutMore}
                  >
                    Find out more
                  </Button>
                </div>
              </div>
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
}

Home.propTypes = {
  insightsPosts: PropTypes.array,
  testimonials: PropTypes.array,
  tweets: PropTypes.array,
  blogPosts: PropTypes.array,
  promotedPost: PropTypes.object,
  homeVideo: PropTypes.string,
  goToContextPage: PropTypes.func
};

export default Home;
