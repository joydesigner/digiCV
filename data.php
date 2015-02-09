<?php
//password must larger than 3 digits. Blank means anyone can visit.
$viewpass = '1234';
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
    $show = 1;
}

function update(){
    //get content
    $content = $_POST['content'];
    $adminpass= trim($_POST['admin_password']);
    if(strlen($adminpass)>0&& $adminpass!= $viewpass){
        //update the view pass
        $viewpass = $adminpass;
    }
   //write to file
   $file = "content.html";
   file_put_contents($file,$content);
}

//compare the password
if( strlen( $viewpass ) > 0 && trim($_REQUEST['vpass']) != $viewpass )
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
