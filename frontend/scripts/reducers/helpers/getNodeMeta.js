const getNodeMeta = (selectedMapDimension, node, attributes, selectedResizeBy, nodeHeights) => {
  const meta = attributes[node.id] && attributes[node.id][selectedMapDimension.uid];
  const nodeHeight = nodeHeights[node.id];
  if (meta && selectedMapDimension.name !== selectedResizeBy.label) {
    return meta;
  }

  if (NODE_ENV_DEV === true) {
    if (selectedMapDimension && meta && nodeHeight && meta.value !== nodeHeight.quant) {
      // See https://basecamp.com/1756858/projects/12498794/todos/312319406
      console.warn(
        'Attempting to show different values two dimensions with the same name.',
        `ResizeBy: ${selectedResizeBy.label} with value ${nodeHeight.quant}`,
        `Map layer: ${selectedMapDimension.name} with value ${meta.value}`
      );
    }
  }
  return null;
};

export default getNodeMeta;
