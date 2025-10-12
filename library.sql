CREATE DATABASE librarydb;
USE librarydb;

CREATE TABLE books (
  book_id INT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100),
  year INT
);

INSERT INTO books VALUES
(101, 'Data Structures and Algorithms', 'Narasimha Karumanchi', 2013),
(102, 'Introduction to Java', 'Herbert Schildt', 2017),
(103, 'Database Management Systems', 'Raghu Ramakrishnan', 2011),
(104, 'Operating System Concepts', 'Silberschatz & Galvin', 2018),
(105, 'Artificial Intelligence', 'Elaine Rich', 2019),
(106, 'Computer Networks', 'Andrew S. Tanenbaum', 2013),
(107, 'Python for Beginners', 'John Zelle', 2017),
(108, 'Programming with C', 'Albert', 2015),
(109, 'Microproceessors', 'John Zelle', 2019),
(110, 'Data Structures & Algorithms', 'Elaine Rich', 2010);
