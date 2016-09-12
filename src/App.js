import React, { Component } from 'react';
import cx from 'classnames';
import './App.css';

/**
 *  Actions
 */
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
 * Components
 */
import { connect } from 'react-redux';

const Picker = props => {
  const { value, onChange, options } = props;
  return (
    <span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(option => 
          <option value={option} key={option}>
            {option}
          </option>
        )}
      </select>
    </span>
  );
}

const Stories = props => {
  const { stories } = props;
  return (
    <ol>
      {stories.map((story, i) =>
        <li className="Story" key={i}>
          <a href={story.url}>
            {story.title} {story.type === 'story' && !!story.url &&
              <small>({story.url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]})</small>
            }
          </a>
          <div className="Story__details">
            {story.score} points&nbsp;
            by {story.by}&nbsp;&bull;&nbsp;
            {story.descendants} comments
          </div>
        </li>
      )}
    </ol>
  );
};

const Nav = props => {
  const { value, onChange, options } = props;
  return (
    <nav className="Nav">
      <div className="Brand">
        HackerNews
      </div>
      {options.map(option => {
        const classes = cx({
          'NavItem--selected': option === value,
        }, "NavItem");
        return (
          <div key={option}  className={classes} onClick={e => onChange(option)}>
          {option.replace('stories', '')}
          </div>
        );
      })} 
    </nav>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedSection } = this.props;
    dispatch(fetchStoriesIfNeeded(selectedSection));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedSection !== this.props.selectedSection) {
      const { dispatch, selectedSection } = nextProps;
      dispatch(fetchStoriesIfNeeded(selectedSection));
    }
  }

  handleChange(nextSection) {
    const { dispatch } = this.props;
    dispatch(selectSection(nextSection));
  }

  render() {
    const { selectedSection, stories, isFetching } = this.props;
    return (
      <div className="App">
        <Nav
          value={selectedSection}
          options={[
            'topstories',
            'newstories',
            'beststories'
          ]}
          onChange={this.handleChange}
        />
        {isFetching && stories.length === 0 &&
          <h2>Loading...</h2>
        }
        {!isFetching && stories.length === 0 &&
          <h2>Empty</h2>
        }
        {stories.length > 0 &&
          <div className="Stories" style={{ opacity: isFetching ? 0.5 : 1}}>
            <Stories stories={stories} />
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { selectedSection, storiesBySection } = state;
  const {
    isFetching,
    items: stories
  } = storiesBySection[selectedSection] || {
    isFetching: true,
    items: []
  };
  return {
    selectedSection,
    stories,
    isFetching
  };
}

const AppContainer = connect(mapStateToProps)(App);

/**
 * Containers
 */
import { Provider } from 'react-redux';

class Root extends Component {
  render () {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

export default Root;
