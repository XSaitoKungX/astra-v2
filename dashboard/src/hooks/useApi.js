import { useState, useEffect, useRef } from 'react';

const API_BASE = '/api';

export function useApi(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialDataRef = useRef(options.initialData || null);

  const { refreshInterval = 0 } = options;

  useEffect(() => {
    let cancelled = false;
    let intervalId = null;

    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}${endpoint}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    if (refreshInterval > 0) {
      intervalId = setInterval(fetchData, refreshInterval);
    }

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [endpoint, refreshInterval]);

  return { data: data || initialDataRef.current, loading, error };
}

export default useApi;
