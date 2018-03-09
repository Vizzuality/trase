import React from 'react';
import Siema from 'react-siema';
import Link from 'redux-first-router-link';

class Entrypoints extends React.PureComponent {
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

  getSliderRef(el) {
    this.slider = el;
  }

  render() {
    const { currentSlide } = this.state;
    return (
      <div className="c-entrypoints">
        <div className="row">
          <Siema loop={false} perPage={2.15} ref={this.getSliderRef}>
            <div className="column small-6">
              <div className="entrypoint-slide -start">
                <Link to={{ type: 'profileRoot' }}>
                  <div className="entrypoint-slide-content">
                    <h3 className="subtitle">Profile</h3>
                    <p className="entrypoint-text">
                      View the trade and sustainability profile of a particular company or
                      production region.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="column small-6">
              <div className="entrypoint-slide -mid">
                <Link to={{ type: 'profileRoot' }}>
                  <div className="entrypoint-slide-content">
                    <h3 className="subtitle">Supply Chain</h3>
                    <p className="entrypoint-text">
                      Follow trade flows to identify sourcing regions, profile supply chain risks
                      and assess opportunities for sustainable production.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="column small-6">
              <div className="entrypoint-slide -end">
                <Link to={{ type: 'profileRoot' }}>
                  <div className="entrypoint-slide-content">
                    <h3 className="subtitle">Profile</h3>
                    <p className="entrypoint-text">
                      Explore the sustainability of different production regions and identify risks
                      and opportunities facing downstream buyers.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </Siema>
          {currentSlide > 0 && (
            <button className="entrypoint-button -prev" onClick={this.onClickPrev} />
          )}

          {currentSlide === 0 && (
            <button className="entrypoint-button -next" onClick={this.onClickNext} />
          )}
        </div>
      </div>
    );
  }
}

export default Entrypoints;
