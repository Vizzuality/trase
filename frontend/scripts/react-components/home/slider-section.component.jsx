/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Siema from 'react-siema';
import cx from 'classnames';

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
    return (
      <div className={cx('c-slider-section', className)}>
        <div className="row column">
          <h3 className="home-subtitle">{name}</h3>
          <div className="slider-wrapper">
            <Siema
              perPage={perPage}
              draggable={false}
              loop={false}
              ref={this.getSliderRef}
            >
              {
                slides
                  .map(slide => (
                    <div key={slide.title || slide.quote} className="slide">
                      {slide.image ?
                        <React.Fragment>
                          <figure
                            className="slide-image"
                            style={{ backgroundImage: `url(${slide.image})` }}
                          />
                          <figcaption className="slide-content">
                            <h4 className="home-subtitle">{slide.category}</h4>
                            <p className="slide-title">{slide.title}</p>
                          </figcaption>
                        </React.Fragment>
                        :
                        <React.Fragment>
                          <div className="slide-quote">
                            <p
                              className="slide-quote-content"
                              dangerouslySetInnerHTML={{ __html: `&ldquo;${slide.quote}&rdquo;` }}
                            />
                            <div className="c-author-footer">
                              <figcaption className="author-details">
                                {slide.quoteAuthor}
                              </figcaption>
                              <figure
                                className="author-avatar"
                                style={{ backgroundImage: slide.quoteAvatar && `url(${slide.quoteAvatar})` }}
                              />
                            </div>
                          </div>
                        </React.Fragment>
                      }
                    </div>
                  ))
              }
            </Siema>
            {this.state.currentSlide > 0 &&
              <button className="slide-prev" onClick={this.onClickPrev} />
            }
            {this.state.currentSlide < (slides.length - perPage) &&
              <button className="slide-next" onClick={this.onClickNext} />
            }
          </div>
        </div>
      </div>
    );
  }
}

SliderSection.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      category: PropTypes.string,
      image: PropTypes.string,
      quote: PropTypes.string,
      quoteAuthor: PropTypes.string,
      quoteAvatar: PropTypes.string
    })
  ).isRequired
};

export default SliderSection;
