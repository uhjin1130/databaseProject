-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: baseball
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `gamerecords`
--

DROP TABLE IF EXISTS `gamerecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gamerecords` (
  `Game_Num` int NOT NULL,
  `Victory_Pitcher` varchar(10) DEFAULT NULL,
  `Victory_Hitter` varchar(10) DEFAULT NULL,
  `Victory_Team` varchar(15) DEFAULT NULL,
  `Defeat_Team` varchar(15) DEFAULT NULL,
  `Defeat_Score` int DEFAULT NULL,
  `Victory_Score` int DEFAULT NULL,
  `Arena_Name` varchar(15) DEFAULT NULL,
  `Referee_ID` int DEFAULT NULL,
  `Game_Date` datetime DEFAULT NULL,
  `Season` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`Game_Num`),
  KEY `Referee_ID_idx` (`Referee_ID`),
  KEY `Arena_Name_idx` (`Arena_Name`),
  CONSTRAINT `Arena_Name` FOREIGN KEY (`Arena_Name`) REFERENCES `stadium` (`Arena_Name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Referee_ID` FOREIGN KEY (`Referee_ID`) REFERENCES `referees` (`Referee_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gamerecords`
--

LOCK TABLES `gamerecords` WRITE;
/*!40000 ALTER TABLE `gamerecords` DISABLE KEYS */;
INSERT INTO `gamerecords` VALUES (124,'양현종','최형우','KIA타이거즈','NC다이노스',1,8,'광주기아챔피언스필드',101,'2024-05-18 00:00:00','Regular'),(224,'박민호','고명준','SSG랜더스','키움히어로즈',3,0,'고척스카이돔',102,'2024-05-18 00:00:00','Regular'),(324,'김재윤','맥키넌','삼성라이온즈','한화이글스',8,9,'대구삼성라이온즈파크',103,'2024-05-18 00:00:00','Regular'),(424,'곽빈','양석환','두산베어스','롯데자이언츠',3,8,'잠실야구장',104,'2024-05-18 00:00:00','Regular'),(524,'최원태','구본혁','LG트윈스','KT위즈',6,7,'수원KT위즈파크',105,'2024-05-18 00:00:00','Regular'),(624,'최원준','김재환','두산베어스','SSG랜더스',6,8,'인천SSG랜더스필드',103,'2024-05-21 00:00:00','Regular'),(724,'반즈','윤동희','롯데자이언츠','KIA타이거즈',1,6,'광주기아챔피언스필드',101,'2024-05-21 00:00:00','Regular'),(1024,'쿠에바스','장성우','KT위즈','두산베어스',0,4,'잠실야구장',102,'2024-10-02 00:00:00','Post'),(1124,'벤자민','강백호','KT위즈','두산베어스',0,1,'잠실야구장',101,'2024-10-03 00:00:00','Post'),(1224,'김민수','문상철','KT위즈','LG트윈스',2,3,'잠실야구장',104,'2024-10-05 00:00:00','Post'),(1324,'임찬규','박동원','LG트윈스','KT위즈',2,7,'잠실야구장',105,'2024-10-06 00:00:00','Post'),(1424,'손주영','오스틴','LG트윈스','KT위즈',5,6,'수원KT위즈파크',103,'2024-10-08 00:00:00','Post');
/*!40000 ALTER TABLE `gamerecords` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-03 14:53:14
