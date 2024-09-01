--Creates Function
--give new id to new customer
CREATE FUNCTION GetUIDCustomer() 
RETURNS INT
AS 
BEGIN
    DECLARE @NewUID INT;
    SELECT @NewUID = ISNULL(MAX(ID), 0) + 1 FROM Customers; 
    RETURN @NewUID; -- Return the new UID
END;
go;
--check if phone exist
CREATE FUNCTION IsPhoneExist(@VarPhoneNumber VARCHAR(255)) 
RETURNS BIT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Customers WHERE PhoneNumber = @VarPhoneNumber)
        RETURN 1;

    RETURN 0;
END;
GO
--check if phone exist on spesific user
CREATE FUNCTION IsPhoneExistWithID(@VarPhoneNumber VARCHAR(255),@ID int) 
RETURNS BIT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Customers WHERE PhoneNumber = @VarPhoneNumber and ID=@ID)
        RETURN 1;

    RETURN 0;
END;
GO
----check if email exist
CREATE Function IsMailExist(@VarEmail VARCHAR(255)) 
Returns BIt
AS BEGIN
    IF EXISTS (SELECT 1 FROM Customers WHERE Email = @VarEmail)
        RETURN 1; 
    
        RETURN 0; 
END;
go;
----check if email exist
CREATE Function IsMailExistWithID(@VarEmail VARCHAR(255),@ID int)
Returns BIt
AS BEGIN
    IF EXISTS (SELECT 1 FROM Customers WHERE Email = @VarEmail and ID=@ID)
        RETURN 1; 
    
        RETURN 0; 
END;
go;
