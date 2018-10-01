export default year => {
  let { search } = window.location;
  if (search.match('year') !== null) {
    search = search.replace(/year=\d{4}/, `year=${year}`);
  } else {
    search = `${search}&year=${year}`;
  }
  window.location.assign(`${window.location.origin}${window.location.pathname}${search}`);
};
