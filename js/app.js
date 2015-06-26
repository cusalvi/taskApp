/*global taskApp, angular */
/**
 * The main Task app module
 *
 * @type {angular.Module}
 */
// using BuiltSDK;
// Built.initialize('application_api_key', 'application_uid');
var app = Built.App('bltda5a1db14d37300a').persistSessionWith(Built.Session.LOCAL_STORAGE);
var user = app.User;
var query = app.Class('task').Query();
var Task = app.Class('task').Object;
// task = Task();

// define our application and pull in ngRoute
var taskApp = angular.module('taskApp', ['ngRoute']);
// ROUTING ===============================================
// set our routing for this application
// each route will pull in a different controller
taskApp.config(function($routeProvider) {
    $routeProvider
        // login page
        .when('/', {
            templateUrl: 'page-login.html',
            controller: 'LoginController',
            resolve: {
                notLoggedIn : function ($location,$q) {
                    var deferred = $q.defer();
                    var auth=user.isAuthenticated();
                    if (auth==false) {
                        deferred.resolve();
                    }
                    else {
                        deferred.reject();
                        $location.url('/todo');
                    };
                    return deferred.promise;
                }
            }
        })

        // register page
        .when('/register', {
            templateUrl: 'page-register.html',
            controller: 'RegisterController'
        })

        // todo page
        .when('/todo', {
            templateUrl: 'page-todo.html',
            controller: 'TodoController',
            resolve: {
                onlyLoggedIn : function ($location,$q) {
                    var deferred = $q.defer();
                    var auth=user.isAuthenticated();
                    if (auth==true) {
                        deferred.resolve();
                    }
                    else {
                        deferred.reject();
                        $location.url('/');
                    };
                    return deferred.promise;
                }
            }

        });
    });