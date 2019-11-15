import kebabCase from 'lodash/kebabCase';
import pickBy from 'lodash/pickBy';
import parseURL from 'utils/parseURL';

function getRoleQueryParams(selectedNodesIds, meta) {
  const { nodes, columns } = meta;

  const roles = nodes
    .filter(n => selectedNodesIds.includes(n.id))
    .reduce(
      (acc, nodeMetadata) => {
        const columnId = nodeMetadata.nodeTypeId;
        const column = columns[columnId];
        if (!column) {
          return acc;
        }

        const { role } = column;
        const bucket = {
          destination: 'destinations',
          source: 'sources',
          exporter: 'companies',
          importer: 'companies'
        }[role];
        return {
          ...acc,
          [bucket]: [...acc[bucket], parseInt(nodeMetadata.id, 10)]
        };
      },
      { sources: [], destinations: [], companies: [] }
    );

  return pickBy(roles, r => r.length > 0);
}

function translateLink(data, meta, to = 'sankey') {
  const { queryParams, countryId, commodityId, title } = data;
  const { selectedContextId, ...params } = parseURL(queryParams);

  let serializerParams = {
    selectedYears: params.selectedYears,
    selectedResizeBy: params.selectedResizeBy,
    selectedRecolorBy: params.selectedRecolorBy
  };

  if (params.selectedNodesIds) {
    const roleQueryParams = getRoleQueryParams(params.selectedNodesIds, meta);
    serializerParams = pickBy({ ...serializerParams, ...roleQueryParams });
  }
  if (to === 'sankey') {
    return {
      type: 'tool',
      payload: {
        serializerParams: {
          ...params,
          ...serializerParams,
          countries: countryId,
          commodities: commodityId
        }
      }
    };
  }

  return {
    type: 'dashboardElement',
    payload: {
      dashboardId: kebabCase(title),
      serializerParams: {
        ...serializerParams,
        countries: countryId,
        commodities: commodityId
      }
    }
  };
}

export default translateLink;
