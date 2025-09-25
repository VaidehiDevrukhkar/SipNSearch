// src/hooks/useCsvCafes.js
import { useState, useEffect } from 'react';
import { fetchCafes } from '../services/cafeService';

export function useCsvCafes() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCsvCafes = async () => {
      setLoading(true);
      setError(null);
      try {
        const csvCafes = await fetchCafes({ csvOnly: true });
        setCafes(csvCafes);
      } catch (err) {
        setError(err.message || 'Failed to load cafes from CSV');
        console.error('Error loading CSV cafes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCsvCafes();
  }, []);

  return { cafes, loading, error };
}
