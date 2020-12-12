var app = {
    // Application Constructor
    initialize: function() {
      this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      var parentElement = document.getElementById(id);
      var listeningElement = parentElement.querySelector('.listening');
      var receivedElement = parentElement.querySelector('.received');

      listeningElement.setAttribute('style', 'display:none;');
      receivedElement.setAttribute('style', 'display:block;');
      console.log('Received Event: ' + id);
      $( ".received" ).click(function() {
        login();
      });
    }
  };
function login(){
    var identification= $("#identification").val();
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
      }           
      });
    }    
}