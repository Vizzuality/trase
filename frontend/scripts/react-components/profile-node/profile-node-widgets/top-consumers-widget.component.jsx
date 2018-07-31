import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import MiniSankey from 'react-components/profiles/mini-sankey.component';
import { withTranslation } from 'react-components/nav/locale-selector/with-translation.hoc';
import {
  GET_NODE_SUMMARY_URL,
  GET_PLACE_TOP_CONSUMER_ACTORS,
  GET_PLACE_TOP_CONSUMER_COUNTRIES
} from 'utils/getURLFromParams';
import capitalize from 'lodash/capitalize';

const TranslatedMiniSankey = withTranslation(MiniSankey);

class TopConsumersWidget extends React.PureComponent {
  getTitle(name) {
    const { type, year } = this.props;
    const noun = type === 'actors' ? 'traders' : 'importer countries';
    if (type === 'actors') {
      return (
        <React.Fragment>
          Top {noun} of soy in <span className="notranslate">{capitalize(name)}</span> in{' '}
          <span className="notranslate">{year}</span>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        Top {noun} of <span className="notranslate">{capitalize(name)}</span> soy in{' '}
        <span className="notranslate">{year}</span>
      </React.Fragment>
    );
  }

  render() {
    const { year, nodeId, contextId, type } = this.props;
    const params = { node_id: nodeId, context_id: contextId };
    const mainQuery =
      type === 'actors' ? GET_PLACE_TOP_CONSUMER_ACTORS : GET_PLACE_TOP_CONSUMER_COUNTRIES;
    return (
      <Widget
        query={[mainQuery, GET_NODE_SUMMARY_URL]}
        params={[{ ...params, year }, { ...params, profile_type: 'place' }]}
      >
        {({ error, data, loading }) => {
          if (loading || error) return null;
          const { municipalityName } = data[GET_NODE_SUMMARY_URL];
          return (
            <section className="mini-sankey-container page-break-inside-avoid">
              <div className="row">
                <div className="small-12 columns">
                  <h3 className="title -small">{this.getTitle(municipalityName)}</h3>
                  <TranslatedMiniSankey
                    data={data[mainQuery]}
                    targetLink="profileNode"
                    year={year}
                  />
                </div>
              </div>
            </section>
          );
        }}
      </Widget>
    );
  }
}

TopConsumersWidget.propTypes = {
  year: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default TopConsumersWidget;
