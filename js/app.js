var jasonsCV = angular.module('jasonsCV', ['ngRoute','wiz.markdown','ngNotify','angularLocalStorage']);
var baseurl = 'data.php'; // use data.php to store the data


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
    $scope.resume.content
    var url = '';
    if( $scope.vpass && $scope.vpass.length > 3 ){
        //url = baseurl+"?a=show&domain="+encodeURIComponent(window.location)+"&vpass="+encodeURIComponent($scope.vpass);
        url = baseurl+"?a=show&vpass="+encodeURIComponent($scope.vpass);
    }
    else {
        //url = baseurl+"?a=show&domain="+encodeURIComponent(window.location);
        url = baseurl+"?a=show";
    }



    $http.get(url).success(function( data ){
        $scope.resume = data;

    });
    //save the password
    $scope.password = function( vpass ){
        $scope.vpass = vpass;
//        indow.location.reload();
    }
});

jasonsCV.controller('adminCtrl', function ($scope,$http,storage,ngNotify) {
    storage.bind($scope,'wpass');
    storage.bind($scope,'vpass');
    storage.bind($scope,'apass');
    storage.bind($scope,'resume.content');

    var url = '';
    if( $scope.vpass && $scope.vpass.length > 3 ){
        //url = baseurl+"?a=show&domain="+encodeURIComponent(window.location)+"&vpass="+encodeURIComponent($scope.vpass);
        url = baseurl+"?a=show&vpass="+encodeURIComponent($scope.vpass);
    }
    else{
        //url = baseurl+"?a=show&domain="+encodeURIComponent(window.location);
        url = baseurl+"?a=show";
    }
    //get data from data.php
    $http.get(url).success(function( data ){
        //check if user input any content into the amdin page
        var oldcontent = $scope.resume.content;
        console.log("Old content is: "+oldcontent);
        $scope.resume = data;
        $scope.resume.admin_password = $scope.apass;
        $scope.resume.view_password = $scope.wpass;
        // if there is some content then glue it with angular scope
        if( oldcontent.length > 0  ) {
            $scope.resume.content = oldcontent;
        }
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
      function( data ){
        //$scope.notice('');
        if( data.errno == 0 )
        {
            $scope.apass = item.admin_password;
            $scope.wpass = item.view_password;
            $scope.resume.content = item.content;
            console.log("item content is: "+item.content);
            ngNotify.set(data.notice,'success');
        }
        else
        {
            ngNotify.set(data.error,'error');
        }
      }
    );
  };
});

// ============
function makepdf()
{
    //post('http://pdf.ftqq.com',{'title':$('#drtitle').html(),'subtitle':$('#drsubtitle').html(),'content':$('#cvcontent').html(),'pdfkey':'jobdeersocool'});
    $("#hform [name=title]").val($('#drtitle').html());
    $("#hform [name=subtitle]").val($('#drsubtitle').html());
    $("#hform [name=content]").val($('#cvcontent').html());
    $("#hform [name=pdfkey]").val('jobdeersocool');
    $("#hform").submit();
}

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.
    var form = jQuery('<form/>', {
        'id':'hform',
        'method':method ,
        'action':path,
        'target':'_blank'
    });

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            
            var hiddenField = jQuery('<input/>', {
            'type':'hidden' ,
            'name':key,
            'value':params[key]
            });

            form.appendChild(hiddenField);
         }
    }

    form.submit();
}


function pdf()
{
  var doc = new jsPDF();
  var specialElementHandlers = {
  '.action-bar': function(element, renderer){
      return true;
    }
  };

  doc.fromHTML($('#resume_body').get(0), 15, 15, {
    'width': 170, 
    'elementHandlers': specialElementHandlers
  });

  doc.output("dataurlnewwindow");
}