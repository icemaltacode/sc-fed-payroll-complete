const LIST_MODE = 1;
const ADD_EMPLOYEE_MODE = 2;
const GENERATE_PAYSLIP_MODE = 3;
const VIEW_PAYSLIP_MODE = 4;

let currentEmployee = -1;

document.addEventListener('DOMContentLoaded', function(e) {
    switchMode(ADD_EMPLOYEE_MODE);
}, false);

document.getElementById('frmAddEmployee').addEventListener('submit', function(e) {
    e.preventDefault();
    switchMode(LIST_MODE);
    addEmployee();
    showEmployees();
    document.getElementById('frmAddEmployee').reset();
});

document.getElementById('frmGeneratePayslip').addEventListener('submit', function(e) {
    e.preventDefault();
    switchMode(VIEW_PAYSLIP_MODE);
    showPayslip();
    document.getElementById('frmGeneratePayslip').reset();
});

document.getElementById('btnCancelAddEmployee').addEventListener('click', function(e) {
    switchMode(LIST_MODE);
});

document.getElementById('btnCancelGeneratePayslip').addEventListener('click', function(e) {
    switchMode(LIST_MODE);
});

document.getElementById('btnAddEmployee').addEventListener('click', function(e) {
    switchMode(ADD_EMPLOYEE_MODE);
});

document.getElementById('employeeStandard').addEventListener('click', function(e) {
    document.getElementById('bonusPercentageArea').style.display = "none";
});
document.getElementById('employeeExecutive').addEventListener('click', function(e) {
    document.getElementById('bonusPercentageArea').style.display = "block";
});

function switchMode(mode) {
    document.getElementById('employeeView').style.display = "none";
    document.getElementById('addEmployeeView').style.display = "none";
    document.getElementById('generatePayslipView').style.display = "none";
    document.getElementById('payslipView').style.display = "none";

    switch(mode) {
        case LIST_MODE:
            document.getElementById('employeeView').style.display = "block";
            break;
        case ADD_EMPLOYEE_MODE:
            document.getElementById('addEmployeeView').style.display = "block";
            break;
        case GENERATE_PAYSLIP_MODE:
            document.getElementById('generatePayslipView').style.display = "block";
            break;
        case VIEW_PAYSLIP_MODE:
            document.getElementById('payslipView').style.display = "block";
    }
}

function generatePayslip(emp) {
    currentEmployee = emp;
    switchMode(GENERATE_PAYSLIP_MODE);
    let empObj = Employee.EMPLOYEES[emp];
    document.getElementById('inputEmployee').value = `${empObj.name} ${empObj.surname}`;

    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    document.getElementById('inputMonth').value = monthNames[new Date().getMonth()];

    let inputYear = document.getElementById('inputYear');
    let currentYear = new Date().getFullYear();
    for (let i = currentYear; i > (currentYear - 3); i--) {
        let year = document.createElement('option');
        year.value = i;
        year.text = i;
        inputYear.add(year);
    }

}

function showPayslip() {
    let month = document.getElementById('inputMonth').value;
    let year = document.getElementById('inputYear').value;
    let hoursWorked = document.getElementById('inputHoursWorked').value;
    let ps = Employee.EMPLOYEES[currentEmployee].getPayslip(month, year, hoursWorked);
    switchMode(VIEW_PAYSLIP_MODE);

    document.getElementById('psEmployeeName').innerHTML = `${ps.name} ${ps.surname}`;
    document.getElementById('psEmployeeRate').innerHTML = `€${ps.rate}`;
    document.getElementById('psPeriod').innerHTML = `${ps.month} ${ps.year}`;
    let payslipTable = document.querySelector('#payslipTable tbody');
    let rows = "";

    rows += `
    <tr>
        <th scope="row">Standard Wage</th>
        <td>€${ps.standardPay}</td>
        <td>€${ps.standardTax}</td>
        <td>€${ps.standardNet}</td>
    </tr>
    `;

    if (ps.overtimePay > 0) {
        rows += `
        <tr>
            <th scope="row">Overtime Wage</th>
            <td>€${ps.overtimePay}</td>
            <td>€${ps.overtimeTax}</td>
            <td>€${ps.overtimeNet}</td>
        </tr>
        `;
    }

    if (Employee.EMPLOYEES[currentEmployee] instanceof Executive) {
        rows += `
        <tr>
            <th scope="row">Bonus</th>
            <td>€${ps.bonusPay}</td>
            <td>€${ps.bonusTax}</td>
            <td>€${ps.bonusNet}</td>
        </tr>
        `;
    }

    rows += `
    <tr>
        <th>Total Wage</th>
        <th>€${ps.grossTotal}</th>
        <th>€${ps.totalTax}</th>
        <th>€${ps.netTotal}</th>
    </tr>
    `;
    payslipTable.innerHTML = rows;
}

function addEmployee() {
    let name = document.getElementById('inputName').value;
    let surname = document.getElementById('inputSurname').value;
    let standardRate = document.getElementById('inputStandardRate').value;
    let overtimeRate = document.getElementById('inputOvertimeRate').value;
    let isStandard = document.getElementById('employeeStandard').checked;

    if (isStandard) {
        new Employee(name, surname, standardRate, overtimeRate);
    } else {
        let bonusPercentage = document.getElementById('inputBonusPercentage').value;
        new Executive(name, surname, standardRate, bonusPercentage);
    }
}

function showEmployees() {
    let employeeTable = document.querySelector('.table tbody');

    let rows = '';
    let i = 1;
    for (let emp of Employee.EMPLOYEES) {
        let tableRow = `
        <tr>
            <th scope="row">${i}</th>
            <td>${emp.name}</td>
            <td>${emp.surname}</td>
            <td>${emp.standardRate}</td>
            <td>
                <button type="button" onclick="generatePayslip(${i - 1})" class="btn btn-primary">
                Payslip
                </button>
            </td>
        </tr>
        `;
        rows += tableRow;
        i++;
    }

    employeeTable.innerHTML = rows;
}