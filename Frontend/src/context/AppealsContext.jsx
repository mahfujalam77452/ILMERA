// src/context/AppealsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { appealService } from '../services/appealService';

const AppealsContext = createContext();

export const AppealsProvider = ({ children }) => {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppeals = async () => {
      try {
        const data = await appealService.getAllAppeals();
        setAppeals(data);
      } catch (error) {
        console.error("Failed to fetch appeals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppeals();
  }, []); // Empty dependency array ensures this runs ONLY once on mount

  return (
    <AppealsContext.Provider value={{ appeals, loading }}>
      {children}
    </AppealsContext.Provider>
  );
};

export const useAppeals = () => useContext(AppealsContext);