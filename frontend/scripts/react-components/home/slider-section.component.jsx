import React from 'react';
import PropTypes from 'prop-types';
import Siema from 'react-siema';
import cx from 'classnames';
import QuoteTile from 'react-components/home/quote-tile.component';
import StoryTile from 'react-components/home/story-tile.component';
import debounce from 'lodash/debounce';

class SliderSection extends React.PureComponent {
  static getPerPage() { // might seem repetitive but it's still needed.
    switch (true) {
      case (window.innerWidth < 640): return 1;
      case (window.innerWidth < 950): return 2;
      default: return 3;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
      visiblePages: SliderSection.getPerPage()
    };

    this.mediaQueries = { 640: 2, 950: 3 }; // undocumented feature { window.innerWidth: perPage }
    this.getSliderRef = this.getSliderRef.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 300);
  }


  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onClickPrev() {
    this.slider.prev();
    this.setState({ currentSlide: this.slider.currentSlide });
  }

  onClickNext() {
    this.slider.next();
    this.setState({ currentSlide: this.slider.currentSlide });
  }

  onResize() {
    this.setState({
      visiblePages: SliderSection.getPerPage(),
      currentSlide: this.slider.currentSlide
    });
  }

  getSliderRef(ref) {
    this.slider = ref;
  }

  render() {
    const { className, name, slides } = this.props;
    const { visiblePages, currentSlide } = this.state;
    const smallScreen = visiblePages === 1;
    const numColums = (slides.length <= visiblePages && visiblePages < 3) ? 6 : 4;
    return (
      <section className={cx('c-slider-section', className)}>
        <div className={cx('row', 'slider-wrapper', { '-auto-width': (slides.length < visiblePages) })}>
          <h3 className="home-subtitle column small-12">{name}</h3>
          <Siema
            perPage={this.mediaQueries}
            draggable={smallScreen}
            loop={false}
            ref={this.getSliderRef}
          >
            {
              slides
                .map(slide => (
                  <div
                    key={slide.title || slide.quote}
                    className={`column small-12 medium-${numColums}`}
                  >
                    <div
                      className={cx('slide', { '-actionable': !slide.quote })}
                    >
                      {slide.quote
                        ? <QuoteTile slide={slide} />
                        : <StoryTile slide={slide} />
                      }
                    </div>
                  </div>
                ))
            }
          </Siema>
          {currentSlide > 0 && !smallScreen &&
            <button className="slide-prev" onClick={this.onClickPrev} />
          }
          {currentSlide < (slides.length - visiblePages) && !smallScreen &&
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
