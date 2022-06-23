const mysql = require('mysql2');

//http://localhost:8081/poc2?xyz=3

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cdac',
    database: 'wpt',
    port: 3306
});
const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
const { response } = require('express');
app.use(express.static('abc'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(8081, function () {
    console.log("server listening at port 8081...");
});

app.get("/getbook", (req,resp) => {
    let bookno = req.query.bookno;
    console.log("input" + bookno);
    let output = {
        status: false,
        bookdetails: {
            bookno: "",
            bookname: "",
            price: ""
        },
    };
    connection.query("select * from book where bookno=?", [bookno], (err, rows) => {
        console.log(rows);
        if (err) {
            console.log(err);
        } else if (rows.length > 0) {
            output.status = true;
            output.bookdetails = rows[0];

        }
        console.log(output);
        resp.send(output);
    }
    );

});


app.get('/addbook', function (req, resp) {

    let input = {
        bookid: req.query.bookid,
        bookname: req.query.bookname,
        price: req.query.price
    };
    let output = false;
    connection.query("insert into book(bookid,bookname,price) values(?,?,?)"[input.bookid, input.bookname, input.price],
        (err,rows) => {
            if (err) {
                output = err;
                console.log("trouble " + err);
            } else if (rows.affectedRows > 0) {
                output = true;
            }
            console.log(output);
            resp.send(output);
        }
    );
});



