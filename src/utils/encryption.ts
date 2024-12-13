import {AES,enc} from 'crypto-js'
const {encrypt,decrypt} = AES;

export function encryptData({jti,payload}:any){
    
    const encrypted = encrypt(
        JSON.stringify(payload),
        jti.slice(2, -1)
      ).toString();
      console.log(jti.slice(2, -1),{encrypted})
return encrypted;
}
export function decryptData({jti,payload}:any){
   const decrypted =  decrypt(payload, jti.slice(2, -1)).toString(enc.Utf8);

   console.log({decrypted})
   return decrypted;
}