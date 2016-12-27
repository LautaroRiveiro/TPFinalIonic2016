angular.module('desafios.controller', [])

.controller('DesafiosCtrl', function($scope, $timeout, servicioDesafios, datosSesion, $state) {
    //$scope.datosSesion = {};
    // if(datosSesion.getUsuario() == null){
    //     $state.go("login");
    // }
    // else{
    //     $scope.datosSesion = datosSesion.getUsuario();
    //     console.info("datosSesion.getUsuario(): ELSE", datosSesion.getUsuario());
    // }
    $scope.datosSesion = {};
    $scope.datosSesion.uid = firebase.auth().currentUser.uid;

    //Creo las variables necesarias
    $scope.desafio = {};
    //$scope.desafio.monto = "";
    //$scope.desafio.texto = ""

    //Creo una bandera que determina qué mostrar:
    //Inicio (inicio), Buscar Desafío(buscar), Crear Desafío (crearDesafio) y Ampliar Desafío (desafío).
    $scope.bandera = {};
    $scope.bandera.estado = "inicio";
    

/*    $scope.desafios = [];

    //Referencio a Partidas de Firebase
    var refDesafios = new Firebase("https://tpfinalionic2016.firebaseio.com/desafios");

    refDesafios.on('child_added', function(data){
    $timeout(function(){
      console.info(data.val(), data.key());
      var desafio = data.val();
      desafio.key = data.key();
      $scope.desafios.push(desafio);
      console.info($scope.desafios, "Playlist: ", $scope.playlists);
    });
    });
*/
    //Recupero los desafíos del Firebase a partir del Service
    $scope.desafios = {};
    $scope.desafios = servicioDesafios.getDesafios();

    //----------------------------- INICIO -----------------------------//
    $scope.ResponderDesafio = function(key){
        $scope.desafio = servicioDesafios.getDesafio(key);
        $scope.bandera.estado = 'responderDesafio';
        $scope.key = key;
    };

    $scope.Resultado = function(resultado){
        if(resultado == "ganador"){
            //GANÉ Y ME COBRO LOS CRÉDITOS Y ACTUALIZO LA PARTIDA A FINALIZADA
            alert("GANASTE");
        }
        else{
            //PERDÍ Y LE DOY LOS CRÉDITOS AL OPONENTE Y ACTUALIZO LA PARTIDA A FINALIZADA
            alert("PERDISTE");
        }
        $scope.VolverAlInicio();
    };

    $scope.VolverAlInicio = function(){
        //Reinicio valores
        for (var variableKey in $scope.desafio){
          if ($scope.desafio.hasOwnProperty(variableKey)){
              delete $scope.desafio[variableKey];
          }
        }
        $scope.key = "";
        console.info("$scope.desafio (reiniciado): ", $scope.desafio);
        //Vuelvo a las desafios creadas
        $scope.bandera.estado = "inicio";
    };
    //------------------------- CREAR DESAFÍO -------------------------//
    
    $scope.Guardar = function(){
        console.info($scope.desafio);
        //Valido que estén monto y ubicación cargados
        if($scope.desafio.monto != "" && $scope.desafio.texto != ""){
            $scope.desafio.creador = datosSesion.getUsuario().nombre;
            $scope.desafio.fechaCreado = Firebase.ServerValue.TIMESTAMP;
            $scope.desafio.estado = "esperando";
            $scope.desafio.creadorUid = firebase.auth().currentUser.uid;
            //Subo la apuesta al Firebase
            servicioDesafios.pushDesafio($scope.desafio);
            //Reinicio valores
            for (var variableKey in $scope.desafio){
              if ($scope.desafio.hasOwnProperty(variableKey)){
                  delete $scope.desafio[variableKey];
              }
            }
            //Vuelvo a las desafios creadas
            $scope.bandera.estado = "inicio";
        }
        else{
            alert("Faltan datos");
        }
    };

    /*   
        $scope.Guardar = function(){
            console.info($scope.desafio);
            //Valido que estén monto y ubicación cargados
            if($scope.desafio.monto != "" && $scope.desafio.texto != ""){
                $scope.desafio.creador = "Lautaro";
                $scope.desafio.fecha = Firebase.ServerValue.TIMESTAMP;
                $scope.desafio.estado = "esperando";
                //Subo la apuesta al Firebase
                refDesafios.push($scope.desafio);
                //Reinicio valores
                $scope.desafio.monto = "";
                $scope.desafio.texto = "";
                //Vuelvo a las desafios creadas
                $scope.bandera.estado = "inicio";
            }
            else{
                alert("Faltan datos");
            }
        };
    */

    $scope.Cancelar = function(){
        //Reinicio valores
        for (var variableKey in $scope.desafio){
          if ($scope.desafio.hasOwnProperty(variableKey)){
              delete $scope.desafio[variableKey];
          }
        }
        //Vuelvo a los desafios creados
        $scope.bandera.estado = "inicio";
    };

    /*
        $scope.Cancelar = function(){
            //Reinicio valores
            $scope.desafio.monto = "";
            $scope.desafio.texto = "";
            //Vuelvo a los desafios creados
            $scope.bandera.estado = "inicio";
        };
    */

    //------------------------- BUSCAR DESAFÍO -------------------------//

    $scope.AmpliarDesafio = function(key){
        //Recupero el desafío indicado (key) a partir del service
        //(en el service le adapto la fecha porque no me salió acá por el tema de la llamada asincrónica)
        $scope.desafio = servicioDesafios.getDesafio(key);
        //Cambio la pantalla a Ampliar Desafío
        $scope.bandera.estado = 'desafio';
        //Guardo la key para después guardar los datos del desafiante en Firebase
        $scope.key = key;
    };

    /*
        $scope.AmpliarDesafio = function(key){
            $scope.bandera.estado = 'desafio';
            $scope.key = key;
            console.info("KEY: ", $scope.key);
        };
    */
 
    $scope.Aceptar = function(){
        //Cambiar datos del desafio existente
        var datosDesafiante = {
            desafiante: datosSesion.getUsuario().nombre,
            desafianteUid: firebase.auth().currentUser.uid,
            estado: "aceptado",
            fechaAceptado: Firebase.ServerValue.TIMESTAMP
        };
        servicioDesafios.updateDesafio($scope.key, datosDesafiante);

        //Reinicio valores
        for (var variableKey in $scope.desafio){
          if ($scope.desafio.hasOwnProperty(variableKey)){
              delete $scope.desafio[variableKey];
          }
        }
        $scope.key = "";
        console.info("$scope.key (reiniciada): ", $scope.key);
        console.info("$scope.desafio (reiniciado): ", $scope.desafio);
        $scope.bandera.estado = "inicio";
    };

    /*
        $scope.Aceptar = function(){
            //Cambiar datos del desafio existente
            firebase.database().ref("/desafios/"+$scope.key).update({
                desafiante: "Facundo",
                estado: "aceptado"
            });
            //Reinicio valores
            $scope.key = "";
            console.info("KEY: ", $scope.key);
            $scope.bandera.estado = "inicio";
        };
    */

    $scope.Volver = function(){
        //Reinicio valores
        for (var variableKey in $scope.desafio){
          if ($scope.desafio.hasOwnProperty(variableKey)){
              delete $scope.desafio[variableKey];
          }
        }
        $scope.key = "";
        console.info("$scope.desafio (reiniciado): ", $scope.desafio);
        //Vuelvo a las desafios creadas
        $scope.bandera.estado = "inicio";
    };

    /*
        $scope.Volver = function(){
            //Reinicio valores
            $scope.key = "";
            console.info("KEY: ", $scope.key);
            //Vuelvo a las desafios creadas
            $scope.bandera.estado = "inicio";
        };
    */
});