import { h, Component } from 'preact';
import 'styles/components/shared/search.scss';
// import Downshift from 'downshift/preact';

export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      isOpened: false
    };
  }

  onOpenClicked() {
    this.setState({
      isOpened: true
    });
  }

  onCloseClicked() {
    this.setState({
      isOpened: false
    });
  }

  render({ nodes }) {
    if (this.state.isOpened === false) {
      return <div onClick={(e) => { console.log(e.target); this.onOpenClicked(); }} class='nav-item'>
        <svg class='icon icon-search'><use xlinkHref='#icon-search' /></svg>
      </div>;
    }

    return <div class='c-search'>
      <svg class='icon icon-search'><use xlinkHref='#icon-search' /></svg>
      <div class='c-search__veil' onClick={(e) => { console.log(e.target); this.onCloseClicked(); }} />
    </div>;
  }
}
