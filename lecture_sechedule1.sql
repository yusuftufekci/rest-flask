-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Dec 01, 2020 at 05:59 PM
-- Server version: 5.7.30
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `lecture_schedule1`
--

-- --------------------------------------------------------

--
-- Table structure for table `classroom`
--

CREATE TABLE `classroom` (
  `classroomID` int(11) NOT NULL,
  `capacity` int(11) NOT NULL,
  `lab` tinyint(1) NOT NULL,
  `location` varchar(30) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `classroom`
--

INSERT INTO `classroom` (`classroomID`, `capacity`, `lab`, `location`, `name`) VALUES
(1, 30, 0, '4.Floor A block', 'a408');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `ID` int(11) NOT NULL,
  `courseCode` varchar(15) NOT NULL,
  `credit` int(35) NOT NULL,
  `name` varchar(35) NOT NULL,
  `departmentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`ID`, `courseCode`, `credit`, `name`, `departmentID`) VALUES
(1, 'COMP421', 6, 'Computer Networks', 1);

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `ID` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `facultyID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`ID`, `name`, `facultyID`) VALUES
(1, 'Computer Engineering', 1);

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `ID` int(11) NOT NULL,
  `studentID` int(11) NOT NULL,
  `sectionID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`ID`, `studentID`, `sectionID`) VALUES
(1, 41501008, 1);

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `ID` int(11) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`ID`, `name`) VALUES
(1, 'Faculty of Engineering');

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

CREATE TABLE `instructor` (
  `ID` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `departmentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `instructor`
--

INSERT INTO `instructor` (`ID`, `name`, `departmentID`) VALUES
(1, 'İlker Bekmezci', 1);

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `ID` int(11) NOT NULL,
  `section` int(11) NOT NULL,
  `instructorID` int(11) NOT NULL,
  `time` varchar(20) NOT NULL,
  `courseID` int(11) NOT NULL,
  `classroomID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`ID`, `section`, `instructorID`, `time`, `courseID`, `classroomID`) VALUES
(1, 2, 1, 'Çarşamba 15.00', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sensors`
--

CREATE TABLE `sensors` (
  `ID` int(11) NOT NULL,
  `tempature` int(11) NOT NULL,
  `classroomID` int(11) NOT NULL,
  `humidity` int(11) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `studentNumber` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  `departmentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`studentNumber`, `name`, `departmentID`) VALUES
(41501008, 'Yusuf Tüfekçi', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classroom`
--
ALTER TABLE `classroom`
  ADD PRIMARY KEY (`classroomID`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `departmentFK` (`departmentID`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `facultyFK` (`facultyID`);

--
-- Indexes for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `sectionFK` (`sectionID`),
  ADD KEY `studentFK` (`studentID`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `departmentFK2` (`departmentID`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `classroomFK` (`classroomID`),
  ADD KEY `courseFK` (`courseID`),
  ADD KEY `instructorFK` (`instructorID`);

--
-- Indexes for table `sensors`
--
ALTER TABLE `sensors`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `classroomFK2` (`classroomID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`studentNumber`),
  ADD KEY `departmentFK3` (`departmentID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `departmentFK` FOREIGN KEY (`departmentID`) REFERENCES `department` (`ID`);

--
-- Constraints for table `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `facultyFK` FOREIGN KEY (`facultyID`) REFERENCES `faculty` (`ID`);

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `sectionFK` FOREIGN KEY (`sectionID`) REFERENCES `section` (`ID`),
  ADD CONSTRAINT `studentFK` FOREIGN KEY (`studentID`) REFERENCES `student` (`studentNumber`);

--
-- Constraints for table `instructor`
--
ALTER TABLE `instructor`
  ADD CONSTRAINT `departmentFK2` FOREIGN KEY (`departmentID`) REFERENCES `department` (`ID`);

--
-- Constraints for table `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `classroomFK` FOREIGN KEY (`classroomID`) REFERENCES `classroom` (`classroomID`),
  ADD CONSTRAINT `courseFK` FOREIGN KEY (`courseID`) REFERENCES `courses` (`ID`),
  ADD CONSTRAINT `instructorFK` FOREIGN KEY (`instructorID`) REFERENCES `instructor` (`ID`);

--
-- Constraints for table `sensors`
--
ALTER TABLE `sensors`
  ADD CONSTRAINT `classroomFK2` FOREIGN KEY (`classroomID`) REFERENCES `classroom` (`classroomID`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `departmentFK3` FOREIGN KEY (`departmentID`) REFERENCES `department` (`ID`);