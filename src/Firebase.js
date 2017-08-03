import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAFwvW4DgBIiPUCZCvPnn7ca4gNh4EM-dY",
  authDomain: "beetimer-4df81.firebaseapp.com",
  databaseURL: "https://beetimer-4df81.firebaseio.com",
  projectId: "beetimer-4df81",
  storageBucket: "beetimer-4df81.appspot.com",
  messagingSenderId: "625145362661"
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

  get() {
    if (this.auth.currentUser) {
      const
        dbref = this.database.ref(`users/${this.auth.currentUser.uid}`)
      ;
      // returns a promise
      return dbref.once('value');
    }
  }

  set(state) {
    if (this.auth.currentUser) {
      const
        dbref = this.database.ref(`users/${this.auth.currentUser.uid}`)
      ;
      dbref.set(state);
    }
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