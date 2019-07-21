DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("item", "walmart", 2.50, 100), ("item2", "walmart", 22.50, 400), ("item3", "walmart", 25.50, 10), ("item4", "walmart", 2.40, 100), ("item5", "walmart", 2.00, 1000);
