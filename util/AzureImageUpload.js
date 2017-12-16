import RNFetchBlob from 'react-native-fetch-blob';
import CryptoJS from 'crypto-js';
import base64 from 'base-64';
import * as mime from 'react-native-mime-types';
import shortid from 'shortid';
import Config from 'react-native-config';

const sendImageToBlob = (img) => {
  const { data, name } = img;
  const imageSize = base64.decode(data).length;
  const key = 'g2Y72pmPn5oGODCmc2iSCYSvMhODw76drqCn9PlE3XdwTqBnt04Btc34bsdCehUL1UE/x7RenuMMTQfj+bOk1g==';
  const strTime = (new Date()).toUTCString();
  let strToSign = "PUT\n\n\n" + imageSize + "\n\napplication/octet-stream\n\n\n\n\n\n\nx-ms-blob-type:BlockBlob\nx-ms-date:"
      strToSign += strTime + `\nx-ms-version:2017-04-17\n/${Config.AZURE_IMAGE_CONTAINER_NAME}/images/` + name;
  const secret = CryptoJS.enc.Base64.parse(key);
  const hash = CryptoJS.HmacSHA256(strToSign, secret);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  const auth = "SharedKey taggingtrackerdevimages:"+hashInBase64;
  const fullUrl = `https://${Config.AZURE_IMAGE_CONTAINER_NAME}.blob.core.windows.net/images/${name}`;

  return RNFetchBlob.fetch(
    'PUT',
    fullUrl,
    {
      'Content-Type': 'application/octet-stream',
      'Content-Length': imageSize.toString(),
      'x-ms-blob-type': 'BlockBlob',
      'x-ms-version': '2017-04-17',
      'x-ms-date': strTime,
      Authorization: auth,
    },
    data
  ).then(response => {
    if (response.respInfo.status == 201) {
      return { name: fullUrl };
    }
    
    throw new Error('Image could not be uploaded');
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
}

export default AzureImageUpload;
