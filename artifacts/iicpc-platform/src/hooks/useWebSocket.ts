import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "@/lib/api";

type ConnectionState = "connecting" | "connected" | "disconnected";

type WebSocketContextValue = {
  socket: Socket | null;
  status: ConnectionState;
  connected: boolean;
  subscribe: (room: string) => () => void;
};

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

function getSocketUrl(): string {
  if (API_BASE_URL) {
    return API_BASE_URL;
  }
  return window.location.origin;
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConnectionState>("connecting");
  const socketRef = useRef<Socket | null>(null);
  const roomCountsRef = useRef(new Map<string, number>());

  useEffect(() => {
    const socket = io(getSocketUrl(), {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 8000,
    });

    socketRef.current = socket;
    setStatus("connecting");

    const resubscribe = () => {
      setStatus("connected");
      for (const room of roomCountsRef.current.keys()) {
        socket.emit("room:join", room);
        socket.emit("subscribe", { room });
      }
    };

    socket.on("connect", resubscribe);
    socket.on("disconnect", () => setStatus("disconnected"));
    socket.on("connect_error", () => setStatus("disconnected"));

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const subscribe = useCallback((room: string) => {
    const currentCount = roomCountsRef.current.get(room) ?? 0;
    roomCountsRef.current.set(room, currentCount + 1);

    const socket = socketRef.current;
    if (socket?.connected && currentCount === 0) {
      socket.emit("room:join", room);
      socket.emit("subscribe", { room });
    }

    return () => {
      const nextCount = (roomCountsRef.current.get(room) ?? 1) - 1;
      const socket = socketRef.current;
      if (nextCount <= 0) {
        roomCountsRef.current.delete(room);
        if (socket?.connected) {
          socket.emit("room:leave", room);
          socket.emit("unsubscribe", { room });
        }
        return;
      }
      roomCountsRef.current.set(room, nextCount);
    };
  }, []);

  const value = useMemo<WebSocketContextValue>(
    () => ({
      socket: socketRef.current,
      status,
      connected: status === "connected",
      subscribe,
    }),
    [status, subscribe],
  );

  return createElement(WebSocketContext.Provider, { value }, children);
}

export function useWebSocket(room?: string) {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }

  useEffect(() => {
    if (!room) return;
    return context.subscribe(room);
  }, [context, room]);

  return context;
}

export function useSocketEvent<T>(eventNames: string[], room?: string) {
  const { socket, connected, status, subscribe } = useWebSocket();
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!room) return;
    return subscribe(room);
  }, [room, subscribe]);

  useEffect(() => {
    if (!socket) return;

    const handler = (payload: T) => setData(payload);
    for (const eventName of eventNames) {
      socket.on(eventName, handler);
    }

    return () => {
      for (const eventName of eventNames) {
        socket.off(eventName, handler);
      }
    };
  }, [eventNames, socket]);

  return { data, connected, status };
}
