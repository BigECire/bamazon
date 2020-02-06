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
    inquirer
        .prompt({
            name: "manager",
            type: "list",
            message: "Would you like to do today?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        })
        .then(function (answer) {
            switch (answer.manager) {
                case "View Products for Sale":
                    connection.query("SELECT * FROM products", function (err, results) {
                        if (err) throw err;

                        for (var i = 0; i < results.length; i++) {
                            var showData = [
                                "ID: " + results[i].id,
                                "Prduct Name: " + results[i].product_name,
                                "Price: " + results[i].price,
                                "Quantity: " + results[i].stock_quantity,
                                "---------------------------------------"
                            ].join("\n");

                            console.log(showData);
                        };
                        start();
                    });
                    break;
                case "View Low Inventory":
                    connection.query("SELECT * FROM products", function (err, results) {
                        if (err) throw err;
                        var numLow = 0;

                        for (var i = 0; i < results.length; i++) {
                            var showData;
                            if (results[i].stock_quantity < 5) {
                                showData = [
                                    "ID: " + results[i].id,
                                    "Prduct Name: " + results[i].product_name,
                                    "Price: " + results[i].price,
                                    "Quantity: " + results[i].stock_quantity,
                                    "---------------------------------------"
                                ].join("\n");
                                numLow++
                                console.log(showData);
                            }

                        };
                        if (numLow === 0) {
                            console.log("All items are well Stocked.");
                        }
                        start();
                    });
                    break;
                case "Add to Inventory":
                    inquirer
                        .prompt([{
                            name: "item",
                            type: "number",
                            message: "What is the ID of the product you would like to restock?"
                        },
                        {
                            name: "addedQuantity",
                            type: "number",
                            message: "How much of the product you would like to restock?"
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

                                var newStock = chosenItem.stock_quantity + answer.addedQuantity;
                                connection.query(
                                    "UPDATE products SET ? WHERE ?",
                                    [
                                        {
                                            stock_quantity: newStock
                                        },
                                        {
                                            id: chosenItem.id
                                        }
                                    ],
                                    function (error) {
                                        if (error) throw err;
                                        console.log("You successfully added " + answer.addedQuantity + " items!");
                                        start();
                                    }
                                );
                            });
                        })
                    break;
                case "Add New Product":
                    var departments = []
                    connection.query("SELECT department_name FROM departments", function (err, results) {
                        if (err) throw err;
                        for (var i = 0; i < results.length; i++) {
                            departments.push( results[i].department_name);
                        }

                        inquirer
                            .prompt([
                                {
                                    name: "item",
                                    type: "input",
                                    message: "What is the name of the product you would like to add?"
                                },
                                {
                                    name: "department",
                                    type: "list",
                                    message: "What department does the product belong to?",
                                    choices: departments
                                },
                                {
                                    name: "price",
                                    type: "number",
                                    message: "What is its price?"
                                },
                                {
                                    name: "stock",
                                    type: "number",
                                    message: "How much would you like to stock?"
                                }
                            ])
                            .then(function (answer) {
                                connection.query(
                                    "INSERT INTO products SET ?",
                                    {
                                        product_name: answer.item,
                                        department_name: answer.department,
                                        price: answer.price,
                                        stock_quantity: answer.stock
                                    },
                                    function (err) {
                                        if (err) throw err;
                                        console.log("The product was added and stocked successfully!");
                                        start();
                                    }
                                );
                            });
                    })
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}