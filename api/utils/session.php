<?php
	date_default_timezone_set('Asia/Kolkata');
	function setResponseHeader(){
		if(!headers_sent()){
			header("Access-Control-Allow-Origin: *");
			header("Content-Type: application/json; charset=UTF-8");
			header("Access-Control-Allow-Methods: POST");
			//header("Access-Control-Max-Age: 3600");
			header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
		}
	}

	function setFileResponseHeader(){
		if(!headers_sent()){
			header("Access-Control-Allow-Origin: *");
			header("Access-Control-Allow-Methods: POST");
			header("Content-Type: multipart/form-data");
			header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
		}
	}

	function startSession(){
		session_start();
	}

	function setSession($sessionParam){
		foreach($sessionParam as $key => $value){
			$_SESSION[$key] = $value;
		}
	}

	function removeSession($sessionVariable){
		 unset($_SESSION[$sessionVariable]);
	}

	function getSessionValue($sessionVariable){
		$resp="";
		if(isset($_SESSION[$sessionVariable] ) ) {
		   $resp=$_SESSION[$sessionVariable];
		}
		return $resp;
	}

	function destroySession(){
		session_unset();
		session_destroy();
	}
?>