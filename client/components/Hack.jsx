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
    // fetch('api/like', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({username: loggedInUser, hackId: hacks.id}),
    // })
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
  };

  // allows deleting of cards
  const deleteHack = () => {
    const loggedInUser = document.getElementById('username-display')?.innerText;
    if (!loggedInUser) return;

    if (loggedInUser !== hack.username) {
      return 'Error, you did not create this hack';
    } else {
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
      <button id='dislike' onClick={dislike} className='voteBtn'>
        Dislike
      </button>
      <span>{dislikesState}</span>
    </div>
  );
};

export default Hack;
