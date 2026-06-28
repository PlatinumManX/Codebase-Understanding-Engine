import { useState, useEffect } from 'react';

export function getRouteFromHash() {
  const hash = window.location.hash.replace('#', '');
  return hash || 'dashboard'; // default route
}

export default function useRoute() {
  const [route, setRoute] = useState(getRouteFromHash());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newRoute) => {
    window.location.hash = newRoute;
  };

  return { route, navigate };
}
