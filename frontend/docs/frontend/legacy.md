# Legacy stuff

The directory called `script/legacy` contains what remains from the custom framework that used to combine vanilla JS classes + EJS templates + Redux. From all components the only remaining ones that are not React are:

- **Story Modal.** Used to display the terms of use when first navigating to the sankey.
- **Info tooltip.** Used in the map hovering interaction and in the profile mini-sankey.

The plan is to replace this with react components.