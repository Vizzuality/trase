import _ from 'lodash';
import { UNITLESS_UNITS } from 'constants';
import getNodeMetaUid from './getNodeMetaUid';

export default function(nodesDict, nodesMeta, layers) {
  const layersByUID = _.keyBy(layers, 'uid');
  const nodesDictWithMeta = {};

  nodesMeta.data.forEach(nodeMeta => {
    const nodeId = parseInt(nodeMeta.node_id, 10);
    const nodeWithMeta = nodesDictWithMeta[nodeId] || _.cloneDeep(nodesDict[nodeId]);

    if (!nodeWithMeta.meta) {
      nodeWithMeta.meta = {};
    }

    const uid = getNodeMetaUid(nodeMeta.attribute_type, nodeMeta.attribute_id);
    const layerByUID = layersByUID[uid];

    const dimensionMeta = {
      rawValue: nodeMeta.value,
      dualLayerBucket: nodeMeta.dual_layer_bucket,
      singleLayerBucket: nodeMeta.single_layer_bucket,
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
