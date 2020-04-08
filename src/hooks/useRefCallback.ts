import { useCallback, useRef } from 'react';

const useRefCallback = (callback?: any) => {
  const ref = useRef(null);
  const setRef = useCallback((node) => {
    if (ref.current) {
    }

    if (node) {
      ref.current = node;
      callback(ref);
    }

    // Save a reference to the node
  }, []);

  return [setRef];
};

export default useRefCallback;
