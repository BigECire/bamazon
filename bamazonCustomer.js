var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "PYP02kky",

    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {
            var showData = [
                "ID: " + results[i].id,
                "Prduct Name: " + results[i].product_name,
                "Price: " + results[i].price,
                "---------------------------------------"
            ].join("\n");

            console.log(showData)
        }

        inquirer
            .prompt([{
                name: "item",
                type: "number",
                message: "What is the ID of the product you would like to purchase?"
            },
            {
                name: "quantity",
                type: "number",
                message: "how many you would like to purchase?"
            }])
            .then(function (answer) {
                connection.query("SELECT * FROM products", function (err, results) {
                    if (err) throw err;
                    var chosenItem;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].id === answer.item) {
                            chosenItem = results[i];
                        }
                    }

                    if (answer.quantity <= chosenItem.stock_quantity) {
                        var newStock = chosenItem.stock_quantity - answer.quantity;
                        var sales = chosenItem.product_sales + (answer.quantity * chosenItem.price)
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: newStock,
                                    product_sales: sales
                                },
                                {
                                    id: chosenItem.id
                                }
                            ],
                            function (error) {
                                if (error) throw err;
                                console.log("Your purchase was successfully! \nYou owe $" + sales + ".");
                                start();
                            }
                        );
                    }
                    else{
                        console.log("Insufficient stock!");
                        start();
                    }
                });
            });
    })
}
