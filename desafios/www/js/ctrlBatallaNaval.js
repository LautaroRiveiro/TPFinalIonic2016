angular.module('batallaNaval.controller', [])

.controller('BatallaNavalCtrl', function($scope, $timeout, datosSesion, $state) {
  //Creo las variables necesarias
  $scope.partida = {};
  $scope.bandera = {};
  $scope.bandera.estado = "inicio";
  $scope.partidas = {};
  //$scope.partidasPropias = [];

  //Referencio a Partidas de Firebase
  var refPartidas = new Firebase("https://tpfinalionic2016.firebaseio.com/partidas");
  refPartidas.on('child_added', function(data){
    $timeout(function(){
      var partida = data.val();
      partida.key = data.key();
      if(partida.creadorUid != firebase.auth().currentUser.uid && partida.estado == "esperando"){
          //$scope.partidas.push(partida);  
          $scope.partidas[partida.key] = partida;
      }
      console.info("Partidas nueva: ", $scope.partidas);
    });
  });

  refPartidas.on('child_changed', function(data){
    $timeout(function(){
      var partida = data.val();
      partida.key = data.key();
      if(partida.creadorUid != firebase.auth().currentUser.uid && partida.estado != "esperando"){
          //$scope.partidas.splice(partida.key, 1);
          delete $scope.partidas[partida.key];
      }
      console.info("Partidas modif: ", $scope.partidas);
    });
  });

  $scope.Guardar = function(){
    console.info($scope.partida);
    //Valido que estén monto y ubicación cargados
    if($scope.partida.monto != undefined && $scope.partida.ubicacionCreador != undefined){
      $scope.partida.creador = datosSesion.getUsuario().nombre;
      $scope.partida.creadorUid = firebase.auth().currentUser.uid;
      $scope.partida.fechaCreado = Firebase.ServerValue.TIMESTAMP;
      $scope.partida.estado = "esperando";
      //Subo la apuesta al Firebase
      refPartidas.push($scope.partida);
      //Reinicio valores
      for (var variableKey in $scope.partida){
          if ($scope.partida.hasOwnProperty(variableKey)){
              delete $scope.partida[variableKey];
          }
      }
      //Vuelvo a las partidas creadas
      $scope.bandera.estado = "inicio";
    }
    else{
      alert("Faltan datos");
    }
  };

  $scope.Cancelar = function(){
    //Reinicio valores
    //$scope.partida.monto = "";
    //$scope.partida.ubicacionCreador = "";
    for (var variableKey in $scope.partida){
        if ($scope.partida.hasOwnProperty(variableKey)){
            delete $scope.partida[variableKey];
        }
    }
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
        desafiante: datosSesion.getUsuario().nombre,
        desafianteUid: firebase.auth().currentUser.uid,
        ubicacionDesafiante: $scope.partida.ubicacionDesafiante,
        estado: "aceptado",
        fechaAceptado: Firebase.ServerValue.TIMESTAMP
      });
      //Reinicio valores
      //$scope.key = "";
      //$scope.partida.ubicacionDesafiante = "";
      for (var variableKey in $scope.partida){
          if ($scope.partida.hasOwnProperty(variableKey)){
              delete $scope.partida[variableKey];
          }
      }
      console.info("KEY: ", $scope.key);
      $scope.bandera.estado = "inicio";
      //$state.transitionTo($state.current, $stateParams, { 
        //reload: true, inherit: false, notify: false 
      //});
    }
    else{
      alert("Falta elegir ubicación");
    }
  };

  $scope.Volver = function(){
    //Reinicio valores
    //$scope.key = "";
    //$scope.partida.ubicacionDesafiante = "";
    for (var variableKey in $scope.partida){
        if ($scope.partida.hasOwnProperty(variableKey)){
            delete $scope.partida[variableKey];
        }
    }
    console.info("KEY: ", $scope.key);
    //Vuelvo a las partidas creadas
    $scope.bandera.estado = "inicio";
  };
});