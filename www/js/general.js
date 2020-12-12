var app = {
    initialize: function() {
      this.bindEvents();
    },
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
      app.receivedEvent('deviceready');
      cordova.plugins.backgroundMode.enable();
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
      cordova.plugins.backgroundMode.on('activate', function () {
          setInterval(function () {
              cordova.plugins.notification.badge.increase();
          },3000);
      });
      cordova.plugins.backgroundMode.on('deactivate', function () {
          cordova.plugins.notification.badge.clear();
      });      
    }
  };
var onSuccess = function(position) {
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
    'message: ' + error.message + '\n');
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