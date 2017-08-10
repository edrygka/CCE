CREATE TABLE users(
    id      INT PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(15) NOT NULL,
    password    VARCHAR(100) NOT NULL,
    email       VARCHAR(25) NOT NULL,
    name        TEXT        NOT NULL
);