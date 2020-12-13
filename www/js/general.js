var app = {
    initialize: function() {
      this.bindEvents();
    },
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
      app.receivedEvent('deviceready');
      checkConnection();
      var eventCallback = function() {
          console.log("Timer inicializado");
          GPS();
      }
      var successCallback = function() {
          console.log("Timer completo");
          GPS();
      }
      var errorCallback = function(e) {
          console.log("Timer error");
      }
      var settings = {
          timerInterval: 60000, // interval between ticks of the timer in milliseconds (Default: 60000)
          startOnBoot: true, // enable this to start timer after the device was restarted (Default: false)
          stopOnTerminate: true, // set to true to force stop timer in case the app is terminated (User closed the app and etc.) (Default: true)
          hours: -1, // delay timer to start at certain time (Default: -1)
          minutes: 0, // delay timer to start at certain time (Default: -1)
      }
      window.BackgroundTimer.onTimerEvent(eventCallback); // subscribe on timer event
      // timer will start at 12:00
      window.BackgroundTimer.start(successCallback, errorCallback, settings);

    cordova.plugins.backgroundMode.setDefaults({ text:'Doing heavy tasks.'});
    // Enable background mode
    cordova.plugins.backgroundMode.enable();

    // Called when background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function () {
        setTimeout(function () {
            // Modify the currently displayed notification
            cordova.plugins.backgroundMode.configure({
                text:'Running in background for more than 5s now.'
            });
            GPS();
        }, 5000);
    }      
    },
    receivedEvent: function(id) {
      GPS();
      today();
      mydata();
      var id_u = localStorage.getItem('id_u');
      var names_u = localStorage.getItem('names_u');
      var rol_u = localStorage.getItem('rol_u');      
      $(".names_u").html(names_u);      
      $( ".close-session" ).click(function() {
        localStorage.clear();
        window.location.replace("index.html");
      });
      $( "#frm-account" ).submit(function( event ) {
        updateData($(this).serialize());
        event.preventDefault();
      }); 
      $( "#frm-format" ).submit(function( event ) {
        var format= $("#formato").val();
        var identificaction_u= $("#identificaction_u").val();
        if(format!=""&&identificaction_u!=""){
          registerFormat($(this).serialize());
        }
        event.preventDefault();
      });     
    }
  };
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
function today(){  
  var meses = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
  var f= new Date();
  var today= f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();  
  $(".today").html(today+"<br/>");
}
function mydata(){
  var pageURL = $(location).attr("href").split("/");
  var actPage= pageURL[pageURL.length-1];
  if(actPage=="cuenta.html"){
    var id_u=localStorage.getItem('id_u');
    $.ajax({ 
      type: "POST",
      data: "action=get-data&type=cuenta&id_u="+id_u,
      url: "https://limpiezaysoluciones.com.co/app/lib/ajax_services.php",
      async: false,         
      success: function(msg){
        var dat= JSON.parse(msg);
        if(dat.status=="200"){          
          $("#identification_u").val(dat.data[0].identification_u);
          $("#names_u").val(dat.data[0].names_u);
          $("#email_u").val(dat.data[0].email_u);
          $("#phone_u").val(dat.data[0].phone_u);
          $("#cellphone_u").val(dat.data[0].cellphone_u);
          $("#address_u").val(dat.data[0].address_u);
        }
        return false;                           
      }           
    });
  }
}
function updateData(form){
  var id_u=localStorage.getItem('id_u');
  $.ajax({ 
    type: "POST",
    data: "action=update-data&type=users&id_u="+id_u+"&"+form,
    url: "https://limpiezaysoluciones.com.co/app/lib/ajax_services.php",
    async: false,         
    success: function(msg){
      var dat= JSON.parse(msg);
      if(dat.status=="200")alert("Datos actualizados correctamente");     
      return false;                           
    }           
  });
}
function registerFormat(form){
  var id_u=localStorage.getItem('id_u');
  $.ajax({ 
    type: "POST",
    data: "action=set-format&id_u="+id_u+"&"+form,
    url: "https://limpiezaysoluciones.com.co/app/lib/ajax_services.php",
    async: false,         
    success: function(msg){
      var dat= JSON.parse(msg);
      if(dat.status=="200")alert("Formato registrado.\nSe ha enviado una copia a los correos registrados.");
      return false;                           
    }           
  });
}
function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.NONE]     = 'No network connection';
    if(states[networkState]=="Unknown connection"||states[networkState]=="No network connection"){
      alert("Conexión a Internet no disponible");
      window.location.replace("index.html");
    }    
} 