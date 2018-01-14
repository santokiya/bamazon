DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;
DROP TABLE IF EXISTS products;

CREATE TABLE products(
    items_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR (100) NULL,
    department_name VARCHAR (100) NULL, 
    price DECIMAL (10,2) NULL,
    stock_quantity INTEGER NULL,
    PRIMARY KEY (items_id)
);

    USE `bamazon_db`;

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    Values
        ('Charmin toilet paper', 'Bathroom', 75.00, 120);

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    Values
        ('Canon printer', 'Office', 50.00, 15);

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    Values
        ('Boots', 'Shoes', 100.00, 55);

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    Values
        ('Snoopy T-shirt', 'Clothes', 14.99, 60);

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    Values
        ('Ozarka water', 'Beverages', 5.99, 200);



    select *
    From products;