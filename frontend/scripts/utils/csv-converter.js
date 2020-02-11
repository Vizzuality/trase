// based on the good old https://github.com/bsusensjackson/json2csv

class CSVConverter {
  static convert(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    // Assume that the headers of the document are equal to the keys in the JSON object.
    const headers = Object.keys(array[0]);
    const stringWithHeaders = CSVConverter.parseHeaders(headers, array);
    return CSVConverter.parseBody(array, stringWithHeaders);
  }

  static parseHeaders(headers) {
    // Push the headers into the CSV string.
    let str = '';
    headers.forEach((item, i, list) => {
      if (i < list.length - 1) {
        str += `${item},`;
      } else {
        str += `${item}`;
      }
    });
    str += '\r\n';
    return str;
  }

  static parseBody(array, str) {
    let line;
    array.forEach(item => {
      line = '';
      Object.keys(item).forEach(key => {
        if (line !== '') line += ',';
        const regex = /,/;
        let value = item[key];

        if (typeof value === 'string') {
          // If the value contained in the JSON object is a string:
          // Perform a regex test to check and see if the value has a comma already in place and escape the value.
          // e.g. "Smith, Jones" as a value should not be separated two different columns.
          value = regex.test(value) ? `"${value}"` : value;
        }
        line += value;
      });
      str += `${line}\r\n`;
    });
    return str;
  }

  static download(csvString, fileName = 'download') {
    if (Object.hasOwnProperty.call(window, 'ActiveXObject') && !window.ActiveXObject) {
      // Determine if client is IE11
      const blob = new Blob([csvString], {
        type: 'text/csv;charset=utf-8;'
      });
      window.navigator.msSaveBlob(blob, 'tcm-01.csv');
    }
    const csvContent = `data:text/csv;charset=utf-8,${escape(csvString)}`;
    const link = document.createElement('a');
    link.setAttribute('target', '__blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default CSVConverter;
