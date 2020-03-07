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



	function checkOTP($database, $conn, $req_data){
		LoggerInfo($GLOBALS["currentFileName"], "Inside checOTP and incoming data is ".json_encode($req_data));
		$forPassOTP =  $req_data->{"data"}->{"forgotPassOTP"};
		LoggerInfo($GLOBALS["currentFileName"], "Login Id is ::".$req_data->{"data"}->{"loginId"}." and unique key is ".$req_data->{"data"}->{"forgotPassOTP"});
		$sql = "SELECT * FROM FORGOT_PASSWORD WHERE LOGIN_ID = :userId AND UNIQUE_KEY=:unique_key";
		$paramList = array();
		$paramList["userId"] = $req_data->{"data"}->{"loginId"};
		$paramList["unique_key"] = $forPassOTP;
		$result = $database->selectParamQuery($conn, $sql, $paramList); if(count($result) > 0){$result  = $result[0];}
		LoggerInfo($GLOBALS["currentFileName"], "response result  is for checkOTP ".json_encode($result));
		if($result == "" || count($result) == 0){
			$response["status"] = "failed";
			$response["statusCode"] = 2001;
			$response["message"] = "Incorrect OTP!";
		}else if(count($result) > 0){
			$response["status"] = "success";
			$response["statusCode"] = 200;
			$data = array();
			$response["data"] = $data;
			$response["message"] = "Set your new password";
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

	function deletePreviousForgotPassList($database, $conn, $req_data){
		$sql = "DELETE FROM FORGOT_PASSWORD WHERE LOGIN_ID=:login_id ";
		$paramList = array();
		$paramList["login_id"] = $req_data["data"]["LOGIN_ID"];
		$result = $database->deleteParamQuery($conn, $sql, $paramList);
	}

	function resetLinkSender($database, $conn, $req_data){
		deletePreviousForgotPassList($database, $conn, $req_data);
		$generatedOtp = generateOTP();

		LoggerInfo($GLOBALS["currentFileName"], "unique key is ".$generatedOtp);
		LoggerInfo($GLOBALS["currentFileName"], "resetlinkIncoming data is".json_encode($req_data));
		LoggerInfo($GLOBALS["currentFileName"], "incoing login id is  data is".json_encode($req_data["data"]["LOGIN_ID"]));

		$sql = "INSERT INTO FORGOT_PASSWORD(LOGIN_ID, REG_TYPE, EMAIL, STATUS, UNIQUE_KEY) VALUES(:login_id,:reg_type,:email,0,:unique_key)";
		$paramList = array();
		$paramList["login_id"] = $req_data["data"]["LOGIN_ID"];
		$paramList["reg_type"] = $req_data["data"]["REG_TYPE"];
		$paramList["email"] = $req_data["data"]["USER_EMAIL"];

		if(fetchConstantsData($database, $conn, "Environment") == "UAT"){
			$paramList["unique_key"] = "123456";
		}else{
			$paramList["unique_key"] = $generatedOtp;
		}



		$result = $database->insertQuery($conn, $sql, $paramList);

		if($result == "failed"){
			$response['status'] = "failed";
			$response['statusCode'] = 1001;
			$response['message'] = "";
			$data = array();
			$response['data'] = $data;
		}else if($result>0){
			$response['status'] = "success";
			$response['statusCode'] = 200;
			$response['message'] = "";
			$data = array();
			$data['lastInsertedId'] = $result;
			LoggerInfo($GLOBALS["currentFileName"], "mailing info is :: to ".$req_data["data"]["USER_EMAIL"]."firstname".$req_data["data"]["FIRST_NAME"]."Lastname ".$req_data["data"]["LAST_NAME"]."otp".$generatedOtp);
			try{
				$from = fetchConstantsData($database, $conn, "fromEmailIdGenOtp");
				$to = $req_data["data"]["USER_EMAIL"];
				$cc = "";
				$bcc = "";
				$subject = "Welcome to Mitron.com";
				$msg =  "Dear ".$req_data["data"]["FIRST_NAME"]." ".$req_data["data"]["LAST_NAME"].",<br> <br/><b>"
				.$generatedOtp."</b>&nbsp;&nbsp;is your One-Time-Password (OTP) for secure login into your account. ". $req_data["data"]["USER_EMAIL"]."This password is valid for 15 minutes.<br/><br/>".
				"The mail is being sent to you with respect to your interest for availing loan products through Mystro.in and during creation of Login Id credentials for accessing our online customer loan application form.<br/><br/>".
				"In case you are not able to successfully login or facing error during OTP validation process, please wite to us at support@mystro.in mentioning your name along with your mobile no.<br/><br/>".
				"At Mystro, we do not email you your password. All User account passwords are to be created by the Users (Applicants) directly. Our representatives will also not call you to offer help for creating any password for user accounts. You can change your password once you login into the account. Following are the recommendations for strong passwords:<br/><br/>".
				"<table>
				<tr><td>&#10004;</td> <td>Create longer length passwords using combinations of letters and numbers </td></tr>
				<tr><td>&#10004;</td> <td>Use different passwords for each of your online accounts</td></tr>
				<tr><td>&#10004;</td> <td>Don't use predictable passwords</td></tr>
				<tr><td>&#10004;</td> <td>Change your passwords regularly</td></tr>
				<tr><td>&#10004;</td> <td>You will have guidance for password creation on the page</td></tr>
				</table><br/><br/>".
				"If you receive a suspicious email that claims to be from www.mystro.in or Mitron Capital, do not click any links or download any attachments. Please call us on our customer care desk or any of our loan officers to ask questions about it or forward the suspicious email to support@mystro.in<br/><br/>".
				"Regards<br/><br/>".
				"Team Mystro<br/><br/>".
				"www.mystro.in";
				$attachment = "";
				sendEmail($to, $subject, $msg);
				sendSMS($req_data["data"]["USER_MOBILE_NO"], $generatedOtp.", is your OTP for secured login and is valid for 15 mins. Never share the OTP number with any one.");
				}catch(Exception $e){
					LoggerInfo($GLOBALS["currentFileName"], "Connection Error: " . $e);
					return;
				}
			}
		};

	function adminLogin($database, $conn, $req_data){
		$sql = "SELECT * FROM USER_REG_MST WHERE REG_TYPE=4 AND (USER_EMAIL = :userId OR BP_ID = :userId OR SE_ID = :userId OR CUST_ID = :userId)";
		$paramList = array();
		$paramList["userId"] = $req_data->{"data"}->{"emailId"};
		$resultEmail = $database->selectParamQuery($conn, $sql, $paramList)[0];
		if(count($resultEmail) > 0){
		LoggerInfo($GLOBALS["currentFileName"], "Account is :: ".$resultEmail["REG_TYPE"]);
		if($resultEmail["ACCOUNT_LOCKED"] == 0){
			$sql = "SELECT * FROM USER_REG_MST WHERE (USER_EMAIL = :userId OR BP_ID = :userId OR SE_ID = :userId OR CUST_ID = :userId) AND USER_PWD = :password";
				$paramList = array();
				$paramList["userId"] = $req_data->{"data"}->{"emailId"};
				$paramList["password"] = $req_data->{"data"}->{"password"};
				$result = $database->selectParamQuery($conn, $sql, $paramList); if(count($result) > 0){$result  = $result[0];}
				LoggerInfo($GLOBALS["currentFileName"], "Paramlist list ".json_encode($paramList)." and sql is".json_encode($sql));
				if (count($result) > 0){
				LoggerInfo($GLOBALS["currentFileName"], "Result FOR CHANGE PASSWORD : " . json_encode($result));
					if ($result["IS_DISABLED"] == 0){
						if($result['IS_EMAIL_VERIFIED'] == 1){
							$generatedOtp = generateOTP();
							$accessToken = generateAccessToken();
							$req = array();
							$req["LOGIN_ID"] = $result['LOGIN_ID'];
							$req["REG_TYPE"] = $result['REG_TYPE'];
							$req["ACCESS_TOKEN"] = $result['ACCESS_TOKEN'];
							setSessionTimer($database, $conn, $req);
							$response["status"] = "success";
							$response["statusCode"] = 200;
							$data = array();
							$data["regType"] = $result['REG_TYPE'];
							$data["loginId"] = $result['LOGIN_ID'];
							$data["firstName"] = $result['FIRST_NAME'];
							$data["middleName"] = $result['MIDDLE_NAME'];
							$data["lastName"] = $result['LAST_NAME'];
							$data["customerId"] = $result['CUST_ID'];
							$data["businessPartnerId"] = $result['BP_ID'];
							$data["email"] = $result['USER_EMAIL'];
							$data["countryCode"] = $result['USER_COUNTRY_CODE'];
							$data["mobileNo"] = $result['USER_MOBILE_NO'];
							$data["lastLoginTime"] = $result['USER_LAST_LOGIN_TIME'] == '' || $result['USER_LAST_LOGIN_TIME'] == null ? null : $result['USER_LAST_LOGIN_TIME'];
							$data["isIdApproved"] = $result['IS_ID_APPROVED'];
							$data["bpFormStatus"] = $result['BP_FORM_STATUS'];
							$response["data"] = $data;
							$response["accessToken"] = $accessToken;
							$response["message"] = "Valid login credentials";
							$sql = "INSERT INTO LOGIN_HISTORY (REG_TYPE, LOGIN_ID, FIRST_NAME, MIDDLE_NAME, LAST_NAME, USER_PWD, USER_EMAIL, USER_COUNTRY_CODE, USER_MOBILE_NO, USER_LAST_LOGIN_TIME, IS_ID_APPROVED, IS_DISABLED, OTP, UPDATE_DATE, ACCESS_TOKEN) VALUES (:reg_type, :login_id, :firstname, :middlename, :lastname, :userpwd, :email, :countrycode, :mobileno, :lastlogintime, :approved, :disabled, :otp, NOW(), :accessToken)";
							$paramList = array();
							// $paramList["id"] = $result['ID'];
							$paramList["reg_type"] = $result['REG_TYPE'];
							$paramList["login_id"] = $result['LOGIN_ID'];
							$paramList["firstname"] = $result['FIRST_NAME'];
							$paramList["middlename"] = "NULL";
							$paramList["lastname"] = $result['LAST_NAME'];
							$paramList["userpwd"] = $result['USER_PWD'];
							$paramList["email"] = $result['USER_EMAIL'];
							$paramList["countrycode"] = $result['USER_COUNTRY_CODE'];
							$paramList["mobileno"] = $result['USER_MOBILE_NO'];
							$paramList["lastlogintime"] = $result['USER_LAST_LOGIN_TIME'] == '' || $result['USER_LAST_LOGIN_TIME'] == null ? null : $result['USER_LAST_LOGIN_TIME'];
							$paramList["approved"] = $result['IS_ID_APPROVED'];
							$paramList["disabled"] = $result['IS_DISABLED'];
							$paramList["otp"] = $generatedOtp;   //default value setted .
							$paramList["accessToken"] = $accessToken; //default value setted.
							$resp = $database->insertQuery($conn, $sql, $paramList);
							date_default_timezone_set('Asia/Kolkata');
							$timestamp = time();
							$date_time = date("Y-m-d H:i:s", $timestamp);
							$sql = "UPDATE USER_REG_MST SET USER_LAST_LOGIN_TIME =:user_last_login_time, ACCESS_TOKEN = :accessToken, OTP = :otp where ID = :id";
							$paramList = array();
							$paramList["user_last_login_time"] = $date_time;
							if(fetchConstantsData($database, $conn, "Environment") == "UAT"){
								$paramList["otp"] = "123456";
							}else{
								$paramList["otp"] = $generatedOtp;
							}

							$paramList["id"] = $result["ID"];
							$paramList["accessToken"] = $accessToken;
							$database->updateQuery($conn, $sql, $paramList);

							$from = fetchConstantsData($database, $conn, "fromEmailIdGenOtp");
							$to = $result['USER_EMAIL'];
							$cc = "";
							$bcc = "";
							$subject = "Welcome to Mitron.com";
							$msg = "Dear ".$result['FIRST_NAME']." ".$result['LAST_NAME'].",<br> <br/><b>"
							.$generatedOtp."</b>&nbsp;&nbsp;is your One-Time-Password (OTP) for secure login into your account ".$result['USER_EMAIL'].". This password is valid for 15 minutes.<br/><br/>".
							"The mail is being sent to you with respect to your interest for availing loan products through Mystro.in and during creation of Login Id credentials for accessing our online customer loan application form.<br/><br/>".
							"In case you are not able to successfully login or facing error during OTP validation process, please wite to us at support@mystro.in mentioning your name along with your mobile no.<br/><br/>".
							"At Mystro, we do not email you your password. All User account passwords are to be created by the Users (Applicants) directly. Our representatives will also not call you to offer help for creating any password for user accounts. You can change your password once you login into the account. Following are the recommendations for strong passwords:<br/><br/>".
							"<table>
							<tr><td>?</td> <td>Create longer length passwords using combinations of letters and numbers </td></tr>
							<tr><td>?</td> <td>Use different passwords for each of your online accounts</td></tr>
							<tr><td>?</td> <td>Don't use predictable passwords</td></tr>
							<tr><td>?</td> <td>Change your passwords regularly</td></tr>
							<tr><td>?</td> <td>You will have guidance for password creation on the page</td></tr>
							</table><br/><br/>".
							"If you receive a suspicious email that claims to be from www.mystro.in or Mitron Capital, do not click any links or download any attachments. Please call us on our customer care desk or any of our loan officers to ask questions about it or forward the suspicious email to support@mystro.in<br/><br/>".
							"Regards<br/><br/>".
							"Team Mystro<br/><br/>".
							"www.mystro.in";
							$attachment = "";
							sendEmail($to, $subject, $msg);
						}else{
							$hoursAfterExpired = 12;
							$date = explode("-",$result["GEN_ACTIVATE_EMAIL_OTP_TIME"]);
							$year = $date[0];
							$month = $date[1];
							$day = explode(" ",$date[2])[0];
							$dtime = explode(" ",$date[2])[1];
							$time = explode(":",$dtime);
							$emailDBDate = new DateTime($year.'-'.$month.'-'.$day);
							$emailDBDate->setTime($time[0], $time[1], $time[2]);
							$dbDateNo = ($emailDBDate->format("YmdHis"));
							LoggerInfo("login.php","Email Date Before:".$dbDateNo);
							$emailDBDate->add(new DateInterval('PT'.$hoursAfterExpired.'H'));
							$sysDate = new DateTime();

							$dbDateNo = ($emailDBDate->format("YmdHis"));
							$sysDateNo = ($sysDate->format("YmdHis"));
							$dbDateNoDMY = (int)substr($dbDateNo,0,8);
							$sysDateNoDMY = (int)substr($sysDateNo,0,8);
							$dbDateNoHMS = substr($dbDateNo,8);
							$sysDateNoHMS = substr($sysDateNo,8);
							
							$flag = false;
							if($dbDateNoDMY > $sysDateNoDMY){
								$flag = false;
								LoggerInfo($GLOBALS["currentFileName"],"User Details time not lapsed. Email:".$result['USER_EMAIL']);
							} else{
								if($dbDateNoHMS >= $sysDateNoHMS){
									$flag = false;
									LoggerInfo($GLOBALS["currentFileName"],"User Details time not lapsed. Email:".$result['USER_EMAIL']);
								} else{
									$flag = true;
									LoggerInfo($GLOBALS["currentFileName"],"User Details time lapsed, sending mail again. Email:".$result['USER_EMAIL']);
								}
							}

							if(!$flag){ //Success
								$response["status"] = "failed";
								$response["statusCode"] = 1000;
								$response["message"] = "Account is not Activated! Please check email.";
							}else{ //Failer
								$generatedEmailOtp = generateAccessToken();
								$sql = "UPDATE USER_REG_MST SET ACTIVATE_EMAIL_OTP = :new_activate_email_otp,GEN_ACTIVATE_EMAIL_OTP_TIME = NOW() WHERE ACTIVATE_EMAIL_OTP = :old_activate_email_otp AND LOGIN_ID = :loginId";
								$paramList = array();
								$paramList["new_activate_email_otp"] = ($generatedEmailOtp);
								$paramList["old_activate_email_otp"] = $result["ACTIVATE_EMAIL_OTP"];
								$paramList["loginId"] = $result["LOGIN_ID"];
								$resultNew = $database->updateQuery($conn, $sql, $paramList);
								if($resultNew == "success"){
									try{
										$from = fetchConstantsData($database, $conn, "fromEmailIdGenOtp");
										$to = $req_data->{"data"}->{"USER_EMAIL"};
										$cc = "";
										$bcc = "";
										$subject = "Welcome to Mitron.com";
										$msg =" Dear ".$req_data->{"data"}->{"FIRST_NAME"}." ".$req_data->{"data"}->{"LAST_NAME"}.",<br>".
										"We have received your interest in availing a business loan.<br>".
										"We would like to help you secure financing quickly and easily.<br>".
										"Please click on below link to Activate Your Account<br><br>".
										/*"<a href='UI/content/dashboard/api/controller/activateLink.php?genOTP=".$generatedEmailOtp."'>Activate Account</a><br><br>"*/
										"Please feel free to write to us for any queries at info@mitron.com<br><br>".
										"Regards<br>".
										"Team Mitron<br>".
										"Visit us at www.mitron.com";
										$attachment = "";
										sendEmail($to, $subject, $msg);
										LoggerInfo($GLOBALS["currentFileName"],"Email Notification send");
									}catch(Exception $e){
										LoggerInfo($GLOBALS["currentFileName"], "Connection Error: " . $e);
									return;
									}
									$response["status"] = "failed";
									$response["statusCode"] = 1005;
									$response["message"] = "Account is not Activated! Please check email. Activation link has been sent to your account";
								}else{
									$response["status"] = "failed";
									$response["statusCode"] = 1004;
									$response["message"] = "Could not send email verification link";
									$data = array();
									$response['data'] = $data;
								}
							}
						}
					}else{
					$response["status"] = "failed";
					$response["statusCode"] = 1000;
					$response["message"] = "Your account has been Deactivated";
					}
				}else{
					$response["status"] = "failed";
					$response["statusCode"] = 1000;
					$response["loginAttempts"] = attemptLogin($database, $conn, $resultEmail);
					$response["message"] = count($response["loginAttempts"]) == 0 ?  "Invalid Username and Password" : $response["loginAttempts"]["message"];
				}

			}else{
				$response["status"] = "failed";
				$response["statusCode"] = 1000;
				$response["message"] = "Account has been temporarily locked. Please contact Admin to unlock the account";
			}

		}else{
			$response["status"] = "failed";
			$response["statusCode"] = 1000;
			$response["message"] = "Email id is not valid!";
		}
		return $response;
	}
		
		
		
		
function login($database, $conn, $req_data){
		$sql = "SELECT * FROM USER_REG_MST WHERE REG_TYPE!=4 AND (USER_EMAIL = :userId OR BP_ID = :userId OR SE_ID = :userId OR CUST_ID = :userId)";
		$paramList = array();
		$paramList["userId"] = $req_data->{"data"}->{"emailId"};
		$resultEmail = $database->selectParamQuery($conn, $sql, $paramList);
		if($resultEmail[0]  > 0){$resultEmail = $resultEmail[0];}
		if(count($resultEmail) > 0){
		LoggerInfo($GLOBALS["currentFileName"], "Account is :: ".$resultEmail["REG_TYPE"]);
		if($resultEmail["ACCOUNT_LOCKED"] == 0){
			$sql = "SELECT * FROM USER_REG_MST WHERE (USER_EMAIL = :userId OR BP_ID = :userId OR SE_ID = :userId OR CUST_ID = :userId) AND USER_PWD = :password";
				$paramList = array();
				$paramList["userId"] = $req_data->{"data"}->{"emailId"};
				$paramList["password"] = $req_data->{"data"}->{"password"};
				$result = $database->selectParamQuery($conn, $sql, $paramList);
				//$result = $result[0];
				if(count($result) > 0){$result  = $result[0];}
				LoggerInfo($GLOBALS["currentFileName"], "Paramlist list ".json_encode($paramList)." and sql is".json_encode($sql));
				if (count($result) > 0){
				LoggerInfo($GLOBALS["currentFileName"], "Result FOR CHANGE PASSWORD : " . json_encode($result));
					if ($result["IS_DISABLED"] == 0){
						if($result['IS_EMAIL_VERIFIED'] == 1){
							$generatedOtp = generateOTP();
							$accessToken = generateAccessToken();
							$req = array();
							$req["LOGIN_ID"] = $result['LOGIN_ID'];
							$req["REG_TYPE"] = $result['REG_TYPE'];
							$req["ACCESS_TOKEN"] = $result['ACCESS_TOKEN'];
							setSessionTimer($database, $conn, $req);
							$response["status"] = "success";
							$response["statusCode"] = 200;
							$data = array();
							$data["regType"] = $result['REG_TYPE'];
							$data["loginId"] = $result['LOGIN_ID'];
							$data["firstName"] = $result['FIRST_NAME'];
							$data["middleName"] = $result['MIDDLE_NAME'];
							$data["customerId"] = $result['CUST_ID'];
							$data["businessPartnerId"] = $result['BP_ID'];
							$data["lastName"] = $result['LAST_NAME'];
							$data["email"] = $result['USER_EMAIL'];
							$data["countryCode"] = $result['USER_COUNTRY_CODE'];
							$data["mobileNo"] = $result['USER_MOBILE_NO'];
							$data["lastLoginTime"] = $result['USER_LAST_LOGIN_TIME'] == '' || $result['USER_LAST_LOGIN_TIME'] == null ? null : $result['USER_LAST_LOGIN_TIME'];
							$data["isIdApproved"] = $result['IS_ID_APPROVED'];
							$data["bpFormStatus"] = $result['BP_FORM_STATUS'];
							$data["sm_id"] = $result['SM_ID'];
							$response["data"] = $data;
							$response["accessToken"] = $accessToken;
							LoggerInfo("login.php", "accessToken :::: ".$accessToken);
							$response["message"] = "Valid login credentials";
							$sql = "INSERT INTO LOGIN_HISTORY (REG_TYPE, LOGIN_ID, FIRST_NAME, MIDDLE_NAME, LAST_NAME, USER_PWD, USER_EMAIL, USER_COUNTRY_CODE, USER_MOBILE_NO, USER_LAST_LOGIN_TIME, IS_ID_APPROVED, IS_DISABLED, OTP, UPDATE_DATE, ACCESS_TOKEN) VALUES (:reg_type, :login_id, :firstname, :middlename, :lastname, :userpwd, :email, :countrycode, :mobileno, :lastlogintime, :approved, :disabled, :otp, NOW(), :accessToken)";
							$paramList = array();
							// $paramList["id"] = $result['ID'];
							$paramList["reg_type"] = $result['REG_TYPE'];
							$paramList["login_id"] = $result['LOGIN_ID'];
							$paramList["firstname"] = $result['FIRST_NAME'];
							$paramList["middlename"] = "NULL";
							$paramList["lastname"] = $result['LAST_NAME'];
							$paramList["userpwd"] = $result['USER_PWD'];
							$paramList["email"] = $result['USER_EMAIL'];
							$paramList["countrycode"] = $result['USER_COUNTRY_CODE'];
							$paramList["mobileno"] = $result['USER_MOBILE_NO'];
							$paramList["lastlogintime"] = $result['USER_LAST_LOGIN_TIME'] == '' || $result['USER_LAST_LOGIN_TIME'] == null ? null : $result['USER_LAST_LOGIN_TIME'];
							$paramList["approved"] = $result['IS_ID_APPROVED'];
							$paramList["disabled"] = $result['IS_DISABLED'];
							$paramList["otp"] = $generatedOtp;   //default value setted .
							$paramList["accessToken"] = $accessToken; //default value setted.
							$resp = $database->insertQuery($conn, $sql, $paramList);
							date_default_timezone_set('Asia/Kolkata');
							$timestamp = time();
							$date_time = date("Y-m-d H:i:s", $timestamp);
							$sql = "UPDATE USER_REG_MST SET USER_LAST_LOGIN_TIME =:user_last_login_time, ACCESS_TOKEN = :accessToken, OTP = :otp, LAST_SESSION_TIME=NOW() where ID = :id";
							$paramList = array();
							$paramList["user_last_login_time"] = $date_time;
							if(fetchConstantsData($database, $conn, "Environment") == "UAT"){
								$paramList["otp"] = "123456";
							}else{
								$paramList["otp"] = $generatedOtp;
							}

							$paramList["id"] = $result["ID"];
							$paramList["accessToken"] = $accessToken;
							$database->updateQuery($conn, $sql, $paramList);
							$from = fetchConstantsData($database, $conn, "fromEmailIdGenOtp");
							$to = $result['USER_EMAIL'];
							$cc = "";
							$bcc = "";
							$subject = "Welcome to Mitron.com";
							$msg = "Dear ".$result['FIRST_NAME']." ".$result['LAST_NAME'].",<br> <br/><b>"
							.$generatedOtp."</b>&nbsp;&nbsp;is your One-Time-Password (OTP) for secure login into your account. ".$result['USER_EMAIL'].". This password is valid for 15 minutes.<br/><br/>".
							"The mail is being sent to you with respect to your interest for availing loan products through Mystro.in and during creation of Login Id credentials for accessing our online customer loan application form.<br/><br/>".
							"In case you are not able to successfully login or facing error during OTP validation process, please wite to us at support@mystro.in mentioning your name along with your mobile no.<br/><br/>".
							"At Mystro, we do not email you your password. All User account passwords are to be created by the Users (Applicants) directly. Our representatives will also not call you to offer help for creating any password for user accounts. You can change your password once you login into the account. Following are the recommendations for strong passwords:<br/><br/>".
							"<table>
							<tr><td>&#10004;</td> <td>Create longer length passwords using combinations of letters and numbers </td></tr>
							<tr><td>&#10004;</td> <td>Use different passwords for each of your online accounts</td></tr>
							<tr><td>&#10004;</td> <td>Don't use predictable passwords</td></tr>
							<tr><td>&#10004;</td> <td>Change your passwords regularly</td></tr>
							<tr><td>&#10004;</td> <td>You will have guidance for password creation on the page</td></tr>
							</table><br/><br/>".
							"If you receive a suspicious email that claims to be from www.mystro.in or Mitron Capital, do not click any links or download any attachments. Please call us on our customer care desk or any of our loan officers to ask questions about it or forward the suspicious email to support@mystro.in<br/><br/>".
							"Regards<br/><br/>".
							"Team Mystro<br/><br/>".
							"www.mystro.in";
							$attachment = "";
/* 
							sendEmail($to, $subject, $msg);
							sendSMS($result['USER_MOBILE_NO'], $generatedOtp.", is your OTP for secured login and is valid for 15 mins. Never share the OTP number with any one."); */
						}else{
							$hoursAfterExpired = 12;
							$date = explode("-",$result["GEN_ACTIVATE_EMAIL_OTP_TIME"]);
							$year = $date[0];
							$month = $date[1];
							$day = explode(" ",$date[2])[0];
							$dtime = explode(" ",$date[2])[1];
							$time = explode(":",$dtime);
							$emailDBDate = new DateTime($year.'-'.$month.'-'.$day);
							$emailDBDate->setTime($time[0], $time[1], $time[2]);
							$dbDateNo = ($emailDBDate->format("YmdHis"));
							LoggerInfo($GLOBALS["currentFileName"],"Email Date Before:".$dbDateNo);
							$emailDBDate->add(new DateInterval('PT'.$hoursAfterExpired.'H'));
							$sysDate = new DateTime();

							$dbDateNo = ($emailDBDate->format("YmdHis"));
							$sysDateNo = ($sysDate->format("YmdHis"));
							$dbDateNoDMY = (int)substr($dbDateNo,0,8);
							$sysDateNoDMY = (int)substr($sysDateNo,0,8);
							$dbDateNoHMS = substr($dbDateNo,8);
							$sysDateNoHMS = substr($sysDateNo,8);
							
							$flag = false;
							if($dbDateNoDMY > $sysDateNoDMY){
								$flag = false;
								LoggerInfo($GLOBALS["currentFileName"],"User Details time not lapsed. Email:".$result['USER_EMAIL']);
							} else{
								if($dbDateNoHMS >= $sysDateNoHMS){
									$flag = false;
									LoggerInfo($GLOBALS["currentFileName"],"User Details time not lapsed. Email:".$result['USER_EMAIL']);
								} else{
									$flag = true;
									LoggerInfo($GLOBALS["currentFileName"],"User Details time lapsed, sending mail again. Email:".$result['USER_EMAIL']);
								}
							}

							if(!$flag){ //Success
								$response["status"] = "failed";
								$response["statusCode"] = 1000;
								$response["message"] = "Account is not Activated! Please check email.";
							}else{ //Failer
								$generatedEmailOtp = generateAccessToken();
								$sql = "UPDATE USER_REG_MST SET ACTIVATE_EMAIL_OTP = :new_activate_email_otp,GEN_ACTIVATE_EMAIL_OTP_TIME = NOW() WHERE ACTIVATE_EMAIL_OTP = :old_activate_email_otp AND LOGIN_ID = :loginId";
								$paramList = array();
								$paramList["new_activate_email_otp"] = ($generatedEmailOtp);
								$paramList["old_activate_email_otp"] = $result["ACTIVATE_EMAIL_OTP"];
								$paramList["loginId"] = $result["LOGIN_ID"];
								$resultNew = $database->updateQuery($conn, $sql, $paramList);
								if($resultNew == "success"){

 									try{
										$from = fetchConstantsData($database, $conn, "fromEmailIdGenOtp");
										$to = $req_data->{"data"}->{"USER_EMAIL"};
										$cc = "";
										$bcc = "";
										$subject = "Welcome to Mitron.com";
										$msg =" Dear ".$req_data->{"data"}->{"FIRST_NAME"}." ".$req_data->{"data"}->{"LAST_NAME"}.",<br>".
										"We have received your interest in availing a business loan.<br>".
										"We would like to help you secure financing quickly and easily.<br>".
										"Please click on below link to Activate Your Account<br><br>".
										"Please feel free to write to us for any queries at info@mitron.com<br><br>".
										"Regards<br>".
										"Team Mitron<br>".
										"Visit us at www.mitron.com";
										$attachment = "";
/*
										sendEmail($to, $subject, $msg);
										sendSMS($result['USER_MOBILE_NO'], $generatedOtp.", is your OTP for secured login and is valid for 15 mins. Never share the OTP number with any one.");
									 */
										LoggerInfo($GLOBALS["currentFileName"],"Email Notification send");
									}catch(Exception $e){
										LoggerInfo($GLOBALS["currentFileName"], "Connection Error: " . $e);
									return;
									}
									$response["status"] = "failed";
									$response["statusCode"] = 1005;
									$response["message"] = "Account is not Activated! Please check email. Activation link has been sent to your account";
								}else{
									$response["status"] = "failed";
									$response["statusCode"] = 1004;
									$response["message"] = "Could not send email verification link";
									$data = array();
									$response['data'] = $data;
								}
							}
						}
					}else{
					$response["status"] = "failed";
					$response["statusCode"] = 1000;
					$response["message"] = "Your account has been Deactivated";
					}
				}else{
					$response["status"] = "failed";
					$response["statusCode"] = 1000;
					$response["loginAttempts"] = attemptLogin($database, $conn, $resultEmail);
					$response["message"] = count($response["loginAttempts"]) == 0 ?  "Invalid Username and Password" : $response["loginAttempts"]["message"];
				}

			}else{
				$response["status"] = "failed";
				$response["statusCode"] = 1000;
				$response["message"] = "Account has been temporarily locked. Please contact Admin to unlock the account";
			}

		}else{
			$response["status"] = "failed";
			$response["statusCode"] = 1000;
			$response["message"] = "Email id is not valid!";
		}
		return $response;
	}

		function attemptLogin($database, $conn, $req_data){
			$response = array();
			 LoggerInfo($GLOBALS["currentFileName"], "Incoming reqeust for login Attemp is ".json_encode($req_data));
			 $flag = false;
			 $sql = "SELECT * FROM LOGIN_ATTEMPTS WHERE LOGIN_ID = :userId AND LOGIN_ATTEMPTS_REF = 1";
			 $paramList = array();
			 $paramList["userId"] = $req_data["LOGIN_ID"];
			 $result = $database->selectParamQuery($conn, $sql, $paramList)[0];
			 /* if(count($result) > 0){$result  = $result[0];} */
			
			LoggerInfo($GLOBALS["currentFileName"], "checking login attempt 123".json_encode($result));			
			
			 
			 if($result == "failed" || $result == "" || count($result) < 0){
				   setAttempts($database, $conn, $req_data);
			 }else if(count($result) > 0){
				  LoggerInfo($GLOBALS["currentFileName"], "checking login attempt".json_encode($result));
					$hoursAfterExpired = 6;
					$date = explode("-",$result["LAST_TRIED_LOGGING"]);
					$year = $date[0];
					$month = $date[1];
					$day = explode(" ",$date[2])[0];
					$dtime = explode(" ",$date[2])[1];
					$time = explode(":",$dtime);
					$emailDBDate = new DateTime($year.'-'.$month.'-'.$day);
					$emailDBDate->setTime($time[0], $time[1], $time[2]);
					$dbDateNo = ($emailDBDate->format("YmdHis"));
					$emailDBDate->add(new DateInterval('PT'.$hoursAfterExpired.'H'));
					$sysDate = new DateTime();

					$dbDateNo = ($emailDBDate->format("YmdHis"));
					$sysDateNo = ($sysDate->format("YmdHis"));
					$dbDateNoDMY = (int)substr($dbDateNo,0,8);
					$sysDateNoDMY = (int)substr($sysDateNo,0,8);
					$dbDateNoHMS = substr($dbDateNo,8);
					$sysDateNoHMS = substr($sysDateNo,8);
							$flag = false;
					
							if($sysDateNoDMY <= $dbDateNoDMY){
									if($sysDateNo <= $dbDateNo){
										$flag = false;
										$result = checkAttempts($database, $conn, $req_data);
										 if($result["LOGIN_ATTEMPTS_REF"] == 4){
											$response["status"] = "failed";
											$response["statusCode"] = 1000;
											$response["message"] = "Account has been Locked !";
											lockAccount($database, $conn, $req_data);
											return $response;
											}else{
											 setAttempts($database, $conn, $req_data);
										 }
									}else{
										LoggerInfo($GLOBALS["currentFileName"],"date is perfect but time is incorrect");
										resetLockTimer($database, $conn, $req_data);
									}
							}else if($sysDateNoDMY > $dbDateNoDMY){
								LoggerInfo($GLOBALS["currentFileName"],"date is incorrect and time is incorrect");
								resetLockTimer($database, $conn, $req_data);
							}
						}

					return $response;
				 }

			function setAttempts($database, $conn, $req_data){
					LoggerInfo($GLOBALS["currentFileName"],"Inside set Attempts");
					$currentLoginAttempt = $req_data["CURRENT_LOGIN_ATTEMPT"] + 1;
				   $sql = "INSERT INTO LOGIN_ATTEMPTS(REG_TYPE,LOGIN_ID,BP_ID,SE_ID,CUST_ID,LOGIN_ATTEMPTS_REF,LAST_TRIED_LOGGING) VALUES(:reg_type,:login_id,:bp_id,:se_id,:cust_id,:login_attempts_ref,NOW())";
				   $paramList = array();
				   $paramList["reg_type"] = $req_data["REG_TYPE"];
				   $paramList["login_id"] = $req_data["LOGIN_ID"];
				   $paramList["bp_id"] = $req_data["BP_ID"];
				   $paramList["se_id"] = $req_data["SE_ID"];
				   $paramList["cust_id"] = $req_data["CUST_ID"];
				   $paramList["login_attempts_ref"] = $currentLoginAttempt;

				   $result = $database->insertQuery($conn, $sql, $paramList);

				   if($result == "failed"){
					 $response['status'] = "failed";
					 $response['statusCode'] = 1001;
					 $response['message'] = "login attempt failed!";
					 $data = array();
					 $response['data'] = $data;
				   }else if($result>0){
					 $response['message'] = "";
					 $data = array();
					 $data['lastInsertedIdForLoginAttempt'] = $result;
					 $response['data'] = $data;

					 $sql = "UPDATE USER_REG_MST SET CURRENT_LOGIN_ATTEMPT =:current_login_attempt  WHERE LOGIN_ID = :login_id";
					 $paramList = array();
					 $paramList["current_login_attempt"] = $currentLoginAttempt;
					 $paramList["login_id"] = $req_data["LOGIN_ID"];
					 $result = $database->updateQuery($conn, $sql, $paramList);
						}
				}

			function checkAttempts($database, $conn, $req_data){
			 $sql = "SELECT * FROM LOGIN_ATTEMPTS WHERE LOGIN_ID = :login_id ORDER BY ID DESC LIMIT 1";
			 $paramList = array();
			 $paramList["login_id"] = $req_data["LOGIN_ID"];
			 $result = $database->selectParamQuery($conn, $sql, $paramList); if(count($result) > 0){$result  = $result[0];}
			 return $result;
			}

			function lockAccount($database, $conn, $req_data){
				$sql = "UPDATE USER_REG_MST SET ACCOUNT_LOCKED =:account_locked  WHERE LOGIN_ID = :login_id";
				$paramList = array();
				$paramList["account_locked"] = 1;
				$paramList["login_id"] = $req_data["LOGIN_ID"];
				$result = $database->updateQuery($conn, $sql, $paramList);
				if($result == "success"){
					$response["statusCode"] = 200;
					setLockNotificationAndSendEmail($database, $conn, $req_data);
				}else{
					$response["statusCode"] = 2001;
				}
			}


			function resetLockTimer($database, $conn, $req_data){
				$sql = "DELETE FROM LOGIN_ATTEMPTS WHERE LOGIN_ID =:login_id";
				$paramList = array();
				$paramList["login_id"] = $req_data["LOGIN_ID"];
				$result = $database->deleteParamQuery($conn, $sql, $paramList);

				$sql = "UPDATE USER_REG_MST SET ACCOUNT_LOCKED= 0 , CURRENT_LOGIN_ATTEMPT = 0 WHERE LOGIN_ID=:login_id";
				$paramList = array();
				$paramList["login_id"] = $req_data["LOGIN_ID"];
				$result = $database->updateQuery($conn, $sql, $paramList);
			}



			function setLockNotificationAndSendEmail($database, $conn, $req_data){
				$sql = "select * from USER_REG_MST where LOGIN_ID = :login_id";
				$paramList = array();
				$paramList["login_id"] = $req_data["LOGIN_ID"];
				$result = $database->selectParamQuery($conn, $sql, $paramList);
				if(count($result) > 0){$result  = $result[0];}
				if($result == "failed" || $result == ""){
					$response["status"] = "failed";
					$response["statusCode"] = 2001;
				}else if(count($result) >= 0){
						LoggerInfo($GLOBALS["currentFileName"],"Locking Account Email is ".$result["USER_EMAIL"]);
					try{
						$from = fetchConstantsData($database, $conn, "fromEmailIdGenOtp");
						$to = $result["USER_EMAIL"];
						$cc = "";
						$bcc = "";
						$subject = "Welcome to Mitron.com";
						$msg =" Dear ".$result["FIRST_NAME"]." ".$result["LAST_NAME"].",<br>".
						"Your Account has been Locked Please Contact Admin to Activate it.".
						"Team Mitron<br>".
						"Visit us at www.mitron.com";
						$attachment = "";
						sendEmail($to, $subject, $msg);
						LoggerInfo($GLOBALS["currentFileName"],"Email Notification send");
					}catch(Exception $e){
						LoggerInfo($GLOBALS["currentFileName"], "Connection Error: " . $e);
						return;
					}
						sendAdminNotification($database, $conn, $result);
				}
			}

			function sendAdminNotification($database, $conn, $req){
				LoggerInfo($GLOBALS["currentFileName"],"sendAdminNotification called Incoming request is ".json_encode($req));
				$notificationId = genSequenceId($conn, "NI");

				 $sql = "INSERT INTO NOTIFICATION(NOTIFICATION_ID, NOTIFICATION_TYPE, NOTIFICATION_TO, NOTIFICATION_GROUP_ID, NOTIFICATION_LOGIN_ID, NOTIFICATION_TITLE, NOTIFICATION_MSG, NOTIFICATION_SUBMISSION_DATE, NOTIFICATION_STATUS_READ, NOTIFICATION_CATEGORIE, IS_FAVOURIATE, DOC_ATTACHED_COUNT, VALIDITY_PERIOD, IS_DISABLED) VALUES (:NOTIFICATION_ID, :NOTIFICATION_TYPE, :NOTIFICATION_TO, :NOTIFICATION_GROUP_ID, :NOTIFICATION_LOGIN_ID, :NOTIFICATION_TITLE, :NOTIFICATION_MSG, NOW(), 0,'INBOX', 0, :DOC_ATTACHED_COUNT, :VALIDITY_PERIOD, 0)";

				$paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
				$paramList["NOTIFICATION_ID"] = $notificationId;
				$paramList["NOTIFICATION_TYPE"] = "";
				$paramList["NOTIFICATION_TO"] = "";
				$paramList["NOTIFICATION_GROUP_ID"] = $req["REG_TYPE"];
				$paramList["NOTIFICATION_LOGIN_ID"] = $req["LOGIN_ID"];
				$paramList["NOTIFICATION_TITLE"] = "Account Lock";
				$paramList["NOTIFICATION_MSG"] = "My Account has been locked, Please unlock it.";
				$paramList["DOC_ATTACHED_COUNT"] = 0;
				$paramList["VALIDITY_PERIOD"] = "0000-00-00 00:00:00";
				LoggerInfo($GLOBALS["currentFileName"], "Sql is ".json_encode($sql));
				LoggerInfo($GLOBALS["currentFileName"], "Paramlist is ".json_encode($paramList));
				$response = array();
				$result = $database->insertQuery($conn, $sql, $paramList);
				LoggerInfo($GLOBALS["currentFileName"], "Admin Notification Added with Result ".$result);
			}
?>