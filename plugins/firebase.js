import { defineNuxtPlugin } from '#app'
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

export default defineNuxtPlugin((nuxtApp) => {
  const firebaseConfig = {
    apiKey: "AIzaSyAcL90Qw1vpdTZzAHUqslkp14zCZuPODRU",
    authDomain: "veep-web.firebaseapp.com",
    projectId: "veep-web",
    storageBucket: "veep-web.appspot.com",
    messagingSenderId: "212524273044",
    appId: "1:212524273044:web:6de1a89719876bbf655381",
    measurementId: "G-92L3X7TF2T"
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const auth = getAuth(app)

  return {
    provide: {
      firebase: app,
      db: db,
      auth: auth
    }
  }
})