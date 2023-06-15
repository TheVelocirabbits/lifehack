import React, { useState } from 'react';

const Hack = ({ hacks }) => {
  const { content, username, likes, dislikes } = hacks;

  // save states for likes and dislikes
  const [likesState, setLikesState] = useState(likes);
  const [dislikesState, setDislikesState] = useState(likes);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  // function to handle like clicks
  const like = () => {
    const loggedInUser = document.getElementById('username-display')?.innerText;
    if (!loggedInUser) return;

    if (!liked) {
      setLikesState(likesState + 1);
      setLiked(true);
    }
    if (disliked) {
      setDislikesState(dislikesState - 1);
      setDisliked(false);
    }
    console.log(hacks.id);
    // send info to server
    fetch('api/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loggedInUser, hackId: hacks.id }),
    });
  };

  // function to handle dislike clicks
  const dislike = () => {
    const loggedInUser = document.getElementById('username-display')?.innerText;
    if (!loggedInUser) return;

    if (!disliked) {
      setDislikesState(dislikesState + 1);
      setDisliked(true);
    }
    if (liked) {
      setLikesState(likesState - 1);
      setLiked(false);
    }
    // send info to server
    fetch('api/dislike', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loggedInUser, hackId: hacks.id }),
    });
  };

  // allows deleting of cards
  const deleteHack = async () => {
    // const hack = document.getElementsByClassName('aHack')
    const loggedInUser = document.getElementById('username-display')?.innerText;
    if (!loggedInUser) return alert('Please Log-In to delete hacks');

    if (loggedInUser !== hacks.username) {
      console.log(hacks._id);
      return alert('You did not create this hack.');
    } else {
      console.log(hacks.id);
      const response = await fetch(`/api/deleteHack`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: hacks.id }),
      });
      console.log(response);
    }
  };

  // creates individual hack boxes
  return (
    <div className='aHack'>
      <h2>
        <p>{content}</p>
      </h2>
      <br />
      <p>
        Submitted by : <span className='username-hack'>{username}</span>
      </p>
      <button id='like' onClick={like} className='voteBtn'>
        Like
      </button>
      <span>{likesState}</span>
      <button className='button' id='dislike' onClick={dislike} className='voteBtn'>
        Dislike
      </button>
      <span>{dislikesState}</span>
      <div className='deleteHackContainer'>
        <button className='deleteHack' onClick={deleteHack}>
          Delete Hack
        </button>
      </div>
    </div>
  );
};

export default Hack;
