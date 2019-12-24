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

    const mockColumns = {};
    const nodesMap = new Map();

    const resultA = sortFlowsBySelectedRecolorBy(linkA, mockColumns, nodesMap, recolorBy);
    const resultA2 = sortFlowsBySelectedRecolorBy(linkA2, mockColumns, nodesMap, recolorBy);
    const resultB = sortFlowsBySelectedRecolorBy(linkB, mockColumns, nodesMap, recolorBy);
    const resultB2 = sortFlowsBySelectedRecolorBy(linkB2, mockColumns, nodesMap, recolorBy);
    const resultC = sortFlowsBySelectedRecolorBy(linkC, mockColumns, nodesMap, recolorBy);
    const resultC2 = sortFlowsBySelectedRecolorBy(linkC2, mockColumns, nodesMap, recolorBy);

    expect(sortBy([resultA, resultB, resultC, resultA2, resultB2, resultC2])).toEqual([
      resultC,
      resultC2,
      resultB,
      resultB2,
      resultA,
      resultA2
    ]);
  });

  it('orders flows using node index based on the qual recolorBY', () => {
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
      recolorBy: 'UNKNOWN'
    };
    const recolorBy = {
      type: 'qual',
      nodes: ['AMAZONIA', 'CAATINGA', 'CERRADO', 'MATA ATLANTICA', 'PAMPA', 'PANTANAL']
    };
    const mockColumns = {};
    const nodesMap = new Map();

    const resultA = sortFlowsBySelectedRecolorBy(linkA, mockColumns, nodesMap, recolorBy);
    const resultA2 = sortFlowsBySelectedRecolorBy(linkA2, mockColumns, nodesMap, recolorBy);
    const resultB = sortFlowsBySelectedRecolorBy(linkB, mockColumns, nodesMap, recolorBy);
    const resultB2 = sortFlowsBySelectedRecolorBy(linkB2, mockColumns, nodesMap, recolorBy);
    const resultC = sortFlowsBySelectedRecolorBy(linkC, mockColumns, nodesMap, recolorBy);
    const resultC2 = sortFlowsBySelectedRecolorBy(linkC2, mockColumns, nodesMap, recolorBy);

    expect(sortBy([resultA, resultB, resultC, resultA2, resultB2, resultC2])).toEqual([
      resultA,
      resultA2,
      resultC,
      resultB,
      resultB2,
      resultC2
    ]);
  });
});

describe('Sort flows when selection by is used', () => {
  const linkA = {
    sourceNodeId: 'A',
    targetNodeId: 'D',
    recolorGroup: 1,
    sourceColumnPosition: 0,
    targetColumnPosition: 1
  };
  const linkA2 = {
    sourceNodeId: 'A',
    targetNodeId: 'F',
    recolorGroup: 1,
    sourceColumnPosition: 0,
    targetColumnPosition: 1
  };
  const linkB = {
    sourceNodeId: 'B',
    targetNodeId: 'E',
    recolorGroup: 2,
    sourceColumnPosition: 0,
    targetColumnPosition: 1
  };
  const linkB2 = {
    sourceNodeId: 'B',
    targetNodeId: 'F',
    recolorGroup: 2,
    sourceColumnPosition: 0,
    targetColumnPosition: 1
  };
  const linkC = {
    sourceNodeId: 'C',
    targetNodeId: 'D',
    recolorGroup: 3,
    sourceColumnPosition: 0,
    targetColumnPosition: 1
  };
  const linkC2 = {
    sourceNodeId: 'C',
    targetNodeId: 'E',
    recolorGroup: 3,
    sourceColumnPosition: 0,
    targetColumnPosition: 1
  };
  const options = {
    nodesColoredAtColumn: 2,
    recolorGroupsOrderedByY: [2, 1, 3]
  };
  const columns = [
    { values: [{ id: 'A' }, { id: 'B' }, { id: 'C' }] },
    { values: [{ id: 'D' }, { id: 'E' }, { id: 'F' }] }
  ];
  const nodesMap = new Map();

  const resultA = sortFlowsBySelectionRecolorGroup(linkA, columns, nodesMap, options);
  const resultA2 = sortFlowsBySelectionRecolorGroup(linkA2, columns, nodesMap, options);
  const resultB = sortFlowsBySelectionRecolorGroup(linkB, columns, nodesMap, options);
  const resultB2 = sortFlowsBySelectionRecolorGroup(linkB2, columns, nodesMap, options);
  const resultC = sortFlowsBySelectionRecolorGroup(linkC, columns, nodesMap, options);
  const resultC2 = sortFlowsBySelectionRecolorGroup(linkC2, columns, nodesMap, options);

  expect(sortBy([resultA, resultB, resultC, resultA2, resultB2, resultC2])).toEqual([
    resultA,
    resultB,
    resultA2,
    resultB2,
    resultC,
    resultC2
  ]);
});
