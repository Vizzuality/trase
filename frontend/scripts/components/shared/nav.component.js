import { getURLParams } from 'utils/stateURL';
import 'styles/components/shared/nav.scss';

const defaults = { el: '.c-nav', haveSolidBackground: false, pageOffset: 0 };

export default class {

  constructor(settings) {
    this.options = Object.assign({}, defaults, settings);
    this.el = document.querySelector(this.options.el);
    this.downloadPdfBtn = this.el.querySelector('.js-download-pdf');

    const urlParams = getURLParams(window.location.search);

    if (urlParams.print === 'true') {
      this.print = true;
      document.body.classList.add('-print');
    }

    this._setEventListeners();
  }

  _setEventListeners() {
    document.addEventListener('scroll', () => this._checkBackground());
    if (this.downloadPdfBtn) {
      this.downloadPdfBtn.addEventListener('click', this._downloadPDF);
    }
  }

  _checkBackground() {
    const { pageOffset } = this.options;
    if (window.pageYOffset > pageOffset && !this.options.haveSolidBackground) {
      this.el.classList.add('-have-background');
      this.options.haveSolidBackground = true;
    } else if(window.pageYOffset <= pageOffset && this.options.haveSolidBackground) {
      this.el.classList.remove('-have-background');
      this.options.haveSolidBackground = false;
    }
  }

  _downloadPDF() {
    const pageTitle = encodeURIComponent(document.getElementsByTagName('title')[0].innerText);
    const currentUrlBase = document.location.href.replace('localhost:8081', 'staging.trase.earth');
    const currentUrl = encodeURIComponent(`${currentUrlBase}&print=true`);
    const pdfUrl = `${PDF_DOWNLOAD_URL}?filename=${pageTitle}&url=${currentUrl}`;
    window.open(pdfUrl, '_blank');
  }
}
