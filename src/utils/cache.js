const LRU = require('lru-cache')

const options = {
  max: 500,

  // for use with tracking overall storage size
  maxSize: 5000,
  sizeCalculation: (value, key) => {
    return 1
  },

  // how long to live in ms
  ttl: 1000 * 60 * 60, //1hr

}

const cache = new LRU(options)

module.exports = {cache}
