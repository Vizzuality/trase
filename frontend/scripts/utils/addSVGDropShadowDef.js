// http://bl.ocks.org/cpbotha/5200394

export default svg => {
  // filters go in defs element
  var defs = svg.append('defs');

  // create filter with id #drop-shadow
  // height=130% so that the shadow is not clipped
  var filter = defs.append('filter')
      .attr('id', 'drop-shadow')
      .attr('height', '180%');

  // SourceAlpha refers to opacity of graphic that this filter will be applied to
  // convolve that with a Gaussian with standard deviation 3 and store result
  // in blur
  filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 3)
      .attr('result', 'blur');

  // translate output of Gaussian blur to the right and downwards with 2px
  // store result in offsetBlur
  filter.append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 1)
      .attr('dy', 1)
      .attr('result', 'offsetBlur');

  // overlay original SourceGraphic over translated blurred opacity by using
  // feMerge filter. Order of specifying inputs is important!
  var feMerge = filter.append('feMerge');

  feMerge.append('feMergeNode')
      .attr('in', 'offsetBlur');
  feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');
};
