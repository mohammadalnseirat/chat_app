import { HOST_URL } from "@/utils/constants";
import axios from "axios";


export const axiosInstance = axios.create({
    baseURL:HOST_URL,
    withCredentials: true, // This is necessary to send cookies when making requests to the backend
})