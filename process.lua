
local sqlite3 = require('lsqlite3')
db = db or sqlite3.open_memory()
dbAdmin = require('@rakis/DbAdmin').new(db)

return "OK"

USERS = [[
  CREATE TABLE IF NOT EXISTS Users (
    PID TEXT PRIMARY KEY,
    Name TEXT, 
  );
]]

PROJECTS = [[
  CREATE TABLE IF NOT EXISTS Projects (
    ID TEXT PRIMARY KEY,
    PID TEXT,
    Title TEXT,
    Tagline TEXT,
    Body TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PID) REFERENCES Authors(PID)
  );
]]

LIKES = [[
  CREATE TABLE IF NOT EXISTS Likes (
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
  db:exec(LIKES)
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
    local ins_r = dbAdmin:exec(string.format([[
      INSERT INTO Users (PID, Name, username, bio, profile_picture_url) VALUES ("%s", "%s", "%s", "%s", "%s");
    ]], msg.From, Name))
    
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
        INSERT INTO Projects (ID, PID, Title, Body, Tagline) VALUES ("%s", "%s", "%s", "%s", "%s", "%s");
      ]], msg.Id, author.PID, msg.Title, msg.ProjectUrl, msg.Tagline. msg.Data ))
      Send({Target = msg.From, Data = "Project Posted."})
      print("New Project Posted")
      return "ok"
    else
      Send({Target = msg.From, Data = "Not Registered" })
      print("Author not registered, can't post")
    end
  end
)

Handlers.add("sidehunt.Projects", function (msg)
  return msg.Action == "Get-Projects"
end,
function (msg)
  local posts = dbAdmin:exec([[
    select p.ID, p.Title, a.Name, p.Body as "Body" from Projects p LEFT OUTER JOIN Users a ON p.PID = a.PID;
  ]])
  print("Listing " .. #posts .. " posts")
  Send({Target = msg.From, Action = "sidehunt.Projects", Data = require('json').encode(posts)})
end
)

Handlers.add("sidehunt.Users", function (msg)
  return msg.Action == "UserList"
end,
function (msg)
  local authors = dbAdmin:exec([[SELECT PID FROM Users]])
  print("Listing " .. #authors .. " authors")
  Send({Target = msg.From, Action = "sidehunt.Users", Data = require('json').encode(authors)})
end
)