import React from 'react';
import { LogoutPayload } from '../Types/DataTypes';
import AuthContext from '../Context/AuthContext';

function Home() {
  const { dispatch, state } = React.useContext(AuthContext);
  const initialLogoutState: LogoutPayload = {
    user: state.user,
  };

  const initRequestState = {
    token: state.token,
  };

  const handleLogout = async (event) => {
    event.preventDefault();

    const logout = await window['billing-app'].ipcRenderer.invoke(
      'logout',
      initRequestState
    );

    if (logout.status === 'success') {
      dispatch({
        type: 'logout',
        payload: initialLogoutState,
      });
    }
  };

  const handleNewBill = (event) => {
    event.preventDefault();

    console.log('new bill');
  };

  return (
    <div className="home-container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
          backgroundColor: '#008b8b30',
        }}
      >
        <div style={{ flexGrow: 3 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              opacity: 0.6,
              fontSize: '1rem',
            }}
          >
            <span>Employee: {state.user.name}</span>
            <span>Device: {state.user.username}</span>
            <span>Invoice ID: 9837234876876329</span>
          </div>
        </div>
        <div
          style={{
            flexGrow: 2,
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <button
            type="button"
            className="link-like-button"
            onClick={handleNewBill}
          >
            New Bill
          </button>
          <button
            type="button"
            className="link-like-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <form style={{ padding: '10px' }}>
        <input style={{ flexGrow: 1 }} type="text" placeholder="Item Name" />
        <input type="number" placeholder="Quantity" />
        <input type="number" placeholder="Price" />
        <input type="submit" value="Add Item" />
      </form>
    </div>
  );
}

export default Home;
