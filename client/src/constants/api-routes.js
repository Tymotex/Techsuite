export const PORT = 5000;

// Change back to "/api" on deployment. Change IP address between
// http://localhost:5000/api and https://techsuite.dev/api on dev/deployment
// export const BASE_URL = "https://techsuite.dev/api";
export const BASE_URL = process.env.NODE_ENV === 'production' ? "https://techsuite.dev/api" : "http://localhost:5000/api";

export const GLOBAL_SOCKET_NAMESPACE = "/ts-socket";
export const PORT_EXT = `:${PORT}`;   // Change back to empty string on deployment

// Change from: http:// window.location.hostname + PORT_EXT + GLOBAL_SOCKET_NAMESPACE
//        to:   https://techsuite.dev` + GLOBAL_SOCKET_NAMESPACE
// export const SOCKET_URI = `http://` + window.location.hostname + PORT_EXT + GLOBAL_SOCKET_NAMESPACE;
export const SOCKET_URI = process.env.NODE_ENV === 'production' ?
    `https://techsuite.dev` + GLOBAL_SOCKET_NAMESPACE
    : `http://` + window.location.hostname + PORT_EXT + GLOBAL_SOCKET_NAMESPACE;
