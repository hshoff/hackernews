import React from 'react';

const StoriesPlacerholder = props => {
  return (
    <div className="Stories">
      <ol>
        {"a".repeat(30).split('').map((a, i) => {
          return (
            <li className="Story__placeholder" key={i}>
              <div className="Story__placeholderTitle" style={{ width: Math.random() * 300 + 350}}/>
              <div className="Story__placeholderDetails" style={{ width: Math.random() * 300 + 350}}/>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default StoriesPlacerholder;