import Actions from '../actions';
import _ from 'lodash';

const initialState = {
  isConnected: false,
  queue: [],
};

export default (state = initialState, action) => {
  switch(action.type) {
    case Actions.CONNECTION_STATE:
      return {
        ...state,
        isConnected: action.isConnected,
      };
    case Actions.ADD_TO_QUEUE:
      return {
        ...state,
        queue: [...state.queue, action.request],
      }
    case Actions.REMOVE_FROM_QUEUE:
      return {
        ...state,
        queue: _.without(state.queue, action.request)
      }
    default:
      return state;
  }
}
