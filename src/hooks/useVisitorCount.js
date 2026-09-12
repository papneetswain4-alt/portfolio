import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const realtimeUrl = import.meta.env.VITE_REALTIME_URL;

export function useVisitorCount() {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    if (!realtimeUrl) return undefined;

    const socket = io(realtimeUrl, {
      transports: ["websocket", "polling"],
    });

    const handleVisitorCount = (count) => {
      if (Number.isFinite(count)) setVisitorCount(count);
    };

    socket.on("visitor-count", handleVisitorCount);

    return () => {
      socket.off("visitor-count", handleVisitorCount);
      socket.disconnect();
    };
  }, []);

  return {
    visitorCount,
    isEnabled: Boolean(realtimeUrl),
  };
}
