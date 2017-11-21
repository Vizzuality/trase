import { h, Component } from 'preact';
import 'styles/components/shared/search.scss';
import 'styles/components/shared/search-react.scss';
import Downshift from 'downshift/preact';

export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      isOpened: true
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
      <div class='autocomplete'>
        <Downshift>
          {({
             getInputProps,
             getItemProps,
             isOpen,
             inputValue,
             selectedItem,
             highlightedIndex
           }) => (
             <div>
               <input {...getInputProps({ placeholder: 'Search a producer, trader or country of import' })} />
               {isOpen ? (
                 <div class='suggestions'>
                   {nodes
                     .filter(
                       i =>
                         !inputValue ||
                         i.name.toLowerCase().includes(inputValue.toLowerCase()),
                     )
                     .map((item, index) => (
                       <div
                         {...getItemProps({ item })}
                         key={item.id}
                         class='suggestion'
                         style={{
                           backgroundColor:
                             highlightedIndex === index ? 'gray' : 'white',
                           fontWeight: selectedItem === item ? 'bold' : 'normal',
                         }}
                       >
                         {item.name}
                       </div>
                     ))}
                 </div>
               ) : null}
             </div>
           )}
        </Downshift>
      </div>
    </div>;
  }
}
