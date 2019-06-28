/**
 * Returns the context with the given id
 * Returns the default context if none is set
 *
 * @param state
 * @param contextId
 * @returns {T}
 */
export const getContextById = (state, contextId) => {
  let selectedContext = state.app.contexts.find(context => context.id === contextId);
  if (!selectedContext) {
    selectedContext = state.app.contexts.find(context => context.isDefault === true);
  }

  return selectedContext;
};
