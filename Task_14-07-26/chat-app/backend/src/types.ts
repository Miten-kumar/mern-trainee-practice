export interface Message {
  id: string;
  room: string;
  username: string;
  text: string;
  createdAt: string; // ISO string, keeps it JSON-safe for persistence
}

export interface TypingUpdate {
  room: string;
  username: string;
  isTyping: boolean;
}

export interface ReadReceipt {
  room: string;
  messageId: string;
  username: string;
}

export interface PresenceUpdate {
  room: string;
  onlineUsers: string[];
}

// callback-style acks, so the client knows if their action actually
// succeeded instead of just hoping the event got through
export type Ack<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// events the server can send to a client
export interface ServerToClientEvents {
  room_history: (messages: Message[]) => void;
  new_message: (message: Message) => void;
  presence_update: (data: PresenceUpdate) => void;
  typing_update: (data: TypingUpdate) => void;
  read_receipt: (data: ReadReceipt) => void;
  error_message: (data: { message: string }) => void;
}

// events a client can send to the server
export interface ClientToServerEvents {
  join_room: (room: string, callback: (res: Ack) => void) => void;
  leave_room: (room: string) => void;
  send_message: (
    data: { room: string; text: string },
    callback: (res: Ack<Message>) => void
  ) => void;
  typing: (data: { room: string; isTyping: boolean }) => void;
  mark_read: (data: { room: string; messageId: string }) => void;
}

// no server-to-server events in this project, socket.io still wants the type
export type InterServerEvents = Record<string, never>;

// per-connection data socket.io attaches after auth
export interface SocketData {
  username: string;
  userId: string;
}
