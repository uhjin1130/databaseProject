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
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `players` (
  `Player_ID` int NOT NULL,
  `Player_Name` varchar(10) NOT NULL,
  `Player_Team` varchar(15) DEFAULT NULL,
  `Player_Num` int DEFAULT NULL,
  `Position_ID` int DEFAULT NULL,
  PRIMARY KEY (`Player_ID`),
  KEY `Position_ID_idx` (`Position_ID`),
  CONSTRAINT `Position_ID` FOREIGN KEY (`Position_ID`) REFERENCES `position` (`Position_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players`
--

LOCK TABLES `players` WRITE;
/*!40000 ALTER TABLE `players` DISABLE KEYS */;
INSERT INTO `players` VALUES (240010,'양현종','KIA타이거즈',54,0),(240011,'김휘집','NC다이노스',44,1),(240020,'이용찬','NC다이노스',22,0),(240021,'김도영','KIA타이거즈',5,1),(240030,'류현진','한화이글스',99,0),(240031,'노시환','한화이글스',8,1),(240040,'원태인','삼성라이온즈',18,0),(240041,'구자욱','삼성라이온즈',5,1),(240050,'윌커슨','롯데자이언츠',46,0),(240051,'윤동희','롯데자이언츠',91,1),(240060,'엔스','LG트윈스',34,0),(240061,'박동원','LG트윈스',27,1),(240070,'곽빈','두산베어스',47,0),(240071,'양의지','두산베어스',25,1),(240080,'김광현','SSG랜더스',29,0),(240081,'최정','SSG랜더스',14,1),(240090,'쿠에바스','KT위즈',32,0),(240091,'로하스','KT위즈',3,1),(240100,'후라도','키움히어로즈',75,0),(240101,'김혜성','키움히어로즈',3,1);
/*!40000 ALTER TABLE `players` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-03 10:40:38
