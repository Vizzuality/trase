import isEqual from 'lodash/isEqual';

import 'styles/_texts.scss';
import 'scripts/react-components/shared/button/button.scss';
import 'styles/components/shared/modal.scss';

import ModalTemplate from 'legacy/modal.ejs';

class ModalComponent {
  constructor() {
    this.state = {
      visibility: false,
      modalParams: null
    };

    this.el = document.querySelector('.js-modal');
    this.veil = document.querySelector('.js-veil');
    this.onVeilClick = () => this._toggleVisibility();
  }

  onCreated(props) {
    this.getModal(props);
  }

  onRemoved() {
    this.veil.removeEventListener('click', this.onVeilClick);
  }

  _setEventListeners() {
    const closeButton = this.el.querySelector('.js-close');

    this.veil.addEventListener('click', this.onVeilClick);
    closeButton.addEventListener('click', this.onVeilClick);
    document.onkeydown = e => this._onKeyDown(e);
  }

  _onKeyDown(e) {
    if (e && e.keyCode !== 27) return;

    if (!this.state.visibility) return;

    this._toggleVisibility();
  }

  _toggleVisibility() {
    Object.assign(this.state, { visibility: !this.state.visibility });
    this._setVisibility();
    this.callbacks.onClose();
  }

  getModal({ modal }) {
    if (isEqual(modal.modalParams, this.state.modalParams)) {
      Object.assign(this.state, { visibility: modal.visibility });
    } else {
      Object.assign(this.state, modal);
      this.render();
    }
    this._setVisibility();
  }

  _setVisibility() {
    this.el.classList.toggle('is-hidden', !this.state.visibility);
    this.veil.classList.toggle('is-hidden', !this.state.visibility);
  }

  render() {
    this.el.innerHTML = ModalTemplate({ data: this.state.modalParams });
    this._setEventListeners();
  }
}

export default ModalComponent;
