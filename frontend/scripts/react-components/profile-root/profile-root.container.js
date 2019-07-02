import { connect } from 'react-redux';
import ProfileRoot from 'react-components/profile-root/profile-root.component';
import { getContextsWithProfilePages } from 'react-components/profile-root/profile-root.selectors';
import { getSelectedContext } from 'reducers/app.selectors';
import { openModal } from 'react-components/shared/profile-selector/profile-selector.actions';

function mapStateToProps(state) {
  const selectedContext = getSelectedContext(state);
  const { contexts } = state.app;
  const selectorContexts = getContextsWithProfilePages(contexts);

  // we make sure the globally selected context is available in the selectorContexts
  const activeContext = selectedContext
    ? selectorContexts.find(ctx => {
        if (DISABLE_MULTIPLE_CONTEXT_PROFILES) {
          return ctx.countryName === 'BRAZIL' && ctx.commodityName === 'SOY';
        }
        return ctx.id === selectedContext.id;
      })
    : null;

  const cardsInfo = [
    {
      title: 'Bunge',
      subtitle:
        'Bunge did not produce any soy in 2017. With less than 0& of any soy of the total production, it ranks in Brazil in soy production and 33rd in the state of Rondonia',
      category: 'exporter',
      imageUrl: 'https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image'
    },
    {
      title: 'China',
      subtitle:
        'Bunge did not produce any soy in 2017. With less than 0& of any soy of the total production, it ranks in Brazil in soy production and 33rd in the state of Rondonia',
      category: 'importing country',
      imageUrl: 'https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image'
    },
    {
      title: 'Brazil',
      subtitle:
        'Bunge did not produce any soy in 2017. With less than 0& of any soy of the total production, it ranks in Brazil in soy production and 33rd in the state of Rondonia',
      category: 'source',
      imageUrl: 'https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image'
    },
    {
      title: 'Cargil',
      subtitle:
        'Bunge did not produce any soy in 2017. With less than 0& of any soy of the total production, it ranks in Brazil in soy production and 33rd in the state of Rondonia',
      category: 'importer',
      imageUrl: 'https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image'
    }
  ]; // Just mocking
  return {
    activeContext,
    getContextsWithProfilePages,
    errorMessage: state.profileRoot.errorMessage,
    cardsInfo,
    contexts
  };
}

const mapDispatchToProps = {
  openModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileRoot);
