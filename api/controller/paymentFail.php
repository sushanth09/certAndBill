<?php 
	require_once "../config/config.php";
	require_once "../config/database.php";
	require_once "../utils/logback.php";
	require_once "../utils/crypt.php";
	require_once "../utils/validation.php";

	$database = new Database();
	$conn = $database->getConnection();
	$currentFileName = "paymentFail.php";
	LoggerInfo($currentFileName, "paymentFail.php called");
	if (!$conn) {
		LoggerInfo($currentFileName, "Connection Error: " . $conn);
		echo "Connection Error:" . $conn;
		return;
	}
	//LoggerInfo("response ::::: payment:::: ".json_encode($_POST));
	$sql = "UPDATE TRANSACTION_AUDIT SET TXN_END_DATE=NOW(), MERCHANT_TXN_ID = :merchantTxnId, ERROR_CODE = :errorCode, MESSAGE = :message, STATUS = :status, RESPONSE = :response WHERE TXN_ID = :txnId AND PAYMENT_ID = :paymentId";
	$paramList = array();
	$paramList["merchantTxnId"] = $_POST["payuMoneyId"];
	$paramList["errorCode"] = $_POST["error"];
	$paramList["message"] = $_POST["error_Message"];
	$paramList["status"] = $_POST["status"];
	$paramList["response"] = json_encode($_POST);
	$paramList["paymentId"] = $_POST["udf3"];
	$paramList["txnId"] = $_POST["txnid"];
	$result = $database->updateQuery($conn, $sql, $paramList);
	//header('Location: http://beta.mystro.in:8000/mitronWebsite/content/dashboard/ui/index.html#/mypayment');
	header('Location: http://localhost:6060/mitronWebsite/content/dashboard/ui/index.html#/mypayment');
	/*
	echo json_encode($_POST)."<br><br><br><br><br><br><br><br><br><br>";
	foreach($_POST as $key => $value) {    
		echo $key ." >>>> ". $value."<br>";
	}
	*/
?>
