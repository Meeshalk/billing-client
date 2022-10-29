import { URL } from 'url';
import path from 'path';
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

const defaultHeaders: AxiosRequestHeaders = {
  Authorization: '',
  Accept: 'application/json',
  'Content-Type': 'multipart/form-data',
};

const axiosConfig: AxiosRequestConfig = {
  url: '/login',
  headers: defaultHeaders,
  method: 'post',
  data: {},
  baseURL: 'http://billing-server-app.test/api/',
  // httpAgent: 'billing-client-electron-version',
  // httpsAgent: 'billing-client-electron-version-secure',
};

async function getAuthBearer() {
  const token = localStorage.getItem('token');

  if (token?.length !== undefined && token?.length > 5) {
    return `Bearer ${token}`;
  }

  return false;
}

export async function makeRequest(data, url, method = 'get') {
  if (url !== 'login') {
    const token = await getAuthBearer();
    axiosConfig.headers.Authorization = token || '';
  }

  if (data != null) {
    if (method === 'get') {
      axiosConfig.headers['Content-Type'] = 'application/json';
    }

    if (method === 'post') {
      axiosConfig.headers['Content-Type'] = 'multipart/form-data';
    }

    if (method === 'put') {
      axiosConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  }

  axiosConfig.data = data;
  axiosConfig.method = method;
  axiosConfig.url = url;

  let response = null;
  try {
    response = await axios(axiosConfig);
    response = response.data;
  } catch (error) {
    response = error.response.data;
  }

  return response;
}

export async function login(username, password, deviceName) {
  const data = {
    username,
    password,
    device_name: deviceName,
  };
  try {
    return await makeRequest(data, 'login', 'post');
  } catch (error) {
    return false;
  }
}
