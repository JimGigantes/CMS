const { connect } = require("http2");
const mysql = require("mysql");
const questions = require('inquirer');

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_db"
});

function prompUser(){
 
  questions
  .prompt([
    {
      type: 'list',
      message: "What would you like to do?",
      choices: [ "Add departments", "Add roles", "Add employees", "View departments","View roles","View employees","Update employee role","Exit"],
      name: 'Selection',
  }
])
  .then((response) => {
    switch(response.Selection){
      case "Add departments":
        addDepartments();                       //done
          break;
      case "Add roles":
         addRoles();                             //done
          break;
      case "Add employees":
        addEmployees();                        //done
          break;
      case "View departments":
        viewDepartments();                   //done                          
          break;
      case "View roles":
        viewRoles();                           //done                 
          break;
      case "View employees":
        viewEmployees()                       //done           
          break;
      case "Update employee role":
          updateEmployeeRole()
          break;
      case "Exit":
          exit()
          break;
  }
  })      
}


function addDepartments(){
 
    questions
    .prompt([
      {
        type: 'input',
        message: "What is the new Department that you would like to add called?",
        name: 'Name',
      }
])
    .then((response) => {
      let query = connection.query("INSERT INTO department SET ?", {
        name: response.Name,
      },
      (err, res) => {
        if(err) throw err;
        console.log(`${res.affectedRows} Department added`);
        
        prompUser();
      })
    })
}

function addRoles(){
  
  questions
  .prompt([
    {
      type: 'input',
      message: 'What is the Title of the new role that you would like to add?',
      name: 'Title',
    },
    {
      type: 'input',
      message: 'What is the Salary of the new role that you would like to add?',
      name: 'Salary',
    },
    {
      type: 'input',
      message: 'What is the department_id of the new role that you would like to add?',
      name: 'department_id',
    }
])
  .then((response) => {
    let query = connection.query("INSERT INTO role SET ?", {
      title: response.Title,
      salary:response.Salary,
      department_id: response.department_id
    },
    (err, res) => {
      if(err) throw err;
      console.log(`${res.affectedRows} Department added`);
      prompUser();
    })
  })

}

function addEmployees(){
 
  questions
  .prompt([
    {
      type: 'input',
      message: 'What is the First Name of the new Employee that you would like to add?',
      name: 'FirstName',
    },
    {
      type: 'input',
      message: 'What is the Last Name of the new Employee that you would like to add?',
      name: 'LastName',
    },
    {
      type: 'input',
      message: 'What is the role_id (possible entries listed above) of the new Employee that you would like to add?',
      name: 'RoleID',
    },
    {
      type: 'input',
      message: 'What is the ID of the manager (possible entries listed above), for the new Employee that you would like to add?',
      name: 'ManagerID',
    }
])
  .then((response) => {
    let query = connection.query("INSERT INTO employee SET ?", {
      first_name: response.FirstName,
      last_name: response.LastName,
      role_id: response.RoleID,
      manager_id: response.ManagerID
    },
    (err, res) => {
      if(err) throw err;
      console.log(`${res.affectedRows}  added to the Employee list`);
      prompUser();
    })
  })

}


function viewDepartments(){
  let query = connection.query("SELECT * FROM department", 
  (err, res) => {
    if(err) throw err;
    console.table(res);
    prompUser();
  })
}

function viewRoles(){
  let query = connection.query("SELECT * FROM role", 
  (err, res) => {
    if(err) throw err;
    console.table(res);
    prompUser();
  })
}

function viewEmployees(){
  let query = connection.query("SELECT * FROM employee", 
  (err, res) => {
    if(err) throw err;
    console.table(res);
    prompUser();
  })
}

function updateEmployeeRole(){
  
  questions
  .prompt([
    {
      type: 'input',
      message: "Which Employee (ID#) would you like to change the role of? ",
      name: 'EmpID',
    },
    {
      type: 'input',
      message: 'Which role would you like them to hold?',
      name: 'Role',
    }
])
  .then((response) => {
    let query = connection.query("UPDATE employee SET ? WHERE ?", [
      {role_id: response.Role},
      {id:response.EmpID}
    ],
    (err, res) => {
      if(err) throw err;
      console.log(`${res.affectedRows} Role Changed`);
      prompUser();
    })
  })

}


function exit(){
  console.log("Thanks for using CMS model no. 9001")
}

prompUser()
