import Actions from '../actions';
import _ from 'lodash';

const initialState = {
  notifications: []
};

export default (state = initialState, action) => {
  switch(action.type) {
    case Actions.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.notification],
      };
    case Actions.DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: _.without(state.notifications, action.notification)
      }
    default:
      return state;
  }
}
