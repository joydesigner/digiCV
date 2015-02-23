var jasonsCV = angular.module('jasonsCV', ['ngRoute','wiz.markdown','ngNotify','angularLocalStorage']);
var baseurl = 'data.php'; // use data.php to store the data
var contentUrl = 'content.txt';
var url = '';
jasonsCV.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/admin', {
        templateUrl: 'admin.html',
        controller: 'adminCtrl'
      }).
      when('/resume', {
        templateUrl: 'resume.html',
        controller: 'resumeCtrl'
      }).
      otherwise({
        redirectTo: '/resume'
      });
//      $locationProvider.html5Mode(true);
  }]);


jasonsCV.controller('resumeCtrl', function ($scope,$http,storage) {
    //store the password in the localstorage
    storage.bind($scope,'vpass');
    storage.bind($scope,'resume.title');
    storage.bind($scope,'resume.subtitle');


    //if will show the password input
    if( $scope.vpass && $scope.vpass.length >= 4 ){
        //url = baseurl+"?a=show&domain="+encodeURIComponent(window.location)+"&vpass="+encodeURIComponent($scope.vpass);
        url = baseurl+"?a=show&vpass="+encodeURIComponent($scope.vpass);
    }
    else {
        //url = baseurl+"?a=show&domain="+encodeURIComponent(window.location);
        url = baseurl+"?a=show";
    }

    //get the cv content
    $http.get(contentUrl).success(function(data){
        $scope.content = data;
    });
    //save the password
    $scope.password = function( vpass ){
        $scope.vpass = vpass;
    };

    // pdf function
    $scope.pdf = function()
    {
        var doc = new jsPDF();
        var specialElementHandlers = {
            '.action-bar': function(){
                return true;
            }
        };
        // Optional - set properties on the document
        doc.setProperties({
            title: 'PDF - CV',
            subject: 'Contact me if you like this simple tool.',
            author: 'Jason',
            keywords: 'Auto generated from html, Online CV by Javascript',
            creator: 'Jason'
        });


        doc.fromHTML($('#resume_body').get(0), 15, 15, {
            'width': 170,
            'elementHandlers': specialElementHandlers
        });

        doc.save("jasonscv.pdf");
    };

});

// start of admin controller
jasonsCV.controller('adminCtrl', function ($scope,$http,storage,ngNotify) {
    storage.bind($scope,'wpass');
    storage.bind($scope,'vpass');
    storage.bind($scope,'apass');
    storage.bind($scope,'resume.content');
    storage.bind($scope, 'resume.title');
    storage.bind($scope, 'resume.subtitle');


    //config the notify
    // Configuration options...

    $scope.theme = 'pure';
    $scope.themeOptions = ['pure', 'pastel', 'prime', 'pitchy'];

    $scope.duration = 4000;
    $scope.durationOptions = [
        { id: 500, value: '500 ms' },
        { id: 1000, value: '1000 ms' },
        { id: 2000, value: '2000 ms' },
        { id: 4000, value: '4000 ms' },
        { id: 8000 , value: '8000 ms'}
    ];

    $scope.position = 'bottom';
    $scope.positionOptions = ['bottom', 'top'];

    $scope.defaultType = 'info';
    $scope.defaultOptions = ['info', 'success', 'warn', 'error', 'grimace'];

    $scope.sticky = false;
    $scope.stickyOptions = [true, false];

    // Configuration actions...

    $scope.setDefaultType = function() {
        ngNotify.config({
            type: $scope.defaultType
        });
    };

    $scope.setDefaultPosition = function() {
        ngNotify.config({
            position: $scope.position
        });
    };

    $scope.setDefaultDuration = function() {
        ngNotify.config({
            duration: $scope.duration
        });
    };

    $scope.setDefaultTheme = function() {
        ngNotify.config({
            theme: $scope.theme
        });
    };

    $scope.setDefaultSticky = function() {
        ngNotify.config({
            sticky: $scope.sticky
        });
    };

    $scope.dismissNotify = function() {
        ngNotify.dismiss();
    };
    // end of config of notify

    if( $scope.vpass && $scope.vpass.length >=4 ){
        //url = baseurl+"?a=show&domain="+encodeURIComponent(window.location)+"&vpass="+encodeURIComponent($scope.vpass);
        url = baseurl+"?a=show&vpass="+encodeURIComponent($scope.vpass);
    }
    else{
        //url = baseurl+"?a=show&domain="+encodeURIComponent(window.location);
        url = baseurl+"?a=show";
    }
    //get data from data.php
    $http.get(url).success(function( data ){
        //console.log("Old content is: "+oldcontent);
        $scope.resume = data;
        $scope.resume.admin_password = $scope.apass;
        $scope.resume.view_password = $scope.wpass;
        $scope.resume.content = data.content;

    });


//save new content
  $scope.save = function( item )
  {
    // sync with the data.php (local store)
    $http
    ({
        method: 'POST',
        //url: baseurl+"?a=update&domain="+encodeURIComponent(window.location),
        url: baseurl+"?a=update&vpass="+encodeURIComponent($scope.vpass),
        data: $.param({'title':item.title,'subtitle':item.subtitle,'content':item.content,'view_password':item.view_password,'admin_password':item.admin_password}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(
      function(){
        //$scope.notice('');
            //console.log("saved successfully");
            $scope.title = item.title;
            $scope.subtitle = item.subtitle;
            $scope.apass = item.admin_password;
            $scope.wpass = item.view_password;
            $scope.resume.content = item.content;
            //console.log("item content is: "+item.content);
            ngNotify.set('Saved Successfully!','success');
      }
    ).error(function() {
            // called asynchronously if an error occurs
            // or server returns response with an error status
            ngNotify.set('Save has some errors.','error');
        });
  };

  // refresh the resume
    $scope.refresh = function(){
        //get the cv content
        $http.get(contentUrl).success(function(){
            //console.log("content data is:"+data);
            $scope.content = $scope.resume.content;

        });
    };
});

