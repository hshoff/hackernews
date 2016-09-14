import React from 'react';

const Stories = props => {
  const { stories } = props;
  return (
    <ol>
      {stories.map((story, i) =>
        <li className="Story" key={i}>
          <a href={story.url} className="StoryTitle">
            {story.title} {story.type === 'story' && !!story.url &&
              <small>({story.url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]})</small>
            }
          </a>
          <div className="Story__details">
            {story.score} points&nbsp;
            by {story.by}&nbsp;&bull;&nbsp;
            <a href={`https://news.ycombinator.com/item?id=${story.id}`} className="Comments">
              {story.descendants} comments
            </a>
          </div>
        </li>
      )}
    </ol>
  );
};

export default Stories;