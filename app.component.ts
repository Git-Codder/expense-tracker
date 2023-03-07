import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Alert } from 'selenium-webdriver';
import { User } from './models/user';
import { UserService } from './services/user.service';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
// import { Router } from '@angular/router';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  users: User[];
  userForm: boolean;
  isNewUser: boolean;
  newUser: any = {};
  editUserForm: boolean;
  editedUser: any = {};
  flag: boolean = false
  userpresentFlag = false;
  logFlag: boolean;
  userExits: boolean;
  currentUser: any;
  userPage: boolean;
  signupFlag: boolean;
  loginflag: boolean;
  loginForm: boolean;
  addFlag: boolean;
  dob: Date;
  phn: number;
  probar: number;
  curruser: User;
  url = ''
  incomeTab = ['Salary', "Bonus", "Cash", "Check", "Others"]
  expenseTab = ["Food", "Grocery", "Bills", "Recharges", "Education", "Travel", "Others"]
  selected = new FormControl(0);
  incomeFlag = false;
  static curruser: string;
  expenseFlag = false;
  summaryFlag = false;
  selectedVal: any;
  myuser: any
  selectedIncome = 'Salary'
  selectedExpense = 'Food'
  my2user: any;
  duplica: number;
  currency: string;
  icurrency: string;
  icustomFlag: boolean;
  ecustomFlag: boolean;
  historyFlag = false;
  message: string;
  constructor(private userService: UserService) { }

  //new datavariable
  selectedUser1: string;
  selectedUser2: string;

  feedbackText: string;
  issueText: string;

  allFeedbacks: any
  allIssue: any;

  //new variable for carray balance
  time_arr: String[];
  userSelected_: String;
  dateSelected_: string;

  //deleted user's array
  userDeleted: string[];

  chartData = {
    categories: [],
    income: [],
    expense: []
  };

  ngOnInit() {

    this.users = this.getUsers();
    this.currency = 'INR'
    this.icurrency = 'INR'
    this.logFlag = true;
    this.loginflag = true;
    var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    for (let k = 0; k < i; k++) {
      if (localStorage.getItem(keys[k])[0] != 'd') {
        let new_obj = JSON.parse(localStorage.getItem(keys[k]))

        this.userService.addUser(new_obj);
      }
    }

    // this.users=(values);
    console.log("ng On it");
    // console.log(this.users)
  }

  getUsers(): User[] {
    return this.userService.getUsersFromData();
  }

  showEditUserForm(user: User) {
    if (!user) {
      this.userForm = false;
      return;
    }
    this.editUserForm = true;
    this.editedUser = user;
  }

  showAddUserForm() {
    // resets form if edited user
    if (this.users.length) {
      this.newUser = {};
    }
    this.userForm = true;
    this.isNewUser = true;
    this.loginForm = false;
    // this.createChartColumn();

  }
  showloginForm() {
    if (this.users.length) {
      this.newUser = {};
    }
    this.userForm = false;
    this.isNewUser = true;
    this.loginForm = true;
  }

  saveUser(user: User) {
    var strongpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    var validate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var password = "^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
    var mediumpassword = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
    if (user.firstName.match(validate)) {
      if (user.lastName.match(strongpassword)) {
        let allUsers = this.getUsers()
        this.userExits = false;
        this.signupFlag = false;
        let realName = '';
        let realPassword = '';

        if (user.firstName != 'admin@gmail.com' && user.lastName === user.thirdName) {
          for (let i = 0; i < allUsers.length; i++) {
            if (user.firstName === allUsers[i].firstName) {
              this.userExits = true;
              realName = allUsers[i].firstName;
              realPassword = allUsers[i].lastName;
            }
          }
        }
        else if (user.firstName != 'admin@gmail.com') {
          alert('password mismatch')
          return;
        }
        else if (user.firstName === 'admin@gmail.com') {
          alert('Email already exists')
          return;
        }
        if (this.userExits === true) {

          alert('Email already exists')
          return;
        }
        else {

          if (user.firstName === 'admin@gmail.com') {
            if (user.lastName === 'admin') {
              this.flag = true;
              this.userForm = false;
              this.logFlag = false;
            }
          }
          else {
            if (this.isNewUser) {
              // add a new user
              this.userService.addUser(user);
              user.totalExpense = user.totalIncome = user.expenseCount = user.IncomeCount = 0
              alert('signed in sucessfully');
            }

            this.userForm = false;
            this.loginflag = true;

          }

        }
      }
      else if (user.lastName.match(mediumpassword)) {
        alert('password is medium')
      }
      else if (user.lastName.match(password))
        alert('password is week')
      else {
        alert('password is week')
      }

    }
    else {
      alert('enter valid email address')
    }

  }
  signedup() {
    this.signupFlag = true;

  }
  userloggingout() {
    this.logFlag = true;

    this.userPage = false;

  }
  loggingout() {
    this.flag = false;
    this.logFlag = true;
    this.loginflag = true
    this.userpresentFlag = false;
    this.incomeFlag = false;
    this.expenseFlag = false;
    this.summaryFlag = false
    this.historyFlag = false
  }
  loginPage(mail) {
    this.currentUser = mail;
    this.logFlag = false;
    this.userForm = false;
    this.userPage = true;
  }
  updateUser() {
    this.userService.updateUser(this.editedUser);
    //make updateNotificationFlag = true when admin update any user detail 
    this.editedUser.updateNotification = true;

    this.editUserForm = false;
    this.editedUser = {};


  }
  additionalsave() {


    this.userService.updateUser(this.editedUser);
    this.editUserForm = false;
    this.editedUser = {};

    this.addFlag = false
    this.dob = this.curruser.fourthName;
    this.phn = this.curruser.fifthName
    this.userService.deleteUser(this.curruser);
    this.userService.addUser(this.curruser);
    console.log(this.curruser)

    const fourthName: string = this.curruser.fourthName ? this.curruser.fourthName.toString() : '';
    const fifthName: number = this.curruser.fifthName;
    const sixthName: string = this.curruser.sixthName;

    let count = 0;
    if (fourthName && typeof fourthName === 'string' && fourthName.trim() !== '') {
      count++;
    }
    if (fifthName && typeof fifthName === 'number') {
      count++;
    }
    if (sixthName && typeof sixthName === 'string' && sixthName.trim() !== '') {
      count++;
    }
    if (count === 2) {
      this.probar = 66.66;
    } else if (count === 3) {
      this.probar = 100;
    } else {
      this.probar = 33.33;
    }
  }

  removeUser(user: User) {
    this.userService.deleteUser(user);
    let i = localStorage.length;
    while (i-- > 0) {

      let key = localStorage.key(i);
      if (localStorage.getItem(key)[0] != 'd') {
        console.log(JSON.parse(localStorage.getItem(key)))
        if (JSON.parse(localStorage.getItem(key)).firstName === user.firstName) {
          localStorage.removeItem(key);
        }
      }
    }


    //code to keep track to which user deleted so they can notify
    let keys = Object.keys(localStorage);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] == "deletedUser") {
        this.userDeleted = JSON.parse(localStorage.getItem("deletedUser"));
        break;
      }
    }

    if (this.userDeleted == undefined || this.userDeleted == null) {
      this.userDeleted = [];
    }
    this.userDeleted.push(user.firstName);
    localStorage.setItem("deletedUser", JSON.stringify(this.userDeleted));

    this.updateFeedback_Issue();

  }

  cancelEdits() {
    this.editedUser = {};
    this.editUserForm = false;
  }
  editbutton() {

    this.addFlag = true;


  }
  cancelNewUser() {
    this.newUser = {};
    this.userForm = false;
  }
  validate(user: User) {

    console.log("validate....")


    //code to read deleted user & remove from tack array
    let keys = Object.keys(localStorage);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] == "deletedUser") {
        this.userDeleted = JSON.parse(localStorage.getItem("deletedUser")) || [];
      }
    }

    if (this.userDeleted && this.userDeleted.length > 0) {
      console.log(this.userDeleted);
      const index = this.userDeleted.findIndex(name => name === user.firstName);
      if (index !== -1) {
        this.userDeleted.splice(index, 1); // remove name from array
        localStorage.setItem('deletedUser', JSON.stringify(this.userDeleted)); // update localStorage
        alert('User Deleted!!');
        return;
      }
    }

    //rest code starts

    let allUsers = this.getUsers()

    //make time_arr to show carry balalnce data
    this.time_arr = [];
    for (let i = 0; i < allUsers.length; i++) {
      let a = this.getAllMonthYears(allUsers[i]);
      this.time_arr.push(...a);
    }

    if (this.time_arr != undefined && this.time_arr != null) {
      this.time_arr = [...new Set(this.time_arr)];
    }
    // console.log("time_arra");
    // console.log(this.time_arr)

    this.updateFeedback_Issue();

    console.log('all', allUsers)
    console.log('val', this.users)
    // for (let i = 0; i < allUsers.length; i++) {
    //   let my_obj = JSON.stringify(allUsers[i]);
    //   localStorage.setItem('myObj' + i.toString(), my_obj);
    //   //let new_obj=JSON.parse(localStorage.getItem("myObj"))
    // }

    if (user.firstName === 'admin@gmail.com') {
      if (user.lastName === 'admin') {
        this.flag = true;
        this.loginForm = false;
        this.loginflag = false
        this.logFlag = false;
      }
      else {
        alert('User Already there')
      }
    }
    else {
      let userpresent = false;

      for (let i = 0; i < allUsers.length; i++) {
        if (user.firstName === allUsers[i].firstName && user.lastName === allUsers[i].lastName) {
          userpresent = true;
          this.curruser = allUsers[i];

          if (this.curruser.updateNotification) {
            alert("Your Account has been updated by Admin");
            this.curruser.updateNotification = false;
          }

          console.log("passed...alert");
          //update user Total Income
          [this.curruser.totalIncome, this.curruser.totalExpense] = this.updateTotal(this.curruser);

          //update currusers expense & income date null to default date
          this.updateDots(this.curruser);

          // console.log("Before");
          // console.log(localStorage);
          this.updateUsersData(this.getUsers());
          // console.log("After");
          // console.log(localStorage);


        }
      }

      if (userpresent) {
        this.userpresentFlag = true;
        this.logFlag = false;
        this.loginflag = false;
        this.userForm = false;
        this.loginForm = false;
        this.message = this.curruser.firstName

        const fourthName: string = this.curruser.fourthName ? this.curruser.fourthName.toString() : '';
        const fifthName: number = this.curruser.fifthName;
        const sixthName: string = this.curruser.sixthName;

        let count = 0;
        if (fourthName && typeof fourthName === 'string' && fourthName.trim() !== '') {
          count++;
        }
        if (fifthName && typeof fifthName === 'number') {
          count++;
        }
        if (sixthName && typeof sixthName === 'string' && sixthName.trim() !== '') {
          count++;
        }
        if (count === 2) {
          this.probar = 66.66;
        } else if (count === 3) {
          this.probar = 100;
        } else {
          this.probar = 33.33;
        }

      }
      else {
        alert('user not found')
      }
    }
  }
  readURL(input) {

    // let bannerImage = document.getElementById('bannerImg');
    // let imgData = this.getBase64Image(bannerImage);
    // localStorage.setItem("imgData", imgData);
    // var dataImage = localStorage.getItem('imgData');
    // document.getElementById('tableBanner').setAttribute( 'src','data:image/png;base64,'+dataImage)
    console.log(input)

  }
  sample() {
    console.log('sks')
    document.querySelector('#bannerImg').addEventListener("change", function () {
      const reader = new FileReader();
      //reader.readAsDataURL(this.files[0]);
      reader.addEventListener("load", () => {

        localStorage.setItem("recent-img", reader.result as string)
      })
      reader.readAsDataURL(this.files[0]);
    })
    const recentImageDataUrl = localStorage.getItem("recent-img")
    this.curruser.sixthName = recentImageDataUrl
    document.querySelector('#imgPreview').setAttribute("src", recentImageDataUrl)
    // document.addEventListener("DOMContentLoaded",()=>{
    //   const recentImageDataUrl=localStorage.getItem("recent-img")
    //   // const img=new Image()
    //   // img.src=recentImageDataUrl
    //   // if(recentImageDataUrl){
    //   //   document.querySelector('#imgPreview').setAttribute("src",img.src)
    //   // }
    //   console.log('st',recentImageDataUrl)
    // })
    // if(event.target.file){
    //   var reader=new FileReader()
    //   reader.readAsDataURL(event.target.file[0]);
    //   reader.onload=(event:any)=>{
    //     this.url=(event.target.result)
    //   }
    // }
  }
  sample1() {

    document.querySelector('#bannerImg1').addEventListener("change", function () {
      const reader = new FileReader();
      reader.readAsDataURL(this.files[0]);
      reader.addEventListener("load", () => {

        localStorage.setItem("recent-img", reader.result as string)
      })

    })

    const recentImageDataUrl = localStorage.getItem("recent-img")
    this.editedUser.sixthName = recentImageDataUrl
    document.querySelector('#imgPreview1').setAttribute("src", recentImageDataUrl)
  }
  income() {
    this.icustomFlag = false;
    this.incomeFlag = true;
    this.userpresentFlag = false;
    this.expenseFlag = false;
    this.summaryFlag = false;
    this.historyFlag = false
    this.myuser = {}

  }
  usdConverter() {
    console.log("my2User : ");
    console.log(this.my2user);
    console.log("myUser : ");
    console.log(this.myuser);

    if (this.currency == 'INR') {
      this.currency = 'USD'
      this.my2user[this.selectedExpense] = this.my2user[this.selectedExpense] / 81
    }

    else {
      this.currency = 'INR'
      this.my2user[this.selectedExpense] = this.my2user[this.selectedExpense] * 81
    }
  }
  incomeusdConverter() {
    console.log("my2User : ");
    console.log(this.my2user);
    console.log("myUser : ");
    console.log(this.myuser);
    if (this.icurrency == 'INR') {
      this.icurrency = 'USD'
      this.myuser[this.selectedIncome] = this.myuser[this.selectedIncome] / 81
    }

    else {
      this.icurrency = 'INR'
      this.myuser[this.selectedIncome] = this.myuser[this.selectedIncome] * 81
    }
  }
  expense() {
    this.ecustomFlag = false;
    this.userpresentFlag = false;
    this.incomeFlag = false;
    this.expenseFlag = true;
    this.summaryFlag = false;
    this.historyFlag = false
    this.my2user = {}

  }

  summary() {
    this.userpresentFlag = false;
    this.incomeFlag = false;
    this.expenseFlag = false;
    this.summaryFlag = true;
    this.historyFlag = false
  }
  profile() {
    this.userpresentFlag = true;
    this.incomeFlag = false;
    this.expenseFlag = false;
    this.summaryFlag = false;
    this.historyFlag = false
  }
  onChangeIncome(deviceValue) {

    this.selectedIncome = (deviceValue)
    if (this.selectedIncome === 'Others')
      this.icustomFlag = true;
    else
      this.icustomFlag = false;
  }
  onChangeExpense(deviceValue) {

    this.selectedExpense = (deviceValue)
    if (this.selectedExpense === 'Others')
      this.ecustomFlag = true;
    else
      this.ecustomFlag = false;
  }
  incomesubmit() {
    console.log("income_submit");

    //checked_new condition
    if (this.myuser.income_dot == null) {
      this.myuser.income_dot = "2023-01-01";
    }

    if (this.icurrency == 'USD') {
      this.myuser[this.selectedIncome] = this.myuser[this.selectedIncome] * 81;
    }

    let cou = this.curruser.IncomeCount
    this.curruser['income' + cou.toString()] = (this.myuser)
    if (this.curruser['Bonus']) {
      this.curruser.bonus = this.curruser['Bonus']
    }
    if (this.curruser['Check']) {
      this.curruser.check = this.curruser['Check']
    }
    if (this.curruser['Salary']) {
      this.curruser.salary = this.curruser['Salary']
    }
    if (this.curruser['Cash']) {
      this.curruser.cash = this.curruser['Cash']
    }
    if (this.curruser['Others']) {
      this.curruser.others = this.curruser['Others']
    }
    if (this.myuser.icustom != undefined) {
      this.incomeTab.pop()
      this.incomeTab.push(this.myuser.icustom, 'Others')

    }
    this.curruser.IncomeCount++;
    let cnt = 0;
    console.log("myUser")
    console.log(this.myuser);
    for (let key in this.myuser) {

      if (!key.startsWith('eig') && !key.startsWith('inco') && !(key.startsWith('icust')))
        cnt += this.myuser[key]
      else {
        continue;
      }

    }

    //updateTotalIncome
    this.curruser.totalIncome += cnt;
    this.updateUsersData(this.getUsers());
    this.summary()

  }
  expensesubmit() {

    //checked condition for null date
    if (this.my2user.expence_dot == null) {
      this.my2user.expence_dot = "2023-01-01";
    }

    if (this.currency == 'USD') {
      this.my2user[this.selectedExpense] = this.my2user[this.selectedExpense] * 81;
    }

    let cou = this.curruser.expenseCount
    this.curruser['expense' + cou.toString()] = (this.my2user)
    console.log("expense_submit");
    console.log(this.curruser)
    if (this.curruser['Food']) {
      this.curruser.food = this.curruser['Food']
    }
    if (this.curruser['Grocery']) {
      this.curruser.grocery = this.curruser['Grocery']
    }
    if (this.curruser['Bills']) {
      this.curruser.bills = this.curruser['Bills']
    }
    if (this.curruser['Recharges']) {
      this.curruser.recharge = this.curruser['Recharges']
    }
    if (this.curruser["Eduaction"]) {
      this.curruser.education = this.curruser['Education']
    }
    if (this.my2user.ecustom != undefined) {
      this.expenseTab.pop()
      this.expenseTab.push(this.my2user.ecustom, 'Others')

    }
    if (this.curruser["Travel"]) {
      this.curruser.travel = this.curruser['Travel']
    }
    this.curruser.expenseCount++;
    let cnt = 0;
    for (let key in this.my2user) {

      if (!key.startsWith('sev') && !key.startsWith('inco') && !key.startsWith('expen') && !(key.startsWith('ecust')))
        cnt += this.my2user[key]
      else {
        continue;
      }

    }
    this.curruser.totalExpense += cnt;
    this.updateUsersData(this.getUsers());
    this.summary()
  }


  history() {
    this.userpresentFlag = false;
    this.incomeFlag = false;
    this.expenseFlag = false;
    this.summaryFlag = false;
    this.historyFlag = true;
    console.log("history_called")
  }

  //new functino added 
  updateUsersData(allUsers: any) {
    // console.log("Before...");
    // console.log(allUsers);
    for (let i = 0; i < allUsers.length; i++) {
      let my_obj = JSON.stringify(allUsers[i]);
      localStorage.setItem('myObj' + i.toString(), my_obj);
      //let new_obj=JSON.parse(localStorage.getItem("myObj"))
    }
    // console.log("After.....")
    // console.log(allUsers);
  }

  //update totalIncome & totalExpenses
  updateTotal(user: any) {
    let totalIncome = 0;
    for (let i = 0; i < user.IncomeCount; i++) {
      let key0 = "income" + i.toString();
      for (let key in user[key0]) {
        if (!key.startsWith('eig') && !key.startsWith('inco') && !(key.startsWith('icust')))
          totalIncome += (isNaN(parseInt(user[key0][key])) ? 0 : parseInt(user[key0][key]));

        else {
          continue;
        }
      }
    }

    let totalExpense = 0;
    for (let i = 0; i < user.expenseCount; i++) {
      let key0 = "expense" + i.toString();
      for (let key in user[key0]) {
        if (!key.startsWith('sev') && !key.startsWith('inco') && !key.startsWith('expen')) {
          console.log(key0 + "---> " + user[key0][key]);
          totalExpense += (isNaN(parseInt(user[key0][key])) ? 0 : parseInt(user[key0][key]));

        }
        else {
          continue;
        }
      }
    }
    return [totalIncome, totalExpense];

  }

  //update dates of the income & expense
  updateDots(obj: { [key: string]: any }): void {
    let expenseCount = obj.expenseCount;
    for (let i = 0; i <= expenseCount; i++) {
      const key = `expense${i}`;
      if (obj.hasOwnProperty(key) && obj[key] != null) {
        if (obj[key].expence_dot == null || obj[key].expence_dot == undefined) {
          obj[key].expence_dot = "2023-01-01";
        }
      }
    }

    let incomeCount = obj.IncomeCount;
    for (let i = 0; i <= incomeCount; i++) {
      const key = `income${i}`;
      if (obj.hasOwnProperty(key) && obj[key] != null) {
        if (obj[key].income_dot == null || obj[key].income_dot == undefined) {
          obj[key].income_dot = "2023-01-01";
        }
      }
    }
  }

  //compare two users function
  compare(time_status: any) {
    console.log("timeStatus : " + time_status)
    // retrieve data from local storage for both selected users
    const user1Data = this.getUsers().filter((obj) => { return obj.firstName == this.selectedUser1 })[0];
    const user2Data = this.getUsers().filter((obj) => { return obj.firstName == this.selectedUser2 })[0];

    // console.log(user1Data);
    // console.log(user2Data);
    // console.log(this.selectedUser1);
    // console.log(this.selectedUser2);


    console.log("user1Data");
    let a, b, c, d;
    [a, b, c, d] = this.extractArrays(user1Data, time_status);

    [a, b] = this.mergeArrays(a, b);
    [c, d] = this.mergeArrays(c, d);

    let categories1 = [...new Set([...a, ...c])];

    console.log("user2Data");
    let a2, b2, c2, d2;
    [a2, b2, c2, d2] = this.extractArrays(user2Data, time_status);

    [a2, b2] = this.mergeArrays(a2, b2);
    [c2, d2] = this.mergeArrays(c2, d2);

    let categories2 = [...new Set([...a2, ...c2])];

    let categories = [...new Set([...categories1, ...categories2])];
    categories.sort((a, b) => a.localeCompare(b));


    // reset income and expense arrays in chart data
    this.chartData.categories = categories
    this.chartData.income = [b, b2];
    this.chartData.expense = [d, d2];

    // calculate income and expense totals for each category for both users
    // for (const category of this.chartData.categories) {
    //   let user1CategoryTotalIncome = b.reduce((acc, curr) => acc + curr, 0);
    //   let user1CategoryTotalExpense = d.reduce((acc, curr) => acc + curr, 0);
    //   let user2CategoryTotalIncome = b2.reduce((acc, curr) => acc + curr, 0);
    //   let user2CategoryTotalExpense = d2.reduce((acc, curr) => acc + curr, 0);


    //   // for (const key in user1Data) {
    //   //   if (key.includes('income') && user1Data[key][category]) {
    //   //     user1CategoryTotalIncome += user1Data[key][category];
    //   //   } else if (key.includes('expense') && user1Data[key][category]) {
    //   //     user1CategoryTotalExpense += user1Data[key][category];
    //   //   }
    //   // }

    //   // for (const key in user2Data) {
    //   //   if (key.includes('income') && user2Data[key][category]) {
    //   //     user2CategoryTotalIncome += user2Data[key][category];
    //   //   } else if (key.includes('expense') && user2Data[key][category]) {
    //   //     user2CategoryTotalExpense += user2Data[key][category];
    //   //   }
    //   // }

    //   // add totals to chart data
    //   // this.chartData.income.push({
    //   //   name: category,
    //   //   data: [user1CategoryTotalIncome, user2CategoryTotalIncome]
    //   // });
    //   // this.chartData.expense.push({
    //   //   name: category,
    //   //   data: [user1CategoryTotalExpense, user2CategoryTotalExpense]
    //   // });
    // }

    // create stacked bar chart using Highcharts library
    const chart = Highcharts.chart('chart-month' as any, {
      chart: {
        type: 'bar'
      },
      // colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'], // Set the colors array
      title: {
        text: 'Income vs Expense Comparison'
      },
      xAxis: {
        categories: this.chartData.categories
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Amount'
        }
      },
      legend: {
        reversed: true
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      series: [{
        name: this.selectedUser1 + ' Income',
        data: this.chartData.categories.map((value) => {
          let index = a.indexOf(value);
          if (index !== -1) {
            return b[index];
          } else {
            return null;
          }
        }),
      }, {
        name: this.selectedUser1 + ' Expenses',
        data: this.chartData.categories.map((value) => {
          let index = c.indexOf(value);
          if (index !== -1) {
            return d[index];
          } else {
            return null;
          }
        }),
      }, {
        name: this.selectedUser2 + ' Income',
        data: this.chartData.categories.map((value) => {
          let index = a2.indexOf(value);
          if (index !== -1) {
            return b2[index];
          } else {
            return null;
          }
        }),
      }, {
        name: this.selectedUser2 + ' Expenses',
        data: this.chartData.categories.map((value) => {
          let index = c2.indexOf(value);
          if (index !== -1) {
            return d2[index];
          } else {
            return null;
          }
        }),
      }]
    } as any);
  }

  //function to extract array from object
  extractArrays(obj: any, time_status: string): [string[], number[], string[], number[]] {
    const a: string[] = [];
    const b: number[] = [];
    const c: string[] = [];
    const d: number[] = [];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Add 1 because month starts from 0
    const currentDay = currentDate.getDate();


    const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;


    for (let i = 0; i < obj.IncomeCount; i++) {
      const key = `income${i}`;

      const incomeDate = new Date(obj[key]['income_dot']);


      if (time_status === 'day' && (incomeDate.toDateString() === currentDate.toDateString() || incomeDate.toDateString() === previousDate.toDateString())) {
        for (const category in obj[key]) {
          if (category !== "income_dot" && category !== "expense_dot" && category !== "expence_dot") {
            a.push(category);
            b.push(obj[key][category]);
          }
        }
      } else if (time_status === 'week' && incomeDate >= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 14)) {
        for (const category in obj[key]) {
          if (category !== "income_dot" && category !== "expense_dot" && category !== "expence_dot") {
            a.push(category);
            b.push(obj[key][category]);
          }
        }
      } else if (time_status === 'month' && ((incomeDate.getFullYear() === currentYear && incomeDate.getMonth() + 1 === currentMonth) || (incomeDate.getFullYear() === previousYear && incomeDate.getMonth() + 1 === previousMonth))) {
        for (const category in obj[key]) {
          if (category !== "income_dot" && category !== "expense_dot" && category !== "expence_dot") {
            a.push(category);
            b.push(obj[key][category]);
          }
        }
      } else if (time_status === 'ok') {
        for (const category in obj[key]) {
          if (category !== "income_dot" && category !== "expense_dot" && category !== "expence_dot") {
            a.push(category);
            b.push(obj[key][category]);
          }
        }
      }
    }

    // console.log(time_status);
    // console.log(a);
    // console.log(b);

    for (let i = 0; i < obj.expenseCount; i++) {
      const key = `expense${i}`;
      const expenseDate = new Date(obj[key]['expence_dot'] || obj[key]['expense_dot']); // Check for both keys

      if (time_status === 'day' && (expenseDate.toDateString() === currentDate.toDateString() || expenseDate.toDateString() === previousDate.toDateString())) {
        for (const category in obj[key]) {
          if (category !== "income_dot" && category !== "expense_dot" && category !== "expence_dot") {
            c.push(category);
            d.push(obj[key][category]);
          }
        }
      } else if (time_status === 'week' && expenseDate >= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 14)) {
        for (const category in obj[key]) {
          if (category !== "income_dot" && category !== "expense_dot" && category !== "expence_dot") {
            c.push(category);
            d.push(obj[key][category]);
          }
        }
      } else if (time_status === 'month' && ((expenseDate.getFullYear() === currentYear && expenseDate.getMonth() + 1 === currentMonth) || (expenseDate.getFullYear() === previousYear && expenseDate.getMonth() + 1 === previousMonth))) {
        for (const category in obj[key]) {
          if (category !== "income_dot" && category !== "expense_dot" && category !== "expence_dot") {
            c.push(category);
            d.push(obj[key][category]);
          }
        }
      } else if (time_status === 'ok') {
        for (const category in obj[key]) {
          if (category !== "income_dot" && category !== "expense_dot" && category !== "expence_dot") {
            c.push(category);
            d.push(obj[key][category]);
          }
        }
      }
    }


    // console.log(time_status);
    // console.log(c);
    // console.log(d);

    return [a, b, c, d];
  }

  //function to submit feedback
  // TypeScript code

  submitFeedback(): void {
    const issue = this.feedbackText.trim();
    if (issue) {
      if (!this.curruser.hasOwnProperty('feedback')) {
        this.curruser.feedback = [];
      }
      this.curruser.feedback.push(issue);
      this.feedbackText = '';
    }
    this.updateUsersData(this.getUsers())
  }



  //function to submit issue
  submitIssue(): void {
    if (!this.curruser.issueRaised) {
      this.curruser.issueRaised = [];
    }
    const issue = this.issueText.trim();
    if (issue) {
      this.curruser.issueRaised.push(issue);
      this.issueText = '';
    }
    this.updateUsersData(this.getUsers())
  }

  //update feedbacks & issue
  updateFeedback_Issue(): void {
    this.allFeedbacks = [];
    this.allIssue = [];
    const usersData = this.getUsers();
    for (let i = 0; i < usersData.length; i++) {
      const user = usersData[i];
      const feedbackList = user.feedback || [];
      const issueList = user.issueRaised || [];
      for (let j = 0; j < feedbackList.length; j++) {
        const feedbackObj = {
          user: user.firstName,
          feedback: feedbackList[j]
        };
        this.allFeedbacks.push(feedbackObj);
      }
      for (let k = 0; k < issueList.length; k++) {
        const issueObj = {
          user: user.firstName,
          issueRaised: issueList[k]
        };
        this.allIssue.push(issueObj);
      }
    }
  }

  //New Function added
  mergeArrays(stringArray: (string | undefined)[], integerArray: (number | undefined)[]): [string[], number[]] {
    const uniqueStrings: string[] = [];
    const summedIntegers: number[] = [];

    // Iterate through the string array
    for (let i = 0; i < stringArray.length; i++) {
      const string: string | undefined = stringArray[i];
      const integer: number | undefined = integerArray[i];

      // Skip this iteration if either string or integer is undefined
      if (string === undefined || integer === undefined) {
        continue;
      }

      const index: number = uniqueStrings.indexOf(string);

      // If the string is not already in the uniqueStrings array, add it and its corresponding integer to summedIntegers
      if (index === -1) {
        uniqueStrings.push(string);
        summedIntegers.push(integer);
      } else {
        // If the string is already in the uniqueStrings array, add its corresponding integer to the existing value in summedIntegers
        summedIntegers[index] += integer;
      }
    }

    return [uniqueStrings, summedIntegers];
  };



  //added code for carray balance of last month in income

  // define a function to calculate balance
  calculateBalance(income: number, expense: number, prevBalance: number): number {
    return prevBalance + income - expense;
  }

  // define a function to update the display
  updateDisplay(): void {
    // simulate fetching data from a server based on the selected user and month
    let selectedDate = new Date();
    if(this.dateSelected_ != null){
      selectedDate = new Date(this.dateSelected_);
    }
    let data = this.getUsers();

    const index = data.findIndex(obj => obj.firstName === this.userSelected_);
    let userIncome: { amount: number, date: string }[] = [];
    let userExpense: { amount: number, date: string }[] = [];

    let obj = this.extractIncomeAndExpense(data[index])

    console.log("obj........");
    console.log(obj);

    userIncome = obj.income;
    userExpense = obj.expense;

    console.log("from updateDisplay")

    //working here
    const filteredData = userIncome.filter(obj => obj.date && obj.date.startsWith(this.dateSelected_));
    let currentMonthIncome = filteredData.reduce((acc, obj) => acc + (obj.amount || 0), 0);

    const filteredData1 = userExpense.filter(obj => obj.date && obj.date.startsWith(this.dateSelected_));
    console.log("currentMonth");
    let currentMonthExpense = filteredData1.reduce((acc, obj) => acc + (obj.amount || 0), 0);

   
    let totalBalance = userIncome.filter(obj => { return ((new Date(obj.date)) <= selectedDate);}).reduce((acc, obj) => acc + (obj.amount || 0), 0) - userExpense.filter(obj =>  { return ((new Date(obj.date)) <= selectedDate);}).reduce((acc, obj) => acc + (obj.amount || 0), 0);

    let prevBalance = totalBalance - (currentMonthIncome - currentMonthExpense);

    let totalIncome = userIncome.filter(obj =>  { return ((new Date(obj.date)) <= selectedDate);}).reduce((acc, obj) => acc + (obj.amount || 0), 0)

    // update the display
    const currentMonthIncomeEl = document.getElementById('currentMonthIncome');
    currentMonthIncomeEl.innerText = currentMonthIncome.toFixed(2);

    const currentMonthExpenseEl = document.getElementById('currentMonthExpense');
    currentMonthExpenseEl.innerText = currentMonthExpense.toFixed(2);

    const prevBalanceEl = document.getElementById('prevBalance');
    prevBalanceEl.innerText = prevBalance.toFixed(2);

    const totalBalanceEl = document.getElementById('totalBalance');
    totalBalanceEl.innerText = totalBalance.toFixed(2);

    const totalIncomeEl = document.getElementById('totalIncome');
    totalIncomeEl.innerText = totalIncome.toFixed(2);
  }

  //get all month from the data
  getAllMonthYears(obj: any) {
    const dates = [];
    const incomeKeys = Object.keys(obj).filter(key => key.includes('income'));
    const expenseKeys = Object.keys(obj).filter(key => (key.includes('expense') && key != "expenseCount"));

    // console.log("from getAllMonthYears");
    // console.log(obj);

    incomeKeys.forEach(key => dates.push(obj[key].income_dot));
    expenseKeys.forEach(key => dates.push(obj[key].expence_dot));

    // console.log(incomeKeys);
    // console.log(expenseKeys);
    return [...new Set(dates.map(date => date.slice(0, 7)))];
  }


  //extract income & expense
  extractIncomeAndExpense(obj: any): { income: { amount: number, date: string }[], expense: { amount: number, date: string }[] } {
    const incomeArr: { amount: number, date: string }[] = [];
    const expenseArr: { amount: number, date: string }[] = [];

      for (const key in obj) {
        if (key.startsWith("income")) {
          const incomeData = obj[key];
          for (const category in incomeData) {
            if (category !== "income_dot" && category != "eightName" && category != "icustom") {
              incomeArr.push({ amount: incomeData[category], date: incomeData.income_dot });
            }
          }
        } else if (key.startsWith("expense")) {
          const expenseData = obj[key];
          for (const category in expenseData) {
            if (category !== "expence_dot" && category != "seventhName" && category != "ecustom") {
              expenseArr.push({ amount: expenseData[category], date: expenseData.expence_dot });
            }
          }
        }
      }
  
    return { income: incomeArr, expense: expenseArr };
  }



}
// core.js:6456 ERROR DOMException: Failed to execute 'setItem' on 'Storage': Setting the value of 'recent-img' exceeded the quota.
//     at FileReader.<anonymous> (http://localhost:4200/main.js:1178:30)
//     at ZoneDelegate.invokeTask (http://localhost:4200/polyfills.js:10228:31)
//     at Object.onInvokeTask (http://localhost:4200/vendor.js:34827:33)
//     at ZoneDelegate.invokeTask (http://localhost:4200/polyfills.js:10227:60)
//     at Zone.runTask (http://localhost:4200/polyfills.js:10000:47)
//     at ZoneTask.invokeTask [as invoke] (http://localhost:4200/polyfills.js:10309:34)
//     at invokeTask (http://localhost:4200/polyfills.js:11422:14)
//     at FileReader.globalZoneAwareCallback (http://localhost:4200/polyfills.




