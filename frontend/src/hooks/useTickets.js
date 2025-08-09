import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useTickets(filters) {
  const [resp, setResp] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const q = new URLSearchParams();
    if (filters.status) q.set('status', filters.status);
    if (filters.technicianId) q.set('technician_id', filters.technicianId);
    if (filters.categoryId) q.set('category_id', filters.categoryId);
    if (filters.source) q.set('source', filters.source);
    if (filters.dateFrom) q.set('date_from', filters.dateFrom);
    if (filters.dateTo) q.set('date_to', filters.dateTo);
    q.set('page', filters.page);
    q.set('per_page', filters.perPage);

    setLoading(true);
    api(`/tickets?${q.toString()}`)
      .then((d) => alive && setResp(d))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [filters.status, filters.technicianId, filters.categoryId, filters.source, filters.dateFrom, filters.dateTo, filters.page, filters.perPage]);

  return { resp, loading };
}
