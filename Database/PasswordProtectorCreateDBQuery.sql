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
    BackupUID VARCHAR(64), -- UID that can be shared with the user
    TokenID INT, -- Foreign Key UID number for Tokens
    FOREIGN KEY (TokenID) REFERENCES Tokens(ID) -- Foreign key references Tokens table
);
---------------------------------------Function
CREATE FUNCTION GetUIDCustomer() 
RETURNS INT
AS 
BEGIN
    DECLARE @NewUID INT;
    SELECT @NewUID = ISNULL(MAX(ID), 0) + 1 FROM Customers; 
    RETURN @NewUID; -- Return the new UID
END;
CREATE Function IsPhoneExist(@VarPhoneNumber VARCHAR(255)) --check if Email already exist
Returns BIt
AS BEGIN
    IF EXISTS (SELECT 1 FROM Customers WHERE PhoneNumber = @VarPhoneNumber)
        RETURN 1; 

        RETURN 0; 
END
CREATE Function IsMailExist(@VarEmail VARCHAR(255)) --check if phone already exist
Returns BIt
AS BEGIN
    IF EXISTS (SELECT 1 FROM Customers WHERE Email = @VarEmail)
        RETURN 1; 
    
        RETURN 0; 
END
-- Get a new customer UID
SELECT dbo.GetUIDCustomer();
-- Check if a phone number exists
SELECT dbo.IsPhoneExist('1234567890');
-- Check if an email exists
SELECT dbo.IsMailExist('example@example.com');
-------------
CREATE PROCEDURE SignUp(
    @VarFirstName VARCHAR(255),
    @VarLastName VARCHAR(255),
    @VarPhoneNumber VARCHAR(255),
    @VarEmail VARCHAR(255),
    @Var2FA bit,
    @VarUserKey VARCHAR(64),
    @VarJsonKey VARCHAR(64),
    @VarBackupUID VARCHAR(64),
    @Message VARCHAR(255) OUTPUT -- Add OUTPUT parameter for status message
) 
AS
BEGIN
    DECLARE @NewUID INT;
	PRINT 'Stored Procedure Called'; -- Debugging: Check if the procedure is called
    -- Check if the email already exists
    IF dbo.IsMailExist(@VarEmail) = 1
    BEGIN
        SET @Message = 'Email already exists. Sign-up failed.';
        RETURN;
    END

    -- Check if the phone number already exists
    IF dbo.IsPhoneExist(@VarPhoneNumber) = 1
    BEGIN
        SET @Message = 'Phone number already exists. Sign-up failed.';
        RETURN;
    END

    -- Get a new unique ID for the customer
    SET @NewUID = dbo.GetUIDCustomer(); -- Call the function to get the new UID

    -- Insert new customer if email and phone number don't exist
    INSERT INTO Customers (ID, FirstName, LastName, PhoneNumber, Email, [2FA], UserKey, JsonKey, BackupUID, TokenID)
    VALUES (@NewUID, @VarFirstName, @VarLastName, @VarPhoneNumber, @VarEmail, @Var2FA, @VarUserKey, @VarJsonKey, @VarBackupUID, NULL);
    
    SET @Message = 'Customer signed up successfully.';
END;
-- Example of calling the function to sign up a new customer
EXEC SignUp 'John', 'Doe', '1234567890', 'john.doe@example.com', 0, 'UserKey123', 'JsonKey123', 'BackupUID123';
select * from Customers
DELETE from Customers;
SELECT * FROM sys.database_permissions WHERE grantee_principal_id = USER_ID('NodeJsServer');
