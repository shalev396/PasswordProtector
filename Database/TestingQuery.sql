--test function
-- Get a new customer UID
SELECT dbo.GetUIDCustomer();
-- Check if a phone number exists
SELECT dbo.IsPhoneExist('1234567890');
-- Check if an email exists
SELECT dbo.IsMailExist('example@example.com');
-------------PROCEDURE
--test SignUp 
EXEC SignUp 'John', 'Doe', '1234567890', 'john.doe@example.com', 0, 'UserKey123', 'JsonKey123',null;
select * from Customers
select * from LastLogin
DELETE from Customers;
--add premition
SELECT * FROM sys.database_permissions WHERE grantee_principal_id = USER_ID('NodeJsServer');
-- test loginWithToken
DECLARE @ReturnedBackupUID VARCHAR(36);
DECLARE @LoginMessage VARCHAR(255);
EXEC loginWithToken 'F76BA6D4-A043-4924-BAE8-09B1D988F208', @ReturnedBackupUID OUTPUT, @LoginMessage OUTPUT;
SELECT @ReturnedBackupUID AS BackupUID, @LoginMessage AS Message;
--test LoginWithEmail
DECLARE @GeneratedLoginToken VARCHAR(36);
DECLARE @LoginMessage VARCHAR(255);
EXEC LoginWithEmail 'john.doe@example.com', @GeneratedLoginToken OUTPUT, @LoginMessage OUTPUT;
SELECT @GeneratedLoginToken AS LoginToken, @LoginMessage AS Message;
---testGetUidByLoginToken
DECLARE @UID INT;
EXEC GetUidByLoginToken '7DBEFF04-8D0E-45E1-9074-576B26A07EC5',@UID OUTPUT
SELECT @UID; 
-- test UpdateCustomer
DECLARE @Message VARCHAR(255);
DECLARE @OutFirstName VARCHAR(255);
DECLARE @OutLastName VARCHAR(255);
DECLARE @OutPhoneNumber VARCHAR(255);
DECLARE @OutEmail VARCHAR(255);
DECLARE @Out2FA BIT;
DECLARE @OutUserKey VARCHAR(64);
DECLARE @OutJsonKey VARCHAR(64);
DECLARE @OutUID INT;
-- Call the procedure
EXEC UpdateCustomer 
    @VarToken = '19E1E6BD-FA51-436D-81D2-2C503B51CF65',  -- Use the sample token inserted earlier
    @VarFirstName = 'Jane',
    @VarLastName = 'Smith',
    @VarPhoneNumber = '0987654321',
    @VarEmail = 'jane.smith@example.com',
    @Var2FA = 0,
    @VarUserKey = 'NewUserKey456',
    @VarJsonKey = 'NewJsonKey456',
    @Message = @Message OUTPUT,
    @OutFirstName = @OutFirstName OUTPUT,
    @OutLastName = @OutLastName OUTPUT,
    @OutPhoneNumber = @OutPhoneNumber OUTPUT,
    @OutEmail = @OutEmail OUTPUT,
    @Out2FA = @Out2FA OUTPUT,
    @OutUserKey = @OutUserKey OUTPUT,
    @OutJsonKey = @OutJsonKey OUTPUT,
    @OutUID = @OutUID OUTPUT;

-- Check the results
SELECT 
    @Message AS Message,
    @OutFirstName AS FirstName,
    @OutLastName AS LastName,
    @OutPhoneNumber AS PhoneNumber,
    @OutEmail AS Email,
    @Out2FA AS TwoFactorAuth,
    @OutUserKey AS UserKey,
    @OutJsonKey AS JsonKey,
    @OutUID AS UID;
select * from LastLogin

select *from Tokens
select *from Passwords
select *from Customers
select *from LastLogin

INSERT INTO Tokens (ID, Token, BackupUID)
VALUES
(1, 'TOKEN-1', '223BCFE7-408A-4D07-8B0E-DC0E65A066CD'),
(2, 'TOKEN-2', '223BCFE7-408A-4D07-8B0E-DC0E65A066CD'),
(3, 'TOKEN-3', '223BCFE7-408A-4D07-8B0E-DC0E65A066CD'),
(4, 'TOKEN-4', '223BCFE7-408A-4D07-8B0E-DC0E65A066CD'),
(5, 'TOKEN-5', '223BCFE7-408A-4D07-8B0E-DC0E65A066CD');

INSERT INTO Passwords (ID, Website, ChangedCount, UsedCount, TokenID, [Password], WebsiteLoginText, BackupUID)
VALUES
(1, 'https://example1.com', 0, 0, 1, 'password123', 'john.doe@example.com', '223BCFE7-408A-4D07-8B0E-DC0E65A066CD'),
(2, 'https://example2.com', 0, 0, 2, 'password456', 'jane.smith@example.com', '223BCFE7-408A-4D07-8B0E-DC0E65A066CD'),
(3, 'https://example3.com', 0, 0, 3, 'password789', 'shalev@example.com', '223BCFE7-408A-4D07-8B0E-DC0E65A066CD'),
(4, 'https://example4.com', 0, 0, 4, 'passwordabc', 'amit@example.com', '223BCFE7-408A-4D07-8B0E-DC0E65A066CD'),
(5, 'https://example5.com', 0, 0, 5, 'passwordxyz', 'shoval@example.com', '223BCFE7-408A-4D07-8B0E-DC0E65A066CD');

SELECT * FROM Passwords;
SELECT * FROM Tokens;
