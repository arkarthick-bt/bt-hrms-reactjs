import { useState, useCallback } from 'react';
import { get } from '../apiHelpers/api';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';

export function useMasterData() {
  const [masterData, setMasterData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const fetchMaster = useCallback(async (table: string, q?: string) => {
    // Basic guard: don't hit the API if it's already fetching for this table 
    // unless it's a search query (q is present)
    setLoading(prev => {
        if (prev[table] && !q) return prev; 
        return { ...prev, [table]: true };
    });

    try {
      const response = await get<any>(API_BASE_URL + API_ENDPOINTS.MASTERS, {
        query: { table, q }
      });
      
      if (response && response.success && response.data) {
        setMasterData(prev => ({ 
          ...prev, 
          [table]: response.data[table] || [] 
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch master data for ${table}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [table]: false }));
    }
  }, []); // Removed loading dependency to allow frequent search updates

  const fetchEmployees = useCallback(async (q?: string) => {
    const table = 'employees';
    setLoading(prev => ({ ...prev, [table]: true }));
    try {
      const response = await get<any>(API_BASE_URL + API_ENDPOINTS.EMPLOYEES.LIST, {
        query: { q, take: 100 }
      });
      if (response && response.success && response.data) {
        setMasterData(prev => ({ 
          ...prev, 
          [table]: response.data.employee || [] 
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch employees:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [table]: false }));
    }
  }, []);


  return { masterData, loading, fetchMaster, fetchEmployees };
}
