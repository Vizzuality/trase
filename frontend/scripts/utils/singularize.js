export default panelName => {
  const irregularInflections = {
    commodities: 'commodity'
  };
  return irregularInflections[panelName] || panelName.substring(0, panelName.length - 1);
};
