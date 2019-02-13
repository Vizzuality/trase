import React from 'react';
import PropTypes from 'prop-types';

function getDownloadPdfLink() {
  const pageTitle = encodeURIComponent(document.getElementsByTagName('title')[0].innerText);
  const currentUrlBase = document.location.href;
  const currentUrl = encodeURIComponent(`${currentUrlBase}&print=true`);
  return `${PDF_DOWNLOAD_URL}?filename=${pageTitle}.pdf&url=${currentUrl}`;
}

function DownloadPdfLink({ className }) {
  return (
    <a className={className} href={getDownloadPdfLink()} target="_blank" rel="noopener noreferrer">
      <svg className="icon icon-download-pdf">
        <use xlinkHref="#icon-download-pdf" />
      </svg>
    </a>
  );
}

DownloadPdfLink.propTypes = {
  className: PropTypes.string
};

export default DownloadPdfLink;
