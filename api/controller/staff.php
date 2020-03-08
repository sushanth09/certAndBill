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
	//$req_data = interceptorService($database, $conn, $req_data);
	$response = array();
	
	$currentFileName = "admin.php";
	$database = new Database();
	$conn = $database->getConnection();
	$errmsg = array();
	LoggerInfo($currentFileName,"Called admin Controller()");

    $action = $req_data->{"action"};

    if ($action == "enrollStudents") {
        $resp = enrollStudents($database, $conn, $req_data);
		echo json_encode($resp);
    } else if ($action == "addPaymentDetails") {
		$resp = addPaymentDetails($database, $conn, $req_data);
		echo json_encode($resp);
	} else if ($action == "updateStudentDetails") {
		$resp = updateStudentDetails($database, $conn, $req_data);
		echo json_encode($resp);
	}

	function enrollStudents($database, $conn, $req_data) {
        $response = array();
		$sql = "SELECT * FROM COURSE_MASTER WHERE ID =:courseId AND IS_DISABLED = 0";
		$paramList = array();
		$paramList["courseId"] = $req_data->{"data"}->{"courseId"};
		$result = $database->selectParamQuery($conn, $sql, $paramList);
		
		$sqlUp = "UPDATE BILL_USER_MANAGEMENT SET ENROLLED_COURSE = ".$result[0]["ID"]." WHERE USER_ID=:userId";
		$paramList = array();
		$paramList["userId"] = $req_data->{"userId"};
		$upResult = $database->updateQuery($conn, $sqlUp, $paramList);
		if ($upResult == "failed") {
            $response = array();
            $response["status"] = "failed";
            $response["statusCode"] = 1000;
            $response["message"] = "Could not update User Details.";
            $data = array();
            $response["data"] = $data;
            $response["userId"] = $req_data->{"userId"};
            $response["accessToken"] = $req_data->{"accessToken"};
            return $response;
        }
        $response = array();
        $response["status"] = "success";
        $response["statusCode"] = 200;
        $response["message"] = "Data Updated Successfully.";
        $data = array();
        $response["data"] = $data;
        $response["userId"] = $req_data->{"userId"};
        $response["accessToken"] = $req_data->{"accessToken"};
		return $response;
    }

    function addStudentOrStaffDetails($database, $conn, $req_data) {
        $response = array();
        $sql = 'INSERT INTO BILL_USER_MANAGEMENT(USER_ID, USER_NAME, F_NAME, L_NAME, CATEGORY, EMAIL_ID, PASSWORD, MOBILE_NO, DOB, CREATED_DATE, LAST_ACCESS_TIME, LAST_LOGIN_TIME) VALUES (:userId, :userName, :fName, :lName, :category, :emailId, :password, :mobileNo, :dob, NOW(), NOW(), NOW())';
        $paramList = array();
		$idType = $req_data->{"data"}->{"idType"};
		LoggerInfo("appno.php", "reached here: ".$idType);
		$paramList["userId"] = genUniqueUserId($idType);
        $paramList["userName"] = $req_data->{"data"}->{"userName"};
        $paramList["fName"] = $req_data->{"data"}->{"fName"};
        $paramList["lName"] = $req_data->{"data"}->{"lName"};
        $paramList["category"] = "STUDENT";
        $paramList["emailId"] = $req_data->{"data"}->{"emailId"};
        $paramList["password"] = $req_data->{"data"}->{"password"};
        $paramList["mobileNo"] = $req_data->{"data"}->{"mobileNo"};
        $paramList["dob"] = $req_data->{"data"}->{"dob"};
        
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
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
	
	function updateStudentDetails($database, $conn, $req_data) {
        $response = array();
        $sql = 'UPDATE BILL_USER_MANAGEMENT SET USER_NAME=:userName, F_NAME=:fName, L_NAME=:lName, CATEGORY=:category, EMAIL_ID=:emailId, PASSWORD=:password, MOBILE_NO=:mobileNo, DOB=:dob, COMPANY_NAME=:companyName, IS_PLACED=:isPlaced,ENROLLED_COURSE=:enrolledCourse, SEND_EMAIL=:sendEmail, CREATED_DATE=NOW(), LAST_ACCESS_TIME=NOW(), LAST_LOGIN_TIME=NOW() WHERE USER_ID=:userId and IS_DISABLED = 0';
        $paramList = array();
        $paramList["userName"] = $req_data->{"data"}->{"userName"};
        $paramList["fName"] = $req_data->{"data"}->{"fName"};
        $paramList["lName"] = $req_data->{"data"}->{"lName"};
        $paramList["category"] = "STUDENT";
        $paramList["emailId"] = $req_data->{"data"}->{"emailId"};
        $paramList["password"] = $req_data->{"data"}->{"password"};
        $paramList["mobileNo"] = $req_data->{"data"}->{"mobileNo"};
        $paramList["dob"] = $req_data->{"data"}->{"dob"};
		$paramList["companyName"] = $req_data->{"data"}->{"placedCompanyName"};
		$paramList["isPlaced"] = $req_data->{"data"}->{"isPlaced"};
		$paramList["enrolledCourse"] = $req_data->{"data"}->{"enrolledCourse"};
		$paramList["sendEmail"] = $req_data->{"data"}->{"sendEmail"};
		$paramList["userId"] = $req_data->{"data"}->{"userId"};
        $result = $database->updateQuery($conn, $sql, $paramList);
		LoggerInfo("staff.php", "reached here: ".json_encode($result));
        if ($result == "failed") {
            $response = array();
            $response["status"] = "failed";
            $response["statusCode"] = 1000;
            $response["message"] = "Could not update Student Details.";
            $data = array();
            $response["data"] = $data;
            $response["userId"] = $req_data->{"userId"};
            $response["accessToken"] = $req_data->{"accessToken"};
            return $response;
        }
        $response = array();
        $response["status"] = "success";
        $response["statusCode"] = 200;
        $response["message"] = "Data Updated Successfully.";
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
	
	function addPaymentDetails($database, $conn, $req_data) {
        $response = array();
        $sql = 'INSERT INTO PAYMENT_MASTER(STUDENT_ID, COURSE_ID, TOTAL_PAYMENT, PENDING_PAYMENT, PAYMENT_DONE, PAYMENT_STATUS) VALUES (:studentId, :courseId, :totalPayment, :pendingPayment, :paymentDone, :paymentStatus)';
        $paramList = array();
		LoggerInfo("appno.php", "reached here: ".json_encode($req_data));
		$paramList["studentId"] = $req_data->{"data"}->{"studentId"};
        $paramList["courseId"] = $req_data->{"data"}->{"courseId"};
        $paramList["totalPayment"] = $req_data->{"data"}->{"totalPayment"};
        $paramList["pendingPayment"] = $req_data->{"data"}->{"pendingPayment"};
        $paramList["paymentDone"] = $req_data->{"data"}->{"paymentDone"};
        $paramList["paymentStatus"] = $req_data->{"data"}->{"paymentStatus"};
        $result = $database->insertQuery($conn, $sql, $paramList);
		LoggerInfo("staff.php", "result: " . json_encode($result));
        if ($result == "failed") {
            $response = array();
            $response["status"] = "failed";
            $response["statusCode"] = 1000;
            $response["message"] = "Could not save Payment Details.";
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