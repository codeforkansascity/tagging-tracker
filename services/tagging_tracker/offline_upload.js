import taggingTrackerActions from './actions';
import { uploadAddress } from '.';
import store from '../../store';

export const uploadSavedTasks = () => {
  let tasks = store.getState().tagging_tracker.queue;

  tasks.forEach(task => {
    if(task) {
      if(task.action === 'UPLOAD' && task.type === 'Address') {
        uploadAddress(task.entity);
      }
    }
    
    store.dispatch(taggingTrackerActions.removeFromQueue({request: task}));
  });
};
