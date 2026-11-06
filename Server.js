var express = require('express');
var app = express();
var fs = require("fs");

var USERS_FILE = __dirname + "/" + "users.json";

// Reads and parses users.json, passing (err, users) to the callback.
function readUsers(callback) {
   fs.readFile(USERS_FILE, 'utf8', function (err, data) {
      if (err) return callback(err);
      try {
         callback(null, JSON.parse(data));
      } catch (parseErr) {
         callback(parseErr);
      }
   });
}

// Returns a copy of the user without the password field.
function withoutPassword(user) {
   var { password, ...safeUser } = user;
   return safeUser;
}

function sendError(res, err) {
   console.error(err);
   res.status(500).json({ error: "Erro ao ler os dados de usuários" });
}

app.get('/listUsers', function (req, res) {
   readUsers(function (err, users) {
      if (err) return sendError(res, err);
      var safeUsers = {};
      for (var key in users) {
         safeUsers[key] = withoutPassword(users[key]);
      }
      res.json(safeUsers);
   });
})

app.get('/listUser/:id', function (req, res) {
   readUsers(function (err, users) {
      if (err) return sendError(res, err);
      var key = "user" + req.params.id;
      if (!Object.prototype.hasOwnProperty.call(users, key)) {
         return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.json(withoutPassword(users[key]));
   });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
