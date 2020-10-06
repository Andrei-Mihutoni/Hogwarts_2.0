"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let filteredStudents = [];
let expelledStudents = [];
let currentStudentsList = [];

const Student = {
  fullName: "",
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "unknow",
  gender: "",
  house: "",
  bloodStatus: "",
  prefect: false,
  expelled: false,
  inquisitorialSquad: false,
  imageFileName: "",
};





function start() {
  loadJSON();
  addSortEvent();
  addFilterEvents();
  addModalCloseEventListener();

}

function loadJSON() {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  // creating a new array, populated with return value of the createStudentObject function
  allStudents = jsonData.map(createStudentObject);
  //   console.log(jsonData);
  //   console.log(allStudents);
  // console.table(allStudents) 
  displayList(allStudents);


}

function createStudentObject(jsonStudent) {
  //   console.log(jsonStudent);
  const student = Object.create(Student);
  student.fullName = jsonStudent.fullname.trim();
  student.firstName = capitalize(student.fullName.split(" ")[0]);
  student.lastName = capitalize(student.fullName.split(" ").slice(-1).toString());
  student.house = capitalize(jsonStudent.house.trim());
  student.gender = jsonStudent.gender;
  student.middleName = capitalize(middleName(student.fullName));
  student.nickName = nickName(student.fullName);
  student.imageFileName = student.lastName.toLowerCase() + "_" + student.firstName.charAt(0).toLowerCase() + ".png";



  // console.log(student, jsonStudent);
  //   console.log(student);
  return student;
}


function middleName(fullNParam) {
  let fullNameSplited = fullNParam.split(" ");
  if (fullNameSplited.length > 2 && fullNameSplited[1].charAt(0) !== `"`
  ) {
    return fullNameSplited[1]
  }
  return ("");
};

function nickName(fullNParam) {
  let fullNameSplited = fullNParam.split(" ");
  if (fullNameSplited.length > 2 && fullNameSplited[1].charAt(0) === `"`
  ) {
    return fullNameSplited[1]
  }
  return ("");
};


function capitalize(name) {
  return (name.charAt(0).toUpperCase() + name.substring(1).toLowerCase());
}



function displayList(value) {
  // clear the display
  document.querySelector("#list tbody").innerHTML = "";
  // build a new list
  value.forEach(displayStudent);
}


function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);
  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  addModalListner(student, clone);

  // console.log(clone);

  // append clone to list
  document.querySelector("tbody").appendChild(clone);

}




function addSortEvent() {
  const sortBtns = document.querySelectorAll("[data-action=sort]");
  for (let i = 0; i < sortBtns.length; i++) {
    sortBtns[i].addEventListener("click", function () {
      sortStudents(this.dataset.sort, currentStudentsList, this.dataset.sortDirection);

      if (this.dataset.sortDirection === "asc") {
        this.dataset.sortDirection = "desc"
      }
      else {
        this.dataset.sortDirection = "asc"
      }
    });
  }
}

function sortStudents(value, allStudentsParam, sortDirection) {


  function sortByValueAsc(a, b) {
    if (a[value] < b[value]) {
      return -1;
    } else {
      return 1;
    }
  }

  function sortByValueDesc(a, b) {
    if (a[value] < b[value]) {
      return 1;
    } else {
      return -1;
    }
  }

  if (sortDirection === "asc") {
    currentStudentsList = allStudentsParam.sort(sortByValueAsc);
  }
  else if (sortDirection === "desc") {
    currentStudentsList = allStudentsParam.sort(sortByValueDesc);
  }

  displayList(currentStudentsList);


  //  revers asc/desc var 1
  // let reverse = 1;
  // if (sortDirection == "asc") {
  //   reverse = 1;
  // } else if (sortDirection == "desc"){
  //   reverse = -1;
  // }
  // function sortByValue(a, b) {
  //   if (a[value] < b[value]) {
  //     return -1 * reverse;
  //   } else {
  //     return 1 * reverse;
  //   }
  // }

}



function addFilterEvents() {
  document.querySelector("#houseDropdown").addEventListener("input", filterStudents);
}

function filterStudents(event) {
  console.log(event.target.value);

  // short and gancy way of filtering
  // filteredStudents = allStudents.filter(student => student.house.toLowerCase() == event.target.value);

  // 
  filteredStudents = allStudents.filter(function (student) {
    if (student.house.toLowerCase() == event.target.value)
      return true;
    else return false;
  })
  currentStudentsList = filteredStudents;

  // console.log(filteredStudents);
  displayList(currentStudentsList);

}

function addModalListner(student, clone) {
  clone.querySelector("#studentRow").addEventListener("click", function () {
    showModal(student);
  })
}

function showModal(student) {
  console.log(student);
  document.querySelector("#studentModal").classList.remove("hide");
  document.querySelector("[data-field=fullName]").textContent = student.firstName + " " + student.middleName + " " + student.lastName;
  document.querySelector("[data-field=modalHouse]").textContent = student.house;
  document.getElementById("modalStudentImage").src = "/images/" + student.imageFileName;
  console.log(student.imageFileName)
}



function addModalCloseEventListener() {
  const modal = document.getElementById("studentModal");
  const closeModal = document.getElementById("close");

  window.addEventListener("click", function (event) {
    if (event.target == modal)
      modal.classList.add("hide");
  })

  closeModal.addEventListener("click", function () {
    modal.classList.add("hide");
  })

}


function addEventListenerModalButtons() {
  document.querySelector("#expellBtn")

}