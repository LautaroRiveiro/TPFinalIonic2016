angular.module('batallaNaval.controller', [])

.controller('BatallaNavalCtrl', function($scope, $timeout, datosSesion, $state) {
  //Creo las variables necesarias
  $scope.partida = {};
  $scope.bandera = {};
  $scope.bandera.estado = "inicio";
  $scope.partidas = {};
  $scope.partidasPropiasEsperando = {};
  $scope.partidasEnJuego = {};
  $scope.turno = {};
  $scope.turno.turno = firebase.auth().currentUser.uid;
  $scope.mostrarRadio = {};
  $scope.mostrarRadio._1 = false;
  $scope.mostrarRadio._2 = false;
  $scope.mostrarRadio._3 = false;
  $scope.mostrarRadio._4 = false;

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
      else if (partida.creadorUid == firebase.auth().currentUser.uid && partida.estado == "esperando"){
          $scope.partidasPropiasEsperando[partida.key] = partida;
      }
      if (partida.estado != "esperando" && (partida.creadorUid == firebase.auth().currentUser.uid || partida.desafianteUid == firebase.auth().currentUser.uid)) {
          $scope.partidasEnJuego[partida.key] = partida;
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
      if (partida.creadorUid == firebase.auth().currentUser.uid && partida.estado != "esperando"){
          delete $scope.partidasPropiasEsperando[partida.key];
      }
      if (partida.estado != "esperando" && (partida.creadorUid == firebase.auth().currentUser.uid || partida.desafianteUid == firebase.auth().currentUser.uid)) {
          $scope.partidasEnJuego[partida.key] = partida;
      }
      console.info("Partidas modif: ", $scope.partidas);
      console.info("Partidas Propias modif: ", $scope.partidasPropias);
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
        fechaAceptado: Firebase.ServerValue.TIMESTAMP,
        turno: firebase.auth().currentUser.uid
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
    $scope.bandera.estado = "buscar";
  };

  //---------------------------- TU TURNO -----------------------------------//
  /* Cuando selecciono una de las partidas que tengo turno, hago lo siguiente:
   * 1. Clono (NO referencio) la partida y sus descendientes, o sea los turnos, a una variable $scope.partida
   * 2. Habilito la vista (estado) para elegir ubicación
   * 3. Guardo la key de la partida en una variable para luego updatear la jugada en Firebase
   * 4. Disableo las opciones donde ya jugué y no acerté
   */
  $scope.JugarTurno = function(partida){
    $scope.partida = jQuery.extend(true, {}, partida);
    $scope.bandera.estado = 'jugar';
    $scope.key = $scope.partida.key;
    $scope.partida.ubicacionDesafiante = "";
    for (var variableKey in $scope.partida.turnos){
      if ($scope.partida.turnos[variableKey].jugador == firebase.auth().currentUser.uid){
          $scope.mostrarRadio["_"+$scope.partida.turnos[variableKey].ubicacion] = true;
      };
    };
  };

  //Cancelar jugada sin elegir
  $scope.VolverJugada = function(){
    //Reinicio valores
    for (var variableKey in $scope.partida){
        if ($scope.partida.hasOwnProperty(variableKey)){
            delete $scope.partida[variableKey];
        }
    }
    //Vuelvo al inicio de las partidas
    $scope.bandera.estado = "inicio";
  };

  /* Cuando acepto la jugada, hago lo siguiente:
   * 1. Valido que esté la ubicación cargada
   * 2. Identifico el uid del oponente para updatear la partida y poner que le toca al otro
   * 3. Cambiar datos de la partida existente
   * 4. Reinicio valores y regreso
   */
  $scope.AceptarJugada = function(){
    //Valido que esté la ubicación cargada
    if($scope.partida.ubicacionDesafiante != ""){
      
      //Identifico el uid del oponente (no se me ocurrió nada mejor)
      var uidOponente = "";
      if($scope.partida.creadorUid != firebase.auth().currentUser.uid){
         uidOponente = $scope.partida.creadorUid;
      }
      else{
         uidOponente = $scope.partida.desafianteUid;
      };
      console.info("OPONENTE", uidOponente);
      
      //Cambiar datos de la partida existente
      firebase.database().ref("/partidas/"+$scope.key).update({
        turno: uidOponente
      });
      firebase.database().ref("/partidas/"+$scope.key+"/turnos").push({
        jugador: firebase.auth().currentUser.uid,
        fecha: Firebase.ServerValue.TIMESTAMP,
        ubicacion: $scope.partida.ubicacionDesafiante
      });

      //Reinicio valores y regreso
      for (var variableKey in $scope.partida){
          if ($scope.partida.hasOwnProperty(variableKey)){
              delete $scope.partida[variableKey];
          }
      }
      $scope.bandera.estado = "inicio";
    }
    else{
      alert("Falta elegir ubicación");
    }
  };

});