import { h, Component } from 'preact';
import classNames from 'classnames';
import 'styles/components/tool/dimensional-selector-react.scss';

export default class DimensionalSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDimensions: {}
    };
    this.selectDimension = this.selectDimension.bind(this);
    this.resetSelection = this.resetSelection.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedDimensions } = this.state;
    const { dimensions, selectElement } = this.props;
    const selectElementConditions = [
      prevProps.dimensions !== dimensions,
      prevState.selectedDimensions !== selectedDimensions
    ].includes(true);

    if (selectElementConditions && Object.keys(selectedDimensions).length === dimensions.length) {
      const selected = Object.values(selectedDimensions)
        .sort((a, b) => {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        })
        .map(el => el.id)
        .join('_');

      selectElement(selected);
    }
  }

  selectDimension(e, index, el) {
    e.stopPropagation();
    if (this.isDisabled(index, el)) return this.resetSelection(e);
    this.setState(state => ({
      selectedDimensions: Object.assign(
        {},
        state.selectedDimensions,
        { [index]: Object.assign({}, el, { order: index }) }
        )
    }));
  }

  resetSelection(e) {
    e.stopPropagation();
    this.setState({ selectedDimensions: {} });
  }

  isDisabled(i, el) {
    const { selectedDimensions } = this.state;
    if (Object.keys(selectedDimensions).length === 0) return false;
    if(selectedDimensions[i]) return el && selectedDimensions[i].id !== el.id;
    const result =  Object.values(selectedDimensions)
      .map(selected => selected.relation)
      .reduce((acc, next) => (acc || !next.includes(el.label)), false);
    return result;
  }

  render() {
    const { dimensions = [], footerText } = this.props;
    const { selectedDimensions } = this.state;

    const isActive = (i, el) => selectedDimensions[i] && selectedDimensions[i].id === el.id;

    return (
      <div className='c-dimensional-selector' onClick={this.resetSelection}>
        <div className='dimension-container'>
          {
            dimensions.map((dimension, dimensionIndex) => (
              <ul class='dimension-list -medium'>
                {
                  dimension
                    .map((el) =>
                      <li
                        class={classNames('dimension-list-item -capitalize', {
                          '-disabled': this.isDisabled(dimensionIndex, el),
                          '-selected': isActive(dimensionIndex, el)
                        })}
                        onClick={e => this.selectDimension(e, dimensionIndex, el)}
                      >
                        {el.label.toLowerCase()}
                      </li>
                    )
                }
              </ul>
            ))
          }
        </div>
        <div className='dimensional-selector-footer'>
          <span className='dimensional-selector-footer-text'>{footerText}</span>
        </div>
      </div>
    );
  }
}