/* eslint-disable max-len,no-new */

// import plyr from 'plyr';
// import 'styles/components/homepage/plyr.scss';
// import 'node_modules/plyr/src/scss/plyr.scss';

// import UpdatesTemplate from 'templates/homepage/updates.ejs';

import HomeMarkup from 'html/home.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import NavContainer from 'containers/shared/nav.container';
import Slider from 'components/home/slider.component';
import PostsTemplate from 'templates/homepage/posts.ejs';
import TweetsTemplate from 'templates/homepage/tweets.ejs';
import 'styles/homepage.scss';

import { GET_POSTS, GET_TWEETS, getURLFromParams, POST_SUBSCRIBE_NEWSLETTER } from 'utils/getURLFromParams';

import EventManager from 'utils/eventManager';

const evManager = new EventManager();

const state = {
  activeIndex: 0,
  scrollTop: 0,
  texts: [
    {
      text: 'Trase transforms our understanding of how companies and governments involved in the trade of agricultural commodities are linked to impacts and opportunities for more sustainable production.',
      action: {
        text: 'explore the tool',
        href: '/flows'
      }
    },
    {
      text: 'Can companies and governments meet their 2020 sustainability goals? The blanket transparency provided by Trase helps address this question and identify priority actions for achieving success.',
      action: {
        text: 'explore company commitments',
        href: '/profiles'
      }
    },
    {
      text: 'The ability to address deforestation and promote sustainability is hampered by poor access to vital information. Trase is committed to free and open access to all the information provided on the platform.',
      action: {
        text: 'download trase data',
        href: '/data'
      }
    }
  ],
  sliders: [
    {
      el: '.js-posts',
      endpoint: getURLFromParams(GET_POSTS),
      template: PostsTemplate,
      perPage: 3,
      next: '.js-posts-next',
      prev: '.js-posts-prev'
    },
    {
      el: '.js-tweets',
      endpoint: getURLFromParams(GET_TWEETS),
      template: TweetsTemplate,
      perPage: 3,
      next: '.js-tweets-next',
      prev: '.js-tweets-prev'
    }
  ]
};


const renderSlider = ({
  el, endpoint, perPage, next, prev, template
}) => {
  fetch(endpoint)
    .then(response => response.json())
    .then(posts => template({ posts: posts.data }))
    .then((slides) => {
      document.querySelector(el).innerHTML = slides;
      new Slider({
        selector: el, perPage, next, prev
      });
    });
};

const getPageOffset = (bounds) => {
  const body = document.querySelector('body').getBoundingClientRect();
  const padding = 65;
  const navHeight = 64;
  return (Math.abs(body.top) + Math.abs(bounds.top)) - padding - navHeight;
};

const scrollIntro = () => {
  const sections = document.querySelectorAll('.js-scroll-change');
  const offsets = Array.prototype.map.call(sections, section => section.getBoundingClientRect().top);
  const direction = (state.scrollTop < window.scrollY) ? 1 : -1;
  let index = state.activeIndex;

  if (offsets[state.activeIndex + 1] < window.innerHeight / 2 && direction === 1) index += direction;
  if (offsets[state.activeIndex] > window.innerHeight / 2 && direction === -1) index += direction;


  state.scrollTop = window.scrollY;

  if (typeof offsets[index] === 'undefined') return;
  if (state.activeIndex !== index) {
    const intro = document.querySelector('.js-intro-statement');
    const { text, action } = state.texts[index];
    const actionNode = intro.querySelector('.js-action');

    state.activeIndex = index;

    intro.querySelector('.js-text').innerText = text;

    actionNode.setAttribute('href', action.href);
    actionNode.innerText = action.text;
  }
};

const newsletterSubscribe = (e) => {
  e.preventDefault();
  const form = document.querySelector('.c-newsletter-form');

  if (form.checkValidity() === false) {
    return;
  }

  const emailAddress = form.querySelector('[name=email]').value;

  const body = new FormData();
  body.append('email', emailAddress);

  const url = getURLFromParams(POST_SUBSCRIBE_NEWSLETTER);

  fetch(url, {
    method: 'POST',
    body
  })
    .then(response => response.json())
    .then((data) => {
      const label = form.querySelector('.newsletter-label');

      label.classList.add('-pink');
      if ('error' in data) {
        label.innerHTML = `Error: ${data.error}`;
      } else if ('email' in data) {
        label.innerHTML = 'Subscription successful';
      }
    });
};

export const mount = (root, store) => {
  root.innerHTML = HomeMarkup({
    footer: FooterMarkup(),
    nav: NavMarkup({ page: 'index' }),
    feedback: FeedbackMarkup()
  });
  const bounds = document.querySelector('.js-trigger-menu-bg').getBoundingClientRect();
  const pageOffset = getPageOffset(bounds);
  new NavContainer(store, { pageOffset });

  state.sliders.forEach(renderSlider);

  // const player = plyr.setup()[0];
  //
  // player.on('ready', () => {
  //   const playButton = document.querySelector('.plyr__play-large');
  //   const playerControls = document.querySelector('.plyr__controls');
  //   const playerVideo = document.querySelector('.plyr__video-wrapper');
  //   playButton.addEventListener('click', () => {
  //     if (player.isFullscreen() === false) {
  //       player.toggleFullscreen();
  //     }
  //   });
  //
  //   player.on('enterfullscreen', function() {
  //     playerControls.classList.add('-active');
  //     playerVideo.classList.add('-active');
  //   });
  //   player.on('exitfullscreen', function() {
  //     playerControls.classList.remove('-active');
  //     playerVideo.classList.remove('-active');
  //     player.pause();
  //   });
  // });

  evManager.addEventListener(window, 'scroll', scrollIntro);
  evManager.addEventListener(document.querySelector('.js-form-subscribe'), 'click', newsletterSubscribe);
};

export const unmount = () => {
  evManager.clearEventListeners();
};
