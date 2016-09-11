import React, { Component } from 'react';
import './App.css';

/**
 *  Actions
 */
import { createAction } from 'redux-actions';

const SELECT_SECTION = 'SELECT_SECTION';
function selectSection(section) {
  return {
    type: SELECT_SECTION,
    payload: {
      section,
    }
  }
}

const INVALIDATE_SECTION = 'INVALIDATE_SECTION';
function invalidateSection(section) {
  return {
    type: INVALIDATE_SECTION,
    payload: {
      section,
    }
  }
}

const REQUEST_STORIES = 'REQUEST_STORIES';
function requestStories(section) {
  return {
    type: REQUEST_STORIES,
    payload: {
      section,
    }
  }
}

const RECEIVE_STORIES = 'RECEIVE_STORIES';
function receiveStories(section, json) {
  return {
    type: RECEIVE_STORIES,
    payload: {
      section,
      stories: json
    }
  }
}

function fetchStories(section) {
  return dispatch => {
    dispatch(requestStories(section));
    return fetch(`https://hacker-news.firebaseio.com/v0/${section}`)
      .then(response => response.json())
      .then(json => dispatch(receiveStories(section, json)));
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

function fetchStoriesIfNeeded(section) {
  return (dispatch, getState) => {
    if (shouldFetchStories(getState(), section)) {
      return dispatch(fetchStories(section));
    }
  }
}


/**
 * Reducers
 */
import { combineReducers } from 'redux';

function selectedSection(state = 'topstories', action) {
  switch (action.type) {
    case SELECT_SECTION:
      return action.payload.section;
    default:
      return state;
  }
}

function stories(
  state = {
    isFetching: false,
    didInvalidate: false,
    items: []
  },
  action
) {
  switch(action.type) {
    case INVALIDATE_SECTION:
      return Object.assign({}, state, {
        didInvalidate: true,
      });
    case REQUEST_STORIES:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
      });
    case RECEIVE_STORIES:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.payload.stories,
      });
    default:
      return state;
  }
}

function storiesBySection(state = {}, action) {
  switch(action.type) {
    case INVALIDATE_SECTION:
    case RECEIVE_STORIES:
    case REQUEST_STORIES:
      return Object.assign({}, state, {
        [action.payload.section]: stories(
          state[action.payload.section],
          action
        ),
      })
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  storiesBySection,
  selectedSection,
});

/**
 * Store
 */
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

const loggerMiddleware = createLogger();

function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  );
}

const store = configureStore();


/**
 * View
 */
import { Provider } from 'react-redux';

class App extends Component {
  render() {
    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
