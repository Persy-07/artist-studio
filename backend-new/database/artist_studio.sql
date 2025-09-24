-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 23 sep. 2025 à 14:45
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `artist_studio`
--

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(7) DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id`, `name`, `description`, `color`, `created_at`) VALUES
(1, 'Pop', 'Musique pop moderne', '#8B5CF6', '2025-09-10 02:33:21'),
(2, 'Rock', 'Rock alternatif et classique', '#EC4899', '2025-09-10 02:33:21'),
(3, 'Electronic', 'Musique électronique', '#06B6D4', '2025-09-10 02:33:21'),
(4, 'Acoustic', 'Musique acoustique', '#10B981', '2025-09-10 02:33:21');

-- --------------------------------------------------------

--
-- Structure de la table `song`
--

CREATE TABLE `song` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `artist` varchar(100) NOT NULL,
  `duration` varchar(10) NOT NULL,
  `description` text NOT NULL,
  `category_id` int(11) NOT NULL,
  `audio_file` varchar(255) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 1,
  `play_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `song`
--

INSERT INTO `song` (`id`, `title`, `artist`, `duration`, `description`, `category_id`, `audio_file`, `cover_image`, `created_at`, `updated_at`, `is_published`, `play_count`) VALUES
(1, 'Mélodie du Cœur', 'Artist Studio', '3:45', 'Une chanson touchante qui explore les émotions profondes du cœur humain. Cette composition mélange des sonorités pop modernes avec des arrangements classiques.', 1, NULL, NULL, '2025-09-10 02:33:21', NULL, 1, 5),
(2, 'Rêves d\'Étoiles', 'Artist Studio', '4:20', 'Un voyage musical à travers les rêves et l\'espoir. Cette pièce acoustique invite à la contemplation et au voyage intérieur.', 4, NULL, NULL, '2025-09-10 02:33:21', NULL, 1, 4),
(3, 'Voyage Intérieur', 'Artist Studio', '3:12', 'Une exploration sonore de notre monde intérieur avec des beats électroniques envoûtants et des mélodies hypnotiques.', 3, NULL, NULL, '2025-09-10 02:33:21', NULL, 1, 1),
(4, 'L\'Horizon', 'Artist Studio', '5:01', 'Un rock puissant qui parle de nouveaux horizons et de dépassement de soi. Guitares énergiques et paroles inspirantes.', 2, NULL, NULL, '2025-09-10 02:33:21', NULL, 1, 0),
(5, 'Danse de Minuit', 'Artist Studio', '4:15', 'Un rythme entraînant pour les nuits magiques. Fusion parfaite entre électronique et pop pour faire danser.', 3, NULL, NULL, '2025-09-10 02:33:21', NULL, 1, 2),
(6, 'mon amour', 'Moise DJITTE', '4H20', 'l\'amour de ma vie', 4, NULL, NULL, '2025-09-18 20:43:22', NULL, 1, 2),
(10, 'La vie en rose ', 'OMAR PEN', '3H30', 'la parole de DIEU , la vie ; la santé sont les meilleurs cadeau  au monde ', 2, NULL, NULL, '2025-09-18 21:54:47', NULL, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(180) NOT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`roles`)),
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `roles`, `password`, `first_name`, `last_name`, `created_at`, `is_active`) VALUES
(2, 'menayameperside3@gmail.com', '[\"ROLE_USER\"]', '$2y$10$nITsLMlLC7Z2fGXKc54bb.vAp5msz96LjvJS9OcUGjGpGhfVZZ/z6', 'Perside', 'MENAYAME MANSANGA', '2025-09-17 01:42:31', 1),
(3, 'demo@artiststudio.com', '[\"ROLE_USER\"]', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo', 'User', '2025-09-17 14:24:39', 1),
(4, 'marwanacim@gmail.com', '[\"ROLE_USER\"]', '$2y$10$GsQupDSkLikX6.yzuwcvs.nvg6zYkEpko53KRd01Abwz82G9s9SL2', 'Marwa', 'NACIM SAYED', '2025-09-17 14:35:20', 1),
(5, 'admin@artiststudio.com', '[\"ROLE_ADMIN\"]', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Demo', '2025-09-17 15:36:55', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `song`
--
ALTER TABLE `song`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `song`
--
ALTER TABLE `song`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `song`
--
ALTER TABLE `song`
  ADD CONSTRAINT `song_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
