export default str => {
  const doc = new DOMParser().parseFromString(str, 'text/html');
  return doc.body.textContent || '';
};
