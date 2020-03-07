<?php
require_once 'class.phpmailer.php';
//require_once 'config.php';

//$from = $_GET("from");
//$to = $_GET("to");
//$replyTo = $_GET("replyTo");
//$subject = $_GET("subject");
//$msgBody = $_GET("msgBody");

echo "loaded";


  function SendConfirmation ($sName, $sEmail)
  {
    $mail = new PHPMailer ();
    
    $mail->SMTPDebug  = 2;
    
    $mail->Host = "tls://smtp.gmail.com";
	
    $mail->IsSMTP ();
    $mail->SMTPAuth   = true;                  // enable SMTP authentication
	$mail->SMTPSecure = 'ssl';
	$mail->Port       = 465;
    $mail->Username = "billAndCert_testing@gmail.com";
    $mail->Password = "bill&cert@123#";
    
    $mail->IsSendmail();  // tell the class to use Sendmail

    $mail->From = "billAndCert_testing@gmail.com";
    $mail->FromName = "Mindscript Team";

    $mail->AddAddress ($sEmail, $sName);

    $mail->Subject = 'PHPMailer Test' . date ('Y-m-d H:i:s');
    $mail->Body = "This is a test.";

    if ($mail->Send ()){
		$mail->ClearAddresses();
		$mail->ClearAttachments();
		echo "\r\nMail sent.";
	}else{
		$mail->ClearAddresses();
		$mail->ClearAttachments();
		echo "\r\nMail not sent. " .  $mail->ErrorInfo;
	}
    
    echo "\r\n";
  }  
  
  /***[ Main ] **************************************************************************/
  
  $sName = 'Sushanth Chetipally';
  $sEmail = 'sushanthchetipally09@gmail.com';
  
  $bSent = SendConfirmation ($sName, $sEmail);


function sendEmail($to, $subject, $msgBody){
	try {
		$mail = new PHPMailer(true); //New instance, with exceptions enabled

		$body             = $msgBody;
		$body             = preg_replace('/\\\\/','', $body); //Strip backslashes

		$mail->IsSMTP();                           // tell the class to use SMTP
		$mail->SMTPAuth   = true;                  // enable SMTP authentication
		$mail->SMTPSecure = 'ssl';
		$mail->Port       = 465;                    // set the SMTP server port
		$mail->Host       = "tls://smtp.gmail.com"; // SMTP server
		$mail->Username   = "bill&cert_testing@gmail.com";     // SMTP server username
		$mail->Password   = "bill@123#";            // SMTP server password

		$mail->IsSendmail();  // tell the class to use Sendmail

		$mail->AddReplyTo("bill&cert_testing@gmail.com","Mitron Team");

		$mail->From       = "bill&cert_testing@gmail.com";
		$mail->FromName   = "Mindscript Team";

		$mail->AddAddress($to);

		$mail->Subject  = $subject;

		//$mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test
		$mail->WordWrap   = 80; // set word wrap

		$mail->MsgHTML($body);

		$mail->IsHTML(true); // send as HTML

		if ($mail->Send ()){
			$mail->ClearAddresses();
			$mail->ClearAttachments();
			echo "\r\nMail sent.";
		}else{
			$mail->ClearAddresses();
			$mail->ClearAttachments();
			echo "\r\nMail not sent. " .  $mail->ErrorInfo;
		}
		return true;
	} catch (phpmailerException $e) {
		//LoggerInfo("phpEmailSend.php","Error While Email Sent:".$e->errorMessage());
		echo "failed:".$e->errorMessage();
		return false;
	}
}
    $to = "sushanthchetipally09@gmail.com";
    $subject = "test";
    $msgbody = "test body";
    sendEmail($to, $subject, $msgbody);
    
    mail("sushanthchetipally09@gmail.com","Test Non Auth","Non Auth Body");
?>