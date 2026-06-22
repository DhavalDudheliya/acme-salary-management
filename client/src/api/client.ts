import axios from 'axios'

/** Shared Axios instance. Base URL comes from env, defaulting to the local API. */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
})

export const API_BASE_URL = apiClient.defaults.baseURL as string
