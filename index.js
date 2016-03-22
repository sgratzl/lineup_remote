
const express = require('express'),
      sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('db.db');

//init DB
db.get('SELECT count(*) as c FROM sqlite_master WHERE type="table" AND name="dataset"', function(err, result) {
  console.log(result);
  if (result.c > 0) {
    return;
  }
  console.log('init database');
  db.serialize(function() {

    db.run('CREATE TABLE dataset (name TEXT, v1 REAL, v2 REAL, v3 REAL)');
    const stmt = db.prepare('INSERT INTO dataset VALUES (?, ?, ?, ?)');

    for (var i = 0; i < 1000; i++) {
      stmt.run('Row ' + i, Math.random()*100, Math.random()*100, Math.random()*100);
    }

    stmt.finalize();
  });
});


app.use(express.static('public'));

app.get('/data', function(req, res) {
  //row id start with 1
  const indices = req.query.i ? req.query.i.split(',').map(function(a) { return 1+ (+a);}) : [];
  if (indices.length > 0) {
    db.all('SELECT rowid AS id, name, v1, v2, v3 FROM dataset WHERE rowid in ('+indices.join(',')+')', function(err, rows) {
      rows.sort(function(a,b) { return indices.indexOf(a.id) - indices.indexOf(b.id); });
      res.send(rows);
    });
  } else {
    db.all("SELECT rowid AS id, name, v1, v2 , v3 FROM dataset", function(err, rows) {
        res.send(rows);
    });
  }
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
