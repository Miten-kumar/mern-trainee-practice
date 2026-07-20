// room -> (socketId -> username). keyed by socketId instead of username
// because the same person could theoretically open two tabs, and we
// only want them to disappear from presence once ALL their sockets leave
const roomPresence = new Map<string, Map<string, string>>();

export function addToRoom(room: string, socketId: string, username: string) {
  if (!roomPresence.has(room)) {
    roomPresence.set(room, new Map());
  }
  roomPresence.get(room)!.set(socketId, username);
}

export function removeFromRoom(room: string, socketId: string) {
  roomPresence.get(room)?.delete(socketId);
}

// call this on disconnect to clean a socket out of every room it was in
export function removeFromAllRooms(socketId: string): string[] {
  const affectedRooms: string[] = [];
  for (const [room, sockets] of roomPresence.entries()) {
    if (sockets.has(socketId)) {
      sockets.delete(socketId);
      affectedRooms.push(room);
    }
  }
  return affectedRooms;
}

export function getOnlineUsernames(room: string): string[] {
  const sockets = roomPresence.get(room);
  if (!sockets) return [];
  // dedupe in case of multiple tabs for the same username
  return [...new Set(sockets.values())];
}
