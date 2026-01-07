import { useEffect } from 'react';

const BASE_TITLE = 'Employee Polls';

const useDocumentTitle = (pageTitle) => {
  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} | ${BASE_TITLE}`;
      return;
    }

    document.title = BASE_TITLE;
  }, [pageTitle]);
};

export default useDocumentTitle;
