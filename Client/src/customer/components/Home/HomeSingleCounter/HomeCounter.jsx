import React, { useEffect, useRef, useState, useCallback } from 'react';

const useCounting = (initialValue, targetValue) => {
  const [count, setCount] = useState(initialValue);
  const countingRef = useRef(null);

  const startCounting = useCallback(() => {
    const countingInterval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount < targetValue) {
          return prevCount + 1;
        } else {
          clearInterval(countingInterval);
          return prevCount;
        }
      });
    }, 15);
  }, [targetValue]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounting();
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    const currentRef = countingRef.current; // Capture the current value

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [countingRef, startCounting]); // Include countingRef and startCounting in the dependency array

  return { count, countingRef };
};

const HomeSingleCounter = ({ title, initialValue, targetValue, sign }) => {
  const { count, countingRef } = useCounting(initialValue, targetValue);

  return (
    <div className='flex flex-col text-center p-2' ref={countingRef}>
      <p className='text-[16px]'>{title}</p>
      <p className='text-[30px] font-bold'>{count}{sign}</p>
    </div>
  );
};

export default HomeSingleCounter;
