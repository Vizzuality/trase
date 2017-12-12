import TableTemplate from 'ejs!templates/profiles/table/table.ejs';
import formatValue from 'utils/formatValue';
import { UNITLESS_UNITS } from 'constants';

import 'styles/components/profiles/area-table.scss';

export default class {
  constructor(settings) {
    this.el = settings.el; //place to show the table
    this.type = settings.type;
    this.data = settings.data;
    this.target = settings.target;
    this.year = settings.year;

    if (this.target === 'actor') {
      this.link = 'profile-actor.html?nodeId=';
    } else if (this.target === 'place') {
      this.link = 'profile-place.html?nodeId=';
    } else {
      this.link = null;
    }

    // remove unneeded units
    this.data.included_columns.forEach(includedColumn => {
      includedColumn.unit = (UNITLESS_UNITS.indexOf(includedColumn.unit) === -1) ? includedColumn.unit : '';
    });

    // this parse would not exist in the future.
    if (this.type === 't_head_actors') {
      for (let i = 0; i < this.data.rows.length; i++) {
        if (this.data.rows[i] !== null && this.data.rows[i].hasOwnProperty('values')) {
          for (let j = 0; j < this.data.rows[i].values.length; j++) {
            if (this.data.rows[i].values[j] !== null && this.data.rows[i].values[j].hasOwnProperty('value')) {
              // there are string values, this way we avoid parse them.
              if (typeof this.data.rows[i].values[j].value !== 'number') {
                this.data.rows[i].values[j].link = this._getLink(this.target, this.data.rows[i].values[j].id, this.year);
              } else {
                this.data.rows[i].values[j].value = formatValue(this.data.rows[i].values[j].value, this.data.included_columns[j].name);
              }
            }
          }
        }
      }
    }

    if (this.type === 't_head_places') {
      for (let i = 0; i < this.data.rows.length; i++) {
        for (let j = 0; j < this.data.rows[i].values.length; j++) {
          this.data.rows[i].values[j] = formatValue(this.data.rows[i].values[j], this.data.included_columns[j].name);
        }
      }
    }

    this.render();
  }

  _getLink(target, id, year) {
    if (target === 'actor') {
      return `profile-actor.html?nodeId=${id}&year=${year}`;
    } else if (target === 'place') {
      return `profile-place.html?nodeId=${id}&year=${year}`;
    }

    return null;
  }

  render() {
    const template = TableTemplate({ data: this.data, type: this.type, link: this.link });
    this.el.innerHTML = template;
    this.el.parentElement.classList.remove('is-hidden');
  }
}
