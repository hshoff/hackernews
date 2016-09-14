import { INVALIDATE_SECTION, RECEIVE_STORIES, REQUEST_STORIES } from '../actions';

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

export default storiesBySection;
