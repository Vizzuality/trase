import { h, Component } from 'preact';
import classNames from 'classnames';
import 'styles/components/tool/dimensional-selector-react.scss';

export default class DimensionalSelector extends Component {

  static orderDimensions(a, b) {
    if (a.order < b.order) return -1;
    if (a.order > b.order) return 1;
    return 0;
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedDimensions: []
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

    if (selectElementConditions && selectedDimensions.length === dimensions.length) {
      const selected = selectedDimensions
        .sort(DimensionalSelector.orderDimensions)
        .map(el => el.id);

      selectElement(selected);
    }
  }

  selectDimension(e, index, el) {
    e.stopPropagation();
    if (this.isDisabled(index, el)) return this.resetSelection(e);
    this.setState(state => {
      return {
        selectedDimensions: [...state.selectedDimensions, Object.assign({}, el, { order: index })]
      };
    });
  }

  resetSelection(e) {
    e.stopPropagation();
    this.setState({ selectedDimensions: [] });
  }

  isDisabled(i, el) {
    const { selectedDimensions } = this.state;
    if (selectedDimensions.length === 0) return false;
    const currentDimension = selectedDimensions.find(dimension => dimension.order === i);
    if(currentDimension) return el && currentDimension.id !== el.id;
    const result =  selectedDimensions
      .map(selected => selected.relation)
      .reduce((acc, next) => (acc || !next.includes(el.label)), false);
    return result;
  }

  render() {
    const { dimensions = [], getFooterText, getElement } = this.props;
    const { selectedDimensions } = this.state;

    const isActive = (i, el) => {
      const current = selectedDimensions.find(dimension => dimension.order === i);
      return current && current.id === el.id;
    };

    return (
      <div className='c-dimensional-selector' onClick={this.resetSelection}>
        <div className='dimension-container'>
          {
            dimensions.sort(DimensionalSelector.orderDimensions)
              .map((dimension) => dimension.elements)
              .map((dimension, dimensionIndex) => (
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
                          {getElement(el, dimensionIndex)}
                        </li>
                      )
                  }
                </ul>
              ))
          }
        </div>
        <div className='dimensional-selector-footer'>
          <span className='dimensional-selector-footer-text'>
            {getFooterText(selectedDimensions, dimensions)}
          </span>
        </div>
      </div>
    );
  }
}