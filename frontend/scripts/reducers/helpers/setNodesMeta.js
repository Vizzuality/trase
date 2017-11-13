import _ from 'lodash';
import getNodeMetaUid from './getNodeMetaUid';
import { UNITLESS_UNITS } from 'constants';

export default function (nodesDict, nodesMeta, layers) {
  const layersByUID = _.keyBy(layers, 'uid');
  const nodesDictWithMeta = {};

  nodesMeta.forEach(nodeMeta => {
    const nodeId = parseInt(nodeMeta.node_id);
    const nodeWithMeta = nodesDictWithMeta[nodeId] || _.cloneDeep(nodesDict[nodeId]);

    if (!nodeWithMeta.meta) {
      nodeWithMeta.meta = {};
    }

    const uid = getNodeMetaUid(nodeMeta.attribute_type.toLowerCase(), nodeMeta.attribute_id);
    const layerByUID = layersByUID[uid];


    const dimensionMeta = {
      rawValue: nodeMeta.value,
      value3: nodeMeta.bucket3,
      value5: nodeMeta.bucket5,
      name: layerByUID.name
    };

    if (layerByUID.unit !== undefined && UNITLESS_UNITS.indexOf(layerByUID.unit) === -1) {
      dimensionMeta.unit = layerByUID.unit;
    }

    nodeWithMeta.meta[uid] = dimensionMeta;
    nodesDictWithMeta[nodeId] = nodeWithMeta;
  });
  return nodesDictWithMeta;
}
