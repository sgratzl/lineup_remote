
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

function rowId2Index(rows) {
  return rows.map(function(d) { return d.id -1; });
}

//return a data view by indices
app.get('/data', function(req, res) {
  //convert to index lookup
  //row id start with 1
  const indices = req.query.i ? req.query.i.split(',').map(function(a) { return 1+ (+a);}) : [];
  if (indices.length > 0) {
    db.all('SELECT rowid AS id, name, v1, v2, v3 FROM dataset WHERE rowid in ('+indices.join(',')+')', function(err, rows) {
      //order by index in the target order
      rows.sort(function(a,b) { return indices.indexOf(a.id) - indices.indexOf(b.id); });
      res.send(rows);
    });
  } else {
    //send all
    db.all("SELECT rowid AS id, name, v1, v2 , v3 FROM dataset", function(err, rows) {
      res.send(rows);
    });
  }
});

//return a random sample of indices
app.get('/sample', function(req, res) {
  //row id start with 1
  const length = parseInt(req.query.length,10) || 100;
  //TODO SQL INJECTION
  db.all('SELECT rowid AS id FROM dataset ORDER BY random() LIMIT '+length, function(err, rows) {
    res.send(rowId2Index(rows));
  });
});


//sorts by the given criteria
app.get('/sort', function(req, res) {
  const asc = req.query._asc === 'true' ? 'ASC': 'DESC';
  const colName = req.query._column;
  //TODO SQL INJECTION
  if (colName) {
    db.all('SELECT rowid AS id FROM dataset ORDER BY '+colName+' '+asc, function(err, rows) {
      res.send(rowId2Index(rows));
    });
  } else {
    //multi criteria -> create a computed score field
    const score = Object.keys(req.query).filter(function(d) { return d[0] !== '_';}).map(function(d) {
      return '(' + d +' * ' + req.query[d] + ') ';
    }).join(' + ');
    console.log(score);
    db.all('SELECT rowid AS id, '+score+' as score FROM dataset ORDER BY score '+asc, function(err, rows) {
      res.send(rowId2Index(rows));
    });
  }
});



app.get('/search', function(req, res) {
  const query = '%'+req.query.query+'%';
  const column = req.query.column;
  //TODO SQL INJECTION
  db.all('SELECT rowid AS id FROM dataset WHERE '+column+' LIKE "'+query+'"', function(err, rows) {
    res.send(rowId2Index(rows));
  });
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
