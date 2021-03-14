import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCCivtpXO8BywnxB4CFI0M64UlXZVMY_QE',
  authDomain: 'qwitter-f92e7.firebaseapp.com',
  projectId: 'qwitter-f92e7',
  storageBucket: 'qwitter-f92e7.appspot.com',
  messagingSenderId: '166184761906',
  appId: '1:166184761906:web:70b725223df9a30eee1a2b'
}

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

export default db
