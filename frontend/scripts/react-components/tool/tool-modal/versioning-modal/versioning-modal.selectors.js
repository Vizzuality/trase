import { createSelector } from 'reselect';
import { getSelectedContext } from 'app/app.selectors';

const getLanguage = state => state.location?.current?.query?.lang || 'en';
const getMethodsAndData = state => state.methodsAndData?.data || null;

export const getVersionData = createSelector(
  [getSelectedContext, getLanguage, getMethodsAndData],
  (context, language, data) => {
    if (!data || !context) return null;
    return data.find(d => d.language === language.toUpperCase() && d.contextId === context.id);
  }
);
