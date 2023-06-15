import React from 'react';
import { Routes, Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Login from './components/Login';
import HackCreator from './components/HackCreator';
import MainDisplay from './components/MainDisplay';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { set } from 'lodash';

const App = () => {
  const [user, setUser] = useState({});
  const [newHack, setNewHack] = useState();
  const [category, setCategory] = useState('Codesmith');
  //successful login function

  function tempAlert(msg, duration) {
    let el = document.createElement('div');
    el.setAttribute(
      'style',
      'position:absolute;top:15%;left:45%;color:white; background-color:rgb(88, 101, 242);width:10em; height: 1.5em; display: flex; justify-content:center; align-items:center; border-radius: 5px; '
    );
    el.innerHTML = msg;
    setTimeout(function () {
      el.parentNode.removeChild(el);
    }, duration);
    document.body.appendChild(el);
  }

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
    console.log(document.getElementById('signInDiv'));
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
    const usernameInput = document.getElementById('login-account-input');
    const passwordInput = document.getElementById('login-account-password');
    console.log(usernameInput.value, passwordInput.value);
    const fetchProps = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: usernameInput.value, password: passwordInput.value }),
    };
    // const newUser = await fetch('/api/user', fetchProps).then((ans) => ans.json());
    const newUser = await fetch('/api/user', fetchProps);
    const complete = await newUser.json();
    setUser(complete[0]);

    // console.log('user: ', userData);
    // console.log('user state: ', user);
    usernameInput.value = '';
    passwordInput.value = '';
    document.getElementById('signInDiv').hidden = true;
  }

  async function loginUser(e) {
    e.preventDefault();
    // send data to server then update page
    const usernameInput = document.getElementById('login-account-input');
    const passwordInput = document.getElementById('login-account-password');
    // const response = await fetch(`/api/user/${usernameInput.value}`);
    const response = await fetch(`/api/userlogin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: usernameInput.value, password: passwordInput.value }),
    });
    const user = await response.json();
    if (user.authentication !== true) {
      return alert('Incorrect username or password. Please try again.');
    }
    tempAlert('Login Successful...', 4000);
    setUser(user);
    usernameInput.value = '';
    passwordInput.value = '';
    document.getElementById('signInDiv').hidden = true;
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
      <div id='signInDiv'></div>
      <h3 id='username-display'>{user.username}</h3>

      {/* if user signed in render sign out & change display name*/}
      {Object.keys(user).length !== 0 && (
        <>
          <button className='button' id='signOutBttn' onClick={(e) => handleSignOut(e)}>
            Sign Out
          </button>
        </>
      )}

      {/* if user signed in render sign out & change display name*/}
      {user && (
        <div>
          <img src={user.picture} />
          {/* <h3>{user.username}</h3> */}
        </div>
      )}
      {/* render login, switch seems useless here */}
      {!Object.keys(user).length && <Login makeUser={makeUser} loginUser={loginUser} />}
      {/* render main display and hack creator */}
      <HackCreator
        user={user}
        newHack={newHack}
        setNewHack={setNewHack}
        category={category}
        setCategory={setCategory}
      />
      <MainDisplay className='hack-items-container' newHack={newHack} category={category} setCategory={setCategory} />
    </>
  );
};

export default App;
