export const PORT = 5000;
export const BASE_URL = "";
export const GLOBAL_SOCKET_NAMESPACE = "/ts-socket"; 
export const PORT_EXT = `:${PORT}`;
export const SOCKET_URI = `http://` + window.location.hostname + PORT_EXT + GLOBAL_SOCKET_NAMESPACE;
