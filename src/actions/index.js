
export const SELECT_SECTION = 'SELECT_SECTION';
export function selectSection(section) {
  return {
    type: SELECT_SECTION,
    payload: {
      section,
    }
  }
}

export const INVALIDATE_SECTION = 'INVALIDATE_SECTION';
export function invalidateSection(section) {
  return {
    type: INVALIDATE_SECTION,
    payload: {
      section,
    }
  }
}

export const REQUEST_STORIES = 'REQUEST_STORIES';
export function requestStories(section) {
  return {
    type: REQUEST_STORIES,
    payload: {
      section,
    }
  }
}

export const RECEIVE_STORIES = 'RECEIVE_STORIES';
export function receiveStories(section, json) {
  return {
    type: RECEIVE_STORIES,
    payload: {
      section,
      stories: json
    }
  }
}

export function fetchStories(section) {
  return dispatch => {
    dispatch(requestStories(section));
    return fetch(`https://hacker-news.firebaseio.com/v0/${section}.json`)
      .then(response => response.json())
      .then(ids => {
        const stories = ids.slice(0,30).map(id => (
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
            .then(response => response.json())
        );
        Promise.all(stories)
          .then(data => dispatch(receiveStories(section, data)))
      });
  }
}

function shouldFetchStories(state, section) {
  const stories = state.storiesBySection[section];
  if (!stories) {
    return true;
  } else if (stories.isFetching) {
    return false;
  } else {
    return stories.didInvalidate;
  }
}

export function fetchStoriesIfNeeded(section) {
  return (dispatch, getState) => {
    if (shouldFetchStories(getState(), section)) {
      return dispatch(fetchStories(section));
    }
  }
}