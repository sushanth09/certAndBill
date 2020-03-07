<?php
	require_once "../config/database.php";

	function genUniqueServiceId(){
		$appId = "SR";
		$iur = date('ymd');
		$iur .= mt_rand(01,99);
		$appId .= $iur;
		return  $appId;
	}

// echo genUniqueServiceId();


?>