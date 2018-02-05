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

    this.AppNav = this.el.querySelector('.app-nav');
    this.FlowsNav = this.el.querySelector('.tool-nav');
    this.toggleBtn = this.el.querySelector('.js-toggle-menu');
  }

  _setEventListeners() {
    this.toggleBtn.addEventListener('click', () => this.onToggleMenu());
  }

  _setNavigationLinks() {
    const links = [].slice.call(this.AppNav.querySelectorAll('.js-nav-link'));
    links.forEach(link => {
      const page = link.getAttribute('data-route');
      link.addEventListener('click', () => this.callbacks.onLinkClick(page));
    });
  }

  onToggleMenu() {
    Object.assign(this.state, { visibilityAppMenu: !this.state.visibilityAppMenu });

    this.toggleBtn.querySelector('.burger').classList.toggle('open');
    this.setAppMenuVisibility();
  }

  setAppMenuVisibility() {
    this.AppNav.classList.toggle('is-hidden', !this.state.visibilityAppMenu);
    this.FlowsNav.classList.toggle('is-hidden', this.state.visibilityAppMenu);
  }
}
