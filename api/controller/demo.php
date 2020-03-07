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
require_once "interceptor.php";
$currentFileName = "blForm.php";
$loadFiles = ["blForm_applicant.php", "blForm_coApplicant.php", "blForm_loanDetails.php", "blForm_applicantPurpose.php", "blform_security.php", "blForm_AppIndividual.php", "blForm_AppCorporate.php", "blDownloadZip.php", "blFormMasterValidation.php"];
//,"formExcelUpload.php" needs to be added
for ($include = 0;$include < count($loadFiles);$include++) {
    try {
        if (!file_exists($loadFiles[$include])) {
            LoggerInfo($GLOBALS["currentFileName"], "Could not load " . $loadFiles[$include]);
        } else {
            require_once $loadFiles[$include];
        }
    }
    catch(Exception $e) {
        LoggerInfo($GLOBALS["currentFileName"], "Exception:::Could not load " . $e);
    }
}
LoggerInfo($GLOBALS["currentFileName"], "require file load successfully");
LoggerInfo($GLOBALS["currentFileName"], "inside blFormExcelUpload1");
try {
    $request = file_get_contents('php://input');
    //LoggerInfo($currentFileName, "inside try".json_encode($request));
    $req_data = json_decode($request);
    //$req_data = interceptorService($req_data);
    $action = $req_data->{"action"};
    if ($action == "") {
        setFileResponseHeader();
        $action = $_POST['action'];
    }
    LoggerInfo($GLOBALS["currentFileName"], "Action:" . $action);
}
catch(Exception $e) {
    LoggerInfo($GLOBALS["currentFileName"], "Error while handling request" . $e);
}
$database = new Database();
$conn = $database->getConnection();
if (!$conn) {
    LoggerInfo($GLOBALS["currentFileName"], "Connection Error: " . $conn);
    return;
}
LoggerInfo($GLOBALS["currentFileName"], "BL Form Action:" . $action);
if ($action == "generateAppId") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = generateAppId($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "addCoApplicant") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = addCoApplicant($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "deleteCoApplicant") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = deleteCoApplicant($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "saveSecurityDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = saveSecurityDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "getFormDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = getFormDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "generateSubmitOTP") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = generateSubmitOTP($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "saveCoAppDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = saveCoAppDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "fetchApplicantData") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = fetchApplicantData($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "fetchApplicantPurposeData") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = fetchApplicantPurposeData($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "fetchCoAppDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = fetchCoAppDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "saveApplicantDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = saveApplicantDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "saveApplicantPurposeDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = saveApplicantPurposeDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "fetchSecurityDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = fetchSecurityDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "saveUploadDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = saveUploadDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "fetchUploadDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = fetchUploadDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "saveLoanDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = saveLoanDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "fetchLoanDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = fetchLoanDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "saveAppIndividualDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = saveAppIndividualDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "saveAppCorporateDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = saveAppCorporateDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "fetchCoApplicantListData") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = fetchCoApplicantListData($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "saveCoAppIndividualDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = saveCoAppIndividualDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "submitFormDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = submitFormDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "saveCoAppCorpDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = saveCoAppCorpDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "fetchAppIndividualDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = fetchAppIndividualDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "fetchAppCorporateDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = fetchAppCorporateDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "fetchCoAppIndividualDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = fetchCoAppIndividualDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "fetchCoAppCorpDetails") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = fetchCoAppCorpDetails($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "getStates") {
    $resp = getStates($database, $conn, $req_data);
    echo json_encode($resp);
} else if ($action == "getCities") {
    $resp = getCityByState($database, $conn, $req_data);
    echo json_encode($resp);
} else if ($action == "getDegree") {
    $resp = getDegree($database, $conn, $req_data);
    echo json_encode($resp);
} else if ($action == "getDegreeByCourse") {
    $resp = getDegreeByCourse($database, $conn, $req_data);
    echo json_encode($resp);
} else if ($action == "deleteFormData") {
    LoggerInfo("blForm.php", "inside deleteFormData " . json_encode($req_data));
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		if ($req_data->{"data"}->{"blData"}->{"applicantDetails"}->{"AD_APPLICANT_TYPE"} == "Individual") {
			LoggerInfo("blForm.php", "inside individual applicantDetails");
			$resp = updateApplicantData($database, $conn, $req_data);
			$resp = updatePurposeData($database, $conn, $req_data);
			$resp = updateApplicantIndividualData($database, $conn, $req_data);
		} else if ($req_data->{"data"}->{"blData"}->{"applicantDetails"}->{"AD_APPLICANT_TYPE"} == "Company") {
			LoggerInfo("blForm.php", "inside company applicantDetails ");
			$resp = updateApplicantData($database, $conn, $req_data);
			$resp = updatePurposeData($database, $conn, $req_data);
			$resp = updateAppCorporateDetails($database, $conn, $req_data);
		} else if ($req_data->{"data"}->{"coApplicantDetails"}->{"LEGAL_ENTITY_TYPE"} == "Individual") {
			$resp = updateCoAppDetails($database, $conn, $req_data);
			$resp = updateCoAppIndDetails($database, $conn, $req_data);
		} else if ($req_data->{"data"}->{"coApplicantDetails"}->{"LEGAL_ENTITY_TYPE"} == "Non-Individual") {
			$resp = updateCoAppDetails($database, $conn, $req_data);
			$resp = updateCoAppCorp($database, $conn, $req_data);
		}
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "generateBLZip") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = generateBLZip($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
} else if ($action == "deleteApplication") {
	$interceptorReq = interceptorRequest($database, $conn, $req_data);
	if($interceptorReq){
		$resp = deleteApplication($database, $conn, $req_data);
		echo json_encode(interceptorResponse($database, $conn, $resp));
	}else{
		$resp = array();
		$resp["status"] = "failed";
		$resp["message"] = "Your session has been timed out.";
		echo json_encode($resp);
	}
}
function deleteApplication($database, $conn, $req_data) {
    $response = array();
    //Fetching Details based on AppFormId
    $sql = "SELECT * FROM FORM_TRACKER WHERE APP_FORM_ID =:app_form_id";
    $paramList = array();
    $paramList["app_form_id"] = $req_data->{"data"}->{"appFormId"};
    LoggerInfo($GLOBALS["currentFileName"], "SQL:" . $sql);
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    if (count($result) > 0 && $result != "failed") {
        $result = $result[0];
    } else {
        $response['status'] = "failed";
        $response['statusCode'] = 8888;
        $response['message'] = "Could not find requested application";
        $response['loginId'] = $req_data->{"loginId"};
        $response['accessToken'] = $req_data->{"accessToken"};
        return $response;
    }
    $appFormId = $req_data->{"data"}->{"appFormId"};
    $response = deleteBLFormApplication($database, $conn, $appFormId);
    $response["loginId"] = $req_data->{"loginId"};
    $response["accessToken"] = $req_data->{"accessToken"};
    return $response;
}
function deleteBLFormApplication($database, $conn, $appFormId) {
    $BLFormTables = ["FORM_TRACKER", "FORM_TRACKER_HISTORY", "BUSINESS_LOAN", "APPLICANT_DETAILS", "APPLICANT_PURPOSE", "APPLICANT_INDIVIDUAL", "APPLICANT_INDI_INCOME_STATEMENT", "APPLICANT_IND_ASSET_DETAILS", "APPLICANT_IND_LIABILITY_DETAILS", "APPLICANT_CORPORATE", "APPLICANT_CORP_INCOME_STATEMENT", "APPLICANT_CORP_ASSET_DETAILS", "APPLICANT_CORP_LIABILITY_LOAN_DETAILS", "APPLICANT_CORP_CREDIT_DETAILS", "APPLICANT_CORP_LIABILITY_DETAILS", "APPLICANT_CORP_NON_IFRS", "APPLICANT_CORP_IFRS", "SECURITY", "LOAN_DETAILS", "APPLICANT_DOCUMENT_UPLOAD"];
    $response = array();
    for ($index = 0;$index < count($BLFormTables);$index++) {
        try {
            $sql = "DELETE FROM " . $BLFormTables[$index] . " WHERE APP_FORM_ID =:app_form_id";
            $paramList = array();
            $paramList["app_form_id"] = $appFormId;
            $result = $database->deleteParamQuery($conn, $sql, $paramList);
            if ($result == "failed") {
                $response["status"] = "failed";
                $response["statusCode"] = 8888;
                $response["message"] = "Could not delete bl form application";
                $data = array();
                $response["data"] = $data;
            }
        }
        catch(Exception $e) {
            LoggerInfo($GLOBALS["currentFileName"], "Exception while deleting table" . $e);
        }
    }
    $response["status"] = "success";
    $response["statusCode"] = 200;
    $response["message"] = "";
    $data = array();
    $response["data"] = $data;
    return $response;
}
function applicantPurposeValidate($database, $conn, $req_data) {
    $appicantPurposeValid = array();
    // applicant purpose
    $sql = "SELECT * FROM APPLICANT_PURPOSE WHERE APP_FORM_ID =:app_form_id";
    $paramList = array();
    $paramList["app_form_id"] = $req_data->{"data"}->{"appFormId"};
    LoggerInfo("blForm.php", "paramList:::::: " . json_encode($paramList));
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    LoggerInfo("blForm.php", "result :::::: " . json_encode($result));
    LoggerInfo("blForm.php", "result1 :::::: " . json_encode($result[0]));
    if (count($result) > 0) {
        $res = $result[0];
        LoggerInfo("blForm.php", "reached generate submit otp " . json_encode($res));
        $appicantPurposeValid = validateApplicantPurposeDetails($database, $conn, $res);
        LoggerInfo("blForm.php", "validateApplicantPurposeDetails " . json_encode($appicantPurposeValid));
    }
    return $appicantPurposeValid;
}
function applicantSecurityValidate($database, $conn, $req_data) {
    $appicantSecurityValid = array();
	$appFormId = $req_data->{"data"}->{"appFormId"};
    LoggerInfo("blForm.php", "security ::::: ");
    $sql = "SELECT * FROM SECURITY_POC WHERE APP_FORM_ID =:app_form_id";
    $paramList = array();
    $paramList["app_form_id"] = $appFormId;
    LoggerInfo("blForm.php", "paramList111111:::::: " . json_encode($paramList));
    LoggerInfo("blForm.php", "paramList111111:::::: " . json_encode($appFormId));
	
    $securityProperty = $database->selectParamQuery($conn, $sql, $paramList);
    $securityShares = "SELECT * FROM SECURITY_SOC WHERE APP_FORM_ID =:app_form_id";
    $securitySOC = $database->selectParamQuery($conn, $securityShares, $paramList);
    $securityEquity = "SELECT * FROM SECURITY_EQMF WHERE APP_FORM_ID =:app_form_id";
    $securityEQMF = $database->selectParamQuery($conn, $securityEquity, $paramList);
    $securityDebfOff = "SELECT * FROM SECURITY_DEBT WHERE APP_FORM_ID =:app_form_id";
    $securityDEBT = $database->selectParamQuery($conn, $securityDebfOff, $paramList);
    $securityDeposits = "SELECT * FROM SECURITY_DEPST WHERE APP_FORM_ID =:app_form_id";
    $securityDEPST = $database->selectParamQuery($conn, $securityDeposits, $paramList);
    $security = "SELECT * FROM SECURITY WHERE APP_FORM_ID =:app_form_id";
    $securitySumm = $database->selectParamQuery($conn, $security, $paramList);
	
    if (count($securityProperty) > 0) {
        $summary = $securitySumm[0];
        LoggerInfo("blForm.php", "reached security values::::: " . json_encode($securityProperty));
        $appicantSecurityValid = validateSecurityDetails($database, $conn, $securityProperty, $securitySOC, $securityEQMF, $securityDEBT, $securityDEPST, $summary);
        LoggerInfo("blForm.php", "validateApplicantFinancialDetails " . json_encode($appicantSecurityValid));
    }
	
    return $appicantSecurityValid;
}

