<?php
	date_default_timezone_set('Asia/Kolkata');
	function LoggerInfo($errorInFile, $log_msg, $logFileName = "mitron"){	
		$log_filename = "../log";
		$log_filename_archive = "logArchive";
		$log_file_data = $log_filename.'/'.$logFileName.'.log';
		
		if(!file_exists($log_filename)){
			mkdir($log_filename, 0777, true);
		}
		if(!file_exists($log_filename.'/'.$log_filename_archive)){
			mkdir($log_filename.'/'.$log_filename_archive, 0777, true);
		}
		
		if(!file_exists($log_file_data)){
			$file = fopen($log_file_data,"w");
			fclose($file);
		}
				
		if (filesize($log_file_data) > 5242880) {				
			copy($log_file_data, $log_filename.'/'.$log_filename_archive.'/'.$logFileName.'_' . date('dmyhis') . '.log');		
			$newFile = $log_filename.'/'.$logFileName.'.log';
			file_put_contents($newFile, date('d-m-y h:i:s').':::[File_Name:'.$errorInFile.']::::'.$log_msg . "\n", LOCK_EX);
		}else{		
			file_put_contents($log_file_data, date('d-m-y h:i:s').':::[File_Name:'.$errorInFile.']::::'.$log_msg . "\n", FILE_APPEND);
		}    
	}
?>