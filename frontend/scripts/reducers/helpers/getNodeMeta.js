const getNodeMeta = (selectedMapDimension, node, attributes, selectedResizeBy, nodeHeights) => {
  const meta = attributes[node.id] && attributes[node.id][selectedMapDimension.uid];
  const nodeHeight = nodeHeights[node.id];
  if (meta && selectedMapDimension.name !== selectedResizeBy.label) {
    return meta;
  }

  if (meta && meta.value !== nodeHeight?.quant && NODE_ENV_DEV === true) {
    // See https://basecamp.com/1756858/projects/12498794/todos/312319406
    console.warn(
      'Attempting to show different values two dimensions with the same name.',
      `ResizeBy: ${selectedResizeBy.label} with value ${node.quant}`,
      `Map layer: ${meta.name} with value ${meta.value}`
    );
  }
  return null;
};

export default getNodeMeta;