function generateSubmitOTP($database, $conn, $req_data) {
    $response = array();
	
    $appFormId = $req_data->{"data"}->{"appFormId"};
    $appTypeId = $req_data->{"data"}->{"appTypeId"};
    LoggerInfo($GLOBALS["currentFileName"], "appTypeId  " . $appTypeId);
    LoggerInfo($GLOBALS["currentFileName"], "req_data::::  " . json_encode($req_data));
    $sql = "SELECT * FROM APPLICANT_DETAILS WHERE APP_FORM_ID =:app_form_id";
    $paramList = array();
    $paramList["app_form_id"] = $req_data->{"data"}->{"appFormId"};
    LoggerInfo("blForm.php", "paramList:::::: " . json_encode($paramList));
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $res = $result[0];
	
    if ($res["AD_APPLICANT_TYPE"] == "Individual") {
        //  applicant Individual
        $sqlBusiLoan = "SELECT * FROM BUSS_LOAN_SHARE_HOLDING_DETAILS WHERE APP_FORM_ID =:app_form_id";
        $busiLoan = $database->selectParamQuery($conn, $sqlBusiLoan, $paramList);
        if (count($result) > 0) {
            $res = $result[0];
            LoggerInfo("blForm.php", "reached generate submit otp " . json_encode($res));
            $appicantDetailsValid = validateApplicantIndividualDetails($database, $conn, $res, $busiLoan);
            LoggerInfo("blForm.php", "validateApplicantIndividualDetails " . json_encode($appicantDetailsValid));
            if (!$appicantDetailsValid["flag"]) {
                $error = array();
                $error = $appicantDetailsValid;
                $response["errorMessage"] = $error;
                $response['status'] = "failed";
                $response['statusCode'] = 1011;
                return $response;
            }
        }
        //applicant Purpose
        $appicantPurposeValidReturn = applicantPurposeValidate($database, $conn, $req_data);
        if (!$appicantPurposeValidReturn["flag"]) {
            $error = array();
            $error = $appicantPurposeValidReturn;
            $response["errorMessage"] = $error;
            $response['status'] = "failed";
            $response['statusCode'] = 1011;
            return $response;
        }
		
        //applicant Individual Financial
        $sql = "SELECT * FROM APPLICANT_INDIVIDUAL WHERE APP_FORM_ID =:app_form_id";
        $paramList = array();
        $paramList["app_form_id"] = $appFormId;
        LoggerInfo("blForm.php", "paramList:::::: " . json_encode($paramList));
        $result = $database->selectParamQuery($conn, $sql, $paramList);
        $applicantIndAsset = "SELECT * FROM APPLICANT_IND_ASSET_BANK_ACC_DTLS WHERE APP_FORM_ID =:app_form_id";
        $appIndAssetRes = $database->selectParamQuery($conn, $applicantIndAsset, $paramList);
        $applicantIndFdDeposit = "SELECT * FROM APPIND_FD_DEPOSIT WHERE APP_FORM_ID =:app_form_id";
        $appIndFdDeposit = $database->selectParamQuery($conn, $applicantIndFdDeposit, $paramList);
        $applicantIndPropertyDetails = "SELECT * FROM APPIND_PROPERTY_DETAILS WHERE APP_FORM_ID =:app_form_id";
        $appIndProperty = $database->selectParamQuery($conn, $applicantIndPropertyDetails, $paramList);
        $applicantIndAssetDetails = "SELECT * FROM APPLICANT_IND_ASSET_DETAILS WHERE APP_FORM_ID =:app_form_id";
        $appIndAssetProperty = $database->selectParamQuery($conn, $applicantIndAssetDetails, $paramList);
        $applicantLiabilityLoanDetails = "SELECT * FROM APPLICANT_IND_LIABILITY_LOAN_DETAILS WHERE APP_FORM_ID =:app_form_id";
        $applicantLiabilityDet = $database->selectParamQuery($conn, $applicantLiabilityLoanDetails, $paramList);
        $applicantLiabilityCreditCard = "SELECT * FROM APPLICANT_IND_LIABILITY_CREDIT_CARD_DTLS WHERE APP_FORM_ID =:app_form_id";
        $appLiabilityCreditCard = $database->selectParamQuery($conn, $applicantLiabilityCreditCard, $paramList);
        if (count($result) > 0) {
            $financialRes = $result[0];
            LoggerInfo("blForm.php", "reached generate submit otp " . json_encode($financialRes));
            $appicantFinancialValid = validateApplicantFinancialDetails($database, $conn, $financialRes, $appIndAssetRes, $appIndFdDeposit, $appIndProperty, $appIndAssetProperty, $applicantLiabilityDet, $appLiabilityCreditCard);
            LoggerInfo("blForm.php", "validateApplicantFinancialDetails " . json_encode($appicantFinancialValid));
            if (!$appicantFinancialValid["flag"]) {
                $error = array();
                $error = $appicantFinancialValid;
                $response["errorMessage"] = $error;
                $response['status'] = "failed";
                $response['statusCode'] = 1011;
                return $response;
            }
        }
		
        // applicant Individual security
        $applicantSecurityValidate = applicantSecurityValidate($database, $conn, $req_data);
		LoggerInfo("blForm.php", "validateApplicantSecurityDetails " . json_encode($applicantSecurityValidate));
		LoggerInfo("blForm.php", "validateApplicantSecurityDetails  count " . count($applicantSecurityValidate));
		if(count($applicantSecurityValidate) > 0){
			if (!$applicantSecurityValidate["flag"]) {
					$error = array();
					$error = $applicantSecurityValidate;
					$response["errorMessage"] = $error;
					$response['status'] = "failed";
					$response['statusCode'] = 1011;
				return $response;
			}
		}
		
    } else if ($res["AD_APPLICANT_TYPE"] != "Individual") {
		
		
		//applicant details
		$sqlBusiLoan = "SELECT * FROM BUSS_LOAN_SHARE_HOLDING_DETAILS WHERE APP_FORM_ID =:app_form_id";
		$busiLoan = $database->selectParamQuery($conn, $sqlBusiLoan, $paramList);
		LoggerInfo("blForm.php", "busiloan:::::: ".json_encode($busiLoan));

		$busiDirec = "SELECT * FROM BUSS_LOAN_DIRECTOR_DETAILS WHERE APP_FORM_ID =:app_form_id";
		$busiLoanDirecDet = $database->selectParamQuery($conn, $busiDirec, $paramList);
		LoggerInfo("blForm.php", "busiLoanDirecDet:::::: ".json_encode($busiLoanDirecDet));

		if(count($result) > 0){
			$res = $result[0];
			LoggerInfo("blForm.php", "reached generate submit otp ".json_encode($res));
			$appicantCorpDetailsValid = validateApplicantCorporateDetails($database, $conn, $res, $busiLoan, $busiLoanDirecDet);
			LoggerInfo("blForm.php", "validateApplicantCorporateDetails ".json_encode($appicantCorpDetailsValid));
			if(!$appicantCorpDetailsValid["flag"]){
				$error  = array();
				$error = $appicantCorpDetailsValid;
				$response["errorMessage"] = $error;
				$response['status'] = "failed";
				$response['statusCode'] = 1011;
			return $response;
			}
		}
		
        //applicant Purpose
        $appicantPurposeValidReturn = applicantPurposeValidate($database, $conn, $req_data);
        if (!$appicantPurposeValidReturn["flag"]) {
            $error = array();
            $error = $appicantPurposeValidReturn;
            $response["errorMessage"] = $error;
            $response['status'] = "failed";
            $response['statusCode'] = 1011;
            return $response;
        }
        //applicant corporate financial
        $sql = "SELECT * FROM APPLICANT_CORPORATE WHERE APP_FORM_ID =:app_form_id";
        $paramList = array();
        $paramList["app_form_id"] = $appFormId;
        LoggerInfo("blForm.php", "paramList:::::: " . json_encode($paramList));
        $appCorpRes = $database->selectParamQuery($conn, $sql, $paramList);
        $applicantCorpIncomeStatement = "SELECT * FROM APPLICANT_CORP_INCOME_STATEMENT WHERE APP_FORM_ID =:app_form_id";
        $corpIncomeStatement = $database->selectParamQuery($conn, $applicantCorpIncomeStatement, $paramList);
        $applicantCorpNonIFRS = "SELECT * FROM APPLICANT_CORP_NON_IFRS WHERE APP_FORM_ID =:app_form_id";
        $CorpNonIFRS = $database->selectParamQuery($conn, $applicantCorpNonIFRS, $paramList);
        $applicantCorpIFRSDetails = "SELECT * FROM APPLICANT_CORP_IFRS WHERE APP_FORM_ID =:app_form_id";
        $CorpIFRSDetails = $database->selectParamQuery($conn, $applicantCorpIFRSDetails, $paramList);
        $applicantCorpAssetBankAccDetails = "SELECT * FROM APPLICANT_CORP_ASSET_BANK_ACC_DTLS WHERE APP_FORM_ID =:app_form_id";
        $CorpAssetBankAccDetails = $database->selectParamQuery($conn, $applicantCorpAssetBankAccDetails, $paramList);
        $applicantCorpPropertyDetails = "SELECT * FROM APPCORP_PROPERTY_DETAILS WHERE APP_FORM_ID =:app_form_id";
        $CorpPropertyDetails = $database->selectParamQuery($conn, $applicantCorpPropertyDetails, $paramList);
        $applicantCorpAssetDetails = "SELECT * FROM APPLICANT_CORP_ASSET_DETAILS WHERE APP_FORM_ID =:app_form_id";
        $CorpAssetDetails = $database->selectParamQuery($conn, $applicantCorpAssetDetails, $paramList);
        $applicantCorpLiabilityLoanDetails = "SELECT * FROM APPLICANT_CORP_LIABILITY_LOAN_DETAILS WHERE APP_FORM_ID =:app_form_id";
        $CorpLiabilityLoanDetails = $database->selectParamQuery($conn, $applicantCorpLiabilityLoanDetails, $paramList);
        $applicantCorpLiabilityCreditCard = "SELECT * FROM APPLICANT_CORP_CREDIT_LOAN_DETAILS WHERE APP_FORM_ID =:app_form_id";
        $CorpLiabilityCreditCard = $database->selectParamQuery($conn, $applicantCorpLiabilityCreditCard, $paramList);
        if (count($appCorpRes) > 0) {
            $appCorpResult = $appCorpRes[0];
            $corpIncomeStatement = $corpIncomeStatement[0];
            $appCorpNonIfrs = $CorpNonIFRS[0];
            $appCorpIfrs = $CorpIFRSDetails[0];
            $appCorpAsset = $CorpAssetDetails[0];
            LoggerInfo("blForm.php", "reached generate submit otp " . json_encode($appCorpResult));
            $appicantCorpFinancialValid = validateApplicantCorporateFinancialDetails($database, $conn, $appCorpResult, $corpIncomeStatement, $appCorpNonIfrs, $appCorpIfrs, $CorpAssetBankAccDetails, $CorpPropertyDetails, $appCorpAsset, $CorpLiabilityLoanDetails, $CorpLiabilityCreditCard);
            LoggerInfo("blForm.php", "validateApplicantCorporateFinancialDetails " . json_encode($appicantCorpFinancialValid));
            if (!$appicantCorpFinancialValid["flag"]) {
                $error = array();
                $error = $appicantCorpFinancialValid;
                $response["errorMessage"] = $error;
                $response['status'] = "failed";
                $response['statusCode'] = 1011;
                return $response;
            }
        }
		
		LoggerInfo("blForm.php", "validateApplicantCorporateFinancialDetails security is callugn atetr me");
		
        // applicant  security
        $applicantSecurityValidate = applicantSecurityValidate($database, $conn, $req_data);
		if(count($applicantSecurityValidate) > 0){
        if (!$applicantSecurityValidate["flag"]) {
            $error = array();
            $error = $applicantSecurityValidate;
            $response["errorMessage"] = $error;
            $response['status'] = "failed";
            $response['statusCode'] = 1011;
            return $response;
        }
		}
		
    } // coapp if close
	
	
    //coapplicant Individual
    $sql = "SELECT * FROM COAPPLICANT WHERE APP_FORM_ID =:app_form_id";
    $paramList = array();
    $paramList["app_form_id"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    LoggerInfo($GLOBALS["currentFileName"], "coapplicant is " . count($result));
    for ($x = 0;$x < count($result);$x++) {
        LoggerInfo($GLOBALS["currentFileName"], "count result is::::::::>>>>>> " . $result[$x]["APP_TYPE_ID"]);
        $sql = "SELECT * FROM COAPPLICANT WHERE APP_FORM_ID =:app_form_id AND APP_TYPE_ID=:app_type_id";
        $paramList = array();
        $paramList["app_form_id"] = $appFormId;
        $paramList["app_type_id"] = $result[$x]["APP_TYPE_ID"];
        $coAppRes = $database->selectParamQuery($conn, $sql, $paramList);
        $resCoapp = $coAppRes[0];
        LoggerInfo($GLOBALS["currentFileName"], "coapplicant with apptype output ::" . json_encode($coAppRes));
        $sql = "SELECT * FROM BUSS_LOAN_CO_SHAREHOLDER_DTLS WHERE  APP_FORM_ID =:app_form_id AND APP_TYPE_ID=:app_type_id";
        $busiRes = $database->selectParamQuery($conn, $sql, $paramList);
        $sql = "SELECT * FROM BUSS_CO_LOAN_DIRECTOR_DETAILS WHERE  APP_FORM_ID =:app_form_id AND APP_TYPE_ID=:app_type_id";
        $busiResDirector = $database->selectParamQuery($conn, $sql, $paramList);
        if (count($coAppRes) > 0) {
            if ($resCoapp["LEGAL_ENTITY_TYPE"] == "Individual") {
                //coapplicant Individual details
                $CoAppDetailsValid = validateCoApplicantIndividualDetails($database, $conn, $resCoapp);
                if (!$CoAppDetailsValid["flag"]) {
                    $error = array();
                    $error = $CoAppDetailsValid;
                    $response["errorMessage"] = $error;
                    $response['status'] = "failed";
                    $response['statusCode'] = 1011;
                    return $response;
                }
				
                //coapplicant Individual financial
                $sql = "SELECT * FROM COAPPLICANT_INDIVIDUAL WHERE APP_FORM_ID =:APP_FORM_ID  AND APP_TYPE_ID =:APP_TYPE_ID";
                $paramList["APP_FORM_ID"] = $result[$x]["APP_FORM_ID"];
                $paramList["APP_TYPE_ID"] = $result[$x]["APP_TYPE_ID"];
                $coappInd = $database->selectParamQuery($conn, $sql, $paramList);
                $coappInd = $coappInd[0];
                $sql = "SELECT * FROM COAPP_IND_INCOME_STATEMENT WHERE APP_FORM_ID =:APP_FORM_ID  AND APP_TYPE_ID =:APP_TYPE_ID";
                $paramList["APP_FORM_ID"] = $result[$x]["APP_FORM_ID"];
                $paramList["APP_TYPE_ID"] = $result[$x]["APP_TYPE_ID"];
                $coappIndIncome = $database->selectParamQuery($conn, $sql, $paramList);
                $coappIndIncome = $coappIndIncome[0];
                $sql = "SELECT * FROM COAPP_IND_ASSET_DETAILS WHERE APP_FORM_ID =:APP_FORM_ID  AND APP_TYPE_ID =:APP_TYPE_ID";
                $paramList["APP_FORM_ID"] = $result[$x]["APP_FORM_ID"];
                $paramList["APP_TYPE_ID"] = $result[$x]["APP_TYPE_ID"];
                $coApplicantIndAssetBankAccDetails = $database->selectParamQuery($conn, $sql, $paramList);
                $sql = "SELECT * FROM COAPP_IND_FD_DEPOSIT WHERE APP_FORM_ID =:APP_FORM_ID  AND APP_TYPE_ID =:APP_TYPE_ID";
                $paramList["APP_FORM_ID"] = $result[$x]["APP_FORM_ID"];
                $paramList["APP_TYPE_ID"] = $result[$x]["APP_TYPE_ID"];
                $coApplicantIndAssetFixedDepositDetails = $database->selectParamQuery($conn, $sql, $paramList);
                $sql = "SELECT * FROM COAPP_IND_PROPERTY_DETAILS WHERE APP_FORM_ID =:APP_FORM_ID  AND APP_TYPE_ID =:APP_TYPE_ID";
                $paramList["APP_FORM_ID"] = $result[$x]["APP_FORM_ID"];
                $paramList["APP_TYPE_ID"] = $result[$x]["APP_TYPE_ID"];
                $coApplicantIndPropertyDetails = $database->selectParamQuery($conn, $sql, $paramList);
                $sql = "SELECT * FROM COAPP_IND_LIABILITY_LOAN_DETAILS WHERE APP_FORM_ID =:APP_FORM_ID  AND APP_TYPE_ID =:APP_TYPE_ID";
                $paramList["APP_FORM_ID"] = $result[$x]["APP_FORM_ID"];
                $paramList["APP_TYPE_ID"] = $result[$x]["APP_TYPE_ID"];
                $coapp_ind_liability_loan_details = $database->selectParamQuery($conn, $sql, $paramList);
                $sql = "SELECT * FROM COAPP_IND_LIABILITY_CREDIT_CARD_DTLS WHERE APP_FORM_ID =:APP_FORM_ID  AND APP_TYPE_ID =:APP_TYPE_ID";
                $paramList["APP_FORM_ID"] = $result[$x]["APP_FORM_ID"];
                $paramList["APP_TYPE_ID"] = $result[$x]["APP_TYPE_ID"];
                $coapp_ind_liability_credit_card_dtls = $database->selectParamQuery($conn, $sql, $paramList);
                $coappIndFinanValid = validateCoApplicantIndividualFinancial($database, $conn, $coappInd, $coappIndIncome, $coApplicantIndAssetBankAccDetails, $coApplicantIndAssetFixedDepositDetails, $coApplicantIndPropertyDetails, $coapp_ind_liability_loan_details, $coapp_ind_liability_credit_card_dtls);
                LoggerInfo("blForm.php", "validateCoApplicantIndividualFinancial returns" . json_encode($coappIndFinanValid));
                if (!$coappIndFinanValid["flag"]) {
                    $error = array();
                    $error = $coappIndFinanValid;
                    $response["errorMessage"] = $error;
                    $response['status'] = "failed";
                    $response['statusCode'] = 1011;
                    return $response;
                }
				
				
				
            } else if ($resCoapp["LEGAL_ENTITY_TYPE"] == "Company") {
                //co-applicant company details
                $CoAppDetailsValidNonInd = validateCoApplicantNonIndividualDetails($database, $conn, $resCoapp, $busiRes, $busiResDirector);
                if (!$CoAppDetailsValidNonInd["flag"]) {
                    $error = array();
                    $error = $CoAppDetailsValidNonInd;
                    $response["errorMessage"] = $error;
                    $response['status'] = "failed";
                    $response['statusCode'] = 1011;
                    return $response;
                }
				
                //co-applicant company financial
                $sql = "SELECT * FROM COAPP_CORPORATE WHERE APP_FORM_ID =:app_form_id";
                $paramList = array();
                $paramList["app_form_id"] = $appFormId;
                LoggerInfo("blForm.php", "paramList:::::: " . json_encode($paramList));
                $coAppCorpRes = $database->selectParamQuery($conn, $sql, $paramList);
                $coAppCorpIncomeStatement = "SELECT * FROM APPLICANT_CORP_INCOME_STATEMENT WHERE APP_FORM_ID =:app_form_id";
                $coApplicantCorpIncomeStatement = $database->selectParamQuery($conn, $coAppCorpIncomeStatement, $paramList);
                $coAppNonIFRS = "SELECT * FROM COAPP_CORP_NON_IFRS WHERE APP_FORM_ID =:app_form_id";
                $coApplicantCorpNonIFRS = $database->selectParamQuery($conn, $coAppNonIFRS, $paramList);
                $coAppAssetBankAccDetails = "SELECT * FROM COAPP_CORP_ASSET_BANK_ACC_DTLS WHERE APP_FORM_ID =:app_form_id";
                $coApplicantCorpAssetBankAccDetails = $database->selectParamQuery($conn, $coAppAssetBankAccDetails, $paramList);
                $coAppPropertyDetails = "SELECT * FROM COAPP_CORP_PROPERTY_DETAILS WHERE APP_FORM_ID =:app_form_id";
                $coApplicantCorpPropertyDetails = $database->selectParamQuery($conn, $coAppPropertyDetails, $paramList);
                $coAppAssetDetails = "SELECT * FROM COAPP_CORP_ASSET_DETAILS WHERE APP_FORM_ID =:app_form_id";
                $coApplicantCorpAssetDetails = $database->selectParamQuery($conn, $coAppAssetDetails, $paramList);
                $coAppLiabilityLoanDetails = "SELECT * FROM COAPP_CORP_LIABILITY_LOAN_DETAILS WHERE APP_FORM_ID =:app_form_id";
                $coApplicantCorpLiabilityLoanDetails = $database->selectParamQuery($conn, $coAppLiabilityLoanDetails, $paramList);
                $coAppLiabilityCreditCard = "SELECT * FROM COAPP_CORP_LIABILITY_CREDIT_DETAILS WHERE APP_FORM_ID =:app_form_id";
                $coApplicantCorpLiabilityCreditCard = $database->selectParamQuery($conn, $coAppLiabilityCreditCard, $paramList);
                if (count($coAppCorpRes) > 0) {
                    $coAppCorpResult = $coAppCorpRes[0];
                    $coAppCorpIncStatement = $coApplicantCorpIncomeStatement[0];
                    $coAppCorpNonIfrs = $coApplicantCorpNonIFRS[0];
                    $coAppCorpAsset = $coApplicantCorpAssetDetails[0];
                    LoggerInfo("blForm.php", "reached generate submit otp " . json_encode($coAppCorpResult));
                    $appicantCorpFinancialValid = validateCoApplicantCorporateFinancialDetails($database, $conn, $coAppCorpResult, $coAppCorpIncStatement, $coAppCorpNonIfrs, $coApplicantCorpAssetBankAccDetails, $coApplicantCorpPropertyDetails, $coAppCorpAsset, $coApplicantCorpLiabilityLoanDetails, $coApplicantCorpLiabilityCreditCard);
                    LoggerInfo("blForm.php", "validateCoApplicantCorporateFinancialDetails " . json_encode($appicantCorpFinancialValid));
                    if (!$appicantCorpFinancialValid["flag"]) {
                        $error = array();
                        $error = $appicantCorpFinancialValid;
                        $response["errorMessage"] = $error;
                        $response['status'] = "failed";
                        $response['statusCode'] = 1011;
                        return $response;
                    }
                }
            } // close of co-applicant company.
            
        } // if respective co-applicant with respect to there app_type id.
        
    } // loop for number of co-applicant.
	
    //server side validation end. 
	
    LoggerInfo($GLOBALS["currentFileName"], "generateSubmitOTP called()::" . json_encode($req_data));
    $generatedOtp = "";
    if (fetchConstantsData($database, $conn, "Environment") == "UAT") {
        $generatedOtp = "123456";
    } else {
        $generatedOtp = generateOTP();
        $from = fetchConstantsData($database, $conn, "fromEmailIdGenOtp");

	$user_det = "SELECT * FROM USER_REG_MST WHERE LOGIN_ID=:login_id";	
	$paramList = array();
	$paramList["login_id"] = $req_data->{"loginId"};
	$userResult = $database->selectParamQuery($conn, $user_det, $paramList);
	if (count($userResult) > 0) {
            $userResult = $userResult[0];
        }
	LoggerInfo("blForm.php", "login result::: ".json_encode($userResult));
        //Fetching Details based on AppFormId
        $sql = "SELECT * FROM APPLICANT_DETAILS WHERE APP_FORM_ID =:app_form_id";
        $paramList = array();
        $paramList["app_form_id"] = $req_data->{"data"}->{"appFormId"};
        $result = $database->selectParamQuery($conn, $sql, $paramList);
        if (count($result) > 0) {
            $result = $result[0];
        }

	if($userResult['REG_TYPE'] == 2 || $userResult['REG_TYPE'] == 3){
		if($result['AD_APPLICANT_TYPE'] == "Individual"){
			$sendOtpValue = $result['AD_I_BI_CONTACT_NO'];
		}else if($result['AD_APPLICANT_TYPE'] != "Individual"){
			$sendOtpValue = $result['AD_NI_AD_CONTACT_NO'];
		}
	}else{
		$sendOtpValue = $userResult['USER_MOBILE_NO'];
	}

        if (!isset($sendOtpValue) || $sendOtpValue == "") {
            $response["status"] = "failed";
            $response["statusCode"] = 5555;
            $response["message"] = "Please provide valid applicant mobile number.";
            $data = array();
            $response['data'] = $data;
            $response['loginId'] = $req_data->{"loginId"};
            $response['accessToken'] = $req_data->{"accessToken"};
            return $response;
        }
        /*$to = $sendEmailId;
        $cc = "";
        $bcc = "";
        $subject = "Welcome to Mitron.com";
        $firstName = $result['AD_APPLICANT_FIRST_NAME'] == null ? "" : $result['AD_APPLICANT_FIRST_NAME'];
        $lastName = $result['AD_APPLICANT_SURNAME'] == null ? "" : $result['AD_APPLICANT_SURNAME'];
        $msg = "Dear " . $firstName . " ,<br> <br/><b>" . $generatedOtp . "</b>&nbsp;&nbsp;is your One-Time-Password (OTP) for secure login of submission of Business Loan Application no " . $req_data->{"data"}->{"appFormId"} . ". This password is valid for 15 minutes.<br/><br/>" . "The mail is being sent to you with respect to you successful submission of details for availing loan products through mystro.in and accessing our online customer loan application form.<br/><br/>" . "In case you are not able to successfully login or facing error during OTP validation process, please write to us at support@mystro.in mentioning your name along with your mobile no.<br/><br/>" . "At Mystro, we do not email you your password.<br/><br/>" . "If you receive a suspicious email that claims to be from www.mystro.in or Mitron Capital, do not click any links or download any attachments. Please call us on our customer care desk or any of our loan officers to ask questions about it or forward the suspicious email to support@mystro.in<br/><br/>" . "Regards<br/>" . "Team Mystro<br/><br/>" . "www.mystro.in";
        $attachment = "";
        sendEmail($to, $subject, $msg);*/
	sendSMS($sendOtpValue, $generatedOtp.", is your OTP and is valid for 30 mins. By using this OTP you are confirming that you have read the terms and conditions for processing the loan application.");
    }
    $sql = "UPDATE BUSINESS_LOAN SET APP_FORM_SUBMITTED_OTP=:app_form_submitted_otp WHERE APP_FORM_ID=:app_form_id";
    $paramList = array();
    $paramList["app_form_submitted_otp"] = $generatedOtp;
    $paramList["app_form_id"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->updateQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response["status"] = "failed";
        $response["statusCode"] = 1002;
        $response["message"] = "Could not update otp details";
        $data = array();
        $response['data'] = $data;
        $response['loginId'] = $req_data->{"loginId"};
        $response['accessToken'] = $req_data->{"accessToken"};
        return $response;
    }
	
	if($req_data->{"regType"} == 8){
		$sql = "UPDATE FORM_TRACKER SET AGENCY_ID=:agency_id WHERE APP_FORM_ID=:app_form_id";
		$paramList = array();
		$paramList["agency_id"] = $req_data->{"loginId"};
		$paramList["app_form_id"] = $req_data->{"data"}->{"appFormId"};
		$result = $database->updateQuery($conn, $sql, $paramList);
		if ($result == "failed") {
			$response["status"] = "failed";
			$response["statusCode"] = 1002;
			$response["message"] = "Could not update otp details";
			$data = array();
			$response['data'] = $data;
			$response['loginId'] = $req_data->{"loginId"};
			$response['accessToken'] = $req_data->{"accessToken"};
			return $response;
		}
	}
	
    $response['status'] = "success";
    $response['statusCode'] = 200;
    $response['message'] = "";
    $response['loginId'] = $req_data->{"loginId"};
    $response['accessToken'] = $req_data->{"accessToken"};
    return $response;
}
function submitFormDetails($database, $conn, $req_data) {
    LoggerInfo($GLOBALS["currentFileName"], "submitFormDetails called()::" . json_encode($req_data));
    //Validate OTP
    $otp = $req_data->{"data"}->{"appFormOTP"};
    if ((numberValid($otp))) {
        $response["status"] = "failed";
        $response["statusCode"] = 1001;
        $response["message"] = "Please provide valid OTP";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    $sql = "UPDATE APPLICANT_DETAILS SET AD_APPLICATION_DATE =:AD_APPLICATION_DATE WHERE APP_FORM_ID=:app_form_id";
    $paramList = array();
    $paramList["AD_APPLICATION_DATE"] = Date('Y-m-d');
    $paramList["app_form_id"] = $req_data->{"data"}->{"appFormId"};
    LoggerInfo($GLOBALS["currentFileName"], "Submitting Data SQL:" . $sql);
    LoggerInfo($GLOBALS["currentFileName"], "Submitting Data ParamList:" . json_encode($paramList));
    $result = $database->updateQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response["status"] = "failed";
        $response["statusCode"] = 1002;
        $response["message"] = "Could not save application date";
        $data = array();
        $response['data'] = $data;
        $response['loginId'] = $req_data->{"loginId"};
        $response['accessToken'] = $req_data->{"accessToken"};
        return $response;
    }
    $sql = "SELECT * FROM BUSINESS_LOAN WHERE APP_FORM_ID =:appFormId AND APP_FORM_SUBMITTED_OTP =:app_form_submitted_otp";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $paramList["app_form_submitted_otp"] = $req_data->{"data"}->{"appFormOTP"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response["status"] = "failed";
        $response["statusCode"] = 1001;
        $response["message"] = "Could not fetch Business Loan Details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    } else if (count($result) == 0) {
        $response["status"] = "failed";
        $response["statusCode"] = 1001;
        $response["message"] = "Please provide valid OTP";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
	LoggerInfo("blForm.php", "form tracker update ");
    //$response = array();
    $sql = "UPDATE FORM_TRACKER SET FORM_STATUS=:form_status WHERE APP_FORM_ID=:app_form_id";
    $paramList = array();
    $paramList["form_status"] = "1";
    $paramList["app_form_id"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->updateQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response["status"] = "failed";
        $response["statusCode"] = 1002;
        $response["message"] = "Could not update details";
        $data = array();
        $response['data'] = $data;
        $response['loginId'] = $req_data->{"loginId"};
        $response['accessToken'] = $req_data->{"accessToken"};
    }
	
	if($req_data->{"regType"} == 9){
		$paramList = array();
		$sql = "SELECT * FROM USER_REG_MST WHERE LOGIN_ID =:login_id";
		$paramList["login_id"] = $req_data->{"loginId"};
		$result = $database->selectParamQuery($conn, $sql, $paramList);
		LoggerInfo("mcForm.php", "result is::::: ".json_encode($result));
		
		$paramList = array();
		$sqlSM = "SELECT * FROM USER_REG_MST WHERE SM_ID =:sm_id";
		$paramList["sm_id"] = $result[0]["SM_ID"];
		$resultSM = $database->selectParamQuery($conn, $sqlSM, $paramList);
		
		$sqlFT = "UPDATE FORM_TRACKER SET AGENCY_ID=:agency_id WHERE APP_FORM_ID=:app_form_id";
		$paramList = array();
		$paramList["agency_id"] = $resultSM[0]["LOGIN_ID"];
		$paramList["app_form_id"] = $req_data->{"data"}->{"appFormId"};
		$result = $database->updateQuery($conn, $sqlFT, $paramList);
		if ($result == "failed") {
			$response["status"] = "failed";
			$response["statusCode"] = 1002;
			$response["message"] = "Could not update otp details";
			$data = array();
			$response['data'] = $data;
			$response['loginId'] = $req_data->{"loginId"};
			$response['accessToken'] = $req_data->{"accessToken"};
			return $response;
		}
	}
	
	$emailId=getEmailIdFromApplication($conn,$req_data->{"data"}->{"appFormId"});
	if($emailId!=""){
		$subject = "Application Under Sanction";
		$msg =  "Dear Sir/Madam,<br> <br/><b>".
		"We have received your application for availing loan. Your proposal is now under the process of evaluation and in case our Loan Officers have any queries they will directly contact you.<br/><br/>".
		"Regards<br/><br/>".
		"Team Mystro<br/><br/>".
		"www.mystro.in";
		sendEmail($emailId, $subject, $msg);
	}
	$response['status'] = "success";
    $response['statusCode'] = 200;
    $response['message'] = "";
    $response['loginId'] = $req_data->{"loginId"};
    $response['accessToken'] = $req_data->{"accessToken"};
    LoggerInfo($GLOBALS["currentFileName"], "Response from form Tracker is ::" . json_encode($response));
    return $response;
}
function generateAppId($database, $conn, $req_data) {
    LoggerInfo($GLOBALS["currentFileName"], "generateAppId() called with incoming request is" . json_encode($req_data));
    //generating Id
    //Inserting data into FORM_TRACKER table
    //Inserting data into BUSINESS_LOAN table
    //Inserting data into APPLICANT_DETAILS table
    //Inserting data into APPLICANT_PURPOSE table
    //Inserting data into APPLICANT_INDIVIDUAL table
    //Inserting data into APPLICANT_CORPORATE table
    //Inserting data into SECURITY table
    //Inserting data into LOAN_DETAILS table
    $newId = genUniqueId($conn, "BL");
    $req_data->{"data"}->{"appFormId"} = $newId;
    $loginId = $req_data->{"loginId"};
	
	$sql = "SELECT CREATED_BY_BP_LOGIN_ID FROM USER_REG_MST WHERE LOGIN_ID=:loginId";
    $paramList = array();
    $paramList["loginId"] = $req_data->{"loginId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList)[0];
	$agencyId=($result["CREATED_BY_BP_LOGIN_ID"]!=null && $result["CREATED_BY_BP_LOGIN_ID"]!="") ?$result["CREATED_BY_BP_LOGIN_ID"]:$loginId;
	
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Form Tracker");
    $sql = "INSERT INTO FORM_TRACKER(AGENT_ID, AGENCY_ID, LODGER_ID, APP_FORM_ID, FORM_STATUS, CREATE_DATE) VALUES(:appliedById, :agencyId, :lodgerId, :appFormId, :form_status, NOW())";
    $paramList = array();
    $paramList["appliedById"] = $req_data->{"loginId"};
    $paramList["agencyId"] = $agencyId;
    $paramList["lodgerId"] = $req_data->{"loginId"};
    $paramList["appFormId"] = $newId;
    $paramList["form_status"] = "0";
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save form details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Form Tracker History");
    $sql = "INSERT INTO FORM_TRACKER_HISTORY (AGENT_ID, LODGER_ID, APP_FORM_ID, FORM_STATUS, UPDATE_DATE) VALUES(:appliedById, :lodgerId, :appFormId, :form_status, NOW())";
    $paramList = array();
    $paramList["appliedById"] = $req_data->{"loginId"};
    $paramList["lodgerId"] = $req_data->{"loginId"};
    $paramList["appFormId"] = $newId;
    $paramList["form_status"] = "1";
    $result1 = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save form history details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Business Loan");
    $sql = "INSERT INTO BUSINESS_LOAN(LOGIN_ID,APP_FORM_ID, UPDATE_DATE) VALUES(:login_id,:appFormId, NOW())";
    $paramList = array();
    $paramList["login_id"] = $loginId;
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save business loan details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Details");
    $sql = "INSERT INTO APPLICANT_DETAILS(APP_FORM_ID, AD_APPLICANT_TYPE, UPDATE_DATE) VALUES(:appFormId, :ad_applicant_type,NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
	$paramList["ad_applicant_type"] = $req_data->{"data"}->{"applicantType"};
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Purpose");
    $sql = "INSERT INTO APPLICANT_PURPOSE(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant purpose details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    //if($req_data->{"data"}->{"applicantType"} == "Individual"){
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Individual");
    $sql = "INSERT INTO APPLICANT_INDIVIDUAL(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant individual details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Individual Income Statement");
    $sql = "INSERT INTO APPLICANT_INDI_INCOME_STATEMENT(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant individual income details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Individual Asset Details");
    $sql = "INSERT INTO APPLICANT_IND_ASSET_DETAILS(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant individual asset details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Individual Liability Details");
    $sql = "INSERT INTO APPLICANT_IND_LIABILITY_DETAILS(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant individual liability details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    //}
    //if($req_data->{"data"}->{"applicantType"} == "Company" || $req_data->{"data"}->{"applicantType"} == "Firm" || $req_data->{"data"}->{"applicantType"} == "HUF" || $req_data->{"data"}->{"applicantType"} == "Society" || $req_data->{"data"}->{"applicantType"} == "Association_Persons"){
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Corporate");
    $sql = "INSERT INTO APPLICANT_CORPORATE(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant corporate details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Corp Income Statement");
    $sql = "INSERT INTO APPLICANT_CORP_INCOME_STATEMENT(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant corporate income statement details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Corp Asset Details");
    $sql = "INSERT INTO APPLICANT_CORP_ASSET_DETAILS(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant corporate asset details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Corp Liability Loan Details");
    $sql = "INSERT INTO APPLICANT_CORP_LIABILITY_LOAN_DETAILS(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant corporate liability loan details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Corp Credit Details");
    $sql = "INSERT INTO APPLICANT_CORP_CREDIT_DETAILS(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant corporate credit details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Corp Liability Details");
    $sql = "INSERT INTO APPLICANT_CORP_LIABILITY_DETAILS(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant corporate liability details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Corp Non IFRS");
    $sql = "INSERT INTO APPLICANT_CORP_NON_IFRS(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant corporate non ifrs details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Corp IFRS");
    $sql = "INSERT INTO APPLICANT_CORP_IFRS(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save applicant corporate ifrs details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    //}
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Security");
    $sql = "INSERT INTO SECURITY(APP_FORM_ID, UPDATE_DATE) VALUES(:appFormId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save security details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    $sql = "SELECT * FROM USER_REG_MST WHERE LOGIN_ID=:loginId";
    $paramList = array();
    $paramList["loginId"] = $req_data->{"loginId"};
    $userResult = $database->selectParamQuery($conn, $sql, $paramList) [0];
    LoggerInfo($GLOBALS["currentFileName"], "Loan Details SQL :: " . $sql);
    LoggerInfo($GLOBALS["currentFileName"], "Loan Details PARAMLIST :: " . json_encode($paramList));
    LoggerInfo($GLOBALS["currentFileName"], "Loan Details RESULT :: " . json_encode($userResult));
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Loan Details");
    $sql = "INSERT INTO LOAN_DETAILS(APP_FORM_ID, BP_ID, SM_ID, UPDATE_DATE) VALUES(:appFormId, :bpId,:smId, NOW())";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $paramList["bpId"] = $userResult["BP_ID"];
    $paramList["smId"] = $userResult["SE_ID"];
    $result = $database->insertQuery($conn, $sql, $paramList);
    LoggerInfo($GLOBALS["currentFileName"], "Loan Details SQL :: " . $sql);
    LoggerInfo($GLOBALS["currentFileName"], "Loan Details PARAMLIST :: " . json_encode($paramList));
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save loan details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    LoggerInfo($GLOBALS["currentFileName"], "Inserting into Applicant Document Upload");
    $sql = "INSERT INTO APPLICANT_DOCUMENT_UPLOAD (MDOC_ID, APP_FORM_ID, DOCUMENT_TYPE, NO_OF_DOCS) SELECT MDOC_ID, :appFormId AS APP_FORM_ID,DOCUMENT_TYPE, NO_OF_DOCS FROM DOCUMENT_UPLOAD_MASTER_CONFIG WHERE FORM_TYPE='BL' AND CUSTOMER = 'Applicant' AND CUSTOMER_TYPE = :applicantType AND IS_DISABLED=0 ORDER BY DOC_SEQUENCE";
    $paramList = array();
    $paramList["appFormId"] = $newId;
    $paramList["applicantType"] = $req_data->{"data"}->{"applicantType"};
    $result = $database->insertQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response = array();
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not save application document details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    $response = array();
    $response["status"] = "success";
    $response["statusCode"] = 200;
    $response["message"] = "Form Id Created successfully!";
    $data = array();
    $data["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $response["data"] = $data;
    //$response["loginId"] = $req_data->{"loginId"};
    //$response["accessToken"] = $req_data->{"accessToken"};
    return $response;
}
function fetchApplicantData($database, $conn, $req_data) {
    $response = array();
    $data = array();
    $sql = "SELECT * FROM BUSINESS_LOAN WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response["status"] = "failed";
        $response["statusCode"] = 1001;
        $response["message"] = "Could not fetch Business Loan Details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    $data["businessLoanData"] = $result;
    $sql = "SELECT * FROM APPLICANT_DETAILS WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response["status"] = "failed";
        $response["statusCode"] = 1001;
        $response["message"] = "Could not fetch Applicant Details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    $data["applicantDetails"] = $result[0];
    $sql = "SELECT * FROM BUSINESS_LOAN_CUST_BUS_CONTRI WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response["status"] = "failed";
        $response["statusCode"] = 1001;
        $response["message"] = "Could not fetch Business Loan Customer Business Contribution Details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    $dummyRes = array();
    //Remove Unnecessary Key's
    $removeKeyList = ["ID", "APP_FORM_ID", "APP_TYPE_ID", "UPDATE_DATE"];
    foreach ($result as $res) {
        foreach ($removeKeyList as $removeKey) {
            $res = removeArrayKey($res, $removeKey);
        }
        $dummyRes[] = $res;
    }
    $data["bussLoanCustContriData"] = $dummyRes;
    $sql = "SELECT * FROM BUSS_LOAN_DIRECTOR_DETAILS WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response["status"] = "failed";
        $response["statusCode"] = 1001;
        $response["message"] = "Could not fetch Business Loan Director Details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    $dummyRes = array();
    //Remove Unnecessary Key's
    $removeKeyList = ["ID", "APP_FORM_ID", "APP_TYPE_ID", "UPDATE_DATE"];
    foreach ($result as $res) {
        foreach ($removeKeyList as $removeKey) {
            $res = removeArrayKey($res, $removeKey);
        }
        $dummyRes[] = $res;
    }
    $data["bussLoanDirectorData"] = $dummyRes;
    $sql = "SELECT * FROM BUSS_LOAN_SHARE_HOLDING_DETAILS WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response["status"] = "failed";
        $response["statusCode"] = 1001;
        $response["message"] = "Could not fetch Business Loan Share Holding Details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    $dummyRes = array();
    //Remove Unnecessary Key's
    $removeKeyList = ["ID", "APP_FORM_ID", "APP_TYPE_ID", "UPDATE_DATE"];
    foreach ($result as $res) {
        foreach ($removeKeyList as $removeKey) {
            $res = removeArrayKey($res, $removeKey);
        }
        $dummyRes[] = $res;
    }
    $data["bussLoanShareHoldingData"] = $dummyRes;
    $response["status"] = "success";
    $response["statusCode"] = 200;
    $response["message"] = "Applicant Details fetched successfully";
    $response["data"] = $data;
    //$response["loginId"] = $req_data->{"loginId"};
    //$response["accessToken"] = $req_data->{"accessToken"};
    return $response;
}
function fetchApplicantPurposeData($database, $conn, $req_data) {
    $response = array();
    $data = array();
    $sql = "SELECT * FROM BUSINESS_LOAN WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["businessLoanData"] = $result;
    $sql = "SELECT * FROM APPLICANT_PURPOSE WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    if ($result == "failed") {
        $response["status"] = "failed";
        $response["statusCode"] = 1000;
        $response["message"] = "Could not fetch Applicant Purpose Details";
        $data = array();
        $response["data"] = $data;
        $response["loginId"] = $req_data->{"loginId"};
        $response["accessToken"] = $req_data->{"accessToken"};
        return $response;
    }
    $data["applicantPurpose"] = $result[0];
    $response["status"] = "success";
    $response["statusCode"] = 200;
    $response["message"] = "Applicant Purpose Details fetched successfully";
    $response["data"] = $data;
    $response["loginId"] = $req_data->{"loginId"};
    $response["accessToken"] = $req_data->{"accessToken"};
    return $response;
}
function fetchSecurityData($database, $conn, $req_data) {
    $response = array();
    $data = array();
    $sql = "SELECT * FROM BUSINESS_LOAN WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["businessLoanData"] = $result;
    $sql = "SELECT * FROM SECURITY WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["securityData"] = $result;
    $sql = "SELECT * FROM SECURITY_POC WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["securityPOCData"] = $result;
    $sql = "SELECT * FROM SECURITY_SOC WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["securitySOCData"] = $result;
    $sql = "SELECT * FROM SECURITY_EQMF WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["securityEQMFData"] = $result;
    $sql = "SELECT * FROM SECURITY_DEBT WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["securityDEBTData"] = $result;
    $sql = "SELECT * FROM SECURITY_DEPST WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["securityDEPSTData"] = $result;
    $response["status"] = "success";
    $response["statusCode"] = 200;
    $response["message"] = "Applicant Details fetched successfully";
    $response["data"] = $data;
    //$response["loginId"] = $req_data->{"loginId"};
    //$response["accessToken"] = $req_data->{"accessToken"};
    return $response;
}
function fetchLoanDetails($database, $conn, $req_data) {
    $response = array();
    $data = array();
    $sql = "SELECT * FROM BUSINESS_LOAN WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["businessLoanData"] = $result;
    $sql = "SELECT * FROM LOAN_DETAILS WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["loanDetails"] = $result;
    $response["status"] = "success";
    $response["statusCode"] = 200;
    $response["message"] = "Applicant Details fetched successfully";
    $response["data"] = $data;
    //$response["loginId"] = $req_data->{"loginId"};
    //$response["accessToken"] = $req_data->{"accessToken"};
    return $response;
}
function saveUploadDetails($database, $conn, $req_data) {
    LoggerInfo($GLOBALS["currentFileName"], "Incoming data is " . json_encode($req_data));
    $response = array();
    $DocumentDetailsQl = $req_data->{"data"}->{"documentDetails"};
    $appFormId = $req_data->{"data"}->{"appFormId"};
    $appTypeId = $req_data->{"data"}->{"appTypeId"};
    LoggerInfo($GLOBALS["currentFileName"], "App Type is " . $appTypeId);
    LoggerInfo($GLOBALS["currentFileName"], "DocumentDetailsQl data is " . json_encode($DocumentDetailsQl));
    if ($appTypeId == '01') {
        foreach ($DocumentDetailsQl as $docDetail) {
            $sql = "UPDATE APPLICANT_DOCUMENT_UPLOAD SET DOCUMENT_NAME = :documentName, DOC_ID = :docId, DOC_SHORT_NAME = :docShortName, UPLOADED_BY_ID = :loginId, UPDATE_DATE = NOW() WHERE ID=:id AND APP_FORM_ID=:appFormId";
            $paramList = array();
            $paramList["documentName"] = $docDetail->{"DOCUMENT_NAME"};
            $paramList["docId"] = $docDetail->{"DOC_ID"};
            $paramList["docShortName"] = $docDetail->{"DOC_SHORT_NAME"};
            $paramList["loginId"] = $req_data->{"loginId"};
            $paramList["id"] = $docDetail->{"ID"};
            $paramList["appFormId"] = $docDetail->{"APP_FORM_ID"};
            $result = $database->updateQuery($conn, $sql, $paramList);
        }
    } else {
        foreach ($DocumentDetailsQl as $docDetail) {
            $sql = "UPDATE COAPP_DOCUMENT_UPLOAD SET DOCUMENT_NAME = :documentName, DOC_ID = :docId, DOC_SHORT_NAME = :docShortName, UPLOADED_BY_ID = :loginId, UPDATE_DATE = NOW() WHERE ID=:id AND APP_FORM_ID=:appFormId AND APP_TYPE_ID=:appTypeId";
            $paramList = array();
            $paramList["documentName"] = $docDetail->{"DOCUMENT_NAME"};
            $paramList["docId"] = $docDetail->{"DOC_ID"};
            $paramList["docShortName"] = $docDetail->{"DOC_SHORT_NAME"};
            $paramList["loginId"] = $req_data->{"loginId"};
            $paramList["id"] = $docDetail->{"ID"};
            $paramList["appFormId"] = $docDetail->{"APP_FORM_ID"};
            $paramList["appTypeId"] = $docDetail->{"APP_TYPE_ID"};
            LoggerInfo($GLOBALS["currentFileName"], "paramList is :: " . json_encode($paramList));
            $result = $database->updateQuery($conn, $sql, $paramList);
        }
    }
    $response["status"] = "success";
    $response["statusCode"] = 200;
    $response["message"] = "Documents saved successfully!";
    $data = array();
    $response["data"] = $data;
    $response["loginId"] = $req_data->{"loginId"};
    $response["accessToken"] = $req_data->{"accessToken"};
    return $response;
}
function fetchUploadDetails($database, $conn, $req_data) {
    $response = array();
    $data = array();
    $result = array();
    $appFormId = $req_data->{"data"}->{"appFormId"};
    $appTypeId = $req_data->{"data"}->{"appTypeId"};
    LoggerInfo($GLOBALS["currentFileName"], "appFormId :: " . $appFormId);
    LoggerInfo($GLOBALS["currentFileName"], "appTypeId :: " . $appTypeId);
    if ($appTypeId == '01') {
        $sql = "SELECT * FROM APPLICANT_DOCUMENT_UPLOAD WHERE APP_FORM_ID =:appFormId";
        $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
        $paramList["appFormId"] = $appFormId;
        LoggerInfo($GLOBALS["currentFileName"], "sql " . $sql);
        LoggerInfo($GLOBALS["currentFileName"], "paramlist  " . json_encode($paramList));
        $result = $database->selectParamQuery($conn, $sql, $paramList);
        LoggerInfo($GLOBALS["currentFileName"], "downloadlist:" . json_encode($result));
        $data["documentDetails"] = array();
        $data["documentDetails"] = $result;
        $sql = "SELECT * FROM DOCUMENT_UPLOAD_MASTER_REF WHERE MDOC_ID IN (SELECT MDOC_ID FROM APPLICANT_DOCUMENT_UPLOAD WHERE APP_FORM_ID =:appFormId)";
        $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
        $paramList["appFormId"] = $appFormId;
        $result = $database->selectParamQuery($conn, $sql, $paramList);
        LoggerInfo($GLOBALS["currentFileName"], "Config " . json_encode($result));
        $data["dropdownData"] = array();
        $data["dropdownData"] = $result;
        LoggerInfo($GLOBALS["currentFileName"], "App Data Result " . json_encode($data));
    } else {
        $sql = "SELECT * FROM COAPP_DOCUMENT_UPLOAD WHERE APP_FORM_ID=:appFormId AND APP_TYPE_ID=:appTypeId";
        $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
        $paramList["appFormId"] = $appFormId;
        $paramList["appTypeId"] = $appFormId . $appTypeId;
        LoggerInfo($GLOBALS["currentFileName"], ">>fetch paramList is :: " . json_encode($paramList));
        $result = $database->selectParamQuery($conn, $sql, $paramList);
        $data["documentDetails"] = $result;
        $sql = "SELECT * FROM DOCUMENT_UPLOAD_MASTER_REF WHERE MDOC_ID IN (SELECT MDOC_ID FROM COAPP_DOCUMENT_UPLOAD WHERE APP_FORM_ID=:appFormId  AND app_type_id=:appTypeId)";
        $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
        $paramList["appFormId"] = $appFormId;
        $paramList["appTypeId"] = $appFormId . $appTypeId;
        LoggerInfo($GLOBALS["currentFileName"], ">>set paramList is :: " . json_encode($paramList));
        $result = $database->selectParamQuery($conn, $sql, $paramList);
        $data["dropdownData"] = $result;
        LoggerInfo($GLOBALS["currentFileName"], "Co App Data Result " . json_encode($data));
    }
    $response["status"] = "success";
    $response["statusCode"] = 200;
    $response["message"] = "Documents fetched successfully";
    $response["data"] = $data;
    LoggerInfo($GLOBALS["currentFileName"], "Fetch Document Response is :: " . json_encode($response));
    return $response;
}
function fetchApplicantIndividualData($database, $conn, $req_data) {
    $response = array();
    $data = array();
    $sql = "SELECT * FROM BUSINESS_LOAN WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["businessLoanData"] = $result;
    $sql = "SELECT * FROM APPLICANT_INDIVIDUAL WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["applicantIndividualData"] = $result;
    $response["status"] = "success";
    $response["statusCode"] = 200;
    $response["message"] = "Applicant Details fetched successfully";
    $response["data"] = $data;
    //$response["loginId"] = $req_data->{"loginId"};
    //$response["accessToken"] = $req_data->{"accessToken"};
    return $response;
}
function fetchApplicantCorporateData($database, $conn, $req_data) {
    $response = array();
    $data = array();
    $sql = "SELECT * FROM BUSINESS_LOAN WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["businessLoanData"] = $result;
    $sql = "SELECT * FROM APPLICANT_CORPORATE WHERE APP_FORM_ID =:appFormId";
    $paramList = array(); // PARAMETER LIST IS SET GLOBAL BECAUSE COULDN`T ACCESS INSIDE FUNCTION.
    $paramList["appFormId"] = $req_data->{"data"}->{"appFormId"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["applicantCorporateData"] = $result;
    $response["status"] = "success";
    $response["statusCode"] = 200;
    $response["message"] = "Applicant Details fetched successfully";
    $response["data"] = $data;
    //$response["loginId"] = $req_data->{"loginId"};
    //$response["accessToken"] = $req_data->{"accessToken"};
    return $response;
}
function getStates($database, $conn, $req_data) {
    $response = array();
    $data = array();
    $paramList = array();
    $sql = "SELECT DISTINCT (STATE_NAME) AS CITY_STATE FROM PINCODES_DATA ORDER BY CITY_STATE ASC";
    $result = $database->selectQuery($conn, $sql);
    $data["stateList"] = $result;
    $response["data"] = $data;
    $response["status"] = "success";
    $response["statusCode"] = 200;
    return $response;
}
function getCityByState($database, $conn, $req_data) {
    $response = array();
    $data = array();
    $paramList = array();
    $sql = "SELECT DISTINCT (DIVISION_NAME) AS CITY_NAME FROM PINCODES_DATA WHERE STATE_NAME =:city_state_param ORDER BY CITY_NAME ASC";
    $paramList["city_state_param"] = $req_data->{"data"}->{"state"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["cityList"] = $result;
    $response["data"] = $data;
    $response["status"] = "success";
    $response["statusCode"] = 200;
    return $response;
}
function getDegree($database, $conn, $req_data) {
    $response = array();
    $data = array();
    $paramList = array();
    $sql = "SELECT DISTINCT DEGREE FROM DEGREE_COURSE_MASTER";
    $result = $database->selectQuery($conn, $sql);
    $data["degreeList"] = $result;
    $response["data"] = $data;
    $response["status"] = "success";
    $response["statusCode"] = 200;
    return $response;
}
function getDegreeByCourse($database, $conn, $req_data) {
    $response = array();
    $data = array();
    $paramList = array();
    $sql = "SELECT COURSE FROM DEGREE_COURSE_MASTER  WHERE DEGREE =:Degree";
    $paramList["Degree"] = $req_data->{"data"}->{"Degree"};
    $result = $database->selectParamQuery($conn, $sql, $paramList);
    $data["CourseList"] = $result;
    $response["data"] = $data;
    $response["status"] = "success";
    $response["statusCode"] = 200;
    return $response;
}
function generateBLZip($database, $conn, $req_data) {
    $response = downloadZipFile($database, $conn, $req_data);
	LoggerInfo("blDownloadZip.php","BL ZIP :".json_encode($response));
	return $response;
}
?>