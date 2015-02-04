var jasonsCV = angular.module('jasonsCV', ['ngRoute','wiz.markdown','ngNotify','angularLocalStorage']);

//var baseurl = 'http://cvbox.sinaapp.com/'; // 使用SAE托管简历数据
var baseurl = 'data.php'; // 使用本地文件托管简历数据，本地模式下，不支持在线编辑


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
  }]);


jasonsCV.controller('resumeCtrl',  function ($scope,$http,storage) {

    storage.bind($scope,'vpass');

    var url = '';
    if( $scope.vpass && $scope.vpass.length > 3 ){
        url = baseurl+"?a=show&domain="+encodeURIComponent(window.location)+"&vpass="+encodeURIComponent($scope.vpass);
    }else{
        url = baseurl+"?a=show&domain="+encodeURIComponent(window.location);
    }

    $http.get(url).success(function( data ){
        $scope.resume = data;
    });

  $scope.password = function( vpass )
  {
    $scope.vpass = vpass;
    window.location.reload();
  }

});

jasonsCV.controller('adminCtrl', function ($scope,$http,storage,ngNotify) {

    storage.bind($scope,'wpass');
    storage.bind($scope,'vpass');
    storage.bind($scope,'apass');
    storage.bind($scope,'resume.content');

    var url = '';
    if( $scope.vpass && $scope.vpass.length > 3 ){
      url = baseurl+"?a=show&domain="+encodeURIComponent(window.location)+"&vpass="+encodeURIComponent($scope.vpass);
    }else{
      url = baseurl+"?a=show&domain="+encodeURIComponent(window.location);
    }

    $http.get(url).success(function( data ){
        var oldcontent = $scope.resume.content;
        $scope.resume = data;
        $scope.resume.admin_password = $scope.apass;
        $scope.resume.view_password = $scope.wpass;
        if( oldcontent.length > 0  ) $scope.resume.content = oldcontent;
    });

  $scope.save = function( item )
  {
    $http
    ({
      method: 'POST',
      url: baseurl+"?a=update&domain="+encodeURIComponent(window.location),
      data: $.param({'title':item.title,'subtitle':item.subtitle,'content':item.content,'view_password':item.view_password,'admin_password':item.admin_password}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(
      function( data ){
        //$scope.notice('');
        if( data.errno == 0 )
        {
          $scope.apass = item.admin_password;
          $scope.wpass = item.view_password;
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