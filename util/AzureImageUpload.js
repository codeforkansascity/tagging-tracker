import RNFetchBlob from 'react-native-fetch-blob';
import CryptoJS from 'crypto-js';
import base64 from 'base-64';
import * as mime from 'react-native-mime-types';
import shortid from 'shortid';
import Config from 'react-native-config';

const constructSignature = (method, name, fileSize, stringTime) => {
  let strToSign = `${method}\n\n\n`;

  if (fileSize) {
    strToSign += fileSize;
  }

  strToSign += "\n\napplication/octet-stream\n\n\n\n\n\n\nx-ms-blob-type:BlockBlob\nx-ms-date:"
  strToSign += stringTime + `\nx-ms-version:2017-04-17\n/${Config.AZURE_IMAGE_CONTAINER_NAME}/images/` + name;

  const secret = CryptoJS.enc.Base64.parse(Config.AZURE_IMAGE_CONTAINER_KEY);
  const hash = CryptoJS.HmacSHA256(strToSign, secret);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  return "SharedKey taggingtrackerdevimages:" + hashInBase64;
}

const sendImageToBlob = (img) => {
  const { data, name } = img;

  const fullUrl = `https://${Config.AZURE_IMAGE_CONTAINER_NAME}.blob.core.windows.net/images/${name}`;
  const imageSize = base64.decode(data).length;
  const strTime = (new Date()).toUTCString();

  return RNFetchBlob.fetch(
    'PUT',
    fullUrl,
    {
      'Content-Type': 'application/octet-stream',
      'Content-Length': imageSize.toString(),
      'x-ms-blob-type': 'BlockBlob',
      'x-ms-version': '2017-04-17',
      'x-ms-date': strTime,
      Authorization: constructSignature('PUT', name, imageSize, strTime),
    },
    data
  ).then(response => {
    if (response.respInfo.status == 201) {
      return { name: fullUrl };
    }
    
    throw new Error('Image could not be uploaded');
  });
}

const removeBlob = (url) => {
  const name = url.split('/').pop();
  const strTime = (new Date()).toUTCString();

  return RNFetchBlob.fetch(
    'DELETE',
    url,
    {
      'Content-Type': 'application/octet-stream',
      'x-ms-blob-type': 'BlockBlob',
      'x-ms-version': '2017-04-17',
      'x-ms-date': strTime,
      Authorization: constructSignature('DELETE', name, '', strTime),
    }
  ).then(response => {
    if (response.respInfo.status == 201) {
      return { name: fullUrl };
    }
    
    throw new Error('Image could not be Deleted');
  });
}

class AzureImageUpload {
  static uploadImage = (imagePath) => {
    let contentType = mime.lookup(imagePath);
    let extension = mime.extension(contentType);
    let name = `${shortid.generate()}.${extension}`;

    return RNFetchBlob.fs.readFile(imagePath, 'base64')
      .then(data => ({data, name}))
      .then(sendImageToBlob);
  }

  static deleteImage = (imageUrl) => {
    return removeBlob(imageUrl);
  }
}

export default AzureImageUpload;
