// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'batallaNaval.controller', 'desafios.controller', 'login.controller'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.perfil', {
    url: '/perfil',
    views: {
      'menuContent': {
        templateUrl: 'templates/perfil.html',
        controller: 'PerfilCtrl'
      }
    }
  })

  .state('app.batallanaval', {
    url: '/batallanaval',
    views: {
      'menuContent': {
        templateUrl: 'templates/batallanaval.html',
        controller: 'BatallaNavalCtrl'
      }
    }
  })

  .state('app.desafios', {
    url: '/desafios',
    views: {
      'menuContent': {
        templateUrl: 'templates/desafios.html',
        controller: 'DesafiosCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/partida/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })

  .state('app.sobremi', {
      url: '/sobremi',
      views: {
        'menuContent': {
          templateUrl: 'templates/sobremi.html'
        }
      }
    })

  .state('app.generar', {
      url: '/generar',
      views: {
        'menuContent': {
          templateUrl: 'templates/generarcreditos.html',
          controller: 'GenerarCtrl'
        }
      }
    })
  
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
})

//Para sacar la caché por defecto a la aplicación para no guardar los datos entre cada vista y login.
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);
});
