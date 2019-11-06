import React from 'react';
import MapDimensions from './map-dimensions.container';

class MapDimensionsReact extends React.PureComponent {
  state = {
    expanded: []
  };

  toggleMapSidebarGroup = id => {
    const groupId = Number(id);
    this.setState(prevState => {
      let draftExpanded = [...prevState.expanded];
      const idIndex = draftExpanded.indexOf(groupId);
      if (idIndex === -1) {
        draftExpanded = [groupId];
      } else {
        draftExpanded.splice(idIndex, 1);
      }
      return { expanded: draftExpanded };
    });
  };

  render() {
    return (
      <MapDimensions
        onToggleGroup={this.toggleMapSidebarGroup}
        expandedMapSidebarGroupsIds={this.state.expanded}
      />
    );
  }
}

export default MapDimensionsReact;
