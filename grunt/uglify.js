module.exports = {

  options: {
    preserveComments: false
  },

  'lib': {
    options: {
      sourceMap: false
    },
    files: {
      './assets/libs.min.js': ['./assets/libs.min.js']
    }
  },

  'app': {
    options: {
      sourceMap: true
    },
    files: {
      './assets/app.min.js': ['./assets/app.js']
    }
  }

};