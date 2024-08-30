--Creates Stored Procedures
--handle sign up
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
go;
--handle Creation of new uid
CREATE PROCEDURE GetNewUID
    @NewUIDString VARCHAR(36) OUTPUT -- Define the output parameter
AS
BEGIN
    SET @NewUIDString = CONVERT(VARCHAR(64), NEWID());
END;
GO
--handle Login with Token
CREATE PROCEDURE loginWithToken
    @LoginToken VARCHAR(36),
    @FirstName VARCHAR(255) OUTPUT,
    @Message VARCHAR(255) OUTPUT
AS
BEGIN
    DECLARE @CustomerID INT;
    DECLARE @CurrentDate DATE;

    -- Get today's date
    SET @CurrentDate = GETDATE();

    -- Check if the LoginToken exists and retrieve the associated CustomerID and ExpiredDate
    SELECT @CustomerID = CustomerID, @FirstName = Customers.FirstName
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
    SET @Message = 'Login successful. FirstName returned.';
END;
GO
--handle Login with email
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
--handle updatingUser
CREATE PROCEDURE UpdateCustomer(
	@VarToken VARCHAR(36),
    @VarFirstName VARCHAR(255),
    @VarLastName VARCHAR(255),
    @VarPhoneNumber VARCHAR(255),
    @VarEmail VARCHAR(255),
    @Var2FA bit,
    @VarUserKey VARCHAR(64),
    @VarJsonKey VARCHAR(64),
    --@VarBackupUID VARCHAR(64),
	@VarUID INT,
    @Message VARCHAR(255) OUTPUT, -- Add OUTPUT parameter for status message
	@OutFirstName VARCHAR(255) OUTPUT,
    @OutLastName VARCHAR(255) OUTPUT,
    @OutPhoneNumber VARCHAR(255) OUTPUT,
    @OutEmail VARCHAR(255) OUTPUT,
    @Out2FA bit OUTPUT,
    @OutUserKey VARCHAR(64) OUTPUT,
    @OutJsonKey VARCHAR(64) OUTPUT,
    --@VarBackupUID VARCHAR(64) OUTPUT,
	@OutUID INT OUTPUT
) 
AS
BEGIN
	PRINT 'Stored Procedure Called'; -- Debugging: Check if the procedure is called
    -- Check if the email already exists
    IF dbo.IsMailExist(@VarEmail) = 1
    BEGIN
        SET @Message = 'Email already exists. Sign-up failed.';
        RETURN;
    END

    -- Check if the phone number already exists
	-- if his keep
	-- if exiests (not his) not
	-- if new keep 
	--1 0 =0* 'stop' true V
	--0 0 =1* 'keep' false V
	--1 1 =0* 'keep' false V
	--0 1 =0* 'stop?' false
	---------------exeists-------------------------------------------his
    IF ( dbo.IsPhoneExist(@VarPhoneNumber) = 1  and dbo.IsPhoneExistWithID(@VarPhoneNumber,@ID)=0)
    BEGIN
        SET @Message = 'Phone number already exists. Sign-up failed.';
        RETURN;
    END
    -- update customer if email and phone number don't exist
	
    Update Customers
	set FirstName=@VarFirstName, LastName=@VarLastName, PhoneNumber=@VarPhoneNumber, Email =@VarEmail, UserKey=@VarUserKey
	from Customers
	join LastLogin on LastLogin.CustomerID=Customers.ID
    where LastToken=@VarToken
    
    
	SET @OutFirstName=@VarFirstName
	SET @OutLastName=@VarLastName
	SET @OutPhoneNumber=@VarPhoneNumber
	SET @OutEmail=@VarEmail
	SET @Out2FA=@Var2FA
	SET @OutUserKey=@OutUserKey
	SET @OutJsonKey=@VarJsonKey
	SET @OutUID=@VarUID
	SET @Message = 'Customer Updated successfully.';

END;
go;