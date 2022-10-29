/* eslint-disable react/no-array-index-key */
import React from 'react';
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
  const { dispatch } = React.useContext(AuthContext);
  const initialLoginFormState: LoginFormState = {
    email: '',
    password: '',
    device_name: '',
    isSubmitting: false,
    errorMessage: [],
  };

  const [loginFormData, setLoginFormData] = React.useState(
    initialLoginFormState
  );

  const handleInputChange = (event) => {
    setLoginFormData({
      ...loginFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoginFormData({
      ...loginFormData,
      isSubmitting: true,
      errorMessage: [],
    });

    const data = await window['billing-app'].ipcRenderer.invoke(
      'login',
      loginFormData
    );

    if (data.status === 'error') {
      const messages = convertErrorsToArray(data.message);
      setLoginFormData({
        ...loginFormData,
        isSubmitting: false,
        errorMessage: messages,
      });
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
      isSubmitting: false,
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
                onChange={handleInputChange}
              >
                <option disabled>Select Device</option>
                <option>Device 1</option>
              </select>

              {loginFormData.errorMessage.length > 0 && (
                <span className="form-error">
                  <p>Errors:</p>
                  <ul>
                    {loginFormData.errorMessage.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </span>
              )}

              <div id="loginSubmit" className="formButtons">
                <button type="submit" disabled={loginFormData.isSubmitting}>
                  {loginFormData.isSubmitting ? (
                    <img className="spinner" src={logo} alt="loading icon" />
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
