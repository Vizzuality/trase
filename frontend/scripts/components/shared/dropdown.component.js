import 'styles/components/shared/dropdown.scss';

export default class {
  constructor(id, callback, hideCurrentSelected = false, hideOnlyChild = false) {
    this.id = id;
    this.callback = callback;
    this.el = document.querySelector(`[data-dropdown=${id}]`);
    this.title = this.el.querySelector('.js-dropdown-title');
    this.list = this.el.querySelector('.js-dropdown-list');
    this.list.classList.add('is-hidden');

    if (this._onlyChild() && hideOnlyChild === true) {
      this.el.classList.add('-hide-only-child');
    }

    this.hideCurrentSelected = hideCurrentSelected;

    this._setEventListeners();
  }

  _bindMultipleEvents(eventArray, el, fn) {
    eventArray.forEach((event) => {
      el.addEventListener(event, fn);
    });
  }

  _setEventListeners() {
    this.title.addEventListener('click', () => {
      if (this.el.classList.contains('-column-selector')) {
        this.title.classList.add('-is-open');
      }
      this._onTitleClick();
    });

    this._bindMultipleEvents(['click', 'touchstart'], this.list, (e) => {
      e.preventDefault();
      if (e.target.getAttribute('data-value') || e.target.parentElement.getAttribute('data-value')) {
        const dataset = (e.target.getAttribute('data-value')) ? e.target.dataset : e.target.parentElement.dataset;
        this._onListClick(dataset);
      }
    });

    window.addEventListener('keyup', (event) => {
      if (event.keyCode === 27 && !this.list.classList.contains('is-hidden')) {
        this._close();
      }
    });

    this._bindMultipleEvents(['mouseup', 'touchstart'], window, (event) => {
      if (event.target === this.list) return;
      this._close();
    });
  }

  _onlyChild() {
    return (this.list.children.length <= 1);
  }

  selectValue(value) {
    // TODO friday hack, this should not happen
    if (value === undefined) {
      value = 'none';
    }

    if (this.hideCurrentSelected === true && this.currentValueTitle) {
      this.currentValueTitle.classList.remove('is-hidden');
    }

    this.currentValueTitle =
      this.list.querySelector(`[data-value="${value}"] .js-dropdown-item-title`) ||
      this.list.querySelector(`[data-value="${value}"]`);
    this.setTitle(this.currentValueTitle.innerHTML);

    if (this.hideCurrentSelected === true && this.currentValueTitle) {
      this.currentValueTitle.classList.add('is-hidden');
    }

  }

  setTitle(text) {
    this.title.innerHTML = text;
  }

  _onTitleClick() {
    const allDropdowns = document.querySelectorAll('.js-dropdown-list');
    for (let i = 0; i < allDropdowns.length; ++i) {
      if (allDropdowns[i].parentNode.getAttribute('data-dropdown') === this.id) {
        this._toggle();
      } else {
        allDropdowns[i].classList.add('is-hidden');
      }
    }
  }

  _toggle() {
    !this.list.classList.toggle('is-hidden');
  }

  _close() {
    this.list.classList.add('is-hidden');

    if (this.el.classList.contains('-column-selector')) {
      this.title.classList.remove('-is-open');
    }
  }

  _onListClick(data) {
    if (Object.keys(data).length > 1) {
      this.callback(data, this.id);
    } else {
      this.callback(data.value, this.id);
    }
    this._close();
  }
}
