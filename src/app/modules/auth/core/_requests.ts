import axios from 'axios'
import { AuthModel, UserModel } from './_models'

const API_URL: any = process.env.REACT_APP_API_URL


export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/admin/verify_token`
export const ADMIN_LOGIN_URL = `${API_URL}/admin/login`
export const USER_LOGIN_URL = `${API_URL}/login`
export const VERIFY_OTP_URL = `${API_URL}/verify-otp`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/admin/forgot-password`
export const CHANGE_PASSWORD_URL = `${API_URL}/admin/change-password`
export const QUESTIONNAIRE_URL = `${API_URL}/admin/questions`
export const GET_CAMPAIGNS = `${API_URL}/admin/campaigns`
export const DELETE_QUESTIONS = `${API_URL}/admin/questions`
export const GET_CAMPAIGNS_USERS = `${API_URL}/admin`
export const GET_USER_CAMPAIGN_DETAILS = `${API_URL}/campaigns`
export const UPLOAD = `${API_URL}/admin/upload`

const token = localStorage.getItem('token');

const header = { headers: { "Authorization": `${token}` } };


// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post(ADMIN_LOGIN_URL, {
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
export function requestPassword(email: string, new_password: string) {
  return axios.post(REQUEST_PASSWORD_URL, {
    email,
    new_password
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

export const setUserType = (type) => {
  return localStorage.setItem('role', type)
}

export const removeUserType = () => {
  return localStorage.removeItem('role')
}

export const getUserType = () => {
  return localStorage.getItem('role')
}


export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  })
}


export async function getRequest() {
  const { data } = await axios.get(API_URL)
  return data
}

export function changePassword(payload) {
  return axios.post(CHANGE_PASSWORD_URL, payload, header)
}



export async function postRequest(payload) {
  const { data } = await axios.post(API_URL, payload, header)
  return data
}

export async function putQuestionnaire(id, payload) {
  return axios.put(QUESTIONNAIRE_URL + '/' + id, payload, header)
}


export async function postQuestionnaire(payload) {
  return axios.post(QUESTIONNAIRE_URL, payload, header)
}


export async function putCampaign(payload, id) {
  return axios.put(GET_CAMPAIGNS + '/' + id, payload, header)
}



export async function getCampaigns() {
  return axios.get(GET_CAMPAIGNS, header)
}


export async function postCampaign(payload) {
  return axios.post(GET_CAMPAIGNS, payload, header)
}

export async function deleteQuestionnaire(id) {
  return axios.delete(DELETE_QUESTIONS + '/' + id, header)
}

export async function deleteCampaignRequest(id) {
  return axios.delete(GET_CAMPAIGNS + '/' + id, header)
}


export async function getUploadUrl(fileObj) {
  return axios.post(UPLOAD, fileObj, header)
}

export async function uploadFile(url, fileObj) {
  // return axios.put(url, fileObj)
  return fetch(url, {
    method: 'PUT',
    body: fileObj,
  })
}

export async function getQuestionnaire() {
  return axios.get(QUESTIONNAIRE_URL, header)
}

export async function getCampaignUsers(id) {
  return axios.get(GET_CAMPAIGNS_USERS + '/campaigns/' + id + '/users', header)
}



export async function getCampaignClickedUsers(id) {
  return axios.get(GET_CAMPAIGNS_USERS + '/campaigns/' + id + '/users?clicks=1', header)
}

export async function generateWinner(id) {
  return axios.patch(GET_CAMPAIGNS_USERS + '/campaigns/' + id + '/generate-winner')
}


export async function getTotalUsers(type) {
  return axios.get(`${GET_CAMPAIGNS_USERS}/users?${type}`, header)
}





// user login


export function userLogin(mobile_no: string, country_code: string, first_name: string, last_name: string) {
  return axios.post(USER_LOGIN_URL, {
    mobile_no,
    country_code,
    first_name,
    last_name
  })
}


export function verifyOtp(payload) {
  return axios.post(VERIFY_OTP_URL, payload)
}

export async function getUserCampaignDetailsRequest(id) {
  return axios.get(GET_USER_CAMPAIGN_DETAILS + '/' + id, header)
}


export async function getQuestion(id) {
  return axios.get(API_URL + '/campaigns/' + id + '/questions', header)
}


export async function submitAnswer(payload, id) {
  return axios.post(API_URL + '/campaigns/' + id + '/submitdetail', payload, header)
}


export async function updateCount(id, payload) {
  return fetch(API_URL + '/campaigns/' + id, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}



