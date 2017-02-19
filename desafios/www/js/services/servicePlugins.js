angular.module('servicioPlugins', [])

.service('sPlugins', function ($timeout, $ionicPlatform) {

	$ionicPlatform.ready(function() {
	    //------------------------------------------ AUDIOS ---------------------------------------------//
	    if( window.plugins && window.plugins.NativeAudio ) {
	        window.plugins.NativeAudio.preloadSimple( 'agua', 'audio/agua.mp3', function(msg){
	        }, function(msg){
	            console.log( 'error: ' + msg );
	        });
	        window.plugins.NativeAudio.preloadSimple( 'derrota', 'audio/derrota.mp3', function(msg){
	        }, function(msg){
	            console.log( 'error: ' + msg );
	        });
	        window.plugins.NativeAudio.preloadSimple( 'fuego', 'audio/fuego.mp3', function(msg){
	        }, function(msg){
	            console.log( 'error: ' + msg );
	        });
	        window.plugins.NativeAudio.preloadSimple( 'triunfo', 'audio/triunfo.mp3', function(msg){
	        }, function(msg){
	            console.log( 'error: ' + msg );
	        });
	        window.plugins.NativeAudio.preloadSimple( 'creditos', 'audio/creditos.mp3', function(msg){
	        }, function(msg){
	            console.log( 'error: ' + msg );
	        });
	        window.plugins.NativeAudio.preloadSimple( 'ingreso', 'audio/ingreso.mp3', function(msg){
	        }, function(msg){
	            console.log( 'error: ' + msg );
	        });
	    };
	});

	return{
		Sonido: function(nombre){
			try{
	            window.plugins.NativeAudio.play(nombre);    
	        }
	        catch (err){
	            console.log("No se puede ejecutar cordovaNativeAudio en la PC");
	        }
		},
		
		Musica: function(nombre){
			$ionicPlatform.ready(function() {  
				try{
					window.plugins.NativeAudio.preloadComplex(nombre, 'audio/'+nombre+'.mp3', 1, 1, 0,
					function(msg) {
						console.log("Música cargada", msg);
						window.plugins.NativeAudio.loop(nombre);
					}, function(msg) {
						console.log('error: ' + msg);
					});
				}
				catch (err){
				    console.log("No se puede ejecutar cordovaNativeAudio en la PC");
				}
			});
		},

		PararMusica: function(nombre){
			try{
	            window.plugins.NativeAudio.stop(nombre);
	            window.plugins.NativeAudio.unload(nombre);
	        }
	        catch (err){
	            console.log("No se puede ejecutar cordovaNativeAudio en la PC");
	        }
		},

		Parar: function(nombre){
			try{
	            window.plugins.NativeAudio.stop(nombre);    
	        }
	        catch (err){
	            console.log("No se puede ejecutar cordovaNativeAudio en la PC");
	        }
		},

		Vibrar: function(duracion){
			try{
				navigator.vibrate(duracion);
			}
			catch(err){
				console.log("No se puede ejecutar vibración en la PC", err);
			}
		}
	}


});
