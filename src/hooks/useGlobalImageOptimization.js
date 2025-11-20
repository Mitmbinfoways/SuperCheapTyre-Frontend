import { useEffect } from 'react';

const runWhenIdle = (cb) => {
  if (typeof window === 'undefined') return;
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(cb, { timeout: 500 });
  } else {
    window.setTimeout(cb, 50);
  }
};

const updateImageAttributes = () => {
  if (typeof document === 'undefined') return;

  const images = document.querySelectorAll('img');

  images.forEach((img) => {
    if (img.dataset.priority === 'high') {
      return;
    }

    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }

    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }

    if (!img.hasAttribute('fetchpriority')) {
      img.setAttribute('fetchpriority', 'low');
    }
  });
};

const useGlobalImageOptimization = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    updateImageAttributes();

    const observer = new MutationObserver(() => {
      runWhenIdle(updateImageAttributes);
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);
};

export default useGlobalImageOptimization;

