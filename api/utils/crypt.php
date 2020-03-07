<?php
	date_default_timezone_set('Asia/Kolkata');
	require_once "../config/database.php";
	require_once "logback.php";
	require_once "appno.php";

	class jsEncode {

		/**
		 * Encodes or decodes string according to key
		 *
		 * @access public
		 * @param mixed $str
		 * @param mixed $decodeKey
		 * @return string
		 */

		public function encodeString($str,$decodeKey) {
		   $result = "";
		   for($i = 0;$i < strlen($str);$i++) {
				$a = $this->_getCharcode($str,$i);
				$b = $a ^ $decodeKey;
				$result .= $this->_fromCharCode($b);
		   }
		   return $result;
		}

		/**
		 * PHP replacement for JavaScript charCodeAt.
		 *
		 * @access private
		 * @param mixed $str
		 * @param mixed $i
		 * @return string
		 */
		private function _getCharcode($str,$i) {
			 return $this->_uniord(substr($str, $i, 1));
		}

		/**
		 * Gets character from code.
		 *
		 * @access private
		 * @return string
		 */
		private function _fromCharCode(){
		  $output = '';
		  $chars = func_get_args();
		  foreach($chars as $char){
			$output .= chr((int) $char);
		  }
		  return $output;
		}

		/**
		 * Multi byte ord function.
		 *
		 * @access private
		 * @param mixed $c
		 * @return mixed
		 */
		private function _uniord($c) {
			$h = ord($c{0});
			if ($h <= 0x7F) {
				return $h;
			} else if ($h < 0xC2) {
				return false;
			} else if ($h <= 0xDF) {
				return ($h & 0x1F) << 6 | (ord($c{1}) & 0x3F);
			} else if ($h <= 0xEF) {
				return ($h & 0x0F) << 12 | (ord($c{1}) & 0x3F) << 6 | (ord($c{2}) & 0x3F);
			} else if ($h <= 0xF4) {
				return ($h & 0x0F) << 18 | (ord($c{1}) & 0x3F) << 12 | (ord($c{2}) & 0x3F) << 6 | (ord($c{3}) & 0x3F);
			} else {
				return false;
			}
		}
	}


	function validateParams($validParams, $request){
		$validParams = json_decode($validParams);
		$request = json_decode($request);
		foreach($validParams as $key => $value){
			$flag = true;
			foreach($request as $key1 => $value1){
				if($key == $key1){
					if($value == $value1){
						$flag = false;
						break;
					}
				}
			}
			if($flag){break;}
		}
		return $flag;
	}
	
	//validate Access Token
	function validateAccessToken($database, $conn, $req_data){
		$sql = "SELECT * FROM USER_REG_MST WHERE LOGIN_ID = :loginId AND ACCESS_TOKEN =:accessToken";
		$paramList = array();
		$paramList["loginId"] = $req_data["LOGIN_ID"];
		$paramList["accessToken"] = $req_data["ACCESS_TOKEN"];
		$result = $database->selectParamQuery($conn, $sql, $paramList);
		if($result == "failed" || count($result) == 0){
			return false;
		}
		return true;
	}
	
	function interceptorRequestService($database, $conn, $request){
		$response = array();
		$loginId = $request["LOGIN_ID"];
		$validateSession = checkSessionTimer($database, $conn, $loginId);
		if(!$validateSession){
			$response["status"] = "failed";
			$response["statusCode"] = "-1111";
			$response["message"] = "Your session has been expired!!!";
			return $response;
		}
		LoggerInfo("crypt.php", "Session validated for login id:".$loginId);
		$validateAccessToken = validateAccessToken($database, $conn, $request);
		if(!$validateAccessToken){
			$response["status"] = "failed";
			$response["statusCode"] = "-2222";
			$response["message"] = "Invalid token, kindly login again.";
			return $response;
		}
		LoggerInfo("crypt.php", "Access Token validated for login id:".$loginId);
		$response["status"] = "success";
		return $response;
	}
	
	function interceptorResponseService($database, $conn, $response){
		if(!isset($response["data"]) || empty($response["data"])){
			$response["data"] = array();
			$response["data"]["sessionTimeout"] = fetchConstantsData($database, $conn, "SessionTimeOutInMin");
			$response["data"]["autoSaveTime"] = fetchConstantsData($database, $conn, "AutoSaveTimeInMin");
		}
		return $response;
	}

	function interceptorService($database, $conn, $request){
    //
		// $login_id = "";
		// $access_token = "";
    //
		// //Check Access Token
		// $action = $request->{"action"};
		// if($action == ""){
		// 	setFileResponseHeader();
		// 	$action = $_POST['action'];
		// 	$login_id = $_POST["loginId"];
		// 	$access_token = $_POST["accessToken"];
		// }else{
		// 	$login_id = $request->{"loginId"};
		// 	$access_token = $request->{"accessToken"};
		// }
		// 	$is_user_exist = false;
		// 	$sql = "SELECT * FROM USER_REG_MST WHERE LOGIN_ID =:loginId AND ACCESS_TOKEN = :accessToken";
		// 	$paramList = array();
		// 	$paramList["loginId"] = $login_id;
		// 	$paramList["accessToken"] = $access_token;
		// 	LoggerInfo("crypt.php","interceptorService paramlist is ".json_encode($paramList));
		// 	LoggerInfo("crypt.php","interceptorService SQl is ".json_encode($sql));
    //
		// 	$result = $database->selectParamQuery($conn, $sql, $paramList);
		// 	LoggerInfo("crypt.php"," result is ".json_encode($result));
		// 	LoggerInfo("crypt.php"," result cout is  ".count($result));
		// 	if($result == "failed" || count($result) == 0){
		// 		$is_user_exist = false;
		// 		$request->{"validAccessToken"} = $is_user_exist;
		// 		return $request;
		// 	}else{
		// 		$is_user_exist = true;
		// 		$request->{"validAccessToken"} = $is_user_exist;
		// 	}
		// 	LoggerInfo("crypt.php"," crypt response is ::".json_encode($request));
			//return $request;
			$request->{"validAccessToken"} = "true";
			return $request;
	}
	//sample example to call above class
	//$d = new jsEncode();
	//echo "<br>".$d->encodeString($req,'123');
	//$database = new Database();
	//$conn = $database->getConnection();
	//$req_data = array();
	//$req_data["LOGIN_ID"] = "LI000001";
	//$req_data["ACCESS_TOKEN"] = "d168c3773553d613d88b34be9f6e00b5ddd27b0736ab2d76470197d5fdba24b5";
	//validateAccessToken($database, $conn, $req_data);
?>