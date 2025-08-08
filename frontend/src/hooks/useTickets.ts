import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Filters } from "../store/filters";

export type SearchResponse = {
  totalcount?: number;
  count?: number;
  content_range?: string;
  data?: any[];
};

export function useTickets(filters: Filters) {
  const [resp, setResp] = useState<SearchResponse>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const q = new URLSearchParams();
    if (filters.status) q.set("status", filters.status);
    if (filters.technicianId) q.set("technician_id", String(filters.technicianId));
    if (filters.categoryId) q.set("category_id", String(filters.categoryId));
    if (filters.source) q.set("source", String(filters.source));
    if (filters.dateFrom) q.set("date_from", String(filters.dateFrom));
    if (filters.dateTo) q.set("date_to", String(filters.dateTo));
    q.set("page", String(filters.page));
    q.set("per_page", String(filters.perPage));

    setLoading(true);
    api<SearchResponse>(`/tickets?${q.toString()}`)
      .then((d) => alive && setResp(d))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [filters.status, filters.technicianId, filters.categoryId, filters.source, filters.dateFrom, filters.dateTo, filters.page, filters.perPage]);

  return { resp, loading };
}
