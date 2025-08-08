import { useEffect, useState } from "react";
import { api } from "../lib/api";

export type Stats = { open: number; in_progress: number; solved_today: number; };

export function useStats(pollMs = 10000) {
  const [data, setData] = useState<Stats>({ open: 0, in_progress: 0, solved_today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const fetchIt = async () => {
      try {
        const d = await api<Stats>("/stats");
        if (alive) setData(d);
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchIt();
    const id = setInterval(fetchIt, pollMs);
    return () => { alive = false; clearInterval(id); };
  }, [pollMs]);

  return { data, loading };
}
