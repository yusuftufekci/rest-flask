-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Nov 29, 2020 at 07:37 PM
-- Server version: 5.7.30
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `lecture_schedule`
--

-- --------------------------------------------------------

--
-- Table structure for table `classroom`
--

CREATE TABLE `classroom` (
  `ClassroomID` int(11) NOT NULL,
  `capacity` int(11) NOT NULL,
  `Lab` tinyint(1) NOT NULL,
  `Location` varchar(30) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `classroom`
--

INSERT INTO `classroom` (`ClassroomID`, `capacity`, `Lab`, `Location`, `name`) VALUES
(1, 30, 0, '4.Floor A block', 'a408');

-- --------------------------------------------------------

--
-- Table structure for table `Courses`
--

CREATE TABLE `Courses` (
  `ID` int(11) NOT NULL,
  `courseCode` varchar(15) NOT NULL,
  `Credit` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `departmentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Courses`
--

INSERT INTO `Courses` (`ID`, `courseCode`, `Credit`, `name`, `departmentID`) VALUES
(1, 'COMP421', 6, 'Computer Networks', 1);

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `ID` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `facultyID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`ID`, `name`, `facultyID`) VALUES
(1, 'Computer engineering', 1),
(2, 'English Language Teaching', 2);

-- --------------------------------------------------------

--
-- Table structure for table `Enrollment`
--

CREATE TABLE `Enrollment` (
  `ID` int(11) NOT NULL,
  `studentID` int(11) NOT NULL,
  `sectionID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Enrollment`
--

INSERT INTO `Enrollment` (`ID`, `studentID`, `sectionID`) VALUES
(1, 41501008, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Faculty`
--

CREATE TABLE `Faculty` (
  `ID` int(11) NOT NULL,
  `name` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Faculty`
--

INSERT INTO `Faculty` (`ID`, `name`) VALUES
(1, 'Faculty Of Engineering'),
(2, 'Faculty of Education');

-- --------------------------------------------------------

--
-- Table structure for table `Instructor`
--

CREATE TABLE `Instructor` (
  `ID` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `departmentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Instructor`
--

INSERT INTO `Instructor` (`ID`, `name`, `departmentID`) VALUES
(1, 'Ilker Bekmezci', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Section`
--

CREATE TABLE `Section` (
  `ID` int(11) NOT NULL,
  `section` int(11) NOT NULL,
  `instructorID` int(11) NOT NULL,
  `time` varchar(30) NOT NULL,
  `courseID` int(11) NOT NULL,
  `classroomID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Section`
--

INSERT INTO `Section` (`ID`, `section`, `instructorID`, `time`, `courseID`, `classroomID`) VALUES
(1, 1, 1, 'Çarşamba- 14.00-16.50', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Sensors`
--

CREATE TABLE `Sensors` (
  `ID` int(11) NOT NULL,
  `Tempature` int(11) NOT NULL,
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
  `name` varchar(15) NOT NULL,
  `departmentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`studentNumber`, `name`, `departmentID`) VALUES
(41501008, 'Yusuf Tufekci', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classroom`
--
ALTER TABLE `classroom`
  ADD PRIMARY KEY (`ClassroomID`);

--
-- Indexes for table `Courses`
--
ALTER TABLE `Courses`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `departmentFK5` (`departmentID`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `facultyFK` (`facultyID`);

--
-- Indexes for table `Enrollment`
--
ALTER TABLE `Enrollment`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `sectionFK2` (`sectionID`),
  ADD KEY `studentFK` (`studentID`);

--
-- Indexes for table `Faculty`
--
ALTER TABLE `Faculty`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Instructor`
--
ALTER TABLE `Instructor`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `departmentFK2` (`departmentID`);

--
-- Indexes for table `Section`
--
ALTER TABLE `Section`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ınstructorFK2` (`instructorID`),
  ADD KEY `courseFK4` (`courseID`),
  ADD KEY `classroomFK2` (`classroomID`);

--
-- Indexes for table `Sensors`
--
ALTER TABLE `Sensors`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `classroomFK4` (`classroomID`);

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
-- Constraints for table `Courses`
--
ALTER TABLE `Courses`
  ADD CONSTRAINT `departmentFK5` FOREIGN KEY (`departmentID`) REFERENCES `department` (`ID`);

--
-- Constraints for table `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `facultyFK` FOREIGN KEY (`facultyID`) REFERENCES `Faculty` (`ID`);

--
-- Constraints for table `Enrollment`
--
ALTER TABLE `Enrollment`
  ADD CONSTRAINT `sectionFK2` FOREIGN KEY (`sectionID`) REFERENCES `Section` (`ID`),
  ADD CONSTRAINT `studentFK` FOREIGN KEY (`studentID`) REFERENCES `student` (`studentNumber`);

--
-- Constraints for table `Instructor`
--
ALTER TABLE `Instructor`
  ADD CONSTRAINT `departmentFK2` FOREIGN KEY (`departmentID`) REFERENCES `department` (`ID`);

--
-- Constraints for table `Section`
--
ALTER TABLE `Section`
  ADD CONSTRAINT `classroomFK2` FOREIGN KEY (`classroomID`) REFERENCES `classroom` (`ClassroomID`),
  ADD CONSTRAINT `courseFK4` FOREIGN KEY (`courseID`) REFERENCES `Courses` (`ID`),
  ADD CONSTRAINT `ınstructorFK2` FOREIGN KEY (`instructorID`) REFERENCES `Instructor` (`ID`);

--
-- Constraints for table `Sensors`
--
ALTER TABLE `Sensors`
  ADD CONSTRAINT `classroomFK4` FOREIGN KEY (`classroomID`) REFERENCES `classroom` (`ClassroomID`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `departmentFK3` FOREIGN KEY (`departmentID`) REFERENCES `department` (`ID`);