<?php
	
	function interceptorRequest($database, $conn, $reqData){
		LoggerInfo("interceptor.php", "inside interceptorRequest");
		$response = false;
		$sql = "SELECT * FROM USER_REG_MST WHERE ACCESS_TOKEN = :accessToken AND LOGIN_ID=:loginId";
		$paramList = array();
		$paramList["accessToken"] = $reqData->{"accessToken"};
		$paramList["loginId"] = $reqData->{"loginId"};
		$result = $database->selectParamQuery($conn, $sql, $paramList);
		LoggerInfo("interceptor.php", "result is::::: ".json_encode($result));
		if(count($result) > 0 && $result != "failed"){
			$response = true;
		}
		return $response;
	}
	
	function interceptorResponse($database, $conn, $respData){
		LoggerInfo("interceptor.php", "inside interceptorResponse");
		$sqlSelect = "SELECT * FROM USER_REG_MST WHERE LOGIN_ID=:loginId";
		$paramList = array();
		$paramList["loginId"] = $respData["loginId"];
		$resultSelect = $database->selectParamQuery($conn, $sqlSelect, $paramList);
		
		LoggerInfo("interceptor.php", "interceptorResponse result is::: ".json_encode($resultSelect));
		$accessToken = $resultSelect[0]["ACCESS_TOKEN"];
		LoggerInfo("interceptor.php", "accessToken:::: ".$accessToken);
		
		$sqlUpdate = "UPDATE USER_REG_MST SET LAST_SESSION_TIME=NOW() WHERE LOGIN_ID LIKE :loginId";
		$paramList = array();
		$paramList["loginId"] = $respData["loginId"];
		$resultUpdate = $database->updateQuery($conn, $sqlUpdate, $paramList);
		
		LoggerInfo("interceptor.php", "update result:::: ".$resultUpdate);
		if($resultUpdate == "success"){
			$respData["accessToken"] = $accessToken;
			$respData["sessionTimeout"] = 15;
		}else{
			$respData["accessToken"] = "";
			$respData["sessionTimeout"] = "";
		}
		LoggerInfo("interceptor.php", "interceptorResponse response::::: ".json_encode($respData));
		return $respData;
	}

?>