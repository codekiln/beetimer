import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD4GJc9J3AqbrZK9rtYNW_y5DzcPvhGZig",
  authDomain: "friendlychat-42c09.firebaseapp.com",
  databaseURL: "https://friendlychat-42c09.firebaseio.com",
  projectId: "friendlychat-42c09",
  storageBucket: "friendlychat-42c09.appspot.com",
  messagingSenderId: "790348993129"
};

firebase.initializeApp(firebaseConfig);

/**
 * Encapsulate the connection to Firebase with a simple class
 */
class FirebaseConnection {
  constructor() {

    // Shortcuts to Firebase SDK features.
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();

    // Initiates Firebase auth and listen to auth state changes.
    this.setOnAuthStateChanged(this.onAuthStateChanged.bind(this));
  }

  signIn() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.auth.signInWithPopup(provider);
  }

  setOnAuthStateChanged(handler) {
    this.auth.onAuthStateChanged(handler);
  }

  onAuthStateChanged(user) {
    if (user) { // User is signed in!
      // console.log(`Firebase.onAuthStateChanged: got user ${JSON.stringify(user)}`);
    } else {
      // User is signed out!
      // console.log('Firebase.onAuthStateChanged: no user')
    }
  };
}

export default new FirebaseConnection();