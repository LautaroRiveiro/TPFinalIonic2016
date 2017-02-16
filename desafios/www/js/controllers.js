angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('PerfilCtrl', function($scope, $stateParams, $state, $timeout, $ionicHistory, datosSesion, $cordovaBarcodeScanner, $http, sPlugins) {
    //Recupero los datos del usuario logueado
    $scope.usuario = {}
    $scope.usuario = datosSesion.getUsuario();
    console.info("datosSesion.getUsuario()", datosSesion.getUsuario());

    //Creo un Token a partir del firebase.auth().currentUser, para mostrar su contenido en el Perfil
    $scope.token = {};
    $scope.token.mostrar = false;
    $scope.token.info = firebase.auth().currentUser;

    $scope.Logout = function() {
      firebase.auth().signOut()
      .then(function(){
        //CurrentUser tiene los datos de la sesión. Si no hay sesión activa, muestra null.
        console.log("Adios! firebase.auth().currentUser:", firebase.auth().currentUser);
        $timeout(function(){
            //Voy a login y borro la caché
            $state.go('login', null, {reload: true});
            $ionicHistory.clearCache();
            //$window.location.reload(true);
        }, 1000);
      }, function(error){
        //Error en deslogueo
        console.log("Error");
      });
    };

    $scope.CargarCredito = function(){
        //Prendo el lector de QR
        $cordovaBarcodeScanner.scan().then(
        function(barcodeData) {
            console.info("barcodeData", barcodeData);
            
            //Si cierro sin leer nada, devuelve cancelled true
            if (barcodeData.cancelled){
                console.info("La lectura fue cancelada. El plugin tiene desarrollado un botón para cancelar sin salir de la app");
                return;
            }

            //Recupero el texto y evalúo si es la key de un crédito
            var texto = barcodeData.text;
            var ref = firebase.database().ref('creditos/'+texto);
            ref.once('value', function(snapshot){
                console.log("snapshot.val()", snapshot.val());
                console.log("snapshot.key", snapshot.key);

                if(snapshot.val() == null){
                    console.info("El QR leido no corresponde a un crédito.");
                    alert("El QR leido no corresponde a un crédito.");
                }
                else if(snapshot.val().disponible == false){
                    console.info("El crédito ya fue utilizado.");
                    alert("El crédito ya fue utilizado.");
                }
                else{
                    console.info("Lectura QR OK. Serán acreditados "+snapshot.val().importe+" créditos.");
                    sPlugins.Sonido("creditos");
                    alert("Lectura QR OK. Serán acreditados "+snapshot.val().importe+" créditos.");
                    datosSesion.sumarCreditos(snapshot.val().importe);
                    ref.update({
                      disponible: false,
                      fechaUsado: Firebase.ServerValue.TIMESTAMP,
                      consumidor: $scope.usuario.nombre,
                      consumidorUid: firebase.auth().currentUser.uid
                    });
                }
            });

        }, function(error) {
            console.info("error", error);
        });
    };

    $scope.Enviar = function(){

      var data = JSON.stringify({
          "to":"elwwVPy9o6E:APA91bFUpUbvIVDCYYrKWdb74nURXhpK9v6aeYtsUNBrS1MXhcPobmiaCtP6pogy0LVal7FBBoB9Xqu67UaSmgU7Hl3NqxxYXDznmLAcKsEP77A01wB4iVVdRC7KmivLU8vlw6y0VkGz", //Topic or single device
          "notification":{
              "title":"Titulo de ejemplo",
              "body":"Hola, mundo",
              "sound":"default",
              "click_action":"FCM_PLUGIN_ACTIVITY", //Must be present for Android
              "icon":"fcm_push_icon" //White icon Android resource
          },
          "priority":"high" //If not set, notification won't be delivered on completely closed iOS app
      });

      var req = {
        method: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: {
          'Content-Type': "application/json",
          'Authorization': 'key=AAAAU5wcfLQ:APA91bFy33R9zTKzC7Le07yOufJge22g1KCVuiuWlsCVjMfXsda4Z780HuX2HqtQbO1GYp1MX4-UCKf-RgphABpwJTIGsRyQhde-bz9M2rdLCDk1pcsH2RXWWbKyaMRi_m7k1YTSgMDnrh6uQoHZ5lcjb4f8TC58Gg'
        },
        data: data
      }

      $http(req).then(function(data){console.info("data", data);}, function(error){console.info("error", error);});

    };

})

.controller('DesafiosCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('GenerarCtrl', function($scope, $stateParams, datosSesion) {
    
    //Apunto a la tabla Créditos de Firebase
    var refCreditos = new Firebase("https://tpfinalionic2016.firebaseio.com/creditos");

    //Creo las variables necesarias
    $scope.datos = {};
    $scope.datos.cantidad = 0;
    $scope.datos.importeTotal = 0;
    $scope.credito = {};

    //Recupero todos los créditos
    refCreditos.on('child_added', function(data){
      console.info(data.val());
      var creditoFB = data.val();
      if(creditoFB.disponible === true)
      {
        $scope.datos.cantidad ++;
        $scope.datos.importeTotal += creditoFB.importe;
      }
    })

    //A la escucha de utilizar créditos
    refCreditos.on('child_changed', function(data){
      console.info("Cambio: ", data.val());
      var creditoFB = data.val();
      if(creditoFB.disponible === false)
      {
        $scope.datos.cantidad --;
        $scope.datos.importeTotal -= creditoFB.importe;
        console.info("Importe: ", $scope.datos.importeTotal, "Cantidad:", $scope.datos.cantidad);
        //NOTA: No me actualiza los datos en el model HTML.
      }
    })

    $scope.GenerarCredito = function(){
      if($scope.credito.importe > 0 && $scope.credito.importe === parseInt($scope.credito.importe, 10)){
        $scope.credito.creadorUid = datosSesion.getUid();
        $scope.credito.creador = datosSesion.getUsuario().nombre;
        $scope.credito.disponible = true;
        $scope.credito.fechaCreado = Firebase.ServerValue.TIMESTAMP;
        console.info($scope.credito);
        refCreditos.push($scope.credito);
        $scope.credito.importe = "";
      }
      else{
        console.log("Valor ingresado no válido");
      }
    }
});
