import Actions from '../actions';
import _ from 'lodash';

const initialState = {
  queue: [],
};

export default (state = initialState, action) => {
  switch(action.type) {
    case Actions.UPDATE_IN_QUEUE:
      return {
        ...state,
        queue: replaceTaskInArray(action.originalTask, action.newTask),
      }
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

function replaceTaskInArray(array, originalTask, newTask) {
  return array.map( (item) => {
    if(item !== originalTask) {
      return newTask;
    }

    return originalTask;
  });
}
