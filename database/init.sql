-- Database initialization script for MediPredict AI
-- This script creates the database if it doesn't exist

-- Create database
CREATE DATABASE IF NOT EXISTS diagno;

-- Use the database
USE diagno;

-- Note: Using root user for simplicity in development
-- Tables will be auto-created by Spring Boot JPA when the application starts

-- Note: Tables will be auto-created by Spring Boot JPA when the application starts
-- The following are the expected table structures for reference:

/*
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL,
    phone_number VARCHAR(15),
    gender VARCHAR(10),
    age INT,
    medical_history TEXT,
    role VARCHAR(20) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User relatives junction table
CREATE TABLE IF NOT EXISTS user_relatives (
    user_id BIGINT,
    relative_id BIGINT,
    PRIMARY KEY (user_id, relative_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (relative_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Test reports table
CREATE TABLE IF NOT EXISTS test_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    disease_type VARCHAR(20) NOT NULL,
    prediction_result INT NOT NULL,
    probability DOUBLE,
    input_data TEXT,
    prediction_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_test_reports_user_id ON test_reports(user_id);
CREATE INDEX idx_test_reports_disease_type ON test_reports(disease_type);
CREATE INDEX idx_test_reports_created_at ON test_reports(created_at);
*/
