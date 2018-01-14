import RNFetchBlob from 'react-native-fetch-blob';

import TaggingTrackerActions from './actions';
import { uploadAddress, uploadTag } from '.';
import store from '../../store';
import AzureImageUpload from '../../util/AzureImageUpload';
import realm from '../../realm';
import Notification from '../../util/Notification';
import * as NotificationActions from '../../actions/notifications';

export const uploadSavedTasks = () => {
  let tasks = store.getState().tagging_tracker.queue;

  tasks.forEach(task => {
    if(task) {
      if(task.action === 'UPLOAD' && task.type === 'Address') {
        let tags = tasks.filter((tag) => {return tag.type === 'Tag' && task.address_id === tag.entity.address});

        uploadAddress(task.entity)
          .then((response) => {
            writeAddressToRealm(response);
            addAddressToTags(response.data['id'], tags);
            return uploadOfflineAddressTags(tags, response.data['id']);}
          )
          .then(() => {
            let message = `${task.entity.street} uploaded successfully.`;
            store.dispatch(NotificationActions.addNotification({notification: {type: Notification.AlertTypes.SUCCESS, message}}));
            store.dispatch(TaggingTrackerActions.removeFromQueue({request: task}));
          })
          .catch((error) => {
            const message = `${task.entity.street} did not upload.`;
            store.dispatch(NotificationActions.addNotification({notification: {type: Notification.AlertTypes.ERROR, message}}));
          });
          
      } else if (task.action === 'UPLOAD' && task.type === 'Tag' && task.address_uploaded) {
        uploadOfflineTagImageCheck(task)
      }
    }
  });
};

const writeAddressToRealm = (response) => {
  realm.write(() => {
    let responseData = response.data.properties;
    responseData.id = response.data.id.toString();
    responseData.latitude = response.data.geometry.coordinates[1];
    responseData.longitude = response.data.geometry.coordinates[0];
    responseData.date_updated = new Date(responseData.date_updated);
    responseData.uploaded_online = true;

    address = realm.create('Address', responseData);
    address.uploaded_online = true;
  });
}

const writeTagToRealm = (response) => {
  realm.write(() => {
    let tag = response.data;
    tag.id = response.data.id.toString();
    tag.address = response.data.address.toString();
    tag.uploaded_online = true;
    tag.date_updated = new Date(tag.date_updated);
    tag.date_taken = new Date(tag.date_taken);
    address = realm.create('Tag', tag);
  });
}

const addAddressToTags = (addressId, tasks) => {
  console.log(tasks);
  tasks.forEach((originalTask) => {
    let newTask = Object.assign({}, originalTask);
    newTask.address_id = addressId;
    newTask.entity.address = addressId;

    store.dispatch(TaggingTrackerActions.replaceItemInQueue({
      originalTask,
      newTask,
    }));
  });
}

const uploadOfflineAddressTags = (tags, addressId) => {
  let tasks = store.getState().tagging_tracker.queue;
  let tagTasks = tasks.filter((tag) => {return tag.type === 'Tag' && tag.entity.address === addressId});
  tagTasks.forEach(uploadOfflineTagImageCheck);
}

const uploadOfflineTagImageCheck = (task) => (
  RNFetchBlob
    .fs
    .exists(task.entity.local_img)
    .then((imageExists) => {return uploadOfflineTag(task, imageExists)})
);

const uploadOfflineTag = (task, imageExists) => {
  let tag = task.entity;

  if (imageExists) {
    return AzureImageUpload.uploadImage(tag.local_img)
      .then(response => {
        let serviceParams = Object.assign({}, tag, {img: response.name});
        delete serviceParams['id'];
        return serviceParams;
      })
      .then(uploadTag)
      .then(writeTagToRealm)
      .then(() => {
        const message = `${tag.description} uploaded successfully`;
        store.dispatch(NotificationActions.addNotification({notification: {type: Notification.AlertTypes.SUCCESS, message}}));
        store.dispatch(TaggingTrackerActions.removeFromQueue({request: task}));
      })
      .catch((error) => {
        const message = `${tag.description} did not upload. ${error}`;
        store.dispatch(NotificationActions.addNotification({notification: {type: Notification.AlertTypes.ERROR, message}}));
      });
  } else {
    return new Promise((resolve, reject) => {
      store.dispatch(TaggingTrackerActions.removeFromQueue({request: task}));
      const message = `${tag.description} does not have an image and cannot be uploaded.`;
      store.dispatch(NotificationActions.addNotification({notification: {type: Notification.AlertTypes.ERROR, message}}));
      resolve(tag);
    });
  }
}

