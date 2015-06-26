taskApp.controller('TodoController', function($scope) {
    'use strict';

    $scope.pageClass = 'page-todo';

    $scope.todoList = [];
    $scope.val = true;
    $scope.load=function(){

        $scope.todoList = [];
        user.getSession()
            .then(function(user) {

                $scope.remaining = 0;
                console.log(user.data.email);
                $scope.username=user.data.email;
                $scope.$apply();
                query
                    .where('app_user_object_uid', user.data.uid)

                .toJSON()
                    .exec()
                    .then(function(objects) {
                        for (var i = 0; i < objects.length; i++) {
                            console.log(objects[i].completed);
                            $scope.todoList.push({
                                uid:objects[i].uid,
                                title: objects[i].title,
                                completed: objects[i].completed
                            });
                            if (!objects[i].completed) {
                                $scope.remaining += 1;
                                console.log($scope.remaining);
                            };
                            console.log($scope.todoList);
                            $scope.$apply();
                        }
                    })


            });
    }


    // for checked attribute
    $scope.checkStrike = function(item, completed) {

        console.log(item.uid);

        user.getSession()
            .then(function(user) {

                console.log(user.data.uid);
                var todoupdate = Task({

                    completed: item.completed
                }); //update value
                todoupdate = todoupdate.upsert({
                    uid: item.uid
                }); // current value
                todoupdate.save()
                    .then(function() {
                            if (item.completed) {
                                bootbox.alert("Task '" + item.title + "' completed. Good job!");
                            }
                            else {
                                bootbox.alert("Task '" + item.title + "'status is incomplete now!");
                            }
                            // $scope.load();
                        },
                        function() {
                            bootbox.alert("error");
                        }
                );
                // $scope.$apply();
            })
    };
    //end  checked attribute

    //start of add task
    $scope.add = function(event) {
        if (event.which === 13) {
            var newtodo = $scope.addtodo;
            $scope.addtodo = null;
            if (newtodo != null) {
                //                $scope.addtodo = null;
                //              $scope.todoList.push(newtodo);
                user.getSession()
                    .then(function() {
                        var TaskClass = app.Class('task').Object;
                        TaskClass({

                            title: newtodo,
                            completed: false
                        })
                            .save()
                            .then(function(data) {
                                   
                                    $scope.load();
                                    
                                },
                                function(err) {
                                    bootbox.alert("Error while adding task.");
                                });

                    });

            };
        };
        console.log($scope.todoList);
    };
    //end of add task
    // for remove completed task
    $scope.removeTodo = function(item) {
        var index = $scope.todoList.indexOf(item);
        user.getSession()
            .then(function(user) {
               
                Task({uid:item.uid})
                .delete()
                .then(function(user){
                    bootbox.alert(item.title + " is removed.");
                    console.log(user);
                    $scope.todoList.splice(index, 1);
                    $scope.$apply();
                })

            })
        
    };

    var curr_user;
    $scope.edit = function(edit) {
        curr_user = edit;
        this.val = false;
    };
    //start todo edit
    $scope.todoEdit = function(event, item) {
        if (event.which === 13) {
            if (item != "") {
                user.getSession()
                    .then(function(user) {

                        var todoupdate = Task({
                            title: item.title
                        }); //update value
                        todoupdate = todoupdate.upsert({

                            uid: item.uid
                        }); // current value
                        todoupdate.save()
                            .then(function(todoupdate) {
                                    bootbox.alert("Task updated.");
                                },
                                function(todoupdate) {
                                    bootbox.alert("Error while updating the task");

                                }
                        );
                        var index = $scope.todoList.indexOf(curr_user);
                    })
                this.val = true;
            };
        };

    };
    //end todo edit
    

    $scope.logout=function(){
        bootbox.confirm("Are you sure, you want to logout?", function(result) {
            if (result){
                user().logout().
                then(function(user){
                    window.location="#"                
                    bootbox.alert("You are successfully logged out");
                });
            }
        });
    }
});


//login controller
taskApp.controller('LoginController', function($scope) {
    $scope.pageClass = 'page-login';
    $scope.login = function() {
        var email = $scope.email;
        var password = $scope.password;
        console.log(email,password);
        user().login(email, password)
        .then(function(user) {
                window.location = "#todo";
                console.log('Logged In');
                // console.log(user.isAuthenticated());
                
            },
            function() {
                bootbox.alert("wrong email address or password");

            })
        // $scope.email = "";
        // $scope.password = "";
    };


    $scope.newUser = function() {
        window.location = "#register"
    };
});



//register controller
taskApp.controller('RegisterController', function($scope) {
    $scope.pageClass = 'page-register';

    // function to submit the form after all validation has occurred            
    $scope.register = function(isValid) {

        // check to make sure the form is completely valid
        if (isValid) {
            bootbox.alert('our form is valid');
            var app = Built.App('bltda5a1db14d37300a').User();
            var username = $scope.username;
            var email = $scope.email;
            var password = $scope.password;
            var password_confirm = $scope.cnfpassword;
            console.log(app,username,email,password,password_confirm);

            app.register(email, password, password_confirm)
                .then(function() {
                        bootbox.alert("Thank you! You are successfully registered to TaskApp");
                        window.location = "#";
                    },
                    function() {
                        bootbox.alert("Sorry! Please fill up all the details properly.");
                    })
        }
        else {
            bootbox.alert('our form is not valid');
        }

    };

    $scope.login = function() {
        window.location = "#";
    }
});
