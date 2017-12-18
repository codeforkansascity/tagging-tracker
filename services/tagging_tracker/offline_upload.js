import taggingTrackerActions from './actions';
import { uploadAddress, uploadTag } from '.';
import store from '../../store';

export const uploadSavedTasks = () => {
  let tasks = store.getState().tagging_tracker.queue;

  tasks.forEach(task => {
    if(task) {
      if(task.action === 'UPLOAD' && task.type === 'Address') {
        uploadAddress(task.entity);
      } else if (task.action === 'UPLOAD' && task.type === 'Tag') {
        uploadTag(task.entity);
      }
    }
    
    store.dispatch(taggingTrackerActions.removeFromQueue({request: task}));
  });
};
