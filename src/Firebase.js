import firebase from "firebase";

const firebaseConfig = {
  apiKey:            "AIzaSyAFwvW4DgBIiPUCZCvPnn7ca4gNh4EM-dY",
  authDomain:        "beetimer-4df81.firebaseapp.com",
  databaseURL:       "https://beetimer-4df81.firebaseio.com",
  projectId:         "beetimer-4df81",
  storageBucket:     "beetimer-4df81.appspot.com",
  messagingSenderId: "625145362661"
};

firebase.initializeApp(firebaseConfig);

/**
 * Encapsulate the connection to Firebase with a simple class
 */
class FirebaseConnection {

  constructor() {

    // Shortcuts to Firebase SDK features.
    this.auth      = firebase.auth();
    this.database  = firebase.database();
    this.storage   = firebase.storage();
    this.listeners = [];

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

  listen() {
    if (this.auth.currentUser) {
      const
        dbref = this.database.ref(`users/${this.auth.currentUser.uid}`),
        self  = this
      ;

      // returns a promise
      return dbref.on('value', function(firebaseSnapshot) {
        const firebaseState = firebaseSnapshot.val();
        console.log('received firebase state: ', firebaseState);
        for (const listener of self.listeners) {
          listener.handleDatabaseUpdate(firebaseState, self.auth.currentUser)
        }

      });
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

  setOnAuthStateChanged(handler) {
    this.auth.onAuthStateChanged(handler);
  }

  signIn() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.auth.signInWithPopup(provider);
  }

  /**
   * Add a listener to the list to notify when auth state changes
   * or when database state changes for that user
   * @param listener - must implement `handleDatabaseUpdate(state, user)`
   */
  subscribe(listener) {
    this.listeners.push(listener);
  }

  /**
   * When Firebase auth state changes and user is logged in,
   * set up listeners for real time database updates. When
   * auth state changes and user is logged out, update listeners
   * with the new empty state and null user.
   * @param user - Firebase auth user
   */
  onAuthStateChanged(user) {
    if (user) {
      // User is signed in!
      this.listen();
    } else {
      // User is signed out!
      for (const listener of this.listeners) {
        listener.handleDatabaseUpdate({}, this.auth.currentUser)
      }
    }
  };

  unsubscribe(listener) {
    this.listeners = this.listeners.filter(item => item !== listener)
  }
}

export default new FirebaseConnection();