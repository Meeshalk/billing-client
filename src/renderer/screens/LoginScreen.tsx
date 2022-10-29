function LoginScreen() {
  return (
    <div className="login-container">
      <div className="card">
        <div className="container">
          <form>
            <h1>Quick Billing App</h1>
            <h2>Login</h2>

            <input
              type="text"
              name="email"
              id="email"
              placeholder="Enter Username"
            />

            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter Password"
            />

            <select
              name="device_name"
              id="device_name"
              defaultValue="Select Device"
            >
              <option disabled>Select Device</option>
              <option>Device 1</option>
            </select>

            <div id="loginSubmit" className="formButtons">
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
