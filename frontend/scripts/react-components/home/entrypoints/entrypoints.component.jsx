import React from 'react';
import PropTypes from 'prop-types';
import Siema from 'react-siema';
import Link from 'redux-first-router-link';
import debounce from 'lodash/debounce';
import cx from 'classnames';
import Heading from 'react-components/shared/heading/heading.component';
import { ImgBackground } from 'react-components/shared/img';

import './entrypoints.scss';
import { TOOL_LAYOUT } from 'constants';

class Entrypoints extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
      isMobile: Entrypoints.getIsMobile()
    };
    this.entrypoints = [
      {
        link: { type: Entrypoints.getIsMobile() && ENABLE_TOOL_PANEL ? 'explore' : 'tool' },
        subtitle: 'Supply Chains',
        text:
          'Follow trade flows to identify sourcing regions, profile supply chain risks and' +
          ' assess opportunities for sustainable production.',
        className: '-supply-chain',
        src: '/images/backgrounds/entrypoint-2@2x.jpg'
      },
      {
        link: { type: 'profiles' },
        subtitle: 'Profile',
        text:
          'View the trade and sustainability profile of a particular' +
          ' company or production region.',
        className: '-profile',
        src: '/images/backgrounds/entrypoint-1@2x.jpg'
      },
      {
        link: { type: 'tool', payload: { serializerParams: { toolLayout: TOOL_LAYOUT.left } } },
        subtitle: 'Map',
        text:
          'Explore the sustainability of different production regions and identify risks and' +
          ' opportunities facing downstream buyers.',
        className: '-map',
        src: '/images/backgrounds/entrypoint-3@2x.jpg'
      }
    ];
    if (DISABLE_PROFILES) {
      this.entrypoints.splice(1, 1);
    }
    this.getSliderRef = this.getSliderRef.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
    this.onSlideChange = this.onSlideChange.bind(this);
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
    const { onClickNext } = this.props;
    onClickNext();
    this.slider.next();
  }

  onSlideChange() {
    this.setState({ currentSlide: this.slider.currentSlide });
  }

  onResize() {
    this.setState({ isMobile: Entrypoints.getIsMobile() });
  }

  static getIsMobile() {
    return window.innerWidth <= 700; // value needs to match with entrypoints.scss variable
  }

  getSliderRef(el) {
    this.slider = el;
  }

  renderEntrypoints(grid) {
    const { onClick } = this.props;

    return this.entrypoints.map(slide => (
      <div key={slide.subtitle} className={grid}>
        <ImgBackground
          className={cx('entrypoint-slide', slide.className)}
          onClick={() => onClick(slide.link)}
          src={slide.src}
        >
          <Link to={slide.link}>
            <div className="entrypoint-slide-content">
              <Heading variant="mono" color="pink" size="sm">
                {slide.subtitle}
              </Heading>
              <p className="entrypoint-text">{slide.text}</p>
            </div>
          </Link>
        </ImgBackground>
      </div>
    ));
  }

  renderSlider() {
    const { currentSlide } = this.state;
    return (
      <React.Fragment>
        <Siema loop={false} perPage={2.15} ref={this.getSliderRef} onChange={this.onSlideChange}>
          {this.renderEntrypoints('column small-6')}
        </Siema>
        {currentSlide > 0 && this.entrypoints.length > 2 && (
          <button className="entrypoint-button -prev" onClick={this.onClickPrev} />
        )}

        {currentSlide === 0 && this.entrypoints.length > 2 && (
          <button className="entrypoint-button -next" onClick={this.onClickNext} />
        )}
      </React.Fragment>
    );
  }

  render() {
    const { isMobile } = this.state;
    return (
      <div className="c-entrypoints">
        <div className="row">
          {isMobile ? this.renderEntrypoints('column small-12') : this.renderSlider()}
        </div>
      </div>
    );
  }
}

Entrypoints.propTypes = {
  onClick: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired
};

export default Entrypoints;
