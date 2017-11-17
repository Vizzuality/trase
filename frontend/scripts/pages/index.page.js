// import plyr from 'plyr';
import Nav from 'components/shared/nav.component.js';
import Slider from 'scripts/components/home/slider.component';
import PostsTemplate from 'ejs!templates/homepage/posts.ejs';
// import UpdatesTemplate from 'ejs!templates/homepage/updates.ejs';
import TweetsTemplate from 'ejs!templates/homepage/tweets.ejs';
import 'styles/homepage.scss';
import 'node_modules/plyr/src/scss/plyr.scss';
import 'styles/components/homepage/plyr.scss';
import { getURLFromParams, POST_SUBSCRIBE_NEWSLETTER } from '../utils/getURLFromParams';

const state = {
  activeIndex: 0,
  scrollTop: 0,
  texts: [
    {
      text: 'Trase transforms our understanding of how companies and governments involved in the trade of agricultural commodities are linked to impacts and opportunities for more sustainable production.',
      action: {
        text: 'explore the tool',
        href: '/flows.html'
      }
    },
    {
      text: 'Can companies and governments meet their 2020 sustainability goals? The blanket transparency provided by Trase helps address this question and identify priority actions for achieving success.',
      action: {
        text: 'explore company commitments',
        href: '/profiles.html'
      }
    },
    {
      text: 'The ability to address deforestation and promote sustainability is hampered by poor access to vital information. Trase is committed to free and open access to all the information provided on the platform.',
      action: {
        text: 'download trase data',
        href: '/data.html'
      }
    }
  ],
  sliders: [
    {
      el: '.js-posts',
      endpoint: API_CMS_URL + '/posts',
      template: PostsTemplate,
      perPage: 3,
      next: '.js-posts-next',
      prev: '.js-posts-prev'
    },
    // {
    //   el: '.js-updates',
    //   endpoint: '/updates',
    //   perPage: 4,
    //   template: UpdatesTemplate
    // },
    {
      el: '.js-tweets',
      endpoint: API_SOCIAL + '/tweets',
      template: TweetsTemplate,
      perPage: 3,
      next: '.js-tweets-next',
      prev: '.js-tweets-prev'
    }
  ]
};


const renderSlider = ({ el, endpoint, perPage, next, prev, template }) => {
  fetch(endpoint)
    .then(response => response.json())
    .then((posts) => template({ posts: posts.data }))
    .then((slides) => {
      document.querySelector(el).innerHTML = slides;
      new Slider({ selector: el, perPage, next, prev });
    });
};

const getPageOffset = (bounds) => {
  const body = document.querySelector('body').getBoundingClientRect();
  const padding = 65;
  const navHeight = 64;
  return Math.abs(body.top) + Math.abs(bounds.top) - padding - navHeight;
};

const scrollIntro = () => {
  const sections = document.querySelectorAll('.js-scroll-change');
  const offsets = Array.prototype.map.call(sections, (section) => section.getBoundingClientRect().top);
  const direction = (state.scrollTop < window.scrollY) ? 1 : -1;
  let index = state.activeIndex;

  if (offsets[state.activeIndex + 1] < window.innerHeight / 2 && direction === 1) index += direction;
  if (offsets[state.activeIndex] > window.innerHeight / 2 && direction === -1) index += direction;


  state.scrollTop = window.scrollY;

  if(typeof offsets[index] === 'undefined') return;
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

const init = () => {
  const bounds = document.querySelector('.js-trigger-menu-bg').getBoundingClientRect();
  const pageOffset = getPageOffset(bounds);
  new Nav({ pageOffset });

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

  window.addEventListener('scroll', scrollIntro);
  document.querySelector('.js-form-subscribe').addEventListener('click', newsletterSubscribe);
};

init();
