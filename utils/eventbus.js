class EventBus {
  constructor() {
    this.cache = {}
  }

  on(type, handler) {
    let callbacks = this.cache[type] || (this.cache[type] = [])
    if (!callbacks.includes(handler)) callbacks.push(handler)
    // console.log(callbacks)
  }

  emit(type, ...args) {
    const callbacks = this.cache[type]
    if (!callbacks) return
    callbacks.forEach(handler => {
      try {
        handler(...args)
      } catch (e) {
        // console.log(e)
      }
    })
  }

  off(type, handler) {
    let callbacks = this.cache[type]
    if (!callbacks) return
    if (!handler) {
      this.cache[type] = []
    } else {
      const i = callbacks.indexOf(handler)
      if (i !== -1) callbacks.splice(i, 1)
    }
  }
}

module.exports = new EventBus()