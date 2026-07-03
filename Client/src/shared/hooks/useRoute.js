import { useState, useEffect } from 'react';

// Get route from pathname or hash fallback
export function getRoute() {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    return hash;
  }
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  return path || 'landing';
}

export default function useRoute() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (newRoute) => {
    if (newRoute.startsWith('#')) {
      window.location.hash = newRoute;
    } else {
      window.history.pushState({}, '', `/${newRoute === 'landing' ? '' : newRoute}`);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  return { route, navigate };
}
