angular.module('login.controller', [])

.controller('LoginCtrl', function($scope, $timeout, $state, $cordovaOauth, sPlugins, $ionicPlatform){
  
    sPlugins.Musica('intro');
    
    // Form data for the login modal
    $scope.loginData = {};
    $scope.estado = {};

    $scope.Logout = function() {
      firebase.auth().signOut()
      .then(function(){
        //Estamos deslogueados
        console.log("Adios");
        //CurrentUser tiene los datos de la sesión. Si no hay sesión activa, muestra null.
        console.info(firebase.auth().currentUser);
        $timeout(function(){
            $scope.estado = 'login';
        }, 1000);
      }, function(error){
        //Error en deslogueo
        console.log("Error");
      });
    };

    $scope.SignUp = function(){
        firebase.auth().createUserWithEmailAndPassword($scope.loginData.username, $scope.loginData.password)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
              alert('The password is too weak.');
            } else {
              alert(errorMessage);
            }
            console.log(error);
        })
        .then(function(respuesta){
          $timeout(function(){
            if(respuesta != undefined)
            {
              //Agrego los datos del USER en una tabla paralela del Firebase, usando como key el UID.
              var ref = new Firebase("https://tpfinalionic2016.firebaseio.com/users");
              ref.child(respuesta.uid).set(respuesta.providerData[0]);
              ref.child(respuesta.uid).update({nombre: $scope.loginData.nombre});
              ref.child(respuesta.uid).update({creditos: 100});
              ref.child(respuesta.uid).update({ingreso: Firebase.ServerValue.TIMESTAMP});
              console.info("Bienvenido", respuesta);
              sPlugins.PararMusica("intro");
              $state.go("app.perfil");
            }
          }, 1000);
        });
    };

    $scope.doLogin = function() {
    
      console.log('Doing login', $scope.loginData);
      //Llamo a la función de Firebase que comprueba las credenciales por el método mail y password.
      //Esta función va a recibir como parámetro el username y la contraseña.
      //Si no son correctos los datos, llama a catch. Puede ser error de usuario o de contraseña.
      //Los errores pueden ser: usuario no existente, contraseña inválida, mail con mal formato.
      //Independientemente de lo que resulte, lama a then. Si fue correcto, en "respuesta" almaceno todos los datos. En respuesta.providerData tengo un array con la información del log.
      firebase.auth().signInWithEmailAndPassword($scope.loginData.username, $scope.loginData.password)
      .catch(function(error){
          //NO SE PUDO LOGUEAR
          //Muestro por consola
          console.info(error);

          //Muestro un alert con el tipo de error
          switch(error.code){
              case "auth/invalid-email":
                alert("Mail con formato incorrecto");
                break;
              case "auth/user-not-found":
                alert("El usuario ingresado no existe");
                break;
              case "auth/wrong-password":
                alert("Contraseña incorrecta");
                break;
              default:
                alert("Error");
                break;
          }
      })
      .then(function(respuesta){
        //ACÁ ENTRA SIEMPRE
        //Pongo todo el código en un timeout para evitar problemas de sincronización
        $timeout(function(){
          //Evalúo si respuesta está cargada con los datos de sesión
          if(respuesta != undefined)
          {
            //SE LOGUEÓ
            console.info("Bienvenido", respuesta);
            //Podría redirigir a otro state
            sPlugins.PararMusica("intro");
            $state.go("app.perfil");
            //O también cambiar 'estado' para mostrar otra parte de código HTML en este mismo template
            //$scope.estado = 'logueado';
          }
          else
          {
            //NO SE LOGUEÓ
            console.info("Error de ingreso", respuesta);
          }
        }, 1000);
      });
    };

    $scope.ResetearClave = function(){
        firebase.auth().sendPasswordResetEmail($scope.loginData.username)
        .then(function(){
            console.log("Revisar el correo");
        }, function(error){
            console.info("error", error);
            //Muestro un alert con el tipo de error
            switch(error.code){
                case "auth/invalid-email":
                  alert("Mail con formato incorrecto");
                  break;
                case "auth/user-not-found":
                  alert("El usuario ingresado no existe");
                  break;
                case "auth/wrong-password":
                  alert("Contraseña incorrecta");
                  break;
                default:
                  alert("Error");
                  break;
            }
        });
    };

    $scope.Test = function(tipoUsuario){
      if(tipoUsuario == "usuario"){
          $scope.loginData.username= "usuario@usuario.com";
          $scope.loginData.password= "12345678";
      }
      else if(tipoUsuario == "admin"){
          $scope.loginData.username= "admin@admin.com";
          $scope.loginData.password= "12345678";
      }
      else{
          $scope.loginData.username= "";
          $scope.loginData.password= "";
      }
    };

    $scope.HabilitarRegistro = function(){
      $scope.loginData.username= "";
      $scope.loginData.password= "";
      $scope.estado.estado = 'registro';
      $scope.estado.boton = 'REGISTRARSE';
    };

    $scope.HabilitarLogin = function(){
      $scope.loginData.nombre= "";
      $scope.loginData.username= "";
      $scope.loginData.password= "";
      $scope.estado.estado = 'login';
      $scope.estado.boton = 'INGRESAR';
    };

    $scope.HabilitarLogin();


    $scope.LoginGithub = function(){

        $cordovaOauth.github("5d7d6cbf5d9612e59d34", "adaf6159b60aecf3100737e8dca984c52bcfbab7", []).then(function(result) {
            var token = result.access_token;
            var credential = firebase.auth.GithubAuthProvider.credential(token);
            firebase.auth().signInWithCredential(credential)
            .catch(function(error) {
              console.info("error", error);
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              console.info("error credential", error.credential);
            })
            .then(function(respuesta){
              console.info("respuesta", respuesta);
              console.info("respuesta.providerData[0]",respuesta.providerData[0]);
              //console.info("respuesta.providerData[0].email",respuesta.providerData[0].email);
              console.info("respuesta.uid",respuesta.uid);              
              
              var providerData = respuesta.providerData[0];

              if(respuesta.providerData[0].email == null){
                //TIENE EL MAIL OCULTO EN LA CONFIGURACION DE GITHUB
                console.info("EMAIL NULL (Lo tiene oculto en el Settings de su GitHub)");
              }

              var ref = new Firebase("https://tpfinalionic2016.firebaseio.com/users/"+respuesta.uid);
              ref.once('value', function(snapshot) {
                console.info("snapshot val", snapshot.val());

                //VER SI EXISTE EL USUARIO EN DATABASE DE FIREBASE (por el UID) Y SI NO CREARLO
                if (snapshot.val() == null) {
                  var usuario = {
                    nombre: providerData.displayName,
                    creditos: 100,
                    ingreso: Firebase.ServerValue.TIMESTAMP,
                    email: providerData.email,
                    foto: providerData.photoURL
                  };
                  //Agrego los datos del USER en una tabla paralela del Firebase, usando como key el UID.
                  ref.set(usuario);
                  console.info("USUARIO", usuario);
                  //ref.child(respuesta.uid).set(usuario);
                  // ref.child(respuesta.uid).update({nombre: providerData.displayName});
                  // ref.child(respuesta.uid).update({creditos: 100});
                  // ref.child(respuesta.uid).update({ingreso: Firebase.ServerValue.TIMESTAMP});
                  console.info("Bienvenido", respuesta);
                  //$state.go("app.sobremi");
                }
              
                $timeout(function(){
                  //Evalúo si respuesta está cargada con los datos de sesión
                  if(respuesta != undefined){
                    //SE LOGUEÓ
                    console.info("Bienvenido", respuesta);
                    sPlugins.PararMusica("intro");
                    $state.go("app.perfil");
                  }
                  else{
                    console.info("Error de ingreso", respuesta);
                  }
                }, 1000);
              });
            });
        }, function(error) {
            console.info("ERROR", error);
        });;
    };
});
