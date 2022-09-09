import axios from 'axios'
import { AuthModel, UserModel } from './_models'

const API_URL = process.env.REACT_APP_API_URL
const baseUrl = "https://jsonplaceholder.typicode.com/users";

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`
export const LOGIN_URL = `${API_URL}/login`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`
export const NEW_CAMPAIGN = `${API_URL}/forgot_password`

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password,
  })
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  })
}


export async function getRequest() {
  // const header = { headers: { "Authorization": `Bearer ${token}` } };
  const { data } = await axios.get(baseUrl)
  return data
}



export async function postRequest(payload) {
  // const header = { headers: { "Authorization": `Bearer ${token}` } };
  const { data } = await axios.post(baseUrl, payload)
  console.log("🚀 ~ file: _requests.ts ~ line 63 ~ postRequest ~ data", data)
  return data
}
