angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PerfilCtrl', function($scope, $stateParams) {
})

.controller('BatallaNavalCtrl', function($scope, $timeout) {
  //Creo las variables necesarias
  $scope.partida = {};
  $scope.bandera = {};
  $scope.bandera.estado = "inicio";
  $scope.partidas = [];

  //Referencio a Partidas de Firebase
  var refPartidas = new Firebase("https://tpfinalionic2016.firebaseio.com/partidas");
  console.info(refPartidas.child('-KUnaLX6HMa1TA9l21kY'));
  refPartidas.on('child_added', function(data){
    $timeout(function(){
      console.info(data.val(), data.key());
      var partida = data.val();
      partida.key = data.key();
      $scope.partidas.push(partida);
      console.info($scope.partidas, "Playlist: ", $scope.playlists);
    });
  });


  $scope.Guardar = function(){
    console.info($scope.partida);
    //Valido que estén monto y ubicación cargados
    if($scope.partida.monto != "" && $scope.partida.ubicacionCreador != ""){
      $scope.partida.creador = "Lautaro";
      $scope.partida.fecha = Firebase.ServerValue.TIMESTAMP;
      //Subo la apuesta al Firebase
      refPartidas.push($scope.partida);
      //Reinicio valores
      $scope.partida.monto = "";
      $scope.partida.ubicacionCreador = "";
      //Vuelvo a las partidas creadas
      $scope.bandera.estado = "inicio";
    }
    else{
      alert("Faltan datos");
    }
  };

  $scope.Cancelar = function(){
    //Reinicio valores
    $scope.partida.monto = "";
    $scope.partida.ubicacionCreador = "";
    //Vuelvo a las partidas creadas
    $scope.bandera.estado = "inicio";
  };

  $scope.AmpliarDesafio = function(key){
    $scope.bandera.estado = 'partida';
    $scope.key = key;
    console.info("KEY: ", $scope.key);
    $scope.partida.ubicacionDesafiante = "";
  }

  $scope.Aceptar = function(){
    //Valido que esté la ubicación cargada
    if($scope.partida.ubicacionDesafiante != ""){
      //Cambiar datos de la partida existente
      firebase.database().ref("/partidas/"+$scope.key).update({
        desafiante: "Facundo",
        ubicacionDesafiante: $scope.partida.ubicacionDesafiante,
        nuevoCampo: "hola"
      });
      //Reinicio valores
      $scope.key = "";
      $scope.partida.ubicacionDesafiante = "";
      console.info("KEY: ", $scope.key);
      $scope.bandera.estado = "inicio";
    }
    else{
      alert("Falta elegir ubicación");
    }
  };

  $scope.Volver = function(){
    //Reinicio valores
    $scope.key = "";
    $scope.partida.ubicacionDesafiante = "";
    console.info("KEY: ", $scope.key);
    //Vuelvo a las partidas creadas
    $scope.bandera.estado = "inicio";
  }

  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
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

.controller('GenerarCtrl', function($scope, $stateParams) {
    
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
      if(creditoFB.estado == "sinUsar")
      {
        $scope.datos.cantidad ++;
        $scope.datos.importeTotal += creditoFB.importe;
      }
    })

    //A la escucha de utilizar créditos
    refCreditos.on('child_changed', function(data){
      console.info("Cambio: ", data.val());
      var creditoFB = data.val();
      if(creditoFB.estado == "usado")
      {
        $scope.datos.cantidad --;
        $scope.datos.importeTotal -= creditoFB.importe;
        console.info("Importe: ", $scope.datos.importeTotal, "Cantidad:", $scope.datos.cantidad);
        //NOTA: No me actualiza los datos en el model HTML.
      }
    })

    $scope.GenerarCredito = function(){
      if($scope.credito.importe > 0 && $scope.credito.importe === parseInt($scope.credito.importe, 10)){
        $scope.credito.usuario = "Lautaro";
        $scope.credito.estado = "sinUsar";
        $scope.credito.fecha = Firebase.ServerValue.TIMESTAMP;
        console.info($scope.credito);
        refCreditos.push($scope.credito);
        $scope.credito.importe = "";
      }
      else{
        console.log("Valor ingresado no válido");
      }
    }
});
