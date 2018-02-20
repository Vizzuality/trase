import 'styles/components/shared/nav-tool.scss';

export default class {
  constructor() {
    this._setVars();
    this._setEventListeners();

    this.state = {
      visibilityAppMenu: false
    };

    this.setAppMenuVisibility();
  }

  onCreated() {
    this._setNavigationLinks();
  }

  _setVars() {
    this.el = document.querySelector('.c-nav-tool');

    this.appNav = this.el.querySelector('.app-nav');
    this.flowsNav = this.el.querySelector('#js-tool-nav-react');
    this.localeSelector = this.el.querySelector('#js-locale-selector-react');
    this.toggleBtn = this.el.querySelector('.js-toggle-menu');
  }

  _setEventListeners() {
    this.toggleBtn.addEventListener('click', () => this.onToggleMenu());
  }

  _setNavigationLinks() {
    const links = [].slice.call(this.appNav.querySelectorAll('.js-nav-link'));
    links.forEach(link => {
      const page = link.getAttribute('data-route');
      link.addEventListener('click', () => this.callbacks.onLinkClick(page));
    });
  }

  onToggleMenu() {
    Object.assign(this.state, { visibilityAppMenu: !this.state.visibilityAppMenu });

    this.toggleBtn.querySelector('.js-burger').classList.toggle('open');
    this.setAppMenuVisibility();
  }

  setAppMenuVisibility() {
    if (this.state.visibilityAppMenu) {
      this.appNav.classList.remove('is-hidden');
      this.flowsNav.classList.add('is-hidden');
      this.localeSelector.classList.remove('is-hidden');
    } else {
      this.appNav.classList.add('is-hidden');
      this.flowsNav.classList.remove('is-hidden');
      this.localeSelector.classList.add('is-hidden');
    }
  }
}
