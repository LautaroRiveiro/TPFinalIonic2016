angular.module('servicios', [])

.service('datosSesion', function ($timeout) {
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
      } else {
        for (var variableKey in usuario){
            if (usuario.hasOwnProperty(variableKey)){
                delete usuario[variableKey];
            }
        };
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
        sumarCreditos: function(value) {
            usuario.creditos += parseInt(value);
            ref.child(firebase.auth().currentUser.uid).update({
                creditos: usuario.creditos
            });
        }
    };
});