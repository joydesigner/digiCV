<?php

$viewpass = '';
//password must larger than 3 digits. Blank means anyone can visit.
$title = 'title';
$subtitle = 'subtitle';
$content = 'My CV';

$data['local'] = 1;


if( strlen( $viewpass ) > 0 && trim($_REQUEST['vpass']) != $viewpass )
  {
	$data['errno'] = '0';
	$data['show'] = 0;
	$data['title'] = '';
	$data['subtitle'] = '';
	$data['content'] = '';
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
