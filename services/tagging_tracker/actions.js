import Actions from '../../actions';

module.exports.replaceItemInQueue = ({ originalTask, newTask }) => ({
  type: Actions.REPLACE_IN_QUEUE,
  originalTask,
  newTask,
});

module.exports.removeFromQueue = ({ request }) => ({
  type: Actions.REMOVE_FROM_QUEUE,
  request,
});

module.exports.addToQueue = ({ request }) => ({
  type: Actions.ADD_TO_QUEUE,
  request,
});

module.exports.setTaskCompletionCount = ({ count }) => ({
  type: Actions.SET_TASK_COMPLETION_COUNT,
  count,
});

module.exports.incrementTaskCompletionCount = () => ({
  type: Actions.INCREMENT_TASK_COMPLETION_COUNT,
});

module.exports.decrementTaskCompletionCount = () => ({
  type: Actions.DECREMENT_TASK_COMPLETION_COUNT,
});
