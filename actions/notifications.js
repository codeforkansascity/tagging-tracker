import Actions from '.';

module.exports.addNotification = ({ notification }) => ({
  type: Actions.ADD_NOTIFICATION,
  notification,
});

module.exports.deleteNotification = ({ notification }) => ({
  type: Actions.DELETE_NOTIFICATION,
  notification
});
