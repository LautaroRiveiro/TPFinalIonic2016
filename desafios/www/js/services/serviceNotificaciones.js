angular.module('servicioNotificaciones', [])

.service('sNotificaciones', function ($timeout, $ionicPlatform, $http) {

	var data = {};

    var req = {
      method: 'POST',
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        'Content-Type': "application/json",
        'Authorization': 'key=AAAAU5wcfLQ:APA91bFy33R9zTKzC7Le07yOufJge22g1KCVuiuWlsCVjMfXsda4Z780HuX2HqtQbO1GYp1MX4-UCKf-RgphABpwJTIGsRyQhde-bz9M2rdLCDk1pcsH2RXWWbKyaMRi_m7k1YTSgMDnrh6uQoHZ5lcjb4f8TC58Gg'
      },
      data: data
    };

	function Enviar(data){
		req.data = data;
		$http(req).then(function(data){console.info("data", data);}, function(error){console.info("error", error);});
	}

	return{
		DesafioTriunfo: function(registerID){
			if(registerID != null){
			    data = JSON.stringify({
			        "to": registerID,
			        "notification":{
			            "title":"Felicitaciones!!",
			            "body":"Has ganado un desafío",
			            //"sound":"notificacion.mp3",
			            "sound":"default",
			            "click_action":"FCM_PLUGIN_ACTIVITY", //Must be present for Android
			            "icon":"fcm_push_icon" //White icon Android resource
			        },
			        "priority":"high" //If not set, notification won't be delivered on completely closed iOS app
			    });
			    Enviar(data);
			}
			else{
				console.info("El usuario no tiene registrado un ID");
			}
		},
		
		DesafioDerrota: function(registerID){
			if(registerID != null){
			    data = JSON.stringify({
			        "to": registerID,
			        "notification":{
			            "title":"Malas noticias",
			            "body":"Has perdido un desafío",
			            "sound":"default",
			            "click_action":"FCM_PLUGIN_ACTIVITY", //Must be present for Android
			            "icon":"fcm_push_icon" //White icon Android resource
			        },
			        "priority":"high" //If not set, notification won't be delivered on completely closed iOS app
			    });
			    Enviar(data);
			}
			else{
				console.info("El usuario no tiene registrado un ID");
			}
		},
		
		BatallaTriunfo: function(registerID){
			if(registerID != null){
			    data = JSON.stringify({
			        "to": registerID,
			        "notification":{
			            "title":"Felicitaciones!!",
			            "body":"Has ganado una batalla",
			            //"sound":"ao.wav",
			            "sound":"default",
			            "click_action":"FCM_PLUGIN_ACTIVITY", //Must be present for Android
			            "icon":"fcm_push_icon" //White icon Android resource
			        },
			        "priority":"high" //If not set, notification won't be delivered on completely closed iOS app
			    });
			    Enviar(data);
			}
			else{
				console.info("El usuario no tiene registrado un ID");
			}
		},
		
		BatallaDerrota: function(registerID){
			if(registerID != null){
			    data = JSON.stringify({
			        "to": registerID,
			        "notification":{
			            "title":"Malas noticias",
			            "body":"Has perdido una batalla",
			            "sound":"default",
			            "click_action":"FCM_PLUGIN_ACTIVITY", //Must be present for Android
			            "icon":"fcm_push_icon" //White icon Android resource
			        },
			        "priority":"high" //If not set, notification won't be delivered on completely closed iOS app
			    });
			    Enviar(data);
			}
			else{
				console.info("El usuario no tiene registrado un ID");
			}			    
		}
	};
});
