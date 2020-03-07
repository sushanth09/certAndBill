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
	require_once "../utils/sendMail.php";
	require_once "interceptor.php";
	
	$request = file_get_contents('php://input');

	$req_data = json_decode($request);
	LoggerInfo("login.php", "json data::: ".json_encode($req_data));
	//$req_data = interceptorService($database, $conn, $req_data);
	$response = array();
	
	$currentFileName = "login.php";
	$database = new Database();
	$conn = $database->getConnection();
	$errmsg = array();
	LoggerInfo($currentFileName,"Called Login Controller()");

	function masterValidation($req_data){
		$var = emailValid($req_data->{"data"}->{"emailId"});
		if(empty($var)){
			$errMsg["flag"] = true;
		}else {
			$errMsg["emailErr"]= $var;
			$errMsg["flag"] = false;
		}

		$var = passWordValid($req_data->{"data"}->{"password"});
		if(empty($var)){
			$errMsg["flag"] = true;
		}else{
			$errMsg["passErr"]= $var;
			$errMsg["flag"] = false;
		}

		return $errmsg;
	}



	LoggerInfo($currentFileName, "Incoming reqeust is ".json_encode($req_data));

 	if (!$conn) {
		LoggerInfo($currentFileName, "Connection Error: " . $conn);
		return;
	}

	$resp = array();
	$action = $req_data->{"data"}->{"action"};
	
	//Interceptor Logic start
	$bypassAction = array();
	$bypassAction[0] = "login";
	$bypassAction[1] = "adminLogin";
	$bypassAction[2] = "forgotPassword";
	$bypassAction[3] = "checkOTP";
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

	if($action=="forgotPassword"){
		$resp =  forgotPassword($database, $conn, $req_data);
		echo json_encode($resp);
	}else if($action=="login"){
		$resp =  login($database, $conn, $req_data);
		LoggerInfo("login.php", "response::::::>>>><<<<< ".json_encode($resp));
		if($resp["status"] == "success"){
			$resp["sessionTimeout"] = 15;
		}else{
			$resp["sessionTimeout"] = 0;
		}
		echo json_encode($resp);
	}else if($action=="adminLogin"){
		$resp =  adminLogin($database, $conn, $req_data);
		echo json_encode($resp);
	}else if($action=="checkOTP"){
		$resp =  checkOTP($database, $conn, $req_data);
		echo json_encode($resp);
	}else if($action=="setNewPass"){
		$resp =  setNewPass($database, $conn, $req_data);
		echo json_encode($resp);
	}else if($action=="signout"){
		$resp =  signout($database, $conn, $req_data);
		echo json_encode($resp);
	}

	function signout($database, $conn, $req_data){
		$response = array();
		LoggerInfo($GLOBALS["currentFileName"], "signout incoming request is ".json_encode($req_data));
		date_default_timezone_set('Asia/Kolkata');
		$timestamp = time();
		$date_time = date("Y-m-d H:i:s", $timestamp);
		$sql = "UPDATE USER_REG_MST SET LAST_LOGOUT_TIME =:last_logout_time, ACCESS_TOKEN=:accessToken WHERE LOGIN_ID = :login_id";
		$paramList = array();
		$paramList["last_logout_time"] = $date_time;
		$paramList["accessToken"] = "";
		$paramList["login_id"] = $req_data->{"data"}->{"login_id"};
		$result = $database->updateQuery($conn, $sql, $paramList);
		if($result == "success"){
			$response["status"] = "success";
			$response["statusCode"] = 200;
			$response["message"] = "signout successfully";
		}else{
			$response["status"] = "failed";
			$response["statusCode"] = 2001;
			$response["message"] = "signout failed";
		}
		return $response;
	};

	function setNewPass($database, $conn, $req_data){
		LoggerInfo($GLOBALS["currentFileName"], "Inside setNewPass and incoming data is ".json_encode($req_data));
		$forPassOTP =  $req_data->{"data"}->{"forgotNewPass"};
		$sql = "UPDATE USER_REG_MST SET USER_PWD =:user_pwd  WHERE LOGIN_ID = :login_id";
		$paramList = array();
		$paramList["user_pwd"] = md5($forPassOTP);
		$paramList["login_id"] = $req_data->{"data"}->{"loginId"};
		$result = $database->updateQuery($conn, $sql, $paramList);
		if($result == "success"){
			$response["status"] = "success";
			$response["statusCode"] = 200;
			$response["message"] = "Password is Updated";
		}else{
			$response["status"] = "failed";
			$response["statusCode"] = 2001;
			$response["message"] = "Password is Updation Failed";
		}
		$sql = "UPDATE FORGOT_PASSWORD SET STATUS =:status, ACTIVATION_DATE=:activation_date  WHERE LOGIN_ID = :login_id";
		$paramList = array();
		$paramList["status"] = "1";
		$paramList["activation_date"] = date("Y-m-d h:i:s");
		$paramList["login_id"] = $req_data->{"data"}->{"loginId"};
		LoggerInfo($GLOBALS["currentFileName"]["currentFileName"], "paramlist is ".json_encode($paramList));
		LoggerInfo($GLOBALS["currentFileName"], "sql is ".json_encode($sql));
		$result = $database->updateQuery($conn, $sql, $paramList);
		return $response;
	};


	function forgotPassword($database, $conn, $req_data){
		$response = array();
		LoggerInfo($GLOBALS["currentFileName"], "Inside forgot Password");
		$forgotEmail =  $req_data->{"data"}->{"forgotEmail"};
		$sql = "SELECT * FROM USER_REG_MST WHERE USER_EMAIL = :userId AND IS_EMAIL_VERIFIED = 1";
		$paramList = array();
		$paramList["userId"] = $forgotEmail;
		$result = $database->selectParamQuery($conn, $sql, $paramList); if(count($result) > 0){$result  = $result[0];}
		LoggerInfo($GLOBALS["currentFileName"], "response result  is ".json_encode($result));
		LoggerInfo($GLOBALS["currentFileName"], "response count result is ".count($result));
		if($result == "" || count($result) == 0){
			$response["status"] = "failed";
			$response["statusCode"] = 2001;
			$response["message"] = "Email Id not Present !";
		}else if(count($result) > 0){
			$response["status"] = "success";
			$response["statusCode"] = 200;
			$data = array();
			$response["data"] = $result;
			$response["message"] = "OTP has been sent";
			$response["linkSendingStatus"] = resetLinkSender($database, $conn, $response);
		}
		return $response;
	};
		
		
	function login($database, $conn, $req_data) {
		$response = array();
		$username = $req_data->{"data"}->{"userId"};
		$password = $req_data->{"data"}->{"password"};
		$sql = "SELECT * FROM BILL_USER_MANAGEMENT WHERE USER_NAME = :userName AND PASSWORD = :password and IS_DISABLED = 0";
		$paramList = array();
		$paramList["userName"] = $username;
		$paramList["password"] = $password;
		$result = $database->selectParamQuery($conn, $sql, $paramList); 
		if (count($result) > 0) {
			$result  = $result[0];
		}
		//LoggerInfo($GLOBALS["currentFileName"], "response result  is ".json_encode($result));
		if($result == "" || count($result) == 0){
			$response["status"] = "failed";
			$response["statusCode"] = 2001;
			$response["message"] = "Email Id not Present !";
		}else if(count($result) > 0) {
			$response["status"] = "success";
			$response["statusCode"] = 200;
			$data = array();
			$response["data"] = $result;
			$response["message"] = "User login success";
		}
		return $response;
	}

?>