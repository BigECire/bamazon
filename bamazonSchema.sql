DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL,
  product_sales INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("laptop", "electronics", 1245, 100), ("t-shirt", "clothing", 22.50, 400), ("TV", "electronics", 600, 140), ("tie", "clothing", 23.40, 100), ("hammer", "tools", 12.95, 1000), ("potato(5 lb.)", "groceries", 4.19, 1500), ("potato peeler", "kitchen", 1.99, 200), ("impact wrench", "tools", 480, 180), ("dozen eggs", "groceries", 1.99, 1000), ("stand mixer", "kitchen", 379, 100), ("cap", "clothing", 12.40, 80), ("blue jeans", "clothing", 12.40, 80);

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs INT NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("electronics", 10000), ("clothing", 2200), ("groceries", 5000), ("kitchen", 2100), ("tools", 2340);
