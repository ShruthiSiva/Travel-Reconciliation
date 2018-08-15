// const ecies = require("eth-ecies");
// const publicKey = 'f92fb36a11fa982392e7f5aa8d5ff2bd44f3b6049e4883ae11f9fc8969cb7b0005417528934163448f765d277b7b60e67e4970e0ee0e259080cbf1b1313674bf';
// const privateKey = 'a4dd97c4065508389acdf2109b41b011c525b703c72ad473c35a98552f34cc45';
//
// var encrypt = function(publicKey, data) {
//     let userPublicKey = new Buffer(publicKey, 'hex');
//     let bufferData = new Buffer(data);
//
//     let encryptedData = ecies.encrypt(userPublicKey, bufferData);
//
//     return encryptedData.toString('base64')
// }
//
// var decrypt = function(privateKey, encryptedData) {
//     let userPrivateKey = new Buffer(privateKey, 'hex');
//     let bufferEncryptedData = new Buffer(encryptedData, 'base64');
//
//     let decryptedData = ecies.decrypt(userPrivateKey, bufferEncryptedData);
//
//     return decryptedData.toString('utf8');
// }
var CryptoJS = require("crypto-js");

var encrypt = async (key, data) => {
  var encrypted = CryptoJS.AES.encrypt(data, key);
  return encrypted;
}

var decrypt = async (key, data) => {
  var decrypted = await CryptoJS.AES.decrypt(data, key);
  var a = decrypted.toString(CryptoJS.enc.Utf8);
  return a;
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
