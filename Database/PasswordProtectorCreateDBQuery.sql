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
    --@VarBackupUID VARCHAR(64),
    @Message VARCHAR(255) OUTPUT -- Add OUTPUT parameter for status message
) 
AS
BEGIN
	DECLARE @ExpDate date;
	DECLARE @LoginToken VARCHAR(36);
	DECLARE @BackupUID VARCHAR(36);
    DECLARE @NewUID INT;
	PRINT 'Stored Procedure Called'; -- Debugging: Check if the procedure is called
	set @ExpDate =GETDATE()
	PRINT @ExpDate
	set @ExpDate = DATEADD(DAY, 1, GETDATE())
	PRINT @ExpDate
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
	EXEC GetNewUID @BackupUID OUTPUT;
	EXEC GetNewUID @LoginToken OUTPUT;
    -- Insert new customer if email and phone number don't exist
    INSERT INTO Customers (ID, FirstName, LastName, PhoneNumber, Email, [2FA], UserKey, JsonKey, BackupUID, TokenID)
    VALUES (@NewUID, @VarFirstName, @VarLastName, @VarPhoneNumber, @VarEmail, @Var2FA, @VarUserKey, @VarJsonKey,@BackupUID, NULL);
    --insert value into last login
	INSERT INTO LastLogin (CustomerID,LastToken,ExpiredDate,LastIP,LastOperatingSystem,LastLocation)
	VALUES(@NewUID,@LoginToken,@ExpDate,'0.0.0.0','WIN10','israel')




    SET @Message = 'Customer signed up successfully.';
END;
-- Example of calling the function to sign up a new customer
EXEC SignUp 'John', 'Doe', '1234567890', 'john.doe@example.com', 0, 'UserKey123', 'JsonKey123',null;
select * from Customers
select * from LastLogin
DELETE from Customers;
SELECT * FROM sys.database_permissions WHERE grantee_principal_id = USER_ID('NodeJsServer');

---------------
CREATE PROCEDURE GetNewUID
    @NewUIDString VARCHAR(36) OUTPUT -- Define the output parameter
AS
BEGIN
    SET @NewUIDString = CONVERT(VARCHAR(64), NEWID());
END;
GO
--Example of calling the function to get new uid
DECLARE @BackupUID VARCHAR(36);
EXEC GetNewUID @BackupUID OUTPUT;
SELECT @BackupUID;

CREATE PROCEDURE loginWithToken
    @LoginToken VARCHAR(36),
    @BackupUID VARCHAR(36) OUTPUT,
    @Message VARCHAR(255) OUTPUT
AS
BEGIN
    DECLARE @CustomerID INT;
    DECLARE @CurrentDate DATE;

    -- Get today's date
    SET @CurrentDate = GETDATE();

    -- Check if the LoginToken exists and retrieve the associated CustomerID and ExpiredDate
    SELECT @CustomerID = CustomerID, @BackupUID = Customers.BackupUID
    FROM LastLogin 
    INNER JOIN Customers ON LastLogin.CustomerID = Customers.ID
    WHERE LastLogin.LastToken = @LoginToken;

    -- If no matching token was found
    IF @CustomerID IS NULL
    BEGIN
        SET @Message = 'Login failed: Invalid token.';
        RETURN;
    END

    -- Check if the token is expired
    IF EXISTS (SELECT 1 FROM LastLogin WHERE CustomerID = @CustomerID AND ExpiredDate < @CurrentDate)
    BEGIN
        SET @Message = 'Login failed: Token expired.';
        RETURN;
    END

    -- If everything is okay, return the BackupUID
    SET @Message = 'Login successful. BackupUID returned.';
END;
GO

DECLARE @ReturnedBackupUID VARCHAR(36);
DECLARE @LoginMessage VARCHAR(255);

-- Call the procedure with a sample token
EXEC loginWithToken 'F76BA6D4-A043-4924-BAE8-09B1D988F208', @ReturnedBackupUID OUTPUT, @LoginMessage OUTPUT;

-- Output the results
SELECT @ReturnedBackupUID AS BackupUID, @LoginMessage AS Message;

CREATE PROCEDURE LoginWithEmail
    @Email VARCHAR(255),
    @LoginToken VARCHAR(36) OUTPUT,
    @Message VARCHAR(255) OUTPUT
AS
BEGIN
    DECLARE @CustomerID INT;
    DECLARE @ExpDate DATE;

    -- Check if the email exists and retrieve the associated CustomerID
    SELECT @CustomerID = ID
    FROM Customers
    WHERE Email = @Email;

    -- If no matching email was found
    IF @CustomerID IS NULL
    BEGIN
        SET @Message = 'Login failed: Email not found.';
        RETURN;
    END

    -- Generate a new LoginToken
    EXEC GetNewUID @LoginToken OUTPUT;

    -- Set the expiration date to tomorrow
    SET @ExpDate = DATEADD(DAY, 1, GETDATE());

    -- Check if the customer already has a record in LastLogin
    IF EXISTS (SELECT 1 FROM LastLogin WHERE CustomerID = @CustomerID)
    BEGIN
        SET @Message = 'Login already exists for this customer. Token will be updated.';
        
        -- Update the existing record with a new token and expiration date
        UPDATE LastLogin
        SET LastToken = @LoginToken, ExpiredDate = @ExpDate
        WHERE CustomerID = @CustomerID;
    END
    ELSE
    BEGIN
        -- Insert a new record into LastLogin if it doesn't exist
        INSERT INTO LastLogin (CustomerID, LastToken, ExpiredDate, LastIP, LastOperatingSystem, LastLocation)
        VALUES (@CustomerID, @LoginToken, @ExpDate, '0.0.0.0', 'WIN10', 'israel');
    END

    -- Return the generated LoginToken
    SET @Message = 'Login successful. LoginToken generated and returned.';
END;
GO

DECLARE @GeneratedLoginToken VARCHAR(36);
DECLARE @LoginMessage VARCHAR(255);

-- Call the procedure with an email
EXEC LoginWithEmail 'john.doe@example.com', @GeneratedLoginToken OUTPUT, @LoginMessage OUTPUT;

-- Output the results
SELECT @GeneratedLoginToken AS LoginToken, @LoginMessage AS Message;