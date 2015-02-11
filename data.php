<?php
//password must larger than 3 digits. Blank means anyone can visit.



$viewpass = '1234';

$adminpass = '';
$title = "Online Testing";
$subtitle = 'Editable online Testing easy to use';
$content = 'aaa';
//$data['local']=1;
$show = 0;

switch($_GET['a']) {
    case 'update':
    update();
    case 'show':
    show();

}

function show(){

    if( strlen( $viewpass ) > 0 && trim($_REQUEST['vpass']) == $viewpass )
    {
        $show = 0;
       // $data['local']=2;
    }else{
        $show = 1;
    }
}

function update(){
    //update content
    $file = "content.html";
    $content = trim($_POST['content']);
    file_put_contents($file,$content);

    //update the password
    $psdFile = "psd.txt";
    try{
        $viewpass = file_get_contents($psdFile);
    }catch(Exception $e){
         echo 'Caught exception: ',  $e->getMessage(), "\n";
    }
    $adminpass= trim($_POST['admin_password']);
    var_dump($adminpass);
    if(strlen($adminpass)>=4 && $adminpass!= $viewpass){
        //update the view pass
        $viewpass = $adminpass;
    }
   //write to file
   file_put_contents($psdFile,$adminpass);

}

//compare the password
if( strlen( $viewpass ) >=4 && trim($_REQUEST['vpass']) == $viewpass )
{
	$data['errno'] = 0;
	$data['show'] = $show;
	$data['title'] = $title;;
	$data['subtitle'] = $subtitle;
	$data['content'] =  $_POST['content'];
}
else
{

	$data['errno'] = 1;
	$data['show'] = 0;
	$data['title'] = '';
	$data['subtitle'] = '' ;
	$data['content'] = $content;
}

echo json_encode( $data );
