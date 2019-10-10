import reducer, {
  initTimelineState,
  toggleStateMachine,
  selectStateMachine
} from 'scripts/react-components/tool/timeline/timeline.reducer';

describe('Tool Timeline component behavior', () => {
  it('should return empty state if no years available', () => {
    const initialState = initTimelineState([]);
    expect(initialState).toEqual({
      hovered: null,
      prevStart: null,
      prevEnd: null,
      prevRange: null,
      hoverPlaceholder: false,
      range: null,
      start: null,
      end: null
    });
  });

  it('should return initial state for a single year', () => {
    const initialState = initTimelineState([2017, 2017]);
    expect(initialState).toEqual({
      hovered: null,
      prevStart: null,
      prevEnd: null,
      prevRange: null,
      hoverPlaceholder: false,
      range: false,
      start: 2017,
      end: 2017
    });
  });

  it('should return initial state for a range of years', () => {
    const initialState = initTimelineState([2017, 2018]);
    expect(initialState).toEqual({
      hovered: null,
      prevStart: null,
      prevEnd: null,
      prevRange: null,
      hoverPlaceholder: false,
      range: true,
      start: 2017,
      end: 2018
    });
  });

  it('toggle state machine returns the appropriate status', () => {
    const newIsRange = true;
    const newIsSingle = false;
    const noPrevRange = { prevRange: null };
    const rangePrev = { prevRange: true };
    const singlePrev = { prevRange: false };

    expect(toggleStateMachine(newIsRange, noPrevRange)).toBe('firstSingleToRangeSwitch');
    expect(toggleStateMachine(newIsRange, rangePrev)).toBe('singleToRangeSwitchWithSavedRange');
    expect(toggleStateMachine(newIsRange, singlePrev)).toBe('singleToRangeSwitchWithoutSavedRange');

    expect(toggleStateMachine(newIsSingle, noPrevRange)).toBe('firstRangeToSingleSwitch');
    expect(toggleStateMachine(newIsSingle, singlePrev)).toBe('rangeToSingleSwitchWithSavedSingle');
    expect(toggleStateMachine(newIsSingle, rangePrev)).toBe(
      'rangeToSingleSwitchWithoutSavedSingle'
    );

    expect(() => toggleStateMachine(true, {})).toThrow();
    expect(() => toggleStateMachine(false, {})).toThrow();
    expect(() => toggleStateMachine()).toThrow();
  });

  it('select state machine returns the appropriate status', () => {
    const year = 2017;

    const single = { start: year, end: year, range: false };
    const range = { start: year, end: year + 1, range: true };
    const emptySingle = { start: null, end: null, range: false };
    const emptyRange = { start: null, end: null, range: true };
    const incompleteRange = { start: year, end: null, range: true };

    expect(selectStateMachine(single)).toBe('completeSingle');
    expect(selectStateMachine(emptySingle)).toBe('completeSingle');
    expect(selectStateMachine(range)).toBe('initRange');
    expect(selectStateMachine(emptyRange)).toBe('initRange');
    expect(selectStateMachine(incompleteRange)).toBe('completeRange');
  });

  it('reducer completes single with prev single', () => {
    const state = {
      hovered: null,
      range: false,
      prevRange: false,
      hoverPlaceholder: false,
      prevStart: 2017,
      prevEnd: 2017,
      start: null,
      end: null
    };

    expect(reducer(state, { type: 'select', payload: 2018 })).toEqual({
      ...state,
      start: 2018,
      end: 2018,
      prevStart: null,
      prevEnd: null,
      prevRange: null
    });
  });

  it('reducer completes single with prev range', () => {
    const state = {
      hovered: null,
      range: false,
      prevRange: true,
      hoverPlaceholder: false,
      prevStart: 2017,
      prevEnd: 2018,
      start: null,
      end: null
    };

    expect(reducer(state, { type: 'select', payload: 2018 })).toEqual({
      ...state,
      start: 2018,
      end: 2018,
      prevStart: null,
      prevEnd: null,
      prevRange: null
    });
  });
});
