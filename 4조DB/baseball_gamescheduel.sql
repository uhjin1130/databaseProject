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
-- Table structure for table `gamescheduel`
--

DROP TABLE IF EXISTS `gamescheduel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gamescheduel` (
  `Game_Num` int NOT NULL,
  `Season` varchar(8) NOT NULL,
  `HomeTeam` varchar(15) NOT NULL,
  `AwayTeam` varchar(15) NOT NULL,
  `Game_Date` datetime DEFAULT NULL,
  PRIMARY KEY (`Game_Num`,`Season`),
  KEY `Season_idx` (`Season`),
  CONSTRAINT `Season` FOREIGN KEY (`Season`) REFERENCES `seasons` (`Season`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gamescheduel`
--

LOCK TABLES `gamescheduel` WRITE;
/*!40000 ALTER TABLE `gamescheduel` DISABLE KEYS */;
INSERT INTO `gamescheduel` VALUES (124,'Regular','KIA타이거즈','NC다이노스','2024-05-18 00:00:00'),(224,'Regular','키움히어로즈','SSG랜더스','2024-05-18 00:00:00'),(324,'Regular','삼성라이온즈','한화이글스','2024-05-18 00:00:00'),(424,'Regular','두산베어스','롯데자이언츠','2024-05-18 00:00:00'),(524,'Regular','KT위즈','LG트윈스','2024-05-18 00:00:00'),(624,'Regular','SSG랜더스','두산베어스','2024-05-21 00:00:00'),(724,'Regular','KIA타이거즈','롯데자이언츠','2024-05-21 00:00:00'),(824,'Regular','LG트윈스','두산베어스','2024-06-01 00:00:00'),(924,'Regular','NC다이노스','롯데자이언츠','2024-06-01 00:00:00'),(1024,'Post','두산베어스','KT위즈','2024-10-02 00:00:00'),(1124,'Post','두산베어스','KT위즈','2024-10-03 00:00:00'),(1224,'Post','LG트윈스','KT위즈','2024-10-05 00:00:00'),(1324,'Post','LG트윈스','KT위즈','2024-10-06 00:00:00'),(1424,'Post','KT위즈','LG트윈스','2024-10-08 00:00:00'),(1524,'Post','KT위즈','LG트윈스','2024-10-09 00:00:00');
/*!40000 ALTER TABLE `gamescheduel` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-03 10:40:39
