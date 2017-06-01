import firebase from 'firebase';

class Firebase {

  constructor() {
    this.connection = firebase.initializeApp(this);
  }

  get apiKey() {
    if (process && process.env && process.env.FIREBASE_OLDTIMER_LOCAL_DEV) {
      return process.env.FIREBASE_OLDTIMER_LOCAL_DEV
    }
    // browser key restricted to https://codekiln.github.io/oldtimer/*
    // at https://console.developers.google.com/apis/credentials
    return 'AIzaSyCd6-VL0WhO1kjS8sfXIgGl3co4T8Xf83A'
  }

  get authDomain() {
    return "oldtimer-9dfb6.firebaseapp.com"
  }

  get databaseURL() {
    return "https://oldtimer-9dfb6.firebaseio.com"
  }

  get projectId() {
    return "oldtimer-9dfb6"
  }

  get storageBucket() {
    return "oldtimer-9dfb6.appspot.com"
  }

  get messagingSenderId() {
    return "332873739617"
  }

}

export default new Firebase().connection;