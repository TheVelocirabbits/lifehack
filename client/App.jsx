import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Login from './components/Login';
import HackCreator from './components/HackCreator';
import MainDisplay from './components/MainDisplay';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { set } from 'lodash';

const App = () => {
  const [user, setUser] = useState({});

  // FOR GOOGLE OAUTH
  async function handleCallbackResponse(response) {
    const userObject = jwtDecode(response.credential);
    const googlename = userObject.name;
    let googleuser;
    // Check if the user exisits in the users table, he they do, set them to the current user
    googleuser = await fetch(`api/user/${googlename}`);
    const checkIfUserExists = await googleuser.json();
    if (checkIfUserExists.length > 0) {
      document.getElementById('signInDiv').hidden = true;
      setUser(checkIfUserExists[0]);
    }
    // Create a new user and set them to the current user
    else {
      const fetchProps = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: googlename }),
      };
      const responseFromCreatingUser = await fetch(`api/user/`, fetchProps);
      googleuser = await responseFromCreatingUser.json();
      document.getElementById('signInDiv').hidden = true;
      setUser(googleuser[0]);
    }
  }
  function handleSignOut(event) {
    setUser({});
    document.getElementById('signInDiv').hidden = false;
  }
  useEffect(() => {
    // These google objects came from a script tag which can be found in index.html
    /* global google */
    google.accounts.id.initialize({
      client_id: '745677008135-28koou137ibajp5jnjalltuu1slpbsde.apps.googleusercontent.com',
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById('signInDiv'), { theme: 'outline', size: 'large' });
    google.accounts.id.prompt();
  }, []);
  // END GOOGLE OAUTH

  async function makeUser(e) {
    e.preventDefault();
    const input = document.getElementById('login-account-input');
    console.log('input name is', input)
    const inputPassword = document.getElementById('login-account-password');
    console.log('inputPassword is', inputPassword);
    const name = input.value;
    console.log('name is', name);
    const password = inputPassword.value;
    console.log('password is', password);
    const fetchProps = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    };
    console.log('name/password: ', name, password);
    const newUser = await fetch('/api/user', fetchProps).then((ans) => ans.json());
    setUser(newUser[0]);
    input.value = '';
  }

  //i think ur right, i think that works :))
  // ok yaaay!
  // idk how to test

  async function loginUser(e) {
    e.preventDefault();
    const input = document.getElementById('login-account-input');
    const response = await fetch(`/api/user/${input.value}`);
    const user = await response.json();
    setUser(user[0]);
    input.value = '';
  }

  async function changeDisplayName(e) {
    console.log('clicked displayname');
    e.preventDefault();
    const input = document.getElementById('change-displayname');
    // console.log(input.value);
    const displayName = input.value;
    const fetchProps = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, newUsername: displayName }),
    };
    const response = await fetch(`/api/user/`, fetchProps);
    const displayNameAfter = await response.json();
    console.log('Changed user: ', displayNameAfter[0]);
    setUser(displayNameAfter[0]);
    input.value = '';
  }

  return (
    <>
      <Router>
        {/* if user render sign in div */}

        {!Object.keys(user).length && (
          <>
            <div id='signInDiv'></div>
          </>
        )}
        {/* if user signed in render sign out & change display name*/}
        {Object.keys(user).length !== 0 && (
          <>
            <h3>{user.username}</h3>
            <button id='signOutBttn' onClick={(e) => handleSignOut(e)}>
              Sign Out
            </button>
            <input id='change-displayname' />
            <button id='change-displayname-bttn' onClick={changeDisplayName}>
              Change Display Name
            </button>
          </>
        )}

        {/* if user signed in render sign out & change display name*/}
        {user && (
          <div>
            <img src={user.picture} />
            <h3>{user.name}</h3>
          </div>
        )}
        {/* render login, switch seems useless here */}
        {!Object.keys(user).length && <Login makeUser={makeUser} loginUser={loginUser} />}
        {/* render main display and hack creator */}
        <HackCreator user={user} />
        <MainDisplay className='hack-items-container' />
      </Router>
    </>
  );
};

export default App;
