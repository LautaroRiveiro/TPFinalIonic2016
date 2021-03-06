angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, datosSesion) {
  $scope.EsAdmin = function(){
    return datosSesion.esAdmin();
  }
})

.controller('PerfilCtrl', function($scope, $rootScope, $stateParams, $state, $timeout, $ionicHistory, datosSesion, $cordovaBarcodeScanner, $http, sPlugins, sNotificaciones) {
    
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
        sNotificaciones.DesafioTriunfo(datosSesion.getRegistrationId());
    };

})

.controller('NotificacionesCtrl', function($scope, datosSesion, $timeout, servicioMensajes) {
    
    $scope.notificaciones = {};
    $scope.notificaciones = servicioMensajes.getNotificaciones();

    $scope.Eliminar = function(key){
        servicioMensajes.updateNotificacion(key,{
            notificado: true
        });
    };

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
