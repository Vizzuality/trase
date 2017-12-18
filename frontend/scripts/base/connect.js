import Container from './Container';

// this is a simple wrapper to avoid having to pass around the store inside containers
// store is passed at container instanciation (ie new Container(store))
// and inside the container, only affected functions have to be passed
// viewClass: the component class that will be instanciated by the container
// mapMethodsToState: maps component methods to app state updates - keys correspond to method names, values to state prop path
// mapViewEventsToActions: maps component callbacks (ie user events) to redux actions
// onCreated: called at component instanciation. Use this as a chance to dispatch an action
export default function(viewClass, mapMethodsToState, mapViewEventsToActions, onCreated) {
  return (store, ...ownProps) => {
    return new Container(
      store,
      viewClass,
      mapMethodsToState,
      mapViewEventsToActions,
      onCreated,
      ownProps
    );
  };
}
