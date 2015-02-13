<?php
//password must larger than 3 digits. Blank means anyone can visit.



$viewpass = '1234';
$adminpass = '';
$title = "Online Testing";
$subtitle = 'Editable online Testing easy to use';
$file = 'content.txt';
$content = file_get_contents($file);


//$data['local']=1;
$show = 0;

switch($_GET['a']) {
    case 'update':
    update();
    case 'show':
    show();

}

function show(){
    if( strlen( $viewpass ) >3 && trim($_REQUEST['vpass']) == $viewpass )
    {
        $data['show'] = $show;
    }else{
    	$data['show'] = 1;
    }
}

if($show == 0){
    $data['errno'] = 0;
    $data['title'] = $title;;
    $data['subtitle'] = $subtitle;
    $data['content'] =  $content;
}else{
    $data['errno'] = 1;
    $data['title'] = '';
    $data['subtitle'] = '' ;
    $data['content'] = $content;
}

function update(){
    //update content
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

echo json_encode( $data );
