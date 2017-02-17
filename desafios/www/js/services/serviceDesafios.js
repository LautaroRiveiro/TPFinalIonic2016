angular.module('servicioDesafios', [])

.service('servicioDesafios', function ($timeout) {
	var desafios = {};

	//Referencio a Partidas de Firebase
    var refDesafios = new Firebase("https://tpfinalionic2016.firebaseio.com/desafios");

    refDesafios.on('child_added', function(data){
	    $timeout(function(){
	      //console.info(data.val(), data.key());
	      var desafio = data.val();
	      //desafio.key = data.key();
	      var campo = data.key();
	      //desafios.push(desafio);
	      desafios[campo] = desafio;
	      console.info("Desafios: ", desafios);
	    });
    });

    refDesafios.on('child_changed', function(data){
	    $timeout(function(){
	      //console.info(data.val(), data.key());
	      var desafio = data.val();
	      //desafio.key = data.key();
	      var campo = data.key();
	      //desafios.push(desafio);
	      desafios[campo] = desafio;
	      console.info("Desafio Modificado: ", desafio);
	    });
    });

    return {
        getDesafios: function () {
            return desafios;
        },
        pushDesafio: function(desafioNuevo) {
        	refDesafios.push(desafioNuevo);
        },
        getDesafio: function (key) {
            var desafioAux = jQuery.extend(true, {}, desafios[key]);

            var fecha = new Date(desafioAux.fechaCreado);
            desafioAux['fechaCreado'] = fecha.getDate() + "/" + (fecha.getMonth()+1) + "/" + fecha.getFullYear();
            console.info("desafioAux: ", desafioAux);
            //return desafios[key];
            return desafioAux;
        },
        updateDesafio: function (key, datosDesafiante) {
            refDesafios.child(key).update(datosDesafiante);
        }
        /*,
        setUsuario: function(value) {
            usuario = value;
        },
        setCreditos: function(value) {
            usuario.creditos = value;
        }*/
    };
});