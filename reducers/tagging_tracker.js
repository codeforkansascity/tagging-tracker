import Actions from '../actions';
import _ from 'lodash';

const initialState = {
  queue: [],
  taskCompletedCount: 0,
};

export default (state = initialState, action) => {
  switch(action.type) {
    case Actions.SET_TASK_COMPLETION_COUNT:
      return {
        ...state,
        taskCompletedCount: action.count,
      }
    case Actions.INCREMENT_TASK_COMPLETION_COUNT:
      return {
        ...state,
        taskCompletedCount: state.taskCompletedCount + 1,
      }
    case Actions.DECREMENT_TASK_COMPLETION_COUNT:
      return {
        ...state,
        taskCompletedCount: state.taskCompletedCount - 1,
      }
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
