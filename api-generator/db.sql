-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 26, 2024 at 05:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `api-generator-v2`
--

-- --------------------------------------------------------

--
-- Table structure for table `data_groups`
--

CREATE TABLE `data_groups` (
  `id` int(11) NOT NULL,
  `name` varchar(225) NOT NULL,
  `uuid` varchar(225) NOT NULL,
  `project_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `data_lists`
--

CREATE TABLE `data_lists` (
  `id` int(11) NOT NULL,
  `uuid` varchar(225) NOT NULL,
  `data_group_id` int(11) NOT NULL,
  `data_row_id` int(11) NOT NULL,
  `data_structure_id` int(11) NOT NULL,
  `data_value` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `data_rows`
--

CREATE TABLE `data_rows` (
  `id` int(11) NOT NULL,
  `uuid` varchar(225) NOT NULL,
  `data_group_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `data_structures`
--

CREATE TABLE `data_structures` (
  `id` int(11) NOT NULL,
  `uuid` varchar(225) NOT NULL,
  `name` varchar(225) NOT NULL,
  `data_type` varchar(225) NOT NULL,
  `data_group_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(225) NOT NULL,
  `uuid` varchar(225) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `data_groups`
--
ALTER TABLE `data_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `data_lists`
--
ALTER TABLE `data_lists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `data_group_id` (`data_group_id`),
  ADD KEY `data_row_id` (`data_row_id`),
  ADD KEY `data_structure_id` (`data_structure_id`);

--
-- Indexes for table `data_rows`
--
ALTER TABLE `data_rows`
  ADD PRIMARY KEY (`id`),
  ADD KEY `data_group_id` (`data_group_id`);

--
-- Indexes for table `data_structures`
--
ALTER TABLE `data_structures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `data_group_id` (`data_group_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `data_groups`
--
ALTER TABLE `data_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `data_lists`
--
ALTER TABLE `data_lists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `data_rows`
--
ALTER TABLE `data_rows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `data_structures`
--
ALTER TABLE `data_structures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `data_groups`
--
ALTER TABLE `data_groups`
  ADD CONSTRAINT `data_groups_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_lists`
--
ALTER TABLE `data_lists`
  ADD CONSTRAINT `data_lists_ibfk_1` FOREIGN KEY (`data_group_id`) REFERENCES `data_groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `data_lists_ibfk_2` FOREIGN KEY (`data_row_id`) REFERENCES `data_rows` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `data_lists_ibfk_3` FOREIGN KEY (`data_structure_id`) REFERENCES `data_structures` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_rows`
--
ALTER TABLE `data_rows`
  ADD CONSTRAINT `data_rows_ibfk_1` FOREIGN KEY (`data_group_id`) REFERENCES `data_groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `data_structures`
--
ALTER TABLE `data_structures`
  ADD CONSTRAINT `data_structures_ibfk_1` FOREIGN KEY (`data_group_id`) REFERENCES `data_groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
