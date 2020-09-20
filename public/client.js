const socket = io();

const message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      output = document.getElementById('output'),
      typing = document.getElementById('typing'),
      button = document.getElementById('button');

   //   send typing message
   message.addEventListener('keypress', () =>{
    socket.emit('userTyping', handle.value)
})

    
// send messages to clients
      button.addEventListener('click', () =>{
          socket.emit('userMessage', {
              handle: handle.value,
              message: message.value
          })
          document.getElementById('message').value="";
      })

 


    //   listen for events from the server
      socket.on("userMessage", (data) => {
          typing.innerHTML ="";
           output.innerHTML += '<p> <strong>' + data.handle + ': </strong>' + data.message + '</p>'
      })

      socket.on('userTyping', (data)=>{
          typing.innerHTML = '<p><em>' + data + ' is typing... </em></p>'
      })



      function getlvideos(callbacks)
      {
      var constraints={
          audio:true,
          video:true
      }
      navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      navigator.getUserMedia(constraints,callbacks.success,callbacks.error);

    }
      function recstream(stream,elemenid)
      {
          debugger;
          var video=document.getElementById(elemenid);

          video.srcObject = stream;
          window.peer_stream=stream;
      }
      getlvideos({
          success:function(stream){
              window.localstream=stream;
              recstream(stream,'lvideo')
          },
          error:function(err)
          {
              alert("cannot access yur camera"+err);
              console.log(err);
          }
        })


        var conn;
        var peer_id;
        var peer = new Peer();

        peer.on('open', function() {
           document.getElementById('displayID').innerHTML=peer.id;
          });

          peer.on('connection',function(connection){
            conn=connection;
            peer_id=connection.peer;
            document.getElementById('connId').value=peer_id;


          });

          peer.on('error',function(err){
              console.log(err);
          });

          document.getElementById('conn_button').addEventListener('click',function(){
              peer_id=document.getElementById("connId").value;
              if(peer_id){
                  conn=peer.connect(peer_id);
              }else{
                  alert("enter an id to connect");
                  return false;
              }
          });

          peer.on("call",function(call){
           debugger;
            var acceptcall=confirm("do you wanna accept call");

            if(acceptcall)
            {
                call.answer=(window.localstream);
               // stream=localstream;
                call.on('stream',function(stream){

                    window.peer_stream = stream;
                    recstream(stream,'rvideo');

                });

                call.on('close',function(){
                    alert('close the call');
                });
            }
            else{
                alert('call denied');
            }
            
          });

          document.getElementById('call_button').addEventListener('click',function(){
          debugger;
            console.log('calling a peer'+peer_id);
            console.log(peer);
            var call=peer.call(peer_id,window.localstream);

            call.on('stream',function(stream){
                window.peer_stream = stream;

                recstream(stream,'rvideo');

            });
          })