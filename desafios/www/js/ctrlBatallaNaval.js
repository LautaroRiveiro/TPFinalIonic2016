angular.module('batallaNaval.controller', [])

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
      $scope.partida.estado = "esperando";
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
  };

  $scope.Aceptar = function(){
    //Valido que esté la ubicación cargada
    if($scope.partida.ubicacionDesafiante != ""){
      //Cambiar datos de la partida existente
      firebase.database().ref("/partidas/"+$scope.key).update({
        desafiante: "Facundo",
        ubicacionDesafiante: $scope.partida.ubicacionDesafiante,
        estado: "aceptado"
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
  };
});