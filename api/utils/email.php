<?php
  function emailNotification($from,$to,$cc,$bcc,$subject,$msg,$attachment){
		$headers = 'From: ' . $from . '<' . $to . '>' . "\r\n" .
		'Reply-To: \r\n' .
		'X-Mailer: PHP/' . phpversion();
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
		mail($to,$subject,$msg,$headers);
    }
    //emailNotification("max@gmail.com","sushanthchetipally09@gmail.com","","","Sample Subject","This is message body","");
?>