import { useEffect } from "react";

export function useSSE(onNewTicket?: (id: string) => void) {
  useEffect(() => {
    const url = "/api/events";
    const es = new EventSource(url);
    es.addEventListener("new_ticket", (e: MessageEvent) => {
      onNewTicket?.(String(e.data));
      const audio = new Audio("/ping.mp3");
      audio.play().catch(() => {});
    });
    return () => es.close();
  }, [onNewTicket]);
}
