/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
import { LoginFormState } from '../Types/DataTypes';
import AuthContext from '../Context/AuthContext';
import logo from '../../assets/spinner.svg';

function convertErrorsToArray(errors): string[] {
  if (typeof errors === 'string') {
    return [errors];
  }
  return Object.values(errors);
}

const Login = () => {
  const initialLoginState: LoginFormState = {
    email: '',
    password: '',
    device_name: '',
    isSubmitting: false,
    errorMessage: [],
  };

  const { dispatch } = React.useContext(AuthContext);
  const [loginFormData, setLoginFormData] = React.useState(initialLoginState);
  const [deviceList, setDeviceList] = React.useState([]);

  const getAllDevices = async () => {
    const response = await window['billing-app'].ipcRenderer.invoke(
      'get-devices',
      []
    );

    if (response.status === 'error') {
      // log
    }

    if (response.status === 'success') {
      setDeviceList([response.data[0]]);
    }
  };

  useEffect(() => {
    getAllDevices();
  }, []);

  const handleInputChange = (event) => {
    setLoginFormData({
      ...loginFormData,
      [event.target.name]: event.target.value,
      device_name: deviceList[0].name,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    let errors = [];
    let isSubmitting = true;
    setLoginFormData({
      ...loginFormData,
      isSubmitting,
      errorMessage: errors,
    });

    const data = await window['billing-app'].ipcRenderer.invoke(
      'login',
      loginFormData
    );

    if (data.status === 'error') {
      errors = convertErrorsToArray(JSON.parse(data.message));
      isSubmitting = false;
    }

    if (data.status === 'success') {
      dispatch({
        type: 'login',
        payload: {
          user: data.data.user,
          token: data.data.access_token,
        },
      });
    }

    setLoginFormData({
      ...loginFormData,
      isSubmitting,
      errorMessage: errors,
    });
  };

  return (
    <>
      <div className="login-container">
        <div className="card">
          <div className="container">
            <form onSubmit={handleFormSubmit}>
              <h1>Quick Billing App</h1>
              <h2>Login</h2>

              <input
                type="text"
                name="email"
                value={loginFormData.email}
                onChange={handleInputChange}
                id="email"
                placeholder="Enter Username"
              />

              <input
                type="password"
                name="password"
                value={loginFormData.password}
                onChange={handleInputChange}
                id="password"
                placeholder="Enter Password"
              />

              <select
                name="device_name"
                id="device_name"
                defaultValue="Select Device"
                style={{ display: 'none' }}
                onChange={handleInputChange}
              >
                <option disabled>Select Device</option>

                {deviceList.length > 0 &&
                  deviceList.map((device, index) => (
                    <option key={index} value={device.name}>
                      {device.name}
                    </option>
                  ))}
              </select>

              <div id="loginSubmit" className="formButtons">
                <button type="submit" disabled={loginFormData.isSubmitting}>
                  {loginFormData.isSubmitting ? (
                    <img className="spinner" src={logo} alt="loading icon" />
                  ) : (
                    'Login'
                  )}
                </button>
              </div>

              {loginFormData.errorMessage.length > 0 && (
                <div className="form-error">
                  <p style={{ textAlign: 'center' }}>Input Errors</p>
                  <ul>
                    {loginFormData.errorMessage.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
