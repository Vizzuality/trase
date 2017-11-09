import { h, Component } from 'preact';
import classNames from 'classnames';
import 'styles/components/shared/help-tooltip-react.scss';


export default class Tooltip extends Component {

  constructor(props) {
    super(props);
    this.onOverBound = this.onOver.bind(this);
    this.onOutBound = this.onOut.bind(this);
    this.state = { visible: false };
  }

  onOver() {
    this.setState({ visible: true });
  }

  onOut() {
    this.setState({ visible: false });
  }

  render({ text, position, floating }) {
    return (
      <div
        className={classNames('tooltip-react', position, { ['-floating']: floating })}
        onMouseOver={this.onOverBound}
        onMouseOut={this.onOutBound}
      >
        <svg class='icon tooltip-react-icon'>
          <use xlinkHref='#icon-layer-info' />
        </svg>
        { this.state.visible &&
          <div className='tooltip-react-content'>
            {text}
          </div>
        }
      </div>
    );
  }
}
