import _ from 'lodash';
import MultiTableTemplate from 'templates/profiles/table/multi-table.ejs';
import Table from 'components/profiles/table.component';
import 'styles/components/shared/tabs.scss';


export default class {
  constructor(settings) {
    this.el = settings.el; // place to show the table
    this.type = settings.type;
    this.data = settings.data;
    this.tabsTitle = settings.tabsTitle;
    this.target = settings.target;
    this.key = `table_${new Date().getTime()}`;
    this.year = settings.year;

    this.render();
  }

  render() {
    const template = MultiTableTemplate({ data: this.data, tabsTitle: this.tabsTitle, key: this.key });
    this.el.innerHTML = template;

    this._renderTables();
    this.el.parentElement.classList.remove('-tab-hidden');

    this.switchers = Array.prototype.slice.call(this.el.querySelectorAll('.js-multi-table-switcher'), 0);
    this.singleTables = Array.prototype.slice.call(this.el.querySelectorAll('.js-multi-table-container'), 0);
    this.switchers.forEach((switcher) => {
      switcher.addEventListener('click', e => this._switchTable(e));
    });
  }

  _renderTables() {
    this.data.forEach((item, i) => {
      // eslint-disable-next-line no-new
      new Table({
        el: document.querySelector(`.${this.key}_${i}`),
        data: item,
        type: this.type,
        target: (_.isFunction(this.target)) ? this.target(item) : this.target,
        year: this.year
      });
    });
  }

  _switchTable(e) {
    const selectedSwitch = e && e.currentTarget;
    if (!selectedSwitch) {
      return;
    }

    const selectedTable = selectedSwitch.getAttribute('data-table');
    this.singleTables.forEach((table) => {
      table.classList.add('-tab-hidden');
    });
    this.switchers.forEach((switcher) => {
      switcher.classList.remove('selected');
    });

    this.el.querySelector(`.${selectedTable}`).classList.remove('-tab-hidden');
    selectedSwitch.classList.add('selected');
  }
}
