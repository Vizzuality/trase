import getNodeMetaUid from './getNodeMetaUid';

export default function (mapDimensions) {
  mapDimensions.forEach((dimension) => {
    dimension.uid = getNodeMetaUid(dimension.type, dimension.layerAttributeId);
  });

  return mapDimensions;
}
