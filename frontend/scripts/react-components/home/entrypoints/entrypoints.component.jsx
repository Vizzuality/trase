import React from 'react';
import Siema from 'react-siema';
import Link from 'redux-first-router-link';
import debounce from 'lodash/debounce';

import './entrypoints.scss';
import Heading from 'react-components/shared/heading/heading.component';

class Entrypoints extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
      isMobile: Entrypoints.getIsMobile()
    };
    this.entrypoints = [
      {
        link: { type: Entrypoints.getIsMobile() ? 'explore' : 'tool' },
        subtitle: 'Supply Chain',
        text:
          'Follow trade flows to identify sourcing regions, profile supply chain risks and' +
          ' assess opportunities for sustainable production.',
        className: '-mid'
      },
      {
        link: { type: 'profileRoot' },
        subtitle: 'Profile',
        text:
          'View the trade and sustainability profile of a particular' +
          ' company or production region.',
        className: '-start'
      },
      {
        link: { type: 'tool', payload: { query: { state: { isMapVisible: true } } } },
        subtitle: 'Map',
        text:
          'Explore the sustainability of different production regions and identify risks and' +
          ' opportunities facing downstream buyers.',
        className: '-end'
      }
    ];
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
    return this.entrypoints.map(slide => (
      <div key={slide.subtitle} className={grid}>
        <div className={`entrypoint-slide ${slide.className}`}>
          <Link to={slide.link}>
            <div className="entrypoint-slide-content">
              <Heading variant="mono" color="pink" size="sm">
                {slide.subtitle}
              </Heading>
              <p className="entrypoint-text">{slide.text}</p>
            </div>
          </Link>
        </div>
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
        {currentSlide > 0 && (
          <button className="entrypoint-button -prev" onClick={this.onClickPrev} />
        )}

        {currentSlide === 0 && (
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

export default Entrypoints;
