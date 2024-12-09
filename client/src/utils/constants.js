export const HOST_URL = import.meta.env.VITE_SERVER_URL;

// Route here:
export const AUTH_ROUTE = "api/v1/auth";
export const SIGN_UP_ROUTE = `${AUTH_ROUTE}/sign-up`;
export const SIGN_IN_ROUTE = `${AUTH_ROUTE}/sign-in`;
export const GET_USER_INFO = `${AUTH_ROUTE}/get-user-info`