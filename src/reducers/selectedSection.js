import { SELECT_SECTION } from '../actions';

function selectedSection(state = 'topstories', action) {
  switch (action.type) {
    case SELECT_SECTION:
      return action.payload.section;
    default:
      return state;
  }
}

export default selectedSection;
