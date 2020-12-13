var app = {
    initialize: function() {
      this.bindEvents();
    },
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
      app.receivedEvent('deviceready');      
    },
    receivedEvent: function(id) {
      GPS();
      var parentElement = document.getElementById(id);
      var listeningElement = parentElement.querySelector('.listening');
      var receivedElement = parentElement.querySelector('.received');
      listeningElement.setAttribute('style', 'display:none;');
      receivedElement.setAttribute('style', 'display:block;');
      checkConnection();
    }
  }; 
  function login(){
    var identification= $("#identification").val();
    checkConnection();
    if(identification!=""){
      $.ajax({ 
        type: "POST",
        data: "action=login-movil&identification="+identification,
        url: "https://limpiezaysoluciones.com.co/app/lib/ajax_services.php",
        async: false,         
        success: function(msg){ 
          var dat=JSON.parse(msg);
          if(dat.status=="200"){
            localStorage.setItem('id_u',dat.data.id_u);
            localStorage.setItem('names_u',dat.data.names_u);
            localStorage.setItem('rol_u',dat.data.rol_u);
            window.location.replace("home.html");
          }else{
            alert("Identificación no registrada en el sistema");
          }      
          return false;                           
        },
        error: function(xhr, status, error){
          console.log("Error!" + xhr.status);
        }       
     });
    }    
  }
var onSuccess = function(position) {
  checkConnection();
  $(".coordinates").html("Coord: "+position.coords.latitude+"-"+position.coords.longitude);
  var id_u=localStorage.getItem('id_u');
  $.ajax({ 
    type: "POST",
    data: "action=set-coordinates&id_u="+id_u+"&latitude="+position.coords.latitude+"&longitude="+position.coords.longitude,
    url: "https://limpiezaysoluciones.com.co/app/lib/ajax_services.php",
    async: false,         
    success: function(msg){
      return false;                           
    }           
  });  
};  
function onError(error) {
  alert('Error GPS - code: '    + error.code    + '\n' +
    'mensaje: ' + error.message + '\n');
}  
function GPS(){
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
  setInterval(function(){navigator.geolocation.getCurrentPosition(onSuccess, onError);},60000);
}  
function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.NONE]     = 'No network connection';
    if(states[networkState]=="Unknown connection"||states[networkState]=="No network connection"){
      alert("Conexión a Internet no disponible");
    }    
} 