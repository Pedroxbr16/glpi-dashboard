import { useEffect } from 'react';

export function useSSE(onNewTicket) {
  useEffect(() => {
    const url = '/api/events';
    const es = new EventSource(url);
    es.addEventListener('new_ticket', (e) => {
      onNewTicket && onNewTicket(e.data);
      const audio = new Audio('/ping.mp3');
      audio.play().catch(() => {});
    });
    return () => es.close();
  }, [onNewTicket]);
}
