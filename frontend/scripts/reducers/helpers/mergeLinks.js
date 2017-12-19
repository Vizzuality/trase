import _ from 'lodash';

// merges same origin / same destination / same qual links
export default function (links, userecolorGroups) {
  const mergedLinks = [];
  const dict = {};

  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    let key = `${link.sourceNodeId}-${link.targetNodeId}`;

    if (link.recolorBy !== null) {
      key = `${key}--${link.recolorBy}`;
    } else if (userecolorGroups === true) {
      key = `${key}-colourGroup${link.recolorGroup}`;
    }

    if (!dict[key]) {
      const mergedLink = _.cloneDeep(link);
      mergedLink.id = key;
      mergedLinks.push(mergedLink);
      dict[key] = mergedLink;
    } else {
      dict[key].height += link.height;
      dict[key].quant += link.quant;
    }
  }

  return mergedLinks;
}
