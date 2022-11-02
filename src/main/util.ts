import { URL } from 'url';
import path from 'path';
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

function resolveHtmlPath(htmlFileName: string) {
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

export async function makeRequest(data, url, method = 'get', token = null) {
  if (url !== 'login' && url !== 'device') {
    if (token === null) {
      throw new Error('Access token not found');
    }
    axiosConfig.headers.Authorization = `Bearer ${token}`;
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

    if (method === 'delete') {
      axiosConfig.headers['Content-Type'] = 'multipart/form-data';
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

async function login(username, password, deviceName) {
  const data = {
    username,
    password,
    device_name: deviceName,
  };
  try {
    return await makeRequest(data, 'login', 'post');
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function logout(token: string) {
  try {
    return await makeRequest({}, 'logout', 'post', token);
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getDevices() {
  try {
    return await makeRequest({}, 'device', 'get');
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 *
 * @param token
 * @param input (?customer_address, ?customer_mobile, ?customer_name, ?payment_type)
 * @returns object
 */
async function newBill(token: string, input?: object) {
  if (typeof input === undefined) {
    input = {};
  } else {
    input = (({
      customer_address,
      customer_mobile,
      customer_name,
      payment_type,
    }) => ({
      customer_address,
      customer_mobile,
      customer_name,
      payment_type,
    }))(input);
  }

  try {
    return await makeRequest(input, 'bill', 'post', token);
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getBill(token: string, billId: string) {
  try {
    return await makeRequest({}, `bill/${billId}`, 'get', token);
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteItem(token: string, billProductId: string) {
  try {
    return await makeRequest(
      {},
      `billing/remove_product/${billProductId}`,
      'delete',
      token
    );
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 *
 * @param token
 * @param billId
 * @param productId
 * @param input (quantity, ?rate, ?name)
 * @returns object
 */
async function addProductToBill(
  token: string,
  input: object,
  billId?: string,
  productId?: string
) {
  let url = 'billing/add_product';

  if (typeof billId !== undefined) {
    url = `${url}/${billId}`;
    // if (typeof productId !== undefined) {
    //   url = `${url}/${productId}`;
    // }
  }

  input = (({ rate, name, quantity }) => ({
    rate,
    name,
    quantity,
  }))(input);

  try {
    return await makeRequest(input, url, 'post', token);
  } catch (error) {
    console.log(error);
    return false;
  }
}

export {
  resolveHtmlPath,
  getDevices,
  login,
  logout,
  newBill,
  deleteItem,
  getBill,
  addProductToBill,
};
