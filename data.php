<?php

$viewpass = '1234';
//password must larger than 3 digits. Blank means anyone can visit.
$title = 'title';
$subtitle = 'subtitle';
$content = '';


switch($_GET['a']) {
    case 'update':
        update();
}

function update(){
    $content = $_POST['content'];
}
if( strlen( $viewpass ) > 0 && trim($_REQUEST['vpass'])== $viewpass )
  {
    $data['errno'] = '0';
    $data['show'] = 1;
    $data['title'] = $title;
    $data['subtitle'] = $subtitle;
    $data['content'] = $content;
    // 1 will show cog
    $data['local'] = 1;
  }
else
{
    $data['errno'] = '1';
	$data['show'] = 0;
	$data['title'] = '';
	$data['subtitle'] = '';
	$data['content'] = '';
}



echo json_encode( $data );
