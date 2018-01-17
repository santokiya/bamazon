var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',
    password: 'password',
    database: 'bamazon_db'
});

connection.connect(function(err) {
    if (err) throw err;
    //console.log('connected as id ' + connection.threadId)
    // connection.end()
    inventory();
});

function inventory() {
    connection.query('SELECT * FROM products', function(err, results) {
        if (err) throw err;

        var items = []
        for (var i = 0; i < results.length; i++) {
            items.push(results[i].items_id + " " + results[i].product_name + " - " + results[i].department_name + " $" + results[i].price + " -On hand- " + results[i].stock_quantity)
                // console.log(results[i].items_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity)
        };
        console.log(" ")
        console.log(items)
        console.log(" ");
        console.log("Which items would you like to buy?")
        start();
    });
}

function start() {
    inquirer
        .prompt({
            name: "buyOrQuit",
            type: "list",
            message: "Please select either BUY or QUIT",
            choices: ["BUY", "QUIT"]
        })
        .then(function(answer) {
            if (answer.buyOrQuit.toUpperCase() === 'BUY') {
                buy();
            } else {
                console.log('Thank you for shopping at Bamazon!')
                connection.end();
            }
        });
}

function buy() {
    // query database and select all from products table
    connection.query('SELECT * FROM products', function(err, results) {
        if (err) throw err;
        // prompt the user for what items they would like to buy
        inquirer
            .prompt([{
                    name: "choice",
                    type: "input",
                    choices: function() {
                        var items = []
                        for (var i = 0; i < results.length; i++) {
                            items.push(results[i].items_id + ' ' + results[i].product_name)
                        }
                        return items;
                    },
                    message: "Please input the id number of the item you would like to buy."
                },
                {
                    name: "units",
                    type: "input",
                    message: "How many units would you like to buy?"
                }
            ])

        .then(function(answer) {
            var chosenItem;

            for (var i = 0; i < results.length; i++) {
                if (results[i].items_id + " " + results[i].product_name === answer.choice) {
                    chosenItem = results[i];
                }
            }

            if (chosenItem.stock_quantity <= parseInt(answer.quantity)) {
                console.log(" ")
                console.log("Insuffcient stock on " + chosenItem.product_name + "Try again later!")
                inventory();
            } else {
                connection.query("UPDATE products SET stock_quantity = stock_quantity - " + answer.quantity + " WHERE items_id = " + chosenItem.items_id);

                // console.log(chosenItem.stock_quantity)
                console.log(" ");
                console.log("Your total is " + answer.quantity * chosenItem.price);
                console.log(" ");
                inventory();
            }
        })
    });
}