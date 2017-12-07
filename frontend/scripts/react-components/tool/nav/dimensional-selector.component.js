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
    this.isSelected = this.isSelected.bind(this);
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

  selectDimension(e, status, index, el) {
    if (e) e.stopPropagation();
    if (['disabled', 'selected'].includes(status)) return this.resetSelection();
    this.setState(state => {
      return {
        selectedDimensions: [...state.selectedDimensions, Object.assign({}, el, { order: index })]
      };
    });
  }

  resetSelection(e) {
    if (e) e.stopPropagation();
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

  isSelected(i, el) {
    const { selectedDimensions } = this.state;
    const current = selectedDimensions.find(dimension => dimension.order === i);
    return current && current.id === el.id;
  };

  render() {
    const { dimensions = [], getFooterText, getElement } = this.props;
    const { selectedDimensions } = this.state;

    const getItemStatus = (i, el) => {
      if(this.isSelected(i, el)) return 'selected';
      if (this.isDisabled(i, el)) return 'disabled';
      return null;
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
                      .map((el) => (
                        <DimensionalSelectorItem
                          index={dimensionIndex}
                          el={el}
                          status={getItemStatus(dimensionIndex, el)}
                          onClick={(e, status) => this.selectDimension(e, status, dimensionIndex, el)}
                          content={getElement(el, dimensionIndex)}
                        />
                      ))
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

function DimensionalSelectorItem({ status, onClick, content }) {
  return (
    <li
      class={classNames('dimension-list-item -capitalize', {
        [`-${status}`]: status
      })}
      onClick={e => onClick(e, status)}
    >
      {content}
    </li>
  );
}