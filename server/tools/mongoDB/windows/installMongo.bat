SET location=C:\Users\vinialsl\Documents\mongoDB\mongodb
MKDIR %location%\data
MKDIR %location%\data\db
MKDIR %location%\logs
cd %location%/bin/
mongod.exe -install -rest -logpath=%location%/logs/log.txt -dbpath=%location%/data/db
sc start "MongoDB"