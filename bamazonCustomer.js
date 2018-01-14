var mysql = require('mysql')
var inquirer = require('inquirer')

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',
    password: 'password',
    database: 'bamazon_db'
})

connection.connect(function(err) {
    if (err) throw err
    console.log('connected as id ' + connection.threadId)
        // connection.end()
    displayItems()
})

function displayItems() {
    connection.query('SELECT * FROM products', function(err, results) {
        if (err) throw err

        var items = []
        for (var i = 0; i < results.length; i++) {
            items.push(results[i].id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity)
            console.log(results[i].id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity)
        }
    })
}

// once you have the items, prompt the user for which they'd like to buy
inquirer
    .prompt([{
            name: 'choice',
            type: 'input',

            message: 'Please input the id number of the item you would like to buy.'
        },
        {
            name: 'units',
            type: 'input',
            message: 'How many units would you like to buy?'
        }
    ])
    .then(function(answer) {
        // get the information of the chosen item
        var chosenItem
        for (var i = 0; i < results.length; i++) {
            if (results[i].item_name === answer.choice) {
                chosenItem = results[i]
            }
        }

        console.log(answer.choice)
        console.log(answer.units)

        connection.query(`SELECT * FROM products WHERE id = ${answer.choice}`, function(err, results) {
            if (err) throw err
            console.log(results)
            console.log(results.stock_quantity)

            if (results[0].stock_quantity < answer.units)
                console.log('Insufficient Quantity')
        })
    })