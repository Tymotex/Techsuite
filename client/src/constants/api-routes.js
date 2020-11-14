export const PORT = 5000;
export const BASE_URL = "https://techsuite.dev/api";  // Change back to "/api" on deployment. Change IP address between http://localhost:5000/api and https://techsuite.dev/api on dev/deployment
export const GLOBAL_SOCKET_NAMESPACE = "/ts-socket";
export const PORT_EXT = `:` + PORT;   // Change back to empty string on deployment
export const SOCKET_URI = `http://` + window.location.hostname + PORT_EXT + GLOBAL_SOCKET_NAMESPACE;
