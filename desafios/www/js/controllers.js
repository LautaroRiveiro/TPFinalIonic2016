angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('PerfilCtrl', function($scope, $stateParams, $state, $timeout) {
    
    //Creo un objeto usuario para almacenar los datos del usuario logueado
    $scope.usuario = {}
    //var user = firebase.auth().currentUser;
    $scope.token = {};
    $scope.token.mostrar = false;
    $scope.token.info = firebase.auth().currentUser;

    //Recupero de la tabla 'users' del firebase los datos del usuario a partir del UID del token
    var ref = new Firebase("https://tpfinalionic2016.firebaseio.com/users");
    ref.child(firebase.auth().currentUser.uid).on('child_added', function(data){
      $timeout(function(){
        console.info(data.val(), data.key());
        var valor = data.val();
        var campo = data.key();
        if(campo == "ingreso"){
            //var fecha = new Date(data.val().ingreso);
            var fecha = new Date(valor);
            console.info(fecha);
            valor = fecha.getDate() + "/" + (fecha.getMonth()+1) + "/" + fecha.getFullYear();
        }
        $scope.usuario[campo] = valor;
      });
    });

    $scope.Logout = function() {
      firebase.auth().signOut()
      .then(function(){
        //Estamos deslogueados
        console.log("Adios");
        //CurrentUser tiene los datos de la sesión. Si no hay sesión activa, muestra null.
        console.info(firebase.auth().currentUser);
        $timeout(function(){
            //$scope.estado = 'login';
            //$state.go('login');
            $state.go('login', null, {reload: true});
        }, 1000);
      }, function(error){
        //Error en deslogueo
        console.log("Error");
      });
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
