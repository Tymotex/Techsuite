export const PORT = 9002;

// Change back to "/api" on deployment. Change IP address between
// http://localhost:9002/api and https://techsuite.timz.dev/api on dev/deployment
// export const BASE_URL = "https://techsuite.timz.dev/api";
// export const BASE_URL = `http://localhost:${PORT}/api`;
export const BASE_URL = process.env.REACT_APP_ENVIRONMENT === 'production' ? "https://techsuite.timz.dev/api" : `http://localhost:${PORT}/api`;

export const GLOBAL_SOCKET_NAMESPACE = "/ts-socket";
export const PORT_EXT = `:${PORT}`;   // Change back to empty string on deployment

// Change from: http:// window.location.hostname + PORT_EXT + GLOBAL_SOCKET_NAMESPACE
//        to:   https://techsuite.timz.dev` + GLOBAL_SOCKET_NAMESPACE
// export const SOCKET_URI = `http://` + window.location.hostname + PORT_EXT + GLOBAL_SOCKET_NAMESPACE;
export const SOCKET_URI = process.env.REACT_APP_ENVIRONMENT === 'production'
    ? `https://techsuite.timz.dev` + GLOBAL_SOCKET_NAMESPACE
    : `http://` + window.location.hostname + PORT_EXT + GLOBAL_SOCKET_NAMESPACE;
