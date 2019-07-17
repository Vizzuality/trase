import {
  sortFlowsBySelectedRecolorBy,
  sortFlowsBySelectionRecolorGroup
} from 'react-components/tool/sankey/sort-flows';
import sortBy from 'lodash/sortBy';

describe('Sort flows when a recolor by is selected', () => {
  it('orders flows using numeric values when recolorby is type ind', () => {
    const linkA = {
      quant: 44444,
      recolorBy: null
    };
    const linkA2 = {
      quant: 444,
      recolorBy: null
    };
    const linkB = {
      quant: 33333,
      recolorBy: 6
    };
    const linkB2 = {
      quant: 333,
      recolorBy: 6
    };
    const linkC = {
      quant: 11111,
      recolorBy: 2
    };
    const linkC2 = {
      quant: 111,
      recolorBy: 2
    };
    const recolorBy = {
      maxValue: '24',
      type: 'ind'
    };

    const resultA = sortFlowsBySelectedRecolorBy(linkA, recolorBy);
    const resultA2 = sortFlowsBySelectedRecolorBy(linkA2, recolorBy);
    const resultB = sortFlowsBySelectedRecolorBy(linkB, recolorBy);
    const resultB2 = sortFlowsBySelectedRecolorBy(linkB2, recolorBy);
    const resultC = sortFlowsBySelectedRecolorBy(linkC, recolorBy);
    const resultC2 = sortFlowsBySelectedRecolorBy(linkC2, recolorBy);

    expect(sortBy([resultA, resultB, resultC, resultA2, resultB2, resultC2])).toEqual([
      resultC,
      resultC2,
      resultB,
      resultB2,
      resultA,
      resultA2
    ]);
  });

  it('orders flows alphabetically based on the qual recolorBY', () => {
    const linkA = {
      quant: 44444,
      recolorBy: 'AMAZONIA'
    };
    const linkA2 = {
      quant: 444,
      recolorBy: 'AMAZONIA'
    };
    const linkB = {
      quant: 33333,
      recolorBy: 'PANTANAL'
    };
    const linkB2 = {
      quant: 333,
      recolorBy: 'PANTANAL'
    };
    const linkC = {
      quant: 11111,
      recolorBy: 'CERRADO'
    };
    const linkC2 = {
      quant: 111,
      recolorBy: 'CERRADO'
    };
    const recolorBy = {
      type: 'qual'
    };
    const resultA = sortFlowsBySelectedRecolorBy(linkA, recolorBy);
    const resultA2 = sortFlowsBySelectedRecolorBy(linkA2, recolorBy);
    const resultB = sortFlowsBySelectedRecolorBy(linkB, recolorBy);
    const resultB2 = sortFlowsBySelectedRecolorBy(linkB2, recolorBy);
    const resultC = sortFlowsBySelectedRecolorBy(linkC, recolorBy);
    const resultC2 = sortFlowsBySelectedRecolorBy(linkC2, recolorBy);

    expect(sortBy([resultA, resultB, resultC, resultA2, resultB2, resultC2])).toEqual([
      resultA,
      resultA2,
      resultC,
      resultC2,
      resultB,
      resultB2
    ]);
  });
});

describe('Sort flows when selection by is used', () => {
  const linkA = {
    quant: 44444,
    recolorGroup: 1,
    sourceColumnPosition: 0,
    targetColumnPosition: 1
  };
  const linkA2 = {
    quant: 444,
    recolorGroup: 1,
    sourceColumnPosition: 0,
    targetColumnPosition: 1
  };
  const linkB = {
    quant: 33333,
    recolorGroup: 2,
    sourceColumnPosition: 0,
    targetColumnPosition: 1
  };
  const linkB2 = {
    quant: 333,
    recolorGroup: 2,
    sourceColumnPosition: 0,
    targetColumnPosition: 1
  };
  const linkC = {
    quant: 11111,
    recolorGroup: 3,
    sourceColumnPosition: 0,
    targetColumnPosition: 1
  };
  const linkC2 = {
    quant: 111,
    recolorGroup: 3,
    sourceColumnPosition: 0,
    targetColumnPosition: 1
  };
  const options = {
    nodesColoredAtColumn: 2,
    recolorGroupsOrderedByY: [2, 1, 3]
  };
  const resultA = sortFlowsBySelectionRecolorGroup(linkA, options);
  const resultA2 = sortFlowsBySelectionRecolorGroup(linkA2, options);
  const resultB = sortFlowsBySelectionRecolorGroup(linkB, options);
  const resultB2 = sortFlowsBySelectionRecolorGroup(linkB2, options);
  const resultC = sortFlowsBySelectionRecolorGroup(linkC, options);
  const resultC2 = sortFlowsBySelectionRecolorGroup(linkC2, options);

  expect(sortBy([resultA, resultB, resultC, resultA2, resultB2, resultC2])).toEqual([
    resultB,
    resultB2,
    resultA,
    resultA2,
    resultC,
    resultC2
  ]);
});
