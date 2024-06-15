
local sqlite3 = require('lsqlite3')
db = db or sqlite3.open_memory()
dbAdmin = require('@rakis/DbAdmin').new(db)

return "OK"

USERS = [[
  CREATE TABLE IF NOT EXISTS Users (
    PID TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    Name TEXT,
    bio TEXT,
    profile_picture_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
]]

PROJECTS = [[
  CREATE TABLE IF NOT EXISTS Projects (
    ID TEXT PRIMARY KEY,
    PID TEXT,
    Title TEXT,
    Body TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PID) REFERENCES Authors(PID)
  );
]]

UPVOTES = [[
  CREATE TABLE IF NOT EXISTS Upvotes (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    PostID TEXT,
    PID TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PostID) REFERENCES Posts(ID),
    FOREIGN KEY (PID) REFERENCES Authors(PID)
  );
]]

function InitDb() 
  db:exec(USERS)
  db:exec(PROJECTS)
  db:exec(UPVOTES)
  return dbAdmin:tables()
end

return InitDb()
