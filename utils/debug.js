//debug
const env = 'develop'
// const env = 'production'

function empty() {
  return function () { }
}

module.exports = {
  log: env === 'develop' ? console.log : empty
}