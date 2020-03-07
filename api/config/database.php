<?php
	require_once "../utils/logback.php";
	require_once "config.php";

	class Database{
		private $dbType = "mysql";
		private $host = "localhost";
		private $dbName = "billAndCert";
		private $userName = "root";
		private $password = "";
		private $currentFileName = "database.php";
		public $conn;

		public function getConnection(){
			$this->conn = null;
			try{
				$this->conn = new PDO($this->dbType.":host=" . $this->host . ";dbname=" . $this->dbName, $this->userName, $this->password, array(PDO::ATTR_PERSISTENT => true));
				$this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			}catch(PDOException $e){
				LoggerInfo($this->currentFileName,"DB PDO Connection Error: " . $e->getMessage());
				//return "DB PDO Connection Error: " . $e->getMessage();
				return "failed";
			}catch(Exception $e){
				LoggerInfo($this->currentFileName,"DB Connection Error: " . $e->getMessage());
				//return "DB Connection Error: " . $e->getMessage();
				return "failed";
			}
			return $this->conn;
		}

		public function selectQuery($conn, $sql){
			try{
				$resp = array();
				$this->conn = $conn;
				$stmt = $this->conn->prepare($sql);
				$stmt->execute();
				$data=$stmt->fetchAll(PDO::FETCH_ASSOC);
				foreach ($data as $item) {
					$temp = array();
					foreach ($item as $key => $value) {
						$temp[$key] = is_null($value) ? "" : $value;
					}
					array_push($resp, $temp);
				}
			}catch(PDOException $e){
				LoggerInfo($this->currentFileName,"DB PDO Select Query Error: " . $e->getMessage());
				//return "DB PDO Select Query Error:" . $e->getMessage();
				return "failed";
			}catch(Exception $e){
				LoggerInfo($this->currentFileName,"DB Select Query Error: " . $e->getMessage());
				//return "DB Select Query Error:" . $e->getMessage();
				return "failed";
			}
			return $resp;
		}

		public function selectParamQuery($conn, $sql, $param){
			try{
				$resp = array();
				$this->conn = $conn;
				$stmt = $this->conn->prepare($sql);
				$stmt->execute($param);
				$data=$stmt->fetchAll(PDO::FETCH_ASSOC);
				foreach ($data as $item) {
					$temp = array();
					foreach ($item as $key => $value) {
						$temp[$key] = is_null($value) ? "" : $value;
					}
					array_push($resp, $temp);
				}
			}catch(PDOException $e){
				LoggerInfo($this->currentFileName,"DB PDO Select Param Query Error: " . $e->getMessage());
				return "failed";
				//return "DB PDO Select Param Query Error:" . $e->getMessage();
			}catch(Exception $e){
				LoggerInfo($this->currentFileName,"DB Select Param Query Error: " . $e->getMessage());
				return "failed";
				//return "DB Select Param Query Error:" . $e->getMessage();
			}
			return $resp;
		}

		public function insertQuery($conn, $sql, $param){
			try{
				$this->conn = $conn;
				$stmt = $this->conn->prepare($sql);
				$stmt->execute($param);
				$resp = $this->conn->lastInsertId();
			}catch(PDOException $e){
				LoggerInfo($this->currentFileName,"DB PDO Insert Param Query Error: " . $e->getMessage());
				//return "DB PDO Insert Query Error:" . $e->getMessage();
				return "failed";
			}catch(Exception $e){
				LoggerInfo($this->currentFileName,"DB Insert Param Query Error: " . $e->getMessage());
				//return "DB Insert Query Error:" . $e->getMessage();
				return "failed";
			}
			return $resp;
		}

		public function updateQuery($conn, $sql, $param){
			try{
				$this->conn = $conn;
				$stmt = $this->conn->prepare($sql);
				$stmt->execute($param);
				$resp= "success";
			}catch(PDOException $e){
				LoggerInfo($this->currentFileName,"DB PDO Update Param Query Error: " . $e->getMessage());
				//return "DB PDO Update Query Error:" . $e->getMessage();
				return "failed";
			}catch(Exception $e){
				LoggerInfo($this->currentFileName,"DB Update Param Query Error: " . $e->getMessage());
				//return "DB Update Query Error:" . $e->getMessage();
				return "failed";
			}
			return $resp;
		}

		public function deleteParamQuery($conn, $sql, $param){
			try{
				$this->conn = $conn;
				$stmt = $this->conn->prepare($sql);
				$stmt->execute($param);
				$resp= "success";
			}catch(PDOException $e){
				LoggerInfo($this->currentFileName,"DB PDO Delete Param Query Error: " . $e->getMessage());
				//return "DB PDO Delete Query Error:" . $e->getMessage();
				return "failed";
			}catch(Exception $e){
				LoggerInfo($this->currentFileName,"DB Delete Param Query Error: " . $e->getMessage());
				//return "DB Delete Query Error:" . $e->getMessage();
				return "failed";
			}
			return $resp;
		}
	}

	//Example to use above code
	//$database = new Database();
	//$db = $database->getConnection();
?>
