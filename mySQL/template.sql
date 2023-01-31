-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 30, 2023 at 06:27 PM
-- Server version: 10.5.18-MariaDB-cll-lve
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ardalanj_klover`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `entry_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `email`, `entry_date`) VALUES
(1, 'a.aljaf@gmail.com', '2022-12-08 19:03:44');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL COMMENT 'eg. 4000 = £40.00	',
  `redeemed` int(11) NOT NULL COMMENT '0=no 1=yes',
  `entry_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `redeemed_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `amount`, `redeemed`, `entry_date`, `redeemed_date`) VALUES
(1, 'TESTCODE', 4000, 0, '2022-12-07 22:32:41', '0000-00-00 00:00:00'),
(2, 'AL-V531Y6', 4000, 0, '2022-12-08 19:45:41', '2022-12-08 19:45:41'),
(3, 'AL-C1K5PD', 4000, 0, '2022-12-14 21:16:59', '2022-12-14 21:16:59'),
(4, 'AL-9D41FS', 4000, 0, '2022-12-14 22:08:24', '2022-12-14 22:08:24'),
(5, 'AL-PTZH91', 4000, 0, '2022-12-14 22:54:50', '2022-12-14 22:54:50'),
(6, 'AL-134K45', 4000, 0, '2022-12-14 23:18:16', '2022-12-14 23:18:16');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `entry_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `username`, `password`, `entry_date`) VALUES
(1, 'klover_admin', 'klj1n24kln1!@#ajklnf', '2022-12-07 22:34:59');

-- --------------------------------------------------------

--
-- Table structure for table `prices`
--

CREATE TABLE `prices` (
  `id` int(11) NOT NULL,
  `pre_assessment` int(11) NOT NULL COMMENT 'price in pence (4000 = £40.00)	',
  `assessment` int(11) NOT NULL COMMENT 'price in pence (4000 = £40.00)	',
  `docs` int(11) NOT NULL COMMENT 'price in pence (4000 = £40.00)',
  `entry_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `prices`
--

INSERT INTO `prices` (`id`, `pre_assessment`, `assessment`, `docs`, `entry_date`) VALUES
(1, 15000, 30000, 5000, '2023-01-30 16:57:53');

-- --------------------------------------------------------

--
-- Table structure for table `timeslots`
--

CREATE TABLE `timeslots` (
  `id` int(11) NOT NULL,
  `day` int(11) NOT NULL COMMENT '0=Sunday, 6=Saturday	',
  `hour` int(11) NOT NULL,
  `minutes` int(11) NOT NULL,
  `entry_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `timeslots`
--

INSERT INTO `timeslots` (`id`, `day`, `hour`, `minutes`, `entry_date`) VALUES
(1, 1, 18, 0, '2022-12-07 23:01:10'),
(7, 5, 14, 30, '2022-12-15 00:33:08'),
(8, 3, 18, 0, '2022-12-15 00:35:00'),
(4, 5, 15, 45, '2022-12-07 23:01:58');

-- --------------------------------------------------------

--
-- Table structure for table `timeslot_options`
--

CREATE TABLE `timeslot_options` (
  `id` int(11) NOT NULL,
  `fixed_max` int(11) NOT NULL COMMENT '0=false (latest appointment available determined by noOfWeeks). 1=true (latest appointment available determined by maxDate).',
  `no_of_weeks` int(11) NOT NULL,
  `max_date_year` int(11) NOT NULL,
  `max_date_month` int(11) NOT NULL COMMENT '0 = Jan... 11 = Dec',
  `max_date_date` int(11) NOT NULL,
  `cushion_days` int(11) NOT NULL COMMENT 'earliest an appointment is available from current day',
  `entry_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `timeslot_options`
--

INSERT INTO `timeslot_options` (`id`, `fixed_max`, `no_of_weeks`, `max_date_year`, `max_date_month`, `max_date_date`, `cushion_days`, `entry_date`) VALUES
(1, 0, 4, 2022, 11, 31, 2, '2022-12-07 22:43:33');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `entry_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `user_id`, `token`, `entry_date`) VALUES
(52, 1, 'g8v97XGNkyABP3h3Glh6U9EW1REQenGPmLnkuyLZFGYd6iK8V4Q8GF8PsSL6lyLSUICxBZfbgl84jQQay2Uwv6z9VneVd4dAzX3lN1VPdqFeNcL9Ygz1675097840616', '2023-01-30 16:57:20');

-- --------------------------------------------------------

--
-- Table structure for table `unavailability`
--

CREATE TABLE `unavailability` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL COMMENT '0=specific timeslot, 1=single day, 2=range of days',
  `time` bigint(255) NOT NULL COMMENT 'UTC time',
  `date_range_end` bigint(255) DEFAULT NULL COMMENT 'UTC time',
  `entry_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `unavailability`
--

INSERT INTO `unavailability` (`id`, `type`, `time`, `date_range_end`, `entry_date`) VALUES
(38, 0, 1676039400000, NULL, '2023-01-30 17:27:52'),
(37, 0, 1675706400000, NULL, '2023-01-30 17:25:00'),
(36, 0, 1675434600000, NULL, '2023-01-30 17:21:40'),
(34, 0, 1675439100000, NULL, '2023-01-30 17:08:38'),
(35, 0, 1676043900000, NULL, '2023-01-30 17:16:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prices`
--
ALTER TABLE `prices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `timeslots`
--
ALTER TABLE `timeslots`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `timeslot_options`
--
ALTER TABLE `timeslot_options`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `unavailability`
--
ALTER TABLE `unavailability`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `prices`
--
ALTER TABLE `prices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `timeslots`
--
ALTER TABLE `timeslots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `timeslot_options`
--
ALTER TABLE `timeslot_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `unavailability`
--
ALTER TABLE `unavailability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
