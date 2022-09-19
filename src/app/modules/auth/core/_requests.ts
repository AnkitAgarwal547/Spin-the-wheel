import axios from 'axios'
import { AuthModel, UserModel } from './_models'

const API_URL = process.env.REACT_APP_API_URL
const baseUrl = "https://jsonplaceholder.typicode.com/users";

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`
export const LOGIN_URL = `${API_URL}/login`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot-password`
export const CHANGE_PASSWORD_URL = `${API_URL}/change-password`
export const QUESTIONNAIRE_URL = `${API_URL}/questions`
export const GET_CAMPAIGNS = `${API_URL}/campaigns`
export const UPLOAD = `${API_URL}/upload`

const token = localStorage.getItem('token');

const header = { headers: { "Authorization": `${token}` } };


// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post(LOGIN_URL, {
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

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
  }
}

export const removeToken = () => {
  localStorage.removeItem('token')
}

export const getToken = () => {
  return localStorage.getItem('token')
}



export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  })
}


export async function getRequest() {
  const { data } = await axios.get(baseUrl)
  return data
}

export function changePassword(payload) {

  return axios.post(CHANGE_PASSWORD_URL, payload, header)
}



export async function postRequest(payload) {
  const { data } = await axios.post(baseUrl, payload, header)
  return data
}

export async function putQuestionnaire(id, payload) {
  return axios.put(QUESTIONNAIRE_URL + '/' + id, payload, header)
}


export async function postQuestionnaire(payload) {
  return axios.post(QUESTIONNAIRE_URL, payload, header)
}


export async function deleteQuestionnaire(id) {
  return axios.delete(QUESTIONNAIRE_URL + '/' + id, header)
}

export async function getCampaigns() {
  return axios.get(GET_CAMPAIGNS, header)
}


export async function postCampaign(payload) {
  return axios.post(GET_CAMPAIGNS, payload, header)
}

export async function deleteCampaignRequest(id) {
  return axios.delete(GET_CAMPAIGNS + '/' + id, header)
}

export async function getUploadUrl(fileObj) {
  return axios.post(UPLOAD, fileObj, header)
}

export async function uploadFile(url, fileObj) {
  return axios.put(url, fileObj)
}

export async function getQuestionnaire() {
  return axios.get(QUESTIONNAIRE_URL, header)
}
