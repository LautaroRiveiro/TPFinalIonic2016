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
