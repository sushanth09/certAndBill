/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 10.1.32-MariaDB : Database - billingcert
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`billingcert` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `billingcert`;

/*Table structure for table `bill_user_management` */

DROP TABLE IF EXISTS `bill_user_management`;

CREATE TABLE `bill_user_management` (
  `ID` int(11) NOT NULL,
  `USER_ID` varchar(200) DEFAULT NULL,
  `USER_NAME` varchar(50) DEFAULT NULL,
  `EMPLOYEE_ID` varchar(20) DEFAULT NULL,
  `F_NAME` varchar(50) DEFAULT NULL,
  `L_NAME` varchar(50) DEFAULT NULL,
  `CATEGORY` varchar(20) DEFAULT NULL,
  `EMAIL_ID` varchar(50) DEFAULT NULL,
  `MOBILE_NO` varchar(20) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `ACCESS_TOKEN` varchar(100) DEFAULT NULL,
  `COMPANY_NAME` varchar(25) DEFAULT NULL,
  `IS_PLACED` int(1) DEFAULT NULL,
  `IS_DISABLED` int(1) DEFAULT NULL,
  `CREATED_DATE` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `LAST_ACCESS_TIME` timestamp(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000',
  `LAST_LOGIN_TIME` timestamp(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `bill_user_management` */

insert  into `bill_user_management`(`ID`,`USER_ID`,`USER_NAME`,`EMPLOYEE_ID`,`F_NAME`,`L_NAME`,`CATEGORY`,`EMAIL_ID`,`MOBILE_NO`,`DOB`,`ACCESS_TOKEN`,`COMPANY_NAME`,`IS_PLACED`,`IS_DISABLED`,`CREATED_DATE`,`LAST_ACCESS_TIME`,`LAST_LOGIN_TIME`) values (0,'SUSH','SUSHANTH','A1001','SUSHANTH','CHETIPALLY','ADMIN','sushanthchetipally01@gmail.com','9326649278','1996-12-19',NULL,NULL,NULL,0,'2020-03-07 12:39:47.000000','2020-03-07 12:39:57.000000','0000-00-00 00:00:00.000000');

/*Table structure for table `course_master` */

DROP TABLE IF EXISTS `course_master`;

CREATE TABLE `course_master` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `COURSE_NAME` varchar(20) NOT NULL,
  `COURSE_DURATION` int(3) NOT NULL,
  `IS_DISABLED` int(1) NOT NULL DEFAULT '0',
  `PAYMENT` int(7) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `course_master` */

/*Table structure for table `payment_master` */

DROP TABLE IF EXISTS `payment_master`;

CREATE TABLE `payment_master` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `STUDENT_ID` int(11) NOT NULL,
  `COURSE_ID` int(11) NOT NULL,
  `TOTAL_PAYMENT` int(7) NOT NULL,
  `PENDING_PAYMENT` int(7) NOT NULL,
  `PAYMENT_DONE` int(7) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `payment_master` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
