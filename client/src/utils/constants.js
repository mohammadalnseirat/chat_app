export const HOST_URL = import.meta.env.VITE_SERVER_URL;

// Route here:
export const AUTH_ROUTE = "api/v1/auth";
export const SIGN_UP_ROUTE = `${AUTH_ROUTE}/sign-up`;
export const SIGN_IN_ROUTE = `${AUTH_ROUTE}/sign-in`;
export const SIGN_OUT_ROUTE = `${AUTH_ROUTE}/log-out`;
export const GET_USER_INFO = `${AUTH_ROUTE}/get-user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTE}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/upload-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/remove-profile-image`;

export const CONTACTS_ROUTE = "api/v1/contacts";
export const SEARCH_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/search-contacts`;
export const GET_CONTACTS_DM_ROUTE = `${CONTACTS_ROUTE}/get-contacts-dm`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/get-all-contacts`;

export const MESSAGE_ROUTE = "api/v1/messages";
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGE_ROUTE}/get-all-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGE_ROUTE}/upload-file`;
