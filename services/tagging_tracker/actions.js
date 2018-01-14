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
