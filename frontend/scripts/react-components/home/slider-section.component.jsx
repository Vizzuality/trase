import React from 'react';
import PropTypes from 'prop-types';
import Siema from 'react-siema';
import cx from 'classnames';
import QuoteTile from 'react-components/home/quote-tile.component';
import StoryTile from 'react-components/home/story-tile.component';

class SliderSection extends React.PureComponent {
  static getPerPage() {
    switch (true) {
      case (window.innerWidth < 640): return 1;
      case (window.innerWidth < 950): return 2;
      default: return 3;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0
    };

    this.getSliderRef = this.getSliderRef.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
  }

  onClickPrev() {
    this.slider.prev();
    this.setState({ currentSlide: this.slider.currentSlide });
  }

  onClickNext() {
    this.slider.next();
    this.setState({ currentSlide: this.slider.currentSlide });
  }

  getSliderRef(ref) {
    this.slider = ref;
  }

  render() {
    const { className, name, slides } = this.props;
    const perPage = SliderSection.getPerPage();
    const smallScreen = perPage === 1;

    return (
      <section className={cx('c-slider-section', className)}>
        <div className="row slider-wrapper">
          <h3 className="home-subtitle column small-12">{name}</h3>
          <Siema
            perPage={perPage}
            draggable={smallScreen}
            loop={false}
            ref={this.getSliderRef}
          >
            {
              slides
                .map(slide => (
                  <div key={slide.title || slide.quote} className="slide column small-12 medium-4">
                    {slide.quote
                      ? <QuoteTile slide={slide} />
                      : <StoryTile slide={slide} />
                    }
                  </div>
                ))
            }
          </Siema>
          {this.state.currentSlide > 0 && !smallScreen &&
            <button className="slide-prev" onClick={this.onClickPrev} />
          }
          {this.state.currentSlide < (slides.length - perPage) && !smallScreen &&
            <button className="slide-next" onClick={this.onClickNext} />
          }
        </div>
      </section>
    );
  }
}

SliderSection.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  slides: PropTypes.array.isRequired
};

export default SliderSection;
