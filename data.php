<?php
//password must larger than 3 digits. Blank means anyone can visit.



if(!isset($viewpass)){
    $viewpass = '';
}

$adminpass = '';
$title = "Jason's Online CV";
$subtitle = 'Editable online CV easy to use';
$content = '';
$data['local']=1;
$show = 0;

switch($_GET['a']) {
    case 'update':
    update();
    case 'show':
    show();

}

function show(){

    if( strlen( $viewpass ) > 0 && trim($_REQUEST['vpass']) != $viewpass )
    {
        $show = 0;
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
if( strlen( $viewpass ) >=4 && trim($_REQUEST['vpass']) != $viewpass )
{
	$data['errno'] = '0';
	$data['show'] = 0;
	$data['title'] = '';
	$data['subtitle'] = '';
	$data['content'] =  $_POST['content'];
}
else
{

	$data['errno'] = '0';
	$data['show'] = 1;
	$data['title'] = $title;
	$data['subtitle'] = $subtitle;
	$data['content'] = $content;
}

echo json_encode( $data );
