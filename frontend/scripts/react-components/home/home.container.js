import { connect } from 'react-redux';
import Home from 'react-components/home/home.component';
import { BREAKPOINTS, HOME_VIDEO } from 'constants';
import { appActions } from 'app/app.register';
import { homeActions } from 'scripts/react-components/home/home.register';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';
import { getDestinationCountries } from 'react-components/home/home.selectors';

function mapStateToProps(state) {
  const { query = {} } = state.location;
  const { tweets, posts, testimonials } = state.home;
  // not ideal, we could use redux-responsive if we need more changes like the one below
  const isSmallResolution = window.innerWidth <= BREAKPOINTS.small;
  const INSIGHTS = ['INSIGHT', 'INFO BRIEF', 'ISSUE BRIEF', 'LONGER READ'];
  const promotedPost = posts.find(post => post.highlighted);
  const blogPosts = posts.filter(
    post => !(post.highlighted && !isSmallResolution) && !INSIGHTS.includes(post.category)
  );
  const insightsPosts = posts.filter(
    post => !(post.highlighted && !isSmallResolution) && INSIGHTS.includes(post.category)
  );
  const homeVideo = HOME_VIDEO[query.lang] || HOME_VIDEO.en;

  return {
    homeVideo,
    blogPosts,
    insightsPosts,
    promotedPost,
    testimonials,
    tweets: tweets.length > 0 ? tweets : null,
    selectedContext: getSelectedContext(state),
    destinationCountries: getDestinationCountries(state),
    selectedYears: getSelectedYears(state)
  };
}

const mapDispatchToProps = dispatch => ({
  goToContextPage: () => {
    dispatch(appActions.setContextIsUserSelected(true));
    dispatch({ type: 'explore' });
  },
  onPlayVideo: videoId => dispatch(homeActions.playHomeVideo(videoId)),
  clickEntrypoint: link => dispatch(homeActions.clickEntrypoint(link)),
  clickNextEntrypoint: () => dispatch(homeActions.clickNextEntrypoint()),
  getTopCountries: () => dispatch(appActions.getTopCountries())
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
