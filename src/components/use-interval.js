
// from https://overreacted.io/making-setinterval-declarative-with-react-hooks/

import { useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export default useInterval;
