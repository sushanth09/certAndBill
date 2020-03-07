<?php
	require_once "../utils/session.php";

	setResponseHeader();

	require_once "../config/config.php";
	require_once "../config/database.php";
	require_once "../utils/logback.php";
	require_once "../utils/crypt.php";
	require_once "../utils/validation.php";
	require_once "../utils/email.php";
	require_once "../utils/appno.php";
	
	$currentFileName = "sessionManagement.php";
	try{
		$request = file_get_contents('php://input');
		//LoggerInfo($currentFileName, "inside try".json_encode($request));
		$req_data = json_decode($request);
		//$req_data = interceptorService($req_data);
		$action = $req_data->{"action"};
		if($action == ""){
			setFileResponseHeader();
			$action = $_POST['action'];
		}
		LoggerInfo($currentFileName, "Action:".$action);
	}catch(Exception $e){
		LoggerInfo($currentFileName,"Error while handling request".$e);
	}
		
	$database = new Database();
	$conn = $database->getConnection();
	if (!$conn) {
		LoggerInfo($currentFileName, "Connection Error: " . $conn);
		return;
	}

	LoggerInfo($currentFileName, "Action:".$action);
	//Interceptor Logic start
	$bypassAction = ["login", "forgotPassword"];
	$callInterceptor = true;
	for($index=0;$index<count($bypassAction);$index++){
		if($bypassAction[$index] == $action){
			$callInterceptor = false;
			break;
		}
	}
	if($callInterceptor){
		$req = array();
		$req["LOGIN_ID"] = $req_data->{"loginId"};
		$req["ACCESS_TOKEN"] = $req_data->{"accessToken"};
		$res = interceptorRequestService($database, $conn, $req);
		if($res["status"] == "failed"){
			echo json_encode($res);
			return;
		}
	}
	//Interceptor Logic end

	if($action=="resetSession"){
		$response = array();
		$req = array();
		$req["LOGIN_ID"] = $req_data->{"loginId"};
		if(setSessionTimer($database, $conn, $req)){
			$response["status"] = "success";
			$response["statusCode"] = 200;
			$response["message"] = "Reset session successful";
			$data = array();
			$response['data'] = $data;
			$response['loginId'] = $req_data->{"loginId"};
			$response['accessToken'] = $req_data->{"accessToken"};
		}else{
			$response["status"] = "failed";
			$response["statusCode"] = "-1111";
			$response["message"] = "Reset session unsuccessful";
			$data = array();
			$response['data'] = $data;
			$response['loginId'] = $req_data->{"loginId"};
			$response['accessToken'] = $req_data->{"accessToken"};
		}
		$response = interceptorResponseService($database, $conn, $response);
		echo json_encode($response);
	}
	
?>