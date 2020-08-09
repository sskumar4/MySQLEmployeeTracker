# Project Name: MySQLEmployeeTracker
# Title: Employee Tracker

![video](Assets/employeetracker.gif)

## Table of Contents

<!-- vscode-markdown-toc -->
* 1. [Link repository](#Linktorepository)
* 2. [Introduction](#Introduction)
* 3. [Technologies](#Technologies)
* 4. [Files](#Files)
* 5. [Features](#Features)
* 6. [Installation](Installation)
* 7. [Launch](#Launch)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

##  1. <a name='Linktorepository'></a>Link to repository

* [Repository](https://github.com/sskumar4/MySQLEmployeeTracker)

##  2. <a name='Introduction'></a>Introduction   
Create a command-line application for managing a company’s employees with features to view and manage the departments, roles, and employees in a company using node, inquirer, and MySQL.


##  3. <a name='Technologies'></a>Technologies 
Javascript, nodeJS, console.table, inquirer, mysql

##  4. <a name='Files'></a>Files
Created the following 
SQL files: 
  * eTrackerDB.sql
js files:
  * eTracker.js, eTracker.js

##  5. <a name='Features'></a>Features
  * Used the mysql NPM package to connect to the MySQL database and perform queries.

  * Used InquirerJs NPM package to interact with the user via the command-line.

  * Used console.table to print MySQL rows to the console. 
  
  The command-line application allows users to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles
  
  * Update employee managers

  * View employees by manager

  * Delete departments, roles, and employees

  * View the total utilized budget which is the combined salaries of all employees in that department 

## 6. <a name='Installation'></a>Installation
1. Go to https://github.com/sskumar4/MySQLEmployeeTracker and click on the "Clone or Download" button. 
2. If you don't have the prerequisites installed, type the following:
   * npm install inquirer
   * npm install mysql
   * npm install console-table
3. Then use your Git bash to execute eTracker.js. 
  

## 7. <a name='Launch'></a>Launch

To deploy this on a live system, copy all of the files to your computer and follow the instructions in the "Installtion" section. This is a command-line tool, not one that runs in the browser. There are no live pages to demonstrate.



