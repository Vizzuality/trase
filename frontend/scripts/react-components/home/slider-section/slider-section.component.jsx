import React from 'react';
import PropTypes from 'prop-types';
import Siema from 'react-siema';
import cx from 'classnames';
import Card from 'react-components/shared/card/card.component';
import AnimatedCard from 'react-components/shared/animated-card/animated-card.component';
import debounce from 'lodash/debounce';
import { DOCUMENT_POST_TYPES } from 'constants';
import Heading from 'react-components/shared/heading/heading.component';
import Link from 'redux-first-router-link';

import './slider-section.scss';

class SliderSection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
      visiblePages: SliderSection.getPerPage()
    };

    this.mediaQueries = { 640: 2, 950: 3 }; // undocumented feature { window.innerWidth: perPage }
    this.getSliderRef = this.getSliderRef.bind(this);
    this.onSlideChange = this.onSlideChange.bind(this);
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
  }

  onClickNext() {
    this.slider.next();
  }

  onSlideChange() {
    this.setState({ currentSlide: this.slider.currentSlide });
  }

  onResize() {
    this.setState({
      visiblePages: SliderSection.getPerPage(),
      currentSlide: this.slider ? this.slider.currentSlide : 0
    });
  }

  static getPerPage() {
    // might seem repetitive but it's still needed.
    switch (true) {
      case window.innerWidth < 640:
        return 1;
      case window.innerWidth < 950:
        return 2;
      default:
        return 3;
    }
  }

  static getActionName(category) {
    if (DOCUMENT_POST_TYPES.includes(category)) {
      return 'Open document';
    }
    return 'See More';
  }

  getSliderRef(ref) {
    this.slider = ref;
  }

  renderCard(slide) {
    const { variant } = this.props;
    if (variant === 'profiles') {
      return (
        <AnimatedCard
          {...slide}
          linkProps={{
            target: '_self',
            to: slide.to
          }}
          Link={Link}
          parseHtml
        />
      );
    }

    return (
      <Card
        translateUrl
        title={slide.title}
        subtitle={`${slide.category} – ${new Date(slide.date).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}`}
        imageUrl={slide.imageUrl}
        linkUrl={slide.completePostUrl}
        actionName={SliderSection.getActionName(slide.category)}
      />
    );
  }

  render() {
    const { className, name, slides, variant } = this.props;
    const { visiblePages, currentSlide } = this.state;
    const smallScreen = visiblePages === 1;
    const numColumns = slides.length <= visiblePages && visiblePages < 3 ? 6 : 4;
    const headingProps = {
      as: 'h3',
      variant: 'sans',
      weight: 'bold',
      transform: 'uppercase',
      color: variant === 'profiles' ? 'blue' : 'pink',
      size: 'sm'
    };
    if (variant === 'profiles') headingProps.weight = 'bold';

    if (slides.length === 0) return null;

    return (
      <section className={cx('c-slider-section', className)}>
        <div className="gradient-before" />
        <div
          className={cx('row', 'slider-wrapper', {
            '-auto-width': slides.length < visiblePages,
            '-yellow-fade': variant === 'profiles',
            '-white-fade': variant !== 'profiles'
          })}
        >
          <div className="column small-12">
            <Heading {...headingProps}>{name}</Heading>
          </div>
          <Siema
            perPage={this.mediaQueries}
            draggable={smallScreen}
            loop={false}
            ref={this.getSliderRef}
            onChange={this.onSlideChange}
          >
            {slides.map(slide => (
              <div
                key={slide.title || slide.quote}
                className={`column small-12 medium-${numColumns}`}
              >
                {this.renderCard(slide)}
              </div>
            ))}
          </Siema>
          {currentSlide > 0 && (
            <button
              className={cx('slide-prev', { '-no-image': !!slides[0].quote })}
              onClick={this.onClickPrev}
            />
          )}
          {currentSlide < slides.length - visiblePages && (
            <button
              className={cx('slide-next', { '-no-image': !!slides[0].quote })}
              onClick={this.onClickNext}
            />
          )}
        </div>
        <div className="gradient-after" />
      </section>
    );
  }
}

SliderSection.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  slides: PropTypes.array.isRequired,
  variant: PropTypes.string
};

export default SliderSection;
