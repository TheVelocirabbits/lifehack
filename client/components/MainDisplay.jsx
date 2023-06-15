import React, { useState, useEffect } from 'react';
import HackCreator from './HackCreator';
import Hack from './Hack';

const MainDisplay = ({ newHack, category, setCategory }) => {
  const [hacks, setHack] = useState([]);

  // Event handler for main category dropdown //
  const handleChange = (event) => {
    console.log('category has been changed');
    event.preventDefault();

    setCategory(event.target.value);
    // console.log(event.target.value);
  };

  // GET request to SQL for specific category hacks //
  async function getHacks() {
    try {
      const response = await fetch(`/api/${category}`);
      const data = await response.json();
      // console.log(data);
      setHack(data);
    } catch (err) {
      console.log(err);
    }
  }

  // Trigger for page rerender once Category change is detected. //
  useEffect(() => {
    getHacks();
  }, [category, newHack]);

  const hackItems = [];
  for (let i = 0; i < hacks.length; i++) {
    // console.log(hacks[i]);
    hackItems.push(<Hack hacks={hacks[i]} key={i} />);
  }

  // console.log('hacks', hacks);
  // console.log('hackItems', hackItems);

  // Category Dropdown Component //
  const CategorySelector = () => {
    return (
      <>
        <label>
          <select value={category} onChange={handleChange} className='categories'>
            <optgroup label='Categories' />
            <option value='Codesmith'>CodeSmith</option>
            <option value='Time'>Time</option>
            <option value='Money'>Money</option>
          </select>
        </label>
      </>
    );
  };

  // Main Hack Display Container Component //
  return (
    <>
      <div className='categorySelector'>
        <CategorySelector />
      </div>
      <div className='hack-items-container'>{hackItems}</div>
    </>
  );
};

export default MainDisplay;
