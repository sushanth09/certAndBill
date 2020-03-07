<?php
	require_once "logback.php";

	$msg = "";
	
	function checkStringValue($value){
		if(!isset($value) || empty($value)){
			return true;
		}
		return false;
	}

	function checkEmpVal($value){
		if($value == null || $value == ""){
			return true;
		}
		return false;
	}
	
	function alphabetNumberValid($value){
		if (!preg_match("/^[a-zA-Z0-9]*$/",$value)) {
			return true;
		}
		return false;
	}
	
	function alphabetNumberSpaceValid($value){
		if (!preg_match("/^[a-zA-Z0-9-:.() ]*$/",$value)) {
			return true;
		}
		return false;
	}
	
	function numberOnlyInput($value){
		return preg_replace("/[^\d]/", "", $value);
	}
	
	function financialYearValid($value){
		$currMonth = (int)Date('m');
		$currYr = (int)Date('Y');

		$fiscalYr = "";

		if ($currMonth > 3) { //
		$nextYr = (string)(($currYr) + 1);
		$fiscalYr = (string)($currYr . "-" . $nextYr[2] . $nextYr[3]);

		} else {
		$nextYr = (string)$currYr;
		$fiscalYr = (string)(($currYr - 1) . "-" . $nextYr[2] . $nextYr[3]);
		}
		$fiscalYr = "FY ".$fiscalYr;
		//LoggerInfo("blFormMasterValidation.php","fiscal year is ".$fiscalYr." and db fiscal year is ".$value);
		if($value  == $fiscalYr){
			//LoggerInfo("blFormMasterValidation.php","checking fiscal false");
			return false;   // if matched then return true
		}
		
		//LoggerInfo("blFormMasterValidation.php","checking fiscal true");
		return true; // if not - matched then return true
	}
	
	/* function nameValid($name){
		if(!isset($name) || empty($name)){
			$msg = "Please enter name";
		}else if (!preg_match("/^[a-zA-Z ]*$/",$name)) {
			$msg = "Invalid name";
		}else if(strlen($name) < 3 || strlen($name) > 50){
			$msg = "Invalid name";
		}
		return $msg;
	} */
	
	function alphabetSpaceValid($name){
		LoggerInfo("validation.php", "alphabetSpaceValidvalid incoming check is ".$name);
		
		if (!preg_match("/^[a-zA-Z ]*$/",$name)) {
			LoggerInfo("validation.php", "alphabetSpaceValid reached here:::: ");
			return true;
		}
		
		return false;
	}
	
	

	function regTypeValid($regType){
		if(!isset($regType) || empty($regType)){
			$msg = "Please select regType";
		}else if (!preg_match("/^[1-9]*$/",$regType)) {
			$msg = "Invalid regType";
		}else if(strlen($regType) < 1 || strlen($regType) > 1){
			$msg = "Invalid regType";
		}
		return $msg;
	}

	//gender valid
	/* function genderValid($gen){
		if(empty($gen)){
			$msg = "Please enter gender.";
		}
		return $msg;
	} */
	
	function userAccountType($accType){
		//LoggerInfo("validation.php", "accountType is ".$accType);
		if(empty($accType)){
			$msg = "Please enter account type.";
		}
		return $msg;
	}
	
	//email valid
	function emailValid($email){
		if(!preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/", $email)){
			return true;
		}
		return false;
	}


	function numberValid($num){
		if (!preg_match("/^[-0-9]*$/",$num)) {
			return true;
		}
		
		return false;
	}
	
	function phoneValid($phone){
		if (!preg_match("/^[7-9]{1}[0-9]{9}$/",$phone)) {
			return true;
		}
		return false;
	}
	
	function decimalValid($decimal){
		LoggerInfo("validation.php", "decimal valid incoming check is ".$decimal);
		
		if (!preg_match("/^-?\d+(\.\d{0,5})?$/", $decimal)){
			LoggerInfo("validation.php", "decimal check for ".$decimal."return is true");
			return true;
		}
		
		LoggerInfo("validation.php", "decimal check for ".$decimal."return is false");
		return false;
	}
	
		function checkNumber ($str){
			if (!preg_match('/^-?[0-9]{15}$/', $str)) {
				return true;
			} 
			return false;
		}
	
	function passWordValid($pwd){
		if(!isset($pwd) || empty($pwd)){
			$msg = "Please enter passwords";
		}else if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,13}/",$pwd)) {
			$msg = "Invalid Password";
		}
		return $msg;
	}

	//pan number valid
	function panNumberValid($pan){
		//LoggerInfo("validation.php", "inside pan number ".$pan);
		if (!preg_match("/^[A-Za-z]{3}[PBLJGCAFHTSpbljgcafhts]{1}[A-Za-z]{1}\d{4}[A-Za-z]{1}$/", $pan)){
			return true;
		}
		return false;
	}
	
	
	//aadhar number valid
	function aadharValid($aadhar){
		if (!preg_match("/^[2-9]{1}[0-9]{11}$/", $aadhar)){
			return true;
		}
		return false;
	}
	
	/* function annualNumberValid($annNum){
		if (!preg_match("/^[0-9]$/", $annNum)){
			return true;
		}
		return false;
	} */
	
	//gst number valid
	function gstNoValid($gstNo){
		if (!preg_match("/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/", $gstNo)){
			return true;
		}else if(strlen($gstNo) != 15){
			return true;
		}
		return false;
	}

	//bankAccountNumber valid
	function bankAccountNumber($bankAccNo){
		if(!preg_match("/^[0-9]$/", $bankAccNo)) {
			return true;
		}else if(strlen($bankAccNo) < 11 || strlen($bankAccNo) > 17){
			return true;
		}
		return false;
	}
	
	//ifsc code valid
	function ifscNumberValid($ifsc){
		if (!preg_match("/^[A-Z]{4}[A-Z0-9]{7}$/", $ifsc)){
			return true;
		}
		return false;
	}
	
	//years of exp valid
	function yearsOfOperations($yrs){
		if(strlen($yrs) > 2){
			return true;
		}
		return false;
	}
	
	function dematNSDL($value){
		if(!preg_match("/^[I]{1}[N]{1}\d{14}$/", $value)){
			return true;
		}
		return false;
	}
	
	function financialValid($value){
		if(!preg_match("/^[a-zA-Z0-9() ]*$/", $value)){
			return true;
		}
		return false;
	}
	function validateCustomerId($cust){
		if(!preg_match("/^[a-zA-Z]{2}[0-9]{12}$/", $cust)){
			return true;
		}
		return false;
	}
	//description
	function description($desc){
		if(!preg_match("/^[a-zA-Z0-9 ':,.\/-]+$/", $desc)){
			return true;
		}
		return false;
	}
	
	function instName($inst){
		//LoggerInfo("validation.php", "reached here ".$inst);
		if(!preg_match("/^[a-zA-Z0-9 ,.'&-]+$/", $inst)){
			return true;
		}
		return false;
	}
	
	function annualIncomeValid($income){
		if($income == "0"){
			return true;
		}else if(strlen($income) > 20){
			return true;
		}
		return false;
	}

	
	function pincodeValid($pin){
		if(!preg_match("/^([1-9]{1}[0-9]{5})$/",$pin)){
			return true;
		}
		return false;
	}

	// m for Month, d for Date, Y for year 4 digit year, y for 2 digit year
	function strToDate($dt, $format = 'd-m-y'){
		$time = strtotime($dt);
		$newformat = date('d-m-Y', $time);
		echo $newformat;
	}

	//validate variable type
	function validateInt($val){
		return var_dump(is_int($val));
	}

	function validateFloat($val){
		return var_dump(is_float($val));
	}

	function validateString($val){
		return var_dump(is_string($val));
	}

	function validateNumeric($val){
		return var_dump(is_numeric($val));
	}

	function validateAlplanumeric($val){
		return ctype_alnum($val);
	}

	function generateOTP(){
		$otp = rand(100000,999999);
		return $otp;
	}

	function generateAccessToken(){
		$token = bin2hex(openssl_random_pseudo_bytes(32));
		return $token;
	}

	function getFileExt($fileName){
		return pathinfo($fileName, PATHINFO_EXTENSION);
	}

	function removeArrayKey($array, $key) {
		unset($array[$key]);
		return $array;
	}

	
	function alphnum($alnm){
		if(!preg_match("^[a-zA-Z0-9_]*$^",$alnm)){
			return true;
		}
		return false;

	}
	
	//blFormValidations
	function checkContainData($dataKey, $dataValues){
		$flag = true;
		
		for($i = 0; $i<count($dataValues); $i++){
	 LoggerInfo("validation.php","cheking exist for data ".$dataKey." returned1 ".$flag." ---".$dataValues[$i]);
			if($dataKey == $dataValues[$i]){
				$flag = false;
			    /* //LoggerInfo("validation.php","cheking exist for data ".$dataKey." returned2 ".$flag);	 */
			}
		}
		
		/* //LoggerInfo("validation.php","checkContainData flag is ".$dataKey." returned ".$flag."with database value".$dataValues[0]." 2".$dataValues[1]);
		 */
		return $flag;
	}
	
	function nameValidate($name){
		if(!isset($name) || empty($name)){
			$msg = "Please enter name";
		}else if (!preg_match("/^[a-zA-Z ]*$/",$name)) {
			$msg = "Invalid name";
		}else if(strlen($name) < 3 || strlen($name) > 50){
			$msg = "Invalid name";
		}
		return $msg;
	}
	
	function emailValidation($email){
		if(empty($email)){
				$msg = "Please enter email";
		}else if(!preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/",$email)){
				$msg = "Please provide valid email Id";
		}
		return $msg;
	}
	
	function regTypeValidation($regType){
		if(!isset($regType) || empty($regType)){
			$msg = "Please select regType";
		}else if (!preg_match("/^[1-9]*$/",$regType)) {
			$msg = "Invalid regType";
		}else if(strlen($regType) < 1 || strlen($regType) > 1){
			$msg = "Invalid regType";
		}
		return $msg;
	}
	
	function numberValidation($regType){
		if(!isset($regType) || empty($regType)){
			$msg = "Please enter number.";
		}else if (!preg_match("/^[0-9]*$/",$regType)) {
			$msg = "Invalid mobile number.";
		}else if(strlen($regType) != 10){
			$msg = "Invalid mobile number.";
		}
		return $msg;
	}

	
	/* $values = array("Individual1", "Non-Individual");
	echo checkContainData("Individual", $values); */
?>