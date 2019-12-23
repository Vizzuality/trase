import MapDimensionsTemplate from 'legacy/map-dimensions.ejs';

export default class {
  constructor() {
    this.el = document.querySelector('.js-dimensions');
    this.sidebarGroups = [];
    this.sidebarGroupsTitles = [];
    this.dimensions = [];
  }

  onCreated(props) {
    this._onGroupTitleClicked = event => {
      const id = event.currentTarget.parentNode.getAttribute('data-group-id');
      this.callbacks.onToggleGroup(id);
    };

    this._onDimensionClicked = event => {
      const dimension = event.currentTarget;
      const uid = dimension.getAttribute('data-dimension-uid');
      const isEnabled = !dimension.classList.contains('-disabled');
      if (isEnabled) {
        this.callbacks.onDimensionClick(uid);
      }
    };

    this.loadMapDimensions(props);
    this.setMapDimensions(props);
    this.toggleSidebarGroups(props);
    this.setVisibility(props);
  }

  onRemoved() {
    this.sidebarGroupsTitles.forEach(sidebarGroupTitle => {
      sidebarGroupTitle.removeEventListener('click', this._onGroupTitleClicked);
    });

    this.dimensions.forEach(dimension => {
      dimension.removeEventListener('click', this._onDimensionClicked);
    });
  }

  loadMapDimensions({ mapDimensionsGroups, expandedMapSidebarGroupsIds }) {
    this.el.innerHTML = MapDimensionsTemplate({
      groups: mapDimensionsGroups
    });

    this.sidebarGroups = Array.prototype.slice.call(
      this.el.querySelectorAll('.js-map-sidebar-group'),
      0
    );
    this.sidebarGroupsTitles = Array.prototype.slice.call(
      this.el.querySelectorAll('.js-map-sidebar-group-title'),
      0
    );
    this.sidebarGroupsTitles.forEach(sidebarGroupTitle => {
      sidebarGroupTitle.addEventListener('click', this._onGroupTitleClicked);
    });

    this.dimensions = Array.prototype.slice.call(
      this.el.querySelectorAll('.js-map-sidebar-group-item'),
      0
    );
    this.dimensions.forEach(dimension => {
      dimension.addEventListener('click', this._onDimensionClicked);
    });
    this.callbacks.onMapDimensionsLoaded();
    this.toggleSidebarGroups({
      expandedMapSidebarGroupsIds
    });
  }

  setMapDimensions({ selectedMapDimensions }) {
    if (this.dimensions === undefined) {
      return;
    }

    const isFull = selectedMapDimensions[0] !== null && selectedMapDimensions[1] !== null;
    this.dimensions.forEach(dimension => {
      const uid = dimension.getAttribute('data-dimension-uid');
      const isSelected = selectedMapDimensions.indexOf(uid) !== -1;
      dimension.classList.toggle('-selected', isSelected);
      if (!isSelected) {
        dimension.classList.toggle('-disabled', isFull);
      }
    });
    this.sidebarGroups.forEach(sidebarGroup => {
      sidebarGroup.classList.toggle(
        '-has-selected-children',
        sidebarGroup.querySelectorAll('.-selected').length
      );
    });
  }

  toggleSidebarGroups({ expandedMapSidebarGroupsIds }) {
    if (this.sidebarGroups === undefined) {
      return;
    }
    this.sidebarGroups.forEach(sidebarGroup => {
      const id = parseInt(sidebarGroup.getAttribute('data-group-id'), 10);
      sidebarGroup.classList.toggle('-expanded', expandedMapSidebarGroupsIds.indexOf(id) !== -1);
    });
  }

  setVisibility({ isChoroplethEnabled }) {
    this.el.classList.toggle('is-hidden', !isChoroplethEnabled);
  }
}
