import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { appActions } from 'app/app.register';

function getDownloadPdfLink() {
  const pageTitle = encodeURIComponent(document.getElementsByTagName('title')[0].innerText);
  const currentUrlBase = document.location.href;
  const currentUrl = encodeURIComponent(`${currentUrlBase}&print=true`);
  return `${PDF_DOWNLOAD_URL}?filename=${pageTitle}.pdf&url=${currentUrl}`;
}

function DownloadPdfLink({ className, onClick }) {
  return (
    <a
      className={className}
      href={getDownloadPdfLink()}
      onClick={onClick}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg className="icon icon-download-pdf">
        <use xlinkHref="#icon-download-pdf" />
      </svg>
    </a>
  );
}

DownloadPdfLink.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string
};

const mapDispatchToProps = {
  onClick: appActions.onDownloadPDF
};

export default connect(null, mapDispatchToProps)(DownloadPdfLink);
