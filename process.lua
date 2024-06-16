
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

Handlers.add("sidehunt.Register",
  Handlers.utils.hasMatchingTag("Action","Register"),
  function (msg)
    -- print(msg)
    print(msg.Name)
    local userCount = dbAdmin:exec(
      string.format([[SELECT * FROM Users WHERE PID = "%s";]], msg.From)
    )
    print(userCount)

    if #userCount > 0 then
      Send({Target = msg.From, Action = "Registered", Data = "Already Registered"})
      print("User already registered")
      return "Already Registered"
    end

    local Name = msg.Name or 'anon'
    -- local username = msg.username or 'anon'
    -- local bio = msg.bio or 'anon'
    -- local profilePic = msg.profilePic or 'anon'
    local ins_r = dbAdmin:exec(string.format([[
      INSERT INTO Users (PID, Name, username, bio, profile_picture_url) VALUES ("%s", "%s", "%s", "%s", "%s");
    ]], msg.From, Name, "usrname", "bio", "profilePic"))
    
    print(ins_r)

    Send({
      Target = msg.From,
      Action = "sidehunt.Registered",
      Data = "Successfully Registered."
    })

    print("Registered " .. msg.Name)
  end 
)

Handlers.add("sidehunt.Post", 
  function (msg) 
    return msg.Action == "Create-Project"
  end,
  function (msg) 
    -- get user
    local author = dbAdmin:exec(string.format([[
      select PID, Name from Users where PID = "%s";
    ]], msg.From))[1] 
    
    if author then
      -- add message
      dbAdmin:exec(string.format([[
        INSERT INTO Projects (ID, PID, Title, Body) VALUES ("%s", "%s", "%s", "%s");
      ]], msg.Id, author.PID, msg.Title, msg.Data ))
      Send({Target = msg.From, Data = "Project Posted."})
      print("New Project Posted")
      return "ok"
    else
      Send({Target = msg.From, Data = "Not Registered" })
      print("Author not registered, can't post")
    end
  end
)
