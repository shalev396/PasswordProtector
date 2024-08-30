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
---test