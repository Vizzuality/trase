export const PROFILE_NODE__ON_PDF_DOWNLOAD = 'PROFILE_NODE__ON_PDF_DOWNLOAD';
export const PROFILE_NODE__SET_COLUMNS_LOADING = 'PROFILE_NODE__SET_COLUMNS_LOADING';
export const PROFILE_NODE__GET_COLUMNS = 'PROFILE_NODE__GET_COLUMNS';
export const PROFILE_NODE__SET_COLUMNS = 'PROFILE_NODE__SET_COLUMNS';

export function getColumns() {
  return {
    type: PROFILE_NODE__GET_COLUMNS
  };
}

export function setColumnsLoading(loading) {
  return {
    type: PROFILE_NODE__SET_COLUMNS_LOADING,
    payload: { loading }
  };
}

export function setColumns(columns) {
  return {
    type: PROFILE_NODE__SET_COLUMNS,
    payload: { columns }
  };
}

export const onDownloadPDF = () => ({
  type: PROFILE_NODE__ON_PDF_DOWNLOAD
});
