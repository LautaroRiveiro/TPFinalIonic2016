angular.module('servicios', [])

.service('datosSesion', function ($timeout, $ionicPlatform) {
    var usuario = {};

    //Recupero de la tabla 'users' del firebase los datos del usuario a partir del UID del token
    var ref = new Firebase("https://tpfinalionic2016.firebaseio.com/users");
    ref.child(firebase.auth().currentUser.uid).on('child_added', function(data){
      $timeout(function(){
        //console.info(data.val(), data.key());
        var valor = data.val();
        var campo = data.key();
        if(campo == "ingreso"){
            //var fecha = new Date(data.val().ingreso);
            var fecha = new Date(valor);
            //console.info(fecha);
            valor = fecha.getDate() + "/" + (fecha.getMonth()+1) + "/" + fecha.getFullYear();
        }
        usuario[campo] = valor;
      });
    });

    ref.child(firebase.auth().currentUser.uid).on('child_changed', function(data){
      $timeout(function(){
        var valor = data.val();
        var campo = data.key();
        if(campo == "creditos"){
            usuario[campo] = valor;
        }
      });
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        ref.child(firebase.auth().currentUser.uid).on('child_added', function(data){
          $timeout(function(){
            //console.info("desde: datosSesion -> onAuthStateChanged", data.val(), data.key());
            var valor = data.val();
            var campo = data.key();
            if(campo == "ingreso"){
                //var fecha = new Date(data.val().ingreso);
                var fecha = new Date(valor);
                //console.info(fecha);
                valor = fecha.getDate() + "/" + (fecha.getMonth()+1) + "/" + fecha.getFullYear();
            }
            usuario[campo] = valor;
          });
        });

        try{
            var push = PushNotification.init({
                android: {
                //Es el mismo SENDER ID de siempre y es el único dato obligatorio en el init.
                senderID: "359101398196"
                },
                ios: {},
                windows: {}
            });
            //Cuando se registra el ID del usuario
            push.on('registration', function(data) {
                console.log("registrationId:" + data.registrationId);
                console.info("push", push);
                firebase.database().ref('users/'+firebase.auth().currentUser.uid).update({
                    registrationId: data.registrationId
                });
            });
            //Cuando le llega una notificación al usuario
            push.on('notification', function(data) {
                console.log("Nueva notificacion", data);
            });
            //Cuando se produce un error
            push.on('error', function(e) {
                console.log(e.message);
            });
        }
        catch(error){
            console.log("La PC no otorga ID de notificaciones.", error);
        };

      } else {
        for (var variableKey in usuario){
            if (usuario.hasOwnProperty(variableKey)){
                delete usuario[variableKey];
            }
        };
      }
    });


  $ionicPlatform.ready(function() {
    //------------------------------------- PUSH NOTIFICATION ----------------------------------------//
    try{
        //Configuración inicial cada vez que se inicia la App
        var push = PushNotification.init({
          android: {
            //Es el mismo SENDER ID de siempre y es el único dato obligatorio en el init.
            senderID: "359101398196"
          },
          ios: {},
          windows: {}
        });

        //Cuando se registra el ID del usuario
        push.on('registration', function(data) {
          console.log("registrationId:" + data.registrationId);
          console.info("push", push);
          firebase.database().ref('users/'+firebase.auth().currentUser.uid).update({
              registrationId: data.registrationId
          });
        });

        //Cuando le llega una notificación al usuario
        push.on('notification', function(data) {
          console.log("Nueva notificacion", data);
        });

        //Cuando se produce un error
        push.on('error', function(e) {
          console.log(e.message);
        });
    }
    catch(error){
            console.log("La PC no otorga ID de notificaciones.", error);
    }
  });


    return {
        getUsuario: function () {
            return usuario;
        },
        setUsuario: function(value) {
            usuario = value;
        },
        setCreditos: function(value) {
            usuario.creditos = value;
            ref.child(firebase.auth().currentUser.uid).update({
                creditos: value
            });
        },
        getCreditos: function() {
            return usuario['creditos'];
        },
        getUid: function () {
            return firebase.auth().currentUser.uid;
        },
        getRegistrationId: function () {
             return usuario['registrationId'];
        },
        sumarCreditos: function(value) {
            usuario.creditos += parseInt(value);
            ref.child(firebase.auth().currentUser.uid).update({
                creditos: usuario.creditos
            });
        },
        esAdmin: function(){
            if (usuario.administrador == null || usuario.administrador == undefined){
                return false;
            }
            if (usuario.administrador) {
                return true;
            }
            return false;
        }
    };
});