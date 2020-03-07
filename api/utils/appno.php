<?php
	date_default_timezone_set('Asia/Kolkata');
	require_once "../config/database.php";
	require_once "logback.php";
	require_once "../utils/sendMail.php";
	
	$currentFileName = "appno.php";

	function genUniqueId($conn, $loanType){
		$tableName = "APP_LOAN_MASTER";
		$constName = "FORM_TYPE";
		$constvalue = "LAST_USED_ID_NO";
		$constDate = "DATE";

		$sql="SELECT * FROM ".$tableName." WHERE ".$constName."=:constName FOR UPDATE";
		$paramList = array();
		$paramList["constName"] = $loanType;
		$resp = $GLOBALS["database"]->selectParamQuery($conn, $sql, $paramList)[0];
	    $value = $resp[$constvalue];
		if(validateDate($resp[$constDate])){			// if unmatched then go inside if
			$value = 0;
		}
		$value++;
		$sql="UPDATE ".$tableName." SET ".$constDate."=:date,".$constvalue."=:value  WHERE ".$constName."=:constName";
		$paramList = array();
		$paramList["date"] = date('Y-m-d');
		$paramList["value"] = $value;
		$paramList["constName"] =  $loanType;
		$resp=$GLOBALS["database"]->updateQuery($conn, $sql, $paramList);
		$appId = substr($loanType,0,1);
		$iur = date('ymd')*1000000;
		$iur += $value;
		$appId .= $iur;
		return $appId;
	}

	function genBpUniqueId($panNo){
		$uniqueId = substr(date("Y"), 2);
		$uniqueId .= $panNo ;
		$uniqueId .= "001";
		return $uniqueId;
	}
	
	
	function stateChangeEmailNotification($database,$conn,$customerLoginId,$appStatus){
		$paramList = array();	
		LoggerInfo("appno.php","App status".$appStatus);
		$sql="SELECT * FROM USER_REG_MST WHERE LOGIN_ID =:customerLoginId";
		$paramList["customerLoginId"]=$customerLoginId;
		
		LoggerInfo($GLOBALS["currentFileName"],"StateChangeEmailNotification SQL :".$sql);
		LoggerInfo($GLOBALS["currentFileName"],"StateChangeEmailNotification SQL :".$customerLoginId);
		
		$result = $GLOBALS["database"]->selectParamQuery($conn, $sql, $paramList)[0];
		LoggerInfo($GLOBALS["currentFileName"], "User Email address ::".$result["USER_EMAIL"]);
		$appStatusName=" ";
		if($appStatus==2){
		$appStatusName="Under Sanction";
		LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==3){
			$appStatusName="Declined (Bin)";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==4){
			$appStatusName="Sanctioned)";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==5){
			$appStatusName="On Hold";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==6){
			$appStatusName="Revised Sanction under progress";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==7){
			$appStatusName="Incomplete (Bin)";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==8){
			$appStatusName="Move to from Sanction register to Pre disbursement";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==9){
			$appStatusName="Documents not executed";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==10){
			$appStatusName="Discrepancy in docs";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==11){
			$appStatusName="Security not created";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==12){
			$appStatusName="Applicant hold";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==13){
			$appStatusName="Company hold";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==14){
			$appStatusName="Loan disbursement done";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==15){
			$appStatusName="Loan not disbursement";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==16){
			$appStatusName="Closed";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==17){
			$appStatusName="Regular";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}else if($appStatus==18){
			$appStatusName="Delinquent";
			LoggerInfo("appno.php","App status ".$appStatusName);;
		}
		$to = $result["USER_EMAIL"];
		$cc = "";
		$bcc = "";
		$subject = "Welcome to Mitron.com";
		LoggerInfo("appno.php","App status ".$result["USER_EMAIL"]);
		$msg =  "<html>"."<head>"."</head>"."<body>".
				"Mystro <img src='http://beta.mystro.in:8000/mitronWebsite/content/dashboard/ui/images/logo2.png' alt='mitronlogo' height='42' width='42'/><br/><br/>".
				"Dear ".ucfirst($result["FIRST_NAME"]).",<br><br/>".
				"<b>Welcome to Mystro.</b><br/>".
				"We have received your interest in availing a business loan. We would like to help you secure financing quickly and easily. Your application status is  <br/>".$appStatusName.
				"<a  ".$appStatusName."'> Activate Account</a><br><br>".
				"Mystro is founded on the belief to empower people to avail loans based on personal decisions and transparency. We will help you to<br/><br/>".
				"<table style='margin-left: 10px;'>".
				"<tr> <td> ✓</td><td>   Know & Decide – Our tools help you to evaluate various scenarios before you decide to take any loan, in case you still have queries you can call our loan officers for a detailed discussion </td> </tr>".
				"<tr> <td> ✓</td>  <td> Create Partnership – We offer loans that can help create value and provide advise to our customers for betterment </td> </tr>".
				"<tr> <td> ✓</td>  <td>  have Happy faces</td> </tr>".
				"</table><br/>".
				"And ofcourse things which everyone else provides like<br/>".
				"<table style='margin-left: 10px;'>
				<tr><td> ✓</td><td>Fast and quick decision</td> </tr>
				<tr><td> ✓</td><td>Convenience – You can truly apply for Loan online, doesn’t matter how complex your requirement is</td> </tr>
				<tr><td> ✓</td><td>Transparent –  No hidden fees and charges, info is available online on our website</td> </tr></table>".
				"Please visit www.mystro.in for more information about the products and the company.<br/><br/>".
				"Please feel free to write to us for any queries at support@mystro.in<br/><br/>".
				"Regards<br/>"."Team Mystro"."</body>"."</html>";
				$attachment = "";
				sendEmail($to, $subject, $msg); 
		return true;
	}

	function genSequenceId($conn, $seqType){
			$tableName = "ID_MASTER";
			$constName = "ID_TYPE";
			$constvalue = "LAST_USED_ID_NO";
			$constDate = "DATE";

			$sql="SELECT * FROM ".$tableName." WHERE ".$constName."=:constName FOR UPDATE";
			$paramList = array();
			$paramList["constName"] = $seqType;
			$resp = $GLOBALS["database"]->selectParamQuery($conn, $sql, $paramList)[0];
		    $value = $resp[$constvalue];
			if(validateDate($resp[$constDate])){			// if unmatched then go inside if
				$value = 0;
			}
			$value++;
			$sql="UPDATE ".$tableName." SET ".$constDate."=:date,".$constvalue."=:value  WHERE ".$constName."=:constName";
			$paramList = array();
			$paramList["date"] = date('Y-m-d');
			$paramList["value"] = $value;
			$paramList["constName"] =  $seqType;
			$resp=$GLOBALS["database"]->updateQuery($conn, $sql, $paramList);
			LoggerInfo("appno.php","Sequence Id Response ".$resp);
			$profileId = substr($seqType,0,2);
			$iur = 1000000;
			$iur += $value;
			$profileId .= date('ymd').substr($iur,1);
			$profileId = $profileId;
			return $profileId;
	}
	
	function getEmailIdFromApplication($conn, $appFormId){
			$sql="SELECT TRIM(CONCAT(AD_I_BI_EMAIL_ID,AD_NI_AD_EMAIL_ID)) AS EMAIL_ID FROM APPLICANT_DETAILS WHERE APP_FORM_ID=:appFormId";
			$paramList = array();
			$paramList["appFormId"] = $appFormId;
			$result = $GLOBALS["database"]->selectParamQuery($conn, $sql, $paramList)[0];
			return $result["EMAIL_ID"];
	}

	function validateDate($dbdate){
		$currDate = date('Y-m-d');
		$compresult=strcmp($currDate, $dbdate);
		return $compresult;
	}

	function genUniqueServiceId(){
		$appId = "SR";
		$iur = date('ymd');
		$iur .= mt_rand(01,99);
		$appId .= $iur;
		return  $appId;
	}

	function genUniqueUploadFileId(){
		$appId = "DC";
		$iur = date('ymd');
		$iur .= mt_rand(01,99);
		$appId .= $iur;
		return  $appId;
	}
	
	 function getAge($dateStr){
		LoggerInfo("appno.php","dateStr :: ".$dateStr);
		if(empty($dateStr)){
			return "";
		}
		$dob=date_create(date("Y/m/d" , strtotime($dateStr)));
		$today=date_create(date("Y/m/d"));
		$diff=date_diff($dob,$today)->format("%a");
		$age=round($diff/365);
		LoggerInfo("appno.php","Age calculated  :: ".$age);
		return $age;
	} 
	
	

	function generateUpdateParamSQL($tableName, $setParams, $whereParams){
		$response = array();
		$sql = "UPDATE ".$tableName." SET ";
		$paramsList = array();
		$totalParams = 0;
		$count = 0;
		$newParams = array();
		foreach ($setParams as $key => $value) {
			if(!strpos($key,"hashKey")){
					$newParams[trim($key)] = $value;
			}
		}
		foreach ($newParams as $value) {$totalParams++;};
		foreach ($newParams as $key => $value) {
			if(!strpos($key,"hashKey")){
				$sql .= strtoupper(trim($key)) . " =:".trim($key);
				$paramsList[trim($key)] = $value;
				if($count < $totalParams - 1){
					$sql .= ",";
				}
			}
			$count++;
		}
		$sql .= " WHERE ";
		$totalParams = 0;
		$count = 0;
		$newParams = array();
		foreach ($whereParams as $key => $value) {
			if(!strpos($key,"hashKey")){
					$newParams[trim($key)] = $value;
			}
		}
		foreach ($newParams as $value) {$totalParams++;};
		foreach ($newParams as $key => $value) {
			if(!strpos($key,"hashKey")){
				$sql .= strtoupper(trim($key)) . " =:".trim($key);
				$paramsList[trim($key)] = $value;
				if($count < $totalParams - 1){
					$sql .= " AND ";
				}
			}
			$count++;
		}
		$response["sql"] = $sql;
		$response["paramsList"] = $paramsList;
		return $response;
	}

	function createInsertFormIdSQL($tableName, $insertParams, $formIdList = ["APP_FORM_ID"]){
		$sql = "INSERT INTO ".$tableName."(";
		$totalParams = 0;
		$count = 0;
		$newParams = array();
		foreach ($insertParams as $key => $value) {
			if(!strpos($key,"hashKey")){
					$newParams[$key] = $value;
			}
		}
		foreach ($newParams as $value) {$totalParams++;};
		foreach ($formIdList as $val){
			$sql .= $val .",";
		}
		foreach ($newParams as $key => $value) {
			if(!strpos($key,"hashKey")){
				$sql .= $key;
				if($count < $totalParams - 1){
					$sql .= ",";
				}
			}
			$count++;
		}
		$sql .= ") VALUES(";
		foreach ($formIdList as $val){
			$sql .= ":".$val .",";
		}
		$count = 0;
		foreach ($newParams as $key => $value) {
			if(!strpos($key,"hashKey")){
				$sql .= ":".$key;
				if($count < $totalParams - 1){
					$sql .= ",";
				}
			}
			$count++;
		}
		$sql .= ")";
		return $sql;
	}
	
	function fetchConstantsData($database, $conn, $key){
		$sql = "SELECT * FROM MITRON_CONSTANTS WHERE CONSTANT_NAME = :constant_name";
		$paramList = array();
		$paramList["constant_name"] = $key;
		$result = $database->selectParamQuery($conn, $sql, $paramList);
		return $result[0]["CONSTANT_VALUE"];
	}

	function fetchValidationConstantsData($database, $conn, $key){
		$sql = "SELECT * FROM SERVER_VALIDATION_CONSTANTS WHERE CONSTANT_NAME = :constant_name";
		$paramList = array();
		$paramList["constant_name"] = $key;
		$result = $database->selectParamQuery($conn, $sql, $paramList);
		return explode(",",$result[0]["CONSTANT_VALUE"]);
	}
	
	function getdaysDifference($lastdate, $currentdate){
		$date1=date_create($lastdate);
		$date2=date_create($currentdate);
		$diff=date_diff($date1,$date2);
		$dateDiff = $diff->format("%a");
		return $dateDiff;
	}
	
	//To validate user session expired or not
	function checkSessionTimer($database, $conn, $id){
		$sessionTime = fetchConstantsData($database, $conn, "SessionTimeOutInMin");
		if(!isset($sessionTime) || empty($sessionTime)){$sessionTime = 15;}
		$sql = "SELECT * FROM USER_SESSION WHERE CURRENT_TIMESTAMP BETWEEN LAST_SESSION_TIME AND DATE_ADD(LAST_SESSION_TIME, INTERVAL ".$sessionTime." MINUTE)";
		$paramList = array();
		$paramList["loginId"] = $id;
		$result = $database->selectParamQuery($conn, $sql, $paramList);
		if($result == "failed" || count($result) == 0){
			return false;
		}
		return true;
	}
	
	//To set session timer of user
	function setSessionTimer($database, $conn, $req_data){
		$sql = "SELECT * FROM USER_SESSION WHERE LOGIN_ID =:loginId";
		$paramList = array();
		$paramList["loginId"] = $req_data["LOGIN_ID"];
		$result = $database->selectParamQuery($conn, $sql, $paramList);
		if($result == "failed" || count($result) == 0){
			$sql = "INSERT INTO USER_SESSION(REG_TYPE, LOGIN_ID, ACCESS_TOKEN, LAST_SESSION_TIME) VALUES(:regType, :loginId, :accessToken, NOW())";
			$paramList = array();
			$paramList["loginId"] = $req_data["LOGIN_ID"];
			$paramList["regType"] = $req_data["REG_TYPE"];
			$paramList["accessToken"] = $req_data["ACCESS_TOKEN"];
			$result = $database->insertQuery($conn, $sql, $paramList);
		}else{
			//insert into user_session_history
			$sql = "INSERT INTO USER_SESSION_HISTORY(REG_TYPE, LOGIN_ID, ACCESS_TOKEN, LAST_SESSION_TIME, UPDATE_DATE) VALUES(:regType, :loginId, :accessToken, :lastSessionTime, NOW())";
			$paramList = array();
			$paramList["loginId"] = $result[0]["LOGIN_ID"];
			$paramList["regType"] = $result[0]["REG_TYPE"];
			$paramList["accessToken"] = $result[0]["ACCESS_TOKEN"];
			$paramList["lastSessionTime"] = $result[0]["LAST_SESSION_TIME"];
			$res = $database->insertQuery($conn, $sql, $paramList);
			
			//update current user_session
			$sql = "UPDATE USER_SESSION SET LAST_SESSION_TIME = NOW() WHERE LOGIN_ID =:loginId";
			$paramList = array();
			$paramList["loginId"] = $req_data["LOGIN_ID"];
			$res = $database->updateQuery($conn, $sql, $paramList);
		}
		 return true;
	}


	function changeDateFormat($dateValue){
		$dateFormat = explode("-", $dateValue);

		if($dateFormat[1] == "Jan"){
			$dateFormat[1] = "01";
		}else if($dateFormat[1] == "Feb"){
			$dateFormat[1] = "02";
		}else if($dateFormat[1] == "Mar"){
			$dateFormat[1] = "03";
		}else if($dateFormat[1] == "Apr"){
			$dateFormat[1] = "04";
		}else if($dateFormat[1] == "May"){
			$dateFormat[1] = "05";
		}else if($dateFormat[1] == "Jun"){
			$dateFormat[1] = "06";
		}else if($dateFormat[1] == "Jul"){
			$dateFormat[1] = "07";
		}else if($dateFormat[1] == "Aug"){
			$dateFormat[1] = "08";
		}else if($dateFormat[1] == "Sep"){
			$dateFormat[1] = "09";
		}else if($dateFormat[1] == "Oct"){
			$dateFormat[1] = "10";
		}else if($dateFormat[1] == "Nov"){
			$dateFormat[1] = "11";
		}else if($dateFormat[1] == "Dec"){
			$dateFormat[1] = "12";
		}

		$date = $dateFormat[2]."-".$dateFormat[1]."-".$dateFormat[0];
		return $date;
	}
	
	
	function getMonthValue($mon){
		if(trim($mon) == "January"){
			$value = "1";
		}else if(trim($mon) == "February"){
			$value = "2";
		}else if(trim($mon) == "March"){
			$value = "3";
		}else if(trim($mon) == "April"){
			$value = "4";
		}else if(trim($mon) == "May"){
			$value = "5";
		}else if(trim($mon) == "June"){
			$value = "6";
		}else if(trim($mon) == "July"){
			$value = "7";
		}else if(trim($mon) == "August"){
			$value = "8";
		}else if(trim($mon) == "September"){
			$value = "9";
		}else if(trim($mon) == "October"){
			$value = "10";
		}else if(trim($mon) == "November"){
			$value = "11";
		}else if(trim($mon) == "December"){
			$value = "12";
		}
		
		return $value;
	}
	
	
	function getMonthFormDate($mon){
		if(trim($mon) == "01"){
			$value = "January";
		}else if(trim($mon) == "02"){
			$value = "February";
		}else if(trim($mon) == "03"){
			$value = "March";
		}else if(trim($mon) == "04"){
			$value = "April";
		}else if(trim($mon) == "05"){
			$value = "May";
		}else if(trim($mon) == "06"){
			$value = "June";
		}else if(trim($mon) == "07"){
			$value = "July";
		}else if(trim($mon) == "08"){
			$value = "August";
		}else if(trim($mon) == "09"){
			$value = "September";
		}else if(trim($mon) == "10"){
			$value = "October";
		}else if(trim($mon) == "11"){
			$value = "November";
		}else if(trim($mon) == "12"){
			$value = "December";
		}
		
		return $value;
	}
	
	//Sample Code

	//$database = new Database();
	//$conn = $database->getConnection();
	//echo genSequenceId($conn, "CC"); 
	//echo fetchConstantsData($database, $conn, "FileUploadType"); 
	//echo checkPasswordChangeTimespan("2018-01-01 12:29:10", "2018-03-01 12:29:10");
	//$req_data = array();
	//$req_data["LOGIN_ID"] = "LI000001";
	//$req_data["ACCESS_TOKEN"] = "12345678";
	//$req_data["REG_TYPE"] = "1";
	//setSessionTimer($database, $conn, $req_data);
	//checkSessionTimer($database, $conn, "LI000001");
?>