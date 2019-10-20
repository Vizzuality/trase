import React, { useState } from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import ResizeListener from 'react-components/shared/resize-listener.component';
import { BREAKPOINTS } from 'constants';
import CountriesPanel from 'react-components/nodes-panel/countries-panel';
import SourcesPanel from 'react-components/nodes-panel/sources-panel';

import 'react-components/nodes-panel/country-sources-panel/country-sources-panel.scss';

function CountrySourcesPanel(props) {
  const { selectedCountry, selectedSourcesIds, sourcesRequired, nodeTypeRenderer } = props;
  const [sourcesOpen, changeSourcesOpen] = useState(sourcesRequired);
  const toggleAccordion = () => changeSourcesOpen(open => !open);

  const activeCountryName = selectedCountry && capitalize(selectedCountry.name);
  const title = `${activeCountryName} regions${sourcesRequired ? '' : ' (Optional)'}`;
  const accordionValue = selectedSourcesIds.length > 0 || sourcesOpen;
  return (
    <ResizeListener>
      {({ windowWidth }) => {
        const columnsCount = windowWidth > BREAKPOINTS.laptop ? 5 : 3;
        const width = windowWidth > BREAKPOINTS.laptop ? 950 : 560;
        return (
          <div className="c-country-sources-panel">
            <CountriesPanel columnsCount={columnsCount} width={width} />
            {selectedCountry && (
              <SourcesPanel
                width={width}
                columnsCount={columnsCount}
                accordionTitle={title}
                accordionValue={accordionValue}
                toggleAccordion={toggleAccordion}
                nodeTypeRenderer={nodeTypeRenderer}
              />
            )}
          </div>
        );
      }}
    </ResizeListener>
  );
}

CountrySourcesPanel.propTypes = {
  selectedSourcesIds: PropTypes.array,
  selectedCountry: PropTypes.object,
  sourcesRequired: PropTypes.bool,
  nodeTypeRenderer: PropTypes.func
};

CountrySourcesPanel.defaultProps = {
  sourcesRequired: false
};

export default CountrySourcesPanel;
