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
	LoggerInfo("admin.php", "json data::: ".json_encode($req_data));
	$req_data = interceptorService($database, $conn, $req_data);
	$response = array();
	
	$currentFileName = "admin.php";
	$database = new Database();
	$conn = $database->getConnection();
	$errmsg = array();
	LoggerInfo($currentFileName,"Called admin Controller()");

    $action = $req_data->{"action"};

    if ($action == "addStudentOrStaffDetails") {
        $resp =  addStudentOrStaffDetails($database, $conn, $req_data);
		echo json_encode($resp);
    } else if ($action == "deleteStudentOrStaffDetails") {
        $resp =  deleteStudentOrStaffDetails($database, $conn, $req_data);
		echo json_encode($resp);
    } else if ($action == "addCourseDetails") {
        $resp =  addCourseDetails($database, $conn, $req_data);
		echo json_encode($resp);
    } 

	function getUserDetails($database, $conn, $req_data) {
        $response = array();
		$sql = "SELECT * FROM BILL_USER_MANAGEMENT WHERE IS_DISABLED = 0 AND CATEGORY != 'ADMIN'";
		$paramList = array();
		$result = $database->selectParamQuery($conn, $sql, $paramList);
		if($result == "" || count($result) == 0){
			$response["status"] = "failed";
			$response["statusCode"] = 2001;
			$response["message"] = "Failed to fetch data !";
		}else if(count($result) > 0) {
			$response["status"] = "success";
			$response["statusCode"] = 200;
			$data = array();
			$response["data"] = $result;
			$response["message"] = "Data fetched successfully.";
		}
		return $response;
    }

    function addStudentOrStaffDetails($database, $conn, $req_data) {
        $response = array();
        $sql = 'INSERT INTO BILL_USER_MANAGEMENT(USER_ID, USER_NAME, F_NAME, L_NAME, CATEGORY, EMAIL_ID, PASSWORD, MOBILE_NO, DOB, CREATED_DATE, LAST_ACCESS_TIME, LAST_LOGIN_TIME) VALUES (:userId, :userName, :fName, :lName, :category, :emailId, :password, :mobileNo, :dob, NOW(), NOW(), NOW())';
        $paramList = array();
		$idType = $req_data->{"data"}->{"userRoleDetails"}->{"idType"};
		LoggerInfo("appno.php", "reached here: ".$idType);
		$paramList["userId"] = genUniqueUserId($idType);
        $paramList["userName"] = $req_data->{"data"}->{"userRoleDetails"}->{"userName"};
        $paramList["fName"] = $req_data->{"data"}->{"userRoleDetails"}->{"fName"};
        $paramList["lName"] = $req_data->{"data"}->{"userRoleDetails"}->{"lName"};
        $paramList["category"] = "STUDENT";
        $paramList["emailId"] = $req_data->{"data"}->{"userRoleDetails"}->{"emailId"};
        $paramList["password"] = md5($req_data->{"data"}->{"userRoleDetails"}->{"password"});
        $paramList["mobileNo"] = $req_data->{"data"}->{"userRoleDetails"}->{"mobileNo"};
        $paramList["dob"] = $req_data->{"data"}->{"userRoleDetails"}->{"dob"};
        
        $result = $database->insertQuery($conn, $sql, $paramList);
        if ($result == "failed") {
            $response = array();
            $response["status"] = "failed";
            $response["statusCode"] = 1000;
            $response["message"] = "Could not save Student Details.";
            $data = array();
            $response["data"] = $data;
            $response["userId"] = $req_data->{"userId"};
            $response["accessToken"] = $req_data->{"accessToken"};
            return $response;
        }
        $response = array();
        $response["status"] = "success";
        $response["statusCode"] = 200;
        $response["message"] = "Data Inserted Successfully.";
        $data = array();
        $response["data"] = $data;
        $response["userId"] = $req_data->{"userId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
	
	function deleteStudentOrStaffDetails($database, $conn, $req_data) {
		LoggerInfo("admin.php", "deleteStudentOrStaffDetails" . $req_data->{"userId"});
		$response = array();
		$sql = "UPDATE BILL_USER_MANAGEMENT SET IS_DISABLED = 1 WHERE USER_ID=:userId";
		$paramList = array();
		$paramList["userId"] = $req_data->{"userId"};
		$result = $database->updateQuery($conn, $sql, $paramList);
		if ($result == "failed") {
			$response["status"] = "failed";
			$response["statusCode"] = 1002;
			$response["message"] = "Could not update User details";
			$data = array();
			$response['data'] = $data;
			$response['userId'] = $req_data->{"userId"};
			$response['accessToken'] = $req_data->{"accessToken"};
			return $response;
		}
		$response['status'] = "success";
		$response['statusCode'] = 200;
		$response['message'] = "";
		$response['userId'] = $req_data->{"userId"};
		$response['accessToken'] = $req_data->{"accessToken"};
		return $response;
	}
	
	function addCourseDetails($database, $conn, $req_data) {
		$response = array();
        $sql = 'INSERT INTO COURSE_MASTER(COURSE_NAME, COURSE_DURATION, COURSE_FEES) VALUES (:courseName, :courseDuration, :courseFees)';
        $paramList = array();
        $paramList["courseName"] = $req_data->{"data"}->{"userDetails"}->{"courseName"};
        $paramList["courseDuration"] = $req_data->{"data"}->{"userDetails"}->{"courseDuration"};
        $paramList["courseFees"] = $req_data->{"data"}->{"userDetails"}->{"courseFees"};
        
        $result = $database->insertQuery($conn, $sql, $paramList);
        if ($result == "failed") {
            $response = array();
            $response["status"] = "failed";
            $response["statusCode"] = 1000;
            $response["message"] = "Could not save Student Details.";
            $data = array();
            $response["data"] = $data;
            $response["userId"] = $req_data->{"userId"};
            $response["accessToken"] = $req_data->{"accessToken"};
            return $response;
        }
        $response = array();
        $response["status"] = "success";
        $response["statusCode"] = 200;
        $response["message"] = "Data Inserted Successfully.";
        $data = array();
        $response["data"] = $data;
        $response["userId"] = $req_data->{"userId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
	}
?>