<?php
require_once 'PHPMailer_5.2.0_0/class.phpmailer.php';
require_once '../config/database.php';
require_once 'logback.php';

	function sendEmails($to, $subject, $msgBody){
		$database = new Database();
		$conn = $database->getConnection();
		if (!$conn) {
			LoggerInfo($currentFileName, "Connection Error: " . $conn);
			return;
		}
		try {
			$mail = new PHPMailer(true); //New instance, with exceptions enabled
			$body = $msgBody;
			$body = preg_replace('/\\\\/','', $body); //Strip backslashes
			$mail->IsSMTP();                           // tell the class to use SMTP
			$mail->SMTPAuth   = true;                  // enable SMTP authentication
			$mail->SMTPSecure = 'ssl';
			$mail->SMTPDebug = 0;                                 // Enable verbose debug output
			$mail->Port       = fetchConstantsData($database, $conn, "EmailSMTPPort"); // set the SMTP server port
			$mail->Host       = fetchConstantsData($database, $conn, "EmailSMTPHost");  // SMTP server
			$mail->Username   = fetchConstantsData($database, $conn, "EmailSMTPUser");     // SMTP server username
			$mail->Password   = fetchConstantsData($database, $conn, "EmailSMTPPassword"); // SMTP server password
//			$mail->IsSendmail();  // tell the class to use Sendmail
			$mail->AddReplyTo("mystro@mystro.in","Mitron Team");
			$mail->From       = "mystro@mystro.in";
			$mail->FromName   = "Mitron Team";
			$mail->AddAddress($to);
			$mail->Subject  = $subject;
			//$mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test
			$mail->WordWrap   = 80; // set word wrap
			$mail->MsgHTML($body);
			$mail->IsHTML(true); // send as HTML
			if ($mail->Send ()){
				$mail->ClearAddresses();
				$mail->ClearAttachments();
				LoggerInfo("sendEmail.php","Mail Sent Successfully. To:".$to." Subject:".$subject." Message Body:".$msgBody, "mitronEmailLog");
			}else{
				$mail->ClearAddresses();
				$mail->ClearAttachments();
				LoggerInfo("sendEmail.php","Mail Sent Failed. To:".$to." Subject:".$subject." Message Body:".$msgBody, "mitronEmailLog");
			}
			return true;
		} catch (phpmailerException $e) {
			LoggerInfo("sendEmail.php","Mail Sent Failed. To:".$to." Subject:".$subject." Message Body:".$msgBody, "mitronEmailLog");
			LoggerInfo("sendEmail.php","Error While Email Sent:".$e->errorMessage(), "mitronEmailLog");
			return false;
		}
	}
	
	function sendEmail ($to, $subject, $msgBody){
		$curl = curl_init();

		$postData = array('body' => $msgBody,
                	  'sender_email' => $to,
	                  'subject' => $subject
                 );
		$postDataJson = json_encode($postData);

		curl_setopt_array($curl, array(
			CURLOPT_URL => "http://ec2-13-232-40-170.ap-south-1.compute.amazonaws.com:8090/send_email_bill.php",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "POST",
			CURLOPT_POSTFIELDS => $postDataJson,
			CURLOPT_HTTPHEADER => array(
				"Cache-Control: no-cache",
				"Content-Type: application/json"
			),
		));

		$response = curl_exec($curl);
		$err = curl_error($curl);
		curl_close($curl);


		if ($err) {
			LoggerInfo("sendEmail.php","Mail Sent Failed. To:".$to." Subject:".$subject." Message Body:".$msgBody, "mitronEmailLog");
			LoggerInfo("sendEmail.php","Error Is :".$err);
			LoggerInfo("sendEmail.php","Response Is :".$response);
			return false;
		} else {
			LoggerInfo("sendEmail.php","Mail Sent To:".$to." Subject:".$subject." Message Body:".$msgBody, "mitronEmailLog");
			LoggerInfo("sendEmail.php","Response Is :".$response);
			return true;
		}
	}	
	function sendSMS ($mobile, $messageStr){
		$url="http://api.msg91.com/api/v2/sendsms";
		$senderId = "MYSTRO";
		$route = 4;
		$campaign = "test Camp";
		$sms = array(
			'message' => $messageStr,
			'to' => array($mobile)
		);
		//Prepare you post parameters
		$postData = array(
			'sender' => $senderId,
			'campaign' => $campaign,
			'route' => $route,
			'sms' => array($sms)
		);
		$postDataJson = json_encode($postData);
		$curl = curl_init();
		curl_setopt_array($curl, array(
			CURLOPT_URL => "$url",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_CUSTOMREQUEST => "POST",
			CURLOPT_POSTFIELDS => $postDataJson,
			CURLOPT_HTTPHEADER => array(
				"authkey: 217770AOjYhJaDWuNE5b0d0899",
				"content-type: application/json"
			),
		));
		$response = curl_exec($curl);
		$err = curl_error($curl);
		curl_close($curl);
		if ($err) {
			return false;
		} else {
			return true;
		}
	}
?>