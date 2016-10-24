angular.module('desafios.controller', [])

.controller('DesafiosCtrl', function($scope, $timeout) {
    //Creo las variables necesarias
    $scope.desafio = {};
    $scope.desafio.monto = "";
    $scope.desafio.texto = ""
    $scope.bandera = {};
    $scope.bandera.estado = "inicio";
    $scope.desafios = [];

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

    $scope.Cancelar = function(){
        //Reinicio valores
        $scope.desafio.monto = "";
        $scope.desafio.texto = "";
        //Vuelvo a los desafios creados
        $scope.bandera.estado = "inicio";
    };


    $scope.AmpliarDesafio = function(key){
        $scope.bandera.estado = 'desafio';
        $scope.key = key;
        console.info("KEY: ", $scope.key);
    };

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

    $scope.Volver = function(){
    //Reinicio valores
    $scope.key = "";
    console.info("KEY: ", $scope.key);
    //Vuelvo a las desafios creadas
    $scope.bandera.estado = "inicio";
    };
});