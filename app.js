const web = require('js-web')
const db = web.storage.mysql

/**
 * Tables!
*/
const messages = db.table('messages')

/**
 * Injections
*/
const injections = [
  web.inject.jquery(),
  web.inject.bootstrap(),
  web.inject.socketIO(),
  web.inject.style('style/main.sass'),
  web.inject.script('script/main.js')
]

/**
 * Routes
*/
web.htmlRoute('/','html/index.html', async (input,session,cookie) => {
  return {
    connected: connectedToChatCount,
    messages: await messages.select(null,'id')
  }
},injections)


/**
 * Socket
*/
let connectedToChatCount = 0
web.onSocketConnection( async (socket) => {
  connectedToChatCount ++

  socket.emit('connection-updates',connectedToChatCount)
  socket.broadcast.emit('connection-updates',connectedToChatCount)
})

web.onSocketDisconnect( async (socket) => {
  connectedToChatCount --

  socket.emit('connection-updates',connectedToChatCount)
  socket.broadcast.emit('connection-updates',connectedToChatCount)
})

web.socket('message', async (data,socket) => {
  const info = JSON.parse(data) // parse json str to json obj

  messages.create(info) // Add message to database

  // Send to to sender
  socket.emit('new-message',JSON.stringify(info))
  // Broadcast to all
  socket.broadcast.emit('new-message',JSON.stringify(info))
})


web.start()
