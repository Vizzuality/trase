import { getSelectedColumnsIds } from 'react-components/tool/tool.selectors';

const columns = {
  1: {
    id: 1,
    name: 'BIOME',
    position: 0,
    group: 0,
    role: 'source',
    filterTo: 3
  },
  2: {
    id: 2,
    name: 'STATE',
    position: 1,
    group: 0,
    role: 'source',
    filterTo: null
  },
  3: {
    id: 3,
    name: 'MUNICIPALITY',
    position: 2,
    group: 0,
    role: 'source',
    filterTo: null
  },
  4: {
    id: 4,
    name: 'LOGISTICS HUB',
    position: 3,
    group: 0,
    role: 'source',
    filterTo: null
  },
  5: {
    id: 5,
    name: 'PORT',
    position: 4,
    group: 1,
    role: 'exporter',
    filterTo: null
  },
  6: {
    id: 6,
    name: 'EXPORTER',
    position: 5,
    group: 1,
    role: 'exporter',
    filterTo: null
  },
  7: {
    id: 7,
    name: 'IMPORTER',
    position: 6,
    group: 2,
    role: 'importer',
    filterTo: null
  },
  8: {
    id: 8,
    name: 'COUNTRY',
    position: 7,
    group: 3,
    role: 'destination',
    filterTo: null
  },
  22: {
    id: 22,
    name: 'ECONOMIC BLOC',
    position: 8,
    group: 3,
    role: 'destination',
    filterTo: null
  }
};
const selectedContext = {
  defaultColumns: [
    {
      id: 3,
      group: 0
    },
    {
      id: 6,
      group: 1
    },
    {
      id: 7,
      group: 2
    },
    {
      id: 8,
      group: 3
    }
  ]
};

let extraColumn = null;
let selectedColumnsIds = null;
const panelActiveNodeTypesIds = {
  source: undefined,
  exporter: undefined,
  importer: undefined
};

describe('Tool selectors', () => {
  describe('getSelectedColumnsIds', () => {
    it('returns the default selected columns if nothing is selected', () => {
      expect(
        getSelectedColumnsIds.resultFunc(
          selectedContext,
          selectedColumnsIds,
          extraColumn,
          columns,
          panelActiveNodeTypesIds
        )
      ).toEqual([3, 6, 7, 8]);
    });

    it('returns the selected columns if they exist', () => {
      selectedColumnsIds = [1, 6, 7, 22];
      expect(
        getSelectedColumnsIds.resultFunc(
          selectedContext,
          selectedColumnsIds,
          extraColumn,
          columns,
          panelActiveNodeTypesIds
        )
      ).toEqual([1, 6, 7, 22]);
    });

    it('fills the empty selected columns with the default columns', () => {
      selectedColumnsIds = [undefined, undefined, undefined, 22];
      expect(
        getSelectedColumnsIds.resultFunc(
          selectedContext,
          selectedColumnsIds,
          extraColumn,
          columns,
          panelActiveNodeTypesIds
        )
      ).toEqual([3, 6, 7, 22]);
    });

    it('adds the extra column if we have it', () => {
      selectedColumnsIds = [1, undefined, undefined, 22];
      extraColumn = { id: 3, parentId: 1 };
      expect(
        getSelectedColumnsIds.resultFunc(
          selectedContext,
          selectedColumnsIds,
          extraColumn,
          columns,
          panelActiveNodeTypesIds
        )
      ).toEqual([1, 3, 6, 7, 22]);
    });

    it('works with 5 columns', () => {
      selectedColumnsIds = [1, 3, 6, 7, 22];
      extraColumn = { id: 3, parentId: 1 };
      expect(
        getSelectedColumnsIds.resultFunc(
          selectedContext,
          selectedColumnsIds,
          extraColumn,
          columns,
          panelActiveNodeTypesIds
        )
      ).toEqual([1, 3, 6, 7, 22]);
    });

    it('fills the 5 columns empty spaces', () => {
      selectedColumnsIds = [1, 3, undefined, 7, 22];
      extraColumn = { id: 3, parentId: 1 };
      expect(
        getSelectedColumnsIds.resultFunc(
          selectedContext,
          selectedColumnsIds,
          extraColumn,
          columns,
          panelActiveNodeTypesIds
        )
      ).toEqual([1, 3, 6, 7, 22]);
    });

    it('removes the extra column if there are 5 columns and no extra column', () => {
      selectedColumnsIds = [1, 3, 6, 7, 22];
      extraColumn = null;
      expect(
        getSelectedColumnsIds.resultFunc(
          selectedContext,
          selectedColumnsIds,
          extraColumn,
          columns,
          panelActiveNodeTypesIds
        )
      ).toEqual([1, 6, 7, 22]);
    });

    it('removes the extra column if there are 5 columns and no extra column even if the selected one is not the parent column', () => {
      selectedColumnsIds = [2, 3, 6, 7, 22];
      extraColumn = null;
      expect(
        getSelectedColumnsIds.resultFunc(
          selectedContext,
          selectedColumnsIds,
          extraColumn,
          columns,
          panelActiveNodeTypesIds
        )
      ).toEqual([2, 6, 7, 22]);
    });
  });
});
