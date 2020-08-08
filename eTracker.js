const inquirer = require("inquirer");

let Database = require("./eTrackerClass.js");

let cTable = require("console.table");



const db = new Database({

    host: "localhost",

    port: 3306,

    user: "root",

    password: "Vetrivelk03#",

    database: "eTracker"

});



/*

  Start of calls to the database 

*/

async function getManagerNames() {

    let query = "SELECT * FROM employee WHERE manager_id IS NULL";



    const rows = await db.query(query);

    //console.log("number of rows returned " + rows.length);

    let employeeNames = [];

    for (const employee of rows) {

        employeeNames.push(employee.first_name + " " + employee.last_name);

    }

    return employeeNames;

}



async function getRoles() {

    let query = "SELECT title FROM role";

    const rows = await db.query(query);

    //console.log("Number of rows returned: " + rows.length);



    let roles = [];

    for (const row of rows) {

        roles.push(row.title);

    }



    return roles;

}



async function getDepartmentNames() {

    let query = "SELECT name FROM department";

    const rows = await db.query(query);

    //console.log("Number of rows returned: " + rows.length);



    let departments = [];

    for (const row of rows) {

        departments.push(row.name);

    }



    return departments;

}



// Given the name of the department, what is its id?

async function getDepartmentId(departmentName) {

    let query = "SELECT * FROM department WHERE department.name=?";

    let args = [departmentName];

    const rows = await db.query(query, args);

    return rows[0].id;

}



// Given the name of the role, what is its id?

async function getRoleId(roleName) {

    let query = "SELECT * FROM role WHERE role.title=?";

    let args = [roleName];

    const rows = await db.query(query, args);

    return rows[0].id;

}



// need to find the employee.id of the named manager

async function getEmployeeId(fullName) {

    // First split the name into first name and last name

    let employee = getFirstAndLastName(fullName);



    let query = 'SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?';

    let args = [employee[0], employee[1]];

    const rows = await db.query(query, args);

    return rows[0].id;

}



async function getEmployeeNames() {

    let query = "SELECT * FROM employee";



    const rows = await db.query(query);

    let employeeNames = [];

    for (const employee of rows) {

        employeeNames.push(employee.first_name + " " + employee.last_name);

    }

    return employeeNames;

}



async function viewAllRoles() {

    console.log("");

    // SELECT * FROM role;

    let query = "SELECT * FROM role";

    const rows = await db.query(query);

    console.table(rows);

    return rows;

}



async function viewAllDepartments() {

    // SELECT * from department;



    let query = "SELECT * FROM department";

    const rows = await db.query(query);

    console.table(rows);

}



async function viewAllEmployees() {

    console.log("");



    // SELECT * FROM employee;

    let query = "SELECT * FROM employee";

    const rows = await db.query(query);

    console.table(rows);

}



async function viewAllEmployeesByDepartment() {

    // View all employees by department

    // SELECT first_name, last_name, department.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);

    console.log("");

    let query = "SELECT first_name, last_name, department.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);";

    const rows = await db.query(query);

    console.table(rows);

}

async function viewAllEmployeesByManager() {
    // View all employees by department

    // SELECT first_name, last_name, department.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);
    const managers = await getManagerNames();
    let query = `SELECT 
  CONCAT(e.first_name, ' ', e.last_name) AS 'Employee Name',
  CONCAT(m.first_name, ' ', m.last_name) AS Manager
FROM
  employee e
INNER JOIN employee m ON 
  m.id = e.manager_id
ORDER BY 
  Manager`;
    // for (i = 0; i < managers.length; i++) {
    //   console.log("manager-name = ", managers[i]);
    //   let manager_id = await getEmployeeId(managers[i]);
    //   let query =
    //     "SELECT employee.id, employee.first_name, employee.last_name,  employee.manager_id FROM employee WHERE employee.manager_id = ?";
    //   let args = [];
    //   args.push(manager_id);
    //   console.log("query", query);
    //   console.log("manager-id", manager_id);
    const rows = await db.query(query);
    console.table(rows);
}

function viewEmployeesByManager() {

    connection.query(sqlqueries.viewEmployeesByManager(), function(err, results) {

        if (err) throw err;

        console.table(results);

        start();

    });

}



// Will return an array with only two elements in it: 

// [first_name, last_name]

function getFirstAndLastName(fullName) {

    // If a person has a space in their first name, such as "Mary Kay", 

    // then first_name needs to ignore that first space. 

    // Surnames generally do not have spaces in them so count the number

    // of elements in the array after the split and merge all before the last

    // element.

    let employee = fullName.split(" ");

    if (employee.length == 2) {

        return employee;

    }



    const last_name = employee[employee.length - 1];

    let first_name = " ";

    for (let i = 0; i < employee.length - 1; i++) {

        first_name = first_name + employee[i] + " ";

    }

    return [first_name.trim(), last_name];

}



async function updateEmployeeRole(employeeInfo) {

    // Given the name of the role, what is the role id?

    // Given the full name of the employee, what is their first_name and last_name?

    // UPDATE employee SET role_id=1 WHERE employee.first_name='Mary Kay' AND employee.last_name='Ash';

    const roleId = await getRoleId(employeeInfo.role);

    const employee = getFirstAndLastName(employeeInfo.employeeName);



    let query = 'UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?';

    let args = [roleId, employee[0], employee[1]];

    const rows = await db.query(query, args);

    console.log(`Updated employee ${employee[0]} ${employee[1]} with role ${employeeInfo.role}`);

}

async function updateEmployeeManager(employeeInfo) {

    // Given the name of the manager, what is the manager id?

    // Given the full name of the employee, what is their first_name and last_name?

    // UPDATE employee SET manager_id=1 WHERE employee.first_name='Mary Kay' AND employee.last_name='Ash';

    const managerId = await getEmployeeId(employeeInfo.manager);

    const employee = getFirstAndLastName(employeeInfo.employeeName);



    let query = 'UPDATE employee SET manager_id=? WHERE employee.first_name=? AND employee.last_name=?';

    let args = [managerId, employee[0], employee[1]];

    const rows = await db.query(query, args);

    console.log(`Updated employee ${employee[0]} ${employee[1]} 's manager as ${employeeInfo.manager}`);

}
/*
//Update  Employee Manager

function updateEmployeeManager() {

    inquirer.prompt([
  
      {
  
        message: "Which employee do you want to update?",
  
        name: "selectedEmployee",
  
        type: "list",
  
        choices: employeeList
  
      },
  
      {
  
        message: "Select their new manager.",
  
        name: "selectedManager",
  
        type: "list",
  
        choices: employeeList
  
      }
  
    ]).then(function (answer) {
  
  
  
      var employeeIdToUpdate = (findEmployeeId(answer.selectedEmployee, employeeListObj)) ? findEmployeeId(answer.selectedEmployee, employeeListObj) : null;
  
  
  
      if (answer.selectedManager === answer.selectedEmployee) {
  
        newManagerId = null;
  
      } else if (findEmployeeId(answer.selectedManager, employeeListObj)) {
  
        newManagerId = findEmployeeId(answer.selectedManager, employeeListObj);
  
      } else {
  
        newManagerId = null;
  
      }
  
  
  
      connection.query(sqlqueries.updateEmployeeManager(newManagerId, employeeIdToUpdate), function (err, results) {
  
        if (err) throw err;
  
        console.log('The manager for ' + answer.selectedEmployee + ' has been changed to ' + answer.selectedManager + '.');
  
        init();
  
      });
  
    });
  
  }
*/
async function addEmployee(employeeInfo) {

    let roleId = await getRoleId(employeeInfo.role);

    let managerId = await getEmployeeId(employeeInfo.manager);



    // INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Bob", "Hope", 8, 5);

    let query = "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";

    let args = [employeeInfo.first_name, employeeInfo.last_name, roleId, managerId];

    const rows = await db.query(query, args);

    console.log(`Added employee ${employeeInfo.first_name} ${employeeInfo.last_name}.`);

}



async function removeEmployee(employeeInfo) {
    const employeeName = getFirstAndLastName(employeeInfo.employeeName);
    // DELETE from employee WHERE first_name="Cyrus" AND last_name="Smith";
    let query = "DELETE from employee WHERE first_name=? AND last_name=?";
    let args = [employeeName[0], employeeName[1]];
    const rows = await db.query(query, args);
    console.log(`Employee removed: ${employeeName[0]} ${employeeName[1]}`);
}

async function removeDepartment(departmentInfo) {

    // DELETE from employee 
    let query = "DELETE from department WHERE name=?";
    let args = [departmentInfo.departmentName];
    //let rows;
    const rows = await db.query(query, args);

    if (rows !== undefined) {
        console.log(`Department removed: ${departmentInfo.departmentName}`);
    } else {
        console.log(`Department cannot be removed because of foreign key references`);
        console.log(`Please remove all rows from role table that reference this department  before retry`);
    }

}

async function removeRole(roleInfo) {
    // DELETE from role 
    let query = "DELETE from role WHERE title=?";
    let args = [roleInfo.title];
    const rows = await db.query(query, args);
    if (rows !== undefined) {
        console.log(`Role removed:  ${roleInfo.title}`);
    } else {
        console.log(`Role cannot be removed because of foreign key references`);
        console.log(
            `Please remove all rows from employee table that reference this role before retry`
        );
    }

}

async function addDepartment(departmentInfo) {

    const departmentName = departmentInfo.departmentName;

    let query = 'INSERT into department (name) VALUES (?)';

    let args = [departmentName];

    const rows = await db.query(query, args);

    console.log(`
            Added department named $ { departmentName }
            `);

}

async function addRole(roleInfo) {

    // INSERT into role (title, salary, department_id) VALUES ("Sales Manager", 100000, 1);

    const departmentId = await getDepartmentId(roleInfo.departmentName);

    const salary = roleInfo.salary;

    const title = roleInfo.roleName;

    let query = 'INSERT into role (title, salary, department_id) VALUES (?,?,?)';

    let args = [title, salary, departmentId];

    const rows = await db.query(query, args);

    console.log(`
            Added role $ { title }
            `);

}

/* 

End of calls to the database

*/

async function mainPrompt() {

    return inquirer

        .prompt([

        {

            type: "list",

            message: "What would you like to do?",

            name: "action",

            choices: [

                "Add department",

                "Add employee",

                "Add role",

                "Remove employee",

                "Remove department",

                "Remove role",

                "Update employee role",

                "Update employee manager",

                "View all departments",

                "View all employees",

                "View all employees by department",

                "View all employees by manager",

                "View all roles",

                "Exit"

            ]

        }

    ])

}



async function getAddEmployeeInfo() {

    const managers = await getManagerNames();

    const roles = await getRoles();

    return inquirer

        .prompt([

        {

            type: "input",

            name: "first_name",

            message: "What is the employee's first name?"

        },

        {

            type: "input",

            name: "last_name",

            message: "What is the employee's last name?"

        },

        {

            type: "list",

            message: "What is the employee's role?",

            name: "role",

            choices: [

                // populate from db

                ...roles

            ]

        },

        {

            type: "list",

            message: "Who is the employee's manager?",

            name: "manager",

            choices: [

                // populate from db

                ...managers

            ]

        }

    ])

}



async function getRemoveEmployeeInfo() {

    const employees = await getEmployeeNames();

    return inquirer

        .prompt([

        {

            type: "list",

            message: "Which employee do you want to remove?",

            name: "employeeName",

            choices: [

                // populate from db

                ...employees

            ]

        }

    ])

}

async function getRemoveDepartmentInfo() {

    const departments = await getDepartmentNames();

    return inquirer

        .prompt([

        {

            type: "list",

            message: "Which department do you want to remove?",

            name: "departmentName",

            choices: [

                // populate from db

                ...departments

            ]

        }

    ])

}


async function getRemoveRoleInfo() {
    const roles = await getRoles();

    return inquirer.prompt([{
        type: "list",

        message: "Which role do you want to remove?",

        name: "title",

        choices: [
            // populate from db

            ...roles,
        ],
    }, ]);
}



async function getDepartmentInfo() {

    return inquirer

        .prompt([

        {

            type: "input",

            message: "What is the name of the new department?",

            name: "departmentName"

        }

    ])

}



async function getRoleInfo() {

    const departments = await getDepartmentNames();

    return inquirer

        .prompt([

        {

            type: "input",

            message: "What is the title of the new role?",

            name: "roleName"

        },

        {

            type: "input",

            message: "What is the salary of the new role?",

            name: "salary"

        },

        {

            type: "list",

            message: "Which department uses this role?",

            name: "departmentName",

            choices: [

                // populate from db

                ...departments

            ]

        }

    ])

}



async function getUpdateEmployeeRoleInfo() {

    const employees = await getEmployeeNames();

    const roles = await getRoles();

    return inquirer

        .prompt([

        {

            type: "list",

            message: "Which employee do you want to update?",

            name: "employeeName",

            choices: [

                // populate from db

                ...employees

            ]

        },

        {

            type: "list",

            message: "What is the employee's new role?",

            name: "role",

            choices: [

                // populate from db

                ...roles

            ]

        }

    ])



}

async function getUpdateEmployeeManagerInfo() {

    const employees = await getEmployeeNames();

    //const roles = await getRoles();

    return inquirer

        .prompt([

        {

            type: "list",

            message: "Which employee do you want to update?",

            name: "employeeName",

            choices: [

                // populate from db

                ...employees

            ]

        },

        {

            type: "list",

            message: "Who is the employee's new manager?",

            name: "manager",

            choices: [

                // populate from db

                ...employees

            ]

        }

    ])



}


async function main() {

    let exitLoop = false;

    while (!exitLoop) {

        const prompt = await mainPrompt();



        switch (prompt.action) {

            case 'Add department':
                {

                    const newDepartmentName = await getDepartmentInfo();

                    await addDepartment(newDepartmentName);

                    break;

                }



            case 'Add employee':
                {

                    const newEmployee = await getAddEmployeeInfo();

                    console.log("add an employee");

                    console.log(newEmployee);

                    await addEmployee(newEmployee);

                    break;

                }



            case 'Add role':
                {

                    const newRole = await getRoleInfo();

                    console.log("add a role");

                    await addRole(newRole);

                    break;

                }



            case 'Remove employee':
                {

                    const employee = await getRemoveEmployeeInfo();

                    await removeEmployee(employee);

                    break;

                }

            case 'Remove department':
                {

                    const department = await getRemoveDepartmentInfo();
                    console.log('Remove department', department);
                    await removeDepartment(department);

                    break;

                }

            case "Remove role":
                {
                    const role = await getRemoveRoleInfo();

                    await removeRole(role);

                    break;
                }



            case 'Update employee role':
                {

                    const employee = await getUpdateEmployeeRoleInfo();

                    await updateEmployeeRole(employee);

                    break;

                }

            case 'Update employee manager':
                {

                    const employee = await getUpdateEmployeeManagerInfo();

                    await updateEmployeeManager(employee);

                    break;

                }



            case 'View all departments':
                {

                    await viewAllDepartments();

                    break;

                }



            case 'View all employees':
                {

                    await viewAllEmployees();

                    break;

                }



            case 'View all employees by department':
                {

                    await viewAllEmployeesByDepartment();

                    break;

                }

            case "View all employees by manager":
                {
                    await viewAllEmployeesByManager();

                    break;
                }



            case 'View all roles':
                {

                    await viewAllRoles();

                    break;

                }



            case 'Exit':
                {

                    exitLoop = true;

                    process.exit(0); // successful exit

                    return;

                }



            default:

                console.log(`
            Internal warning.Shouldn 't get here. action was ${prompt.action}`);

        }

    }

}



// Close your database connection when Node exits

process.on("exit", async function(code) {

    await db.close();

    return console.log(`About to exit with code ${code}`);

});

main();