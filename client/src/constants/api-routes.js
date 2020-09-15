export const PORT = 5000;
export const BASE_URL = "/api";
export const GLOBAL_SOCKET_NAMESPACE = "/ts-socket"; 
// Change the PORT_EXT to either empty string on deployment
export const PORT_EXT = ``;
export const SOCKET_URI = `http://` + window.location.hostname + PORT_EXT + GLOBAL_SOCKET_NAMESPACE;
