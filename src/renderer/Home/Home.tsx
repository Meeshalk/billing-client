import React from 'react';
import { LogoutPayload } from '../Types/DataTypes';
import AuthContext from '../Context/AuthContext';

function Home() {
  const { dispatch, state } = React.useContext(AuthContext);
  const initialLogoutState: LogoutPayload = {
    user: state.user,
  };

  const handleLogout = (event) => {
    event.preventDefault();

    dispatch({
      type: 'logout',
      payload: initialLogoutState,
    });
  };

  return (
    <div>
      Home
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Home;
