import React from 'react';
import PropTypes from 'prop-types';
import MultiTable from 'react-components/profiles/multi-table.component';
import Widget from 'react-components/widgets/widget.component';
import { GET_PLACE_INDICATORS } from 'utils/getURLFromParams';

function SustainabilityIndicatorsWidget(props) {
  const { year, nodeId, contextId } = props;
  const params = { node_id: nodeId, context_id: contextId, year };
  return (
    <Widget query={[GET_PLACE_INDICATORS]} params={[params]}>
      {({ data, loading }) =>
        !loading && (
          <section className="c-area-table score-table">
            <div className="row">
              <div className="small-12 columns">
                <MultiTable
                  year={year}
                  type="t_head_places"
                  data={data[GET_PLACE_INDICATORS]}
                  tabsTitle="Sustainability indicators:"
                  target={item => (item.name === 'Municipalities' ? 'profileNode' : null)}
                />
              </div>
            </div>
          </section>
        )
      }
    </Widget>
  );
}

SustainabilityIndicatorsWidget.propTypes = {
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default SustainabilityIndicatorsWidget;
