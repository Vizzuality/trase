- Remove lines from charts when no data is available
- Added Colombia departments TopoJSON file
- Improvements to context layer generation and documentation

### 3.0.1
- Remove non-flow nodes from data portal option
- Sort data portal nodes alphabetically

### 3.0.0
- Add new "Clear selection" button at the bottom of the sankey
- Add support for disabling map layers per year
- Add brazilian biomes context layer
- Add configurable default basemaps and context layers per context
- Add data portal data collection form

### 2.5.1
- site: temporarily disable homepage video
- profile: update labels
- general: update node and sass versions

### 2.5.0
- data: add message informing that data portal is temporarily disabled
- tool: reset linked polygons layer when switching context
- profile: prevent charts from displaying undefined units
- tool: improve displaying of flow tooltips on certain recolor by criteria
- tool: push 'unknown' type nodes below 'other' type
- tool: fix recolor by legend vertical alignment
- tool: fix styling issue on node options in complete view
- tool: improved link sorting
- tool: fix issue where selected columns were not properly saved and loaded into the URL
- tool/profiles: prevent tooltips from showing off screen
- tool: highlight linked map areas when no map layer is selected
- tool: fix map area selection on layer change
- tool: prevent coloring unknown flow on recolor by
- general: code cleanup and improvement
- tool: on percentual resize by, display value instead of bucket range
- tool: fix column selector overlap in complete mode
- home: update images to include profile page preview 
- tool: maintain cloropeth on map when non geo column is changed on sankey
- tool: clear node selection on context change
- tool: improve support for percentual recolor by
- tool: clear selected nodes when column is changed
- profile: fix missing "total" label on top source regions for actor profile
- tool: save and load map dimensions in URL
- general: harmonize decimal and unit rendering
- tool: fix issue when selecting non-existent geo ids on map
- tool: fixed issue when selecting/hovering countries
- tool: prevent 'unknown' type nodes from appearing as a search result
- profile: add soy production to place profile
- tool: highlight bucket on map hover
- tool: fix map dimensions display in node cards
- tool: display "not mobile compatible" message when viewing with smartphone/tablet
- about: add partner links
- footer: add partner links
- tool: fix issue on loading and saving resize by configuration
- tool: remove link to "unknown ..." and "domestic consumption" nodes profile
- tool: fixed context layer legend
- tool: use default choropleth bucket when one of the values is zero
- profiles: remove biome states profiles
- profiles: fix overlapping chart labels on profile pages
- tool: improve sorting of recoloured sankey flows
- tool: add shading to contextual layers
- profiles: fixes missing link in actor's top municipalities list
- tool: fixes issue where not shown columns on sankey would not be searchable
- tool: fixes issue where sankey would not be filterable by biome
- tool: fixes issue where invisible countries/actors would not show up on search results unless part of the top results
- tool: fixes issue that prevented full sankey interaction when landing from profile page
- tool: fixes issue on tooltips Z-index
- tool: limit world map to prevent showing of multiple "worlds"
- tool: fixed various issues with the map with contexts that don't have subnational granularity
- profiles: fixes order of lines in Line chart
- profiles: improves xAxis ticks on Line chart (display months in number of years >2)
- profiles: fixes loader showing up on top of nav.
- profiles: fixes choropleth maps only showing 5 values.
- profiles: fixes scatterplot not showing current node.
- profiles: fixes municipalities legend not showing when switching source.
- profiles: includes map choropleth legend
- profiles: includes the top sources' source switch.
- tool: map dimensions groups are now collapsible
- tool: map dimensions selecting is simpler (singl radio buttons column)
- tool: fixed tool crash when links API fails
- profiles: connects choropleth maps to real data in actors profile pages
- home: only allow video playing on full screen
- home: show screenshot instead of video when video playback has not started yet
- tool: added tooltips on the map to show info that is otherwise displayed on the bottom of the sankey
- tool: fixed water scarcity color scale
- tool: added link tooltips resize by information
- tool: added link tooltips quant units
- profiles: actor municipalities/biome/state switcher
- profiles: added line chart locations on actors page
- profiles: added hover effects on shortcut buttons
- profiles: companies exporting chart (mock)
- tool entry in menu now triggers a submenu with two entry points

### 2.0.4
- improved loader and added it to profiles search page
- home: added basic tweets section
- home: added tutorial video
- tool: allow explicit linking to an expanded node and map state
- tool: non-interactive/country wide columns
- profiles: added direct links to tool
- profiles: actor countries map (mock)
- profiles: actor municipalities map (mock)
- profiles: actor sustainability multitable (mock)
- profiles: place indicators table (mock)
- profiles: place deforestation chart (mock)
- profiles: place improved chord diagrams styles
- profiles: place header maps
- Disabled data portal

### 2.0.3
- Added React-based views
- Improved choropleth layers
- Improved map legends
- Enable data portal
- Improved static pages
- Expanded map view

### 2.0.2
- Fixed regression where legend summary would not appear
- Improved flows page dropdowns behaviour

### 2.0.1
- Cross browser support improvements
- Search component refactoring and improvements

### 2.0.0
- Improved design
- Added data portal basic functionality
- Added multi-context support for sankey
- Added global search components
- Improved map
- Improved sankey

### 1.0.7
- map, sankey: performance improvements

### 1.0.6
Add homepage anchors
Fix google analytics detection on devel envs

### 1.0.5
- map: fixes a major issue where user was able to query a node without links by clicking a polygon on the map
- sankey: Implemented Google Analytics events

### 1.0.4
- sankey: Fixed issue with wrong merging of links coloured by node selection

### 1.0.3
- Change choropleth rendering to match new API data

### 1.0.2
- Extracted Google Analytics key to ENV variable
- sankey: renamed color by 'None' to 'Node selection'
- support and various bugfixes for IE11
- sankey: node selection coloring improvements
- actor fact sheet: rendered biome data
- change overall number formatting

### 1.0.1
- Added recolour by selected node
- Improve cross browser compatibility
- Add text to fact sheet search page
- Implement responsive footer

### 1.0.0
- Initial release
