//connecting to the database

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);

    displayItems();

});

function displayItems() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        var displayArray = [];

        for (var i = 0; i < results.length; i++) {
            displayArray.push(results[i].items_id + " " + results[i].product_name + " " + results[i].price + " " + results[i].stock_quantity);
        };
        console.log()
        console.log("Welcome to BAMAzon, we have great deals for you, here is what we have for sale!!!");
        console.log();
        console.log(displayArray);
        console.log();
        console.log("take a look and buy whatever you are interested in.")
        console.log()
        start();
    });
}

function start() {
    //displayItems();
    inquirer
        .prompt({
            name: "buyOrLeave",
            type: "list",
            message: "Would you like to [BUY] or [LEAVE] the store and comeback another time?",
            choices: ["BUY", "LEAVE"]
        })
        .then(function(answer) {
            if (answer.buyOrLeave.toUpperCase() === "BUY") {
                buy();
            } else {
                console.log("Have a nice day, and comeback again!!!")
                connection.end();
            }
        });
}

function buy() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to buy
        inquirer
            .prompt([{
                    name: "choice",
                    type: "list",
                    choices: function() {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].items_id + " " + results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "Which item would you like to buy?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to buy"
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
                console.log("-----------------------------------------------------------------")
                console.log("we have insuffcient items on " + chosenItem.product_name + " please comeback again when we have more in stock!!!");
                displayItems();
            } else {

                connection.query("UPDATE products SET stock_quantity = stock_quantity - " + answer.quantity + " WHERE items_id = " + chosenItem.items_id);

                //console.log(chosenItem.stock_quantity);
                console.log("----------------------------------------------------------------------");
                console.log("Your total price is " + answer.quantity * chosenItem.price + " dollars");
                console.log("----------------------------------------------------------------");
                console.log("Thank you for buying from Bamazon, you comeback now you hear?");
                console.log("-------------------------------------------------------------------")
                displayItems();


            }


        })

    });
}