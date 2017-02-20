angular.module('servicioMensajes', [])

.service('servicioMensajes', function ($timeout, datosSesion) {
	var datos = {};
    datos.notificaciones = {};

	//Referencio a Partidas de Firebase
    var ref = firebase.database().ref('notificaciones');
    ref.on('child_added', function(data){
      $timeout(function(){
        if (data.val().usuarioUid == datosSesion.getUid() && data.val().notificado == false) {
            datos.notificaciones[data.key] = data.val();
            console.info("Agregado", data.val());
            var fecha = new Date(data.val().fecha);
            datos.notificaciones[data.key].fecha = fecha.getDate() + "/" + (fecha.getMonth()+1) + "/" + fecha.getFullYear();
            datos.cantidad = $.map(datos.notificaciones, function(n, i) { return i; }).length;
        }
        console.info("data.val", data.val());
      });
    });

    return {
        getNotificaciones: function () {
            return datos.notificaciones;
        },
        pushNotificacion: function(obj) {
        	ref.push(obj);
        },
        getNotificacion: function (key) {
            var notificacionAux = jQuery.extend(true, {}, datos.notificaciones[key]);
            var fecha = new Date(notificacionAux.fechaCreado);
            notificacionAux['fechaCreado'] = fecha.getDate() + "/" + (fecha.getMonth()+1) + "/" + fecha.getFullYear();
            console.info("notificacionAux: ", notificacionAux);
            return notificacionAux;
        },
        updateNotificacion: function (key, obj) {
            ref.child(key).update(obj);
            delete datos.notificaciones[key];
        },
        getCantidad: function () {
            return datos.cantidad;
        }
    };
});