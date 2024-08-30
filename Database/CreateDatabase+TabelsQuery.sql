CREATE DATABASE PasswordProtectorDB;
---------------------------------------create tables
CREATE TABLE Tokens (
    ID INT NOT NULL PRIMARY KEY, -- UID number for tokens
    Token VARCHAR(64), -- The Token
    BackupUID VARCHAR(64) -- Uid that can be shared with the user
);
CREATE TABLE Passwords(
    ID INT NOT NULL PRIMARY KEY, -- UID number for Passwords
    Website VARCHAR(255), -- URL to the login page of the website
    ChangedCount INT, -- Counter of the amount of times that the password is changed
    UsedCount INT, -- Counter of the amount of times that the password is used
    TokenID INT, -- Foreign Key UID number for Tokens
    [Password] VARCHAR(64), -- The password
    WebsiteLoginText VARCHAR(255), -- Stores email/phone number/username, whatever the website needs for login
    BackupUID VARCHAR(64), -- Uid that can be shared with the user
    FOREIGN KEY (TokenID) REFERENCES Tokens(ID) -- Foreign key references Tokens table
);
CREATE TABLE Customers (
    ID INT NOT NULL PRIMARY KEY, -- UID number for customers
    FirstName VARCHAR(255), -- First name
    LastName VARCHAR(255), -- Last name
    PhoneNumber VARCHAR(255), -- Phone number
    Email VARCHAR(255), -- Email
    [2FA] bit, -- If 2FA is enabled
    UserKey VARCHAR(64), -- User-entered value that is the root for encryption (avoid using "Key")
    JsonKey VARCHAR(64), -- Key for decryption of JSON files
    BackupUID VARCHAR(36), -- UID that can be shared with the user
    TokenID INT, -- Foreign Key UID number for Tokens
    FOREIGN KEY (TokenID) REFERENCES Tokens(ID) -- Foreign key references Tokens table
);
CREATE TABLE LastLogin(
	CustomerID INT NOT NULL PRIMARY KEY, -- UID number for customers
	LastToken VarChar(36),
	ExpiredDate Date,
	LastIP Varchar(15),
	LastOperatingSystem VarChar(64),
	LastLocation VarChar(64),
	FOREIGN KEY (CustomerID) REFERENCES Customers(ID)
);