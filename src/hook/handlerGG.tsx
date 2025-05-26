import {signOut ,  signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebase";
const provider = new GoogleAuthProvider();
export function handlerLoginGG() {
  return signInWithPopup(auth, provider)
    .then((result ) => {
      const user = result.user;
      console.log(user)
      let profile = {name : user.displayName, email:user.email,img : user.photoURL}
      localStorage.setItem("userProfile", JSON.stringify(profile));
      localStorage.setItem('isLogin',user.uid)

    }).catch((error ) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
}

export function handerLogout (){
  signOut(auth).then(() => {
    localStorage.removeItem('isLogin')

    
}).catch((error) => {
  throw error
});
}