// merges same origin / same destination / same qual links
export default function(links, userecolorGroups) {
  const mergedLinks = [];
  const dict = {};

  if (typeof links === 'undefined') {
    return [];
  }

  links.forEach(link => {
    let key = `${link.sourceNodeId}-${link.targetNodeId}`;

    if (link.recolorBy !== null) {
      key = `${key}--${link.recolorBy}`;
    } else if (userecolorGroups) {
      key = `${key}-colourGroup${link.recolorGroup}`;
    }

    if (!dict[key]) {
      const mergedLink = { ...link, id: key };
      mergedLinks.push(mergedLink);
      dict[key] = mergedLink;
    } else {
      dict[key].height += link.height;
      dict[key].quant += link.quant;
    }
  });

  return mergedLinks;
}
