
var scrollToBot = function(){
  var objDiv = document.getElementById("message-wrapper");
  objDiv.scrollTop = objDiv.scrollHeight;
}

$('#send').click(function(){
  if($('#name').val().trim() == ''){
    alert('write a name')
    return
  }
  if($('#msg').val().trim() == ''){
    alert('write a message')
    return
  }
  socket.emit('message',JSON.stringify({
    name: $('#name').val(),
    message: $('#msg').val()
  }))
})

var socket = io()
socket.on('new-message',function(data){
  newMessage = JSON.parse(data)
  $('#messages')
    .append('<li>'+newMessage.name+': '+newMessage.message+'</li>')

  scrollToBot()
})

socket.on('connection-updates', function(data){
  $('#connected').html('Connected: '+data)
})

$(document).ready(function(){
    scrollToBot()
})
