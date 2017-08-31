// Here is where you can define configuration overrides based on the execution environment.
// Supply a key to the default export matching the NODE_ENV that you wish to target, and
// the base configuration will apply your overrides before exporting itself.

const apiKeyLocal = process.env.FIREBASE_OLDTIMER_LOCAL_DEV

module.exports = {
  // ======================================================
  // Overrides when NODE_ENV === 'development'
  // ======================================================
  // NOTE: In development, we use an explicit public path when the assets
  // are served webpack by to fix this issue:
  // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
  development: (config) => ({
    compiler_public_path: `http://${config.server_host}:${config.server_port}/`,
    firebase:             {
      apiKey:            apiKeyLocal,
      authDomain:        "oldtimer-9dfb6.firebaseapp.com",
      databaseURL:       "https://oldtimer-9dfb6.firebaseio.com",
      projectId:         "oldtimer-9dfb6",
      storageBucket:     "oldtimer-9dfb6.appspot.com",
      messagingSenderId: "332873739617"
    },
    reduxFirebase:        {
      userProfile:          'users', // root that user profiles are written to
      enableLogging:        false, // enable/disable Firebase Database Logging
      updateProfileOnLogin: false // enable/disable updating of profile on login
      // profileDecorator: (userData) => ({ email: userData.email }) // customize format of user profile
    }
  }),

  // ======================================================
  // Overrides when NODE_ENV === 'production'
  // ======================================================
  production: (config) => ({
    compiler_public_path:     '/',
    compiler_fail_on_warning: false,
    compiler_hash_type:       'chunkhash',
    compiler_devtool:         null,
    compiler_stats:           {
      chunks:       true,
      chunkModules: true,
      colors:       true
    },
    firebase:                 {
      apiKey:            "AIzaSyCd6-VL0WhO1kjS8sfXIgGl3co4T8Xf83A",
      authDomain:        "oldtimer-9dfb6.firebaseapp.com",
      databaseURL:       "https://oldtimer-9dfb6.firebaseio.com",
      projectId:         "oldtimer-9dfb6",
      storageBucket:     "oldtimer-9dfb6.appspot.com",
      messagingSenderId: "332873739617"
    },
    reduxFirebase:            {
      userProfile:          'users', // root that user profiles are written to
      enableLogging:        false, // enable/disable Firebase Database Logging
      updateProfileOnLogin: false // enable/disable updating of profile on login
      // profileDecorator: (userData) => ({ email: userData.email }) // customize format of user profile
    }
  })
}
