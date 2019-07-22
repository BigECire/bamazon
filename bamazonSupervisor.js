var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "PYP02kky",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "supervisor",
            type: "list",
            message: "Would you like to do today?",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.supervisor === "View Product Sales by Department") {
                connection.query("SELECT departments.department_id, departments.over_head_costs, departments.department_name, SUM(products.product_sales) AS sales FROM products RIGHT JOIN departments ON (departments.department_name = products.department_name) GROUP BY departments.department_id ORDER BY departments.department_id", function (err, results) {
                    if (err) throw err;

                    var table = new Table({
                        head: ["department_id", "department_name", "over_head_costs", "product_sales", "total_profit"]
                        , colWidths: [20, 20, 20, 20, 20]
                    });
                    console.log(results);
                    
                    for (var i = 0; i < results.length; i++) {
                        if(results[i].sales === null){
                            results[i].sales = 0;
                        }

                        table.push(
                            [results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].sales || 0, (results[i].sales - results[i].over_head_costs) || (0 - results[i].over_head_costs)]
                        );
                    }
                    console.log(table.toString());
                    start();
                })
            }
            else if (answer.supervisor === "Create New Department") {

                inquirer
                    .prompt([
                        {
                            name: "department",
                            type: "input",
                            message: "What is the department you would like to add?"
                        },
                        {
                            name: "over_head_costs",
                            type: "number",
                            message: "What is its over head cost?"
                        }
                    ])
                    .then(function (answer) {
                        connection.query(
                            "INSERT INTO departments SET ?",
                            {
                                department_name: answer.department,
                                over_head_costs: answer.over_head_costs
                            },
                            function (err) {
                                if (err) throw err;
                                console.log("The department was added successfully!");
                                start();
                            }
                        );
                    });
            } else {
                connection.end();
            }
        });
}