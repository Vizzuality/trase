# Sankey

The Sankey chart is part of the tool page

TODO: Describe sankey structure and functionality

## Functions

### Expand

Accessible from the node menu.
It adds nodes to the nodes-panel via NODES_PANEL reducer and URL. This function expands all the selected nodes to fill the height of the Sankey chart.

### Clear selection

Accessible from the tool navbar.
Clears all selected node except for the context.
To clear them uses both the TOOL_LINKS and NODES_PANEL reducer