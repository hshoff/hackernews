import { combineReducers } from 'redux';
import storiesBySection from './storiesBySection';
import selectedSection from './selectedSection';

const rootReducer = combineReducers({
  storiesBySection,
  selectedSection,
});

export default rootReducer;
