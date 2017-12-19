export default (text) => {
  if (text) {
    return text.substr(-1, 1).toLowerCase() === 's' ? `${text}'` : `${text}'s`;
  }
  return '-';
};
