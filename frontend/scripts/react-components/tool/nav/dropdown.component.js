import { h, Component } from 'preact';
import findParent from 'find-parent';

export default class ClickOutside extends Component {
  constructor(props) {
    super(props);
    this.handleBound = this.handle.bind(this);
  }

  render() {
    const children = (this.props.currentDropdown !== this.props.id) ? null : this.props.children;
    return <div {...this.props} ref={ref => this.container = ref}>{children}</div>;
  }

  componentDidMount() {
    document.addEventListener('click', this.handleBound, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleBound, true);
  }

  handle(e) {
    const isInside = this.container.contains(e.target) || findParent.byClassName(e.target, 'js-dropdown') !== undefined;

    if (isInside === false) {
      this.props.onClickOutside(null);
    }
  }
}
