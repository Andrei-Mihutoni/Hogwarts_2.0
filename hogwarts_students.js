"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let filteredStudents = [];
let expelledStudents = [];
let currentStudentsList = [];
let hackedSystem = false;

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

const Families = {
  half: "",
  pure: "",
};

const families = Object.create(Families);


let prefectHouses = [
  {
    name: "Gryffindor",
    students: []
  },

  {
    name: "Slytherin",
    students: []
  },

  {
    name: "Hufflepuff",
    students: []
  },

  {
    name: "Ravenclaw",
    students: []
  }
];


function start() {
  loadJSONBloodStatus();
  // addSortEvent(); //to fix - executes before loading the JSON
  addFilterEvents();
  addModalCloseEventListener();
  countStatus();
};

async function loadJSONStudents() {
  await fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
      addSortEvent();   // ####### to fix - executes after loading the JSON

    });
};

async function loadJSONBloodStatus() {
  await fetch("https://petlatkea.dk/2020/hogwarts/families.json")
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjectsBloodStatus(jsonData);
    });
  loadJSONStudents();
};

function prepareObjects(jsonData) {
  // creating a new array, populated with return value of the createStudentObject function
  allStudents = jsonData.map(createStudentObject);
  //   console.log(jsonData);
  //   console.log(allStudents);
  // console.table(allStudents) 
  displayList(allStudents);
};

function prepareObjectsBloodStatus(jsonData) {
  families.pure = jsonData.pure;
  families.half = jsonData.half;
};

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
  student.inquisitorialSquad = false;
  student.prefect = false;




  for (let i = 0; i < families.half.length; i++) {
    if (families.half[i] == student.lastName) {
      student.bloodStatus = "Half";
    } else if (families.half[i] !== student.lastName) {
      student.bloodStatus = "Muggle";
    }
  };

  for (let i = 0; i < families.pure.length; i++) {
    if (families.pure[i] == student.lastName) {
      student.bloodStatus = "Pure";
    }
  };

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
};


function displayList(value) {
  // clear the display
  document.querySelector("#list tbody").innerHTML = "";
  // build a new list
  value.forEach(displayStudent);
  countStatus();
};


function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);
  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=blood]").textContent = student.bloodStatus;

  if (student.inquisitorialSquad == true) {
    clone.querySelector("[data-field=inquisitor]").textContent = "✓";
  }

  if (student.prefect == true) {
    clone.querySelector("[data-field=prefect]").textContent = "✓";
  }
  addModalListner(student, clone);

  // console.log(clone);

  // append clone to list
  document.querySelector("tbody").appendChild(clone);

};


function addSortEvent() {
  const sortBtns = document.querySelectorAll("[data-action=sort]");
  currentStudentsList = allStudents;
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
};

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

  console.log(allStudentsParam)
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

};

function addFilterEvents() {
  document.querySelector("#houseDropdown").addEventListener("input", filterStudents);
  document.querySelector("[data-filter=all]").addEventListener("click", function () {
    currentStudentsList = allStudents;
    displayList(currentStudentsList);
  });
  document.querySelector("#houseDropdownStatus").addEventListener("input", function () {
    if (this.value === "enrolled") {
      displayList(currentStudentsList);
    }
    else displayList(expelledStudents);
  });
};

function filterStudents(event) {
  console.log(event.target.value);

  // short and fancy way of filtering:
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

};

function addModalListner(student, clone) {
  clone.querySelector("#studentRow").addEventListener("click", function () {
    showModal(student);
  })
};

function showModal(student) {
  console.log(student);
  document.querySelector("#studentModal").classList.remove("hide");
  document.querySelector("[data-field=fullName]").textContent = student.firstName + " " + student.middleName + " " + student.lastName;
  document.querySelector("[data-field=modalHouse]").textContent = student.house;
  document.querySelector("[data-field=modalBloodStatus]").textContent = student.bloodStatus;
  document.getElementById("modalStudentImage").src = "/images/" + student.imageFileName;
  console.log(student.imageFileName);
  addEventListenerModalButtons(student);

  if (student.prefect == true) {
    document.querySelector("#makePrefectBtn").textContent = "Remove Prefect";
  } else {
    document.querySelector("#makePrefectBtn").textContent = "Add as Prefect";
  };


  if (student.inquisitorialSquad == true) {
    document.querySelector("#makeInquisitorBtn").textContent = "Remove inquisitor";
  } else {
    document.querySelector("#makeInquisitorBtn").textContent = "Make Inquisitor";
  };


  if (student.firstName == "Andrei" && student.lastName == "Mihutoni") {
    const expellBtn = document.querySelector("#expellBtn");
    const expellBtnClone = expellBtn.cloneNode(true);
    expellBtn.parentNode.replaceChild(expellBtnClone, expellBtn);
  }
};


function addModalCloseEventListener() {
  const modal = document.getElementById("studentModal");
  const closeModal = document.getElementById("close");

  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.classList.add("hide");
      removeBtnEvents(modal);
    }
  })

  closeModal.addEventListener("click", function () {
    modal.classList.add("hide");
    removeBtnEvents(modal);

  })

};

function closeModal() {
  document.getElementById("studentModal").classList.add("hide");
  removeBtnEvents(document.getElementById("studentModal"));
};

function addEventListenerModalButtons(student) {
  document.querySelector("#expellBtn").addEventListener("click", function () {
    expelStudent(student);
    displayList(currentStudentsList);
  });
  document.querySelector("#makeInquisitorBtn").addEventListener("click", function () {
    makeInquisitor(student);
    displayList(currentStudentsList);

    if (student.inquisitorialSquad == true) {
      this.textContent = "Remove inquisitor";
    } else {
      this.textContent = "Make Inquisitor";
    };

  });
  document.querySelector("#makePrefectBtn").addEventListener("click", function () {
    makePrefect(student);
    displayList(currentStudentsList);

    if (student.prefect == true) {
      this.textContent = "Remove Prefect";
    } else {
      this.textContent = "Add as Prefect";
    }
  });


};

function expelStudent(student) {
  allStudents.splice(allStudents.indexOf(student), 1);
  expelledStudents.push(student);
  currentStudentsList.splice(currentStudentsList.indexOf(student), 1);
  closeModal();
};


function makeInquisitor(student) {
  if (student.inquisitorialSquad == true) {
    student.inquisitorialSquad = false;
  }
  else if (student.bloodStatus == "Pure" && student.house == "Slytherin") {
    student.inquisitorialSquad = true;
  }
  else {
    alert("In order to make a student Inquisitor, he/she must be Pure-Blooded and from Slytherin house.")
  };
};


function makePrefect(student) {
  for (let i = 0; i < prefectHouses.length; i++) {
    if (student.house == prefectHouses[i].name) {
      if (student.prefect == false) {
        if (prefectHouses[i].students.length < 2) {
          prefectHouses[i].students.push(student);
          student.prefect = true;
          console.log(prefectHouses[i].students);
        } else {
          alert(` There can be maximum 2 prefects from each house.
          Remove one before adding another one`);
        }
      } else {
        prefectHouses[i].students.splice(prefectHouses[i].students.indexOf(student), 1);
        student.prefect = false;
        console.log(prefectHouses[i].students);
      }
    }
  }
};


function removeBtnEvents(modal) {
  const modalContent = modal.querySelector(".modalButtons");

  const expellBtn = modalContent.querySelector("#expellBtn");
  const expellBtnClone = expellBtn.cloneNode(true);
  expellBtn.parentNode.replaceChild(expellBtnClone, expellBtn);

  const makePrefectBtn = modalContent.querySelector("#makePrefectBtn");
  const prefectBtnClone = makePrefectBtn.cloneNode(true);
  makePrefectBtn.parentNode.replaceChild(prefectBtnClone, makePrefectBtn);

  const makeInquisitorBtn = modalContent.querySelector("#makeInquisitorBtn");
  const makeInquisitorClone = makeInquisitorBtn.cloneNode(true);
  makeInquisitorBtn.parentNode.replaceChild(makeInquisitorClone, makeInquisitorBtn);
};

function hackTheSystem() {

  if (hackedSystem == false) {
    const andreiMihutoni = Object.create(Student);
    andreiMihutoni.firstName = "Andrei";
    andreiMihutoni.lastName = "Mihutoni";
    andreiMihutoni.house = "Slyterin";
    andreiMihutoni.gender = "boy";
    andreiMihutoni.bloodStatus = "Pure";




    for (let i = 0; i < allStudents.length; i++) {
      console.log(allStudents[i])
      if (allStudents[i].bloodStatus == "Pure") {
        let randomPurness = Math.floor(Math.random() * 2)
        console.log(randomPurness)
        if (randomPurness == 0) {
          allStudents[i].bloodStatus = "Muggle";
        } else {
          allStudents[i].bloodStatus = "Half";
        }
      } else {
        allStudents[i].bloodStatus = "Pure"
      }
    }

    allStudents.unshift(andreiMihutoni);
    hackedSystem = true;
    displayList(currentStudentsList);
    hackedRemoveInquisitors();

  }


};

function hackedRemoveInquisitors() {
  setInterval(() => {
    for (let i = 0; i < allStudents.length; i++) {
      if (allStudents[i].inquisitorialSquad == true) {
        allStudents[i].inquisitorialSquad = false;
        alert(`Inqusitor status revoked!
        Muahahaha haha `);
      }
    }
    displayList(currentStudentsList);

  }, 2000);
};


function countStatus() {
  // console.log(allStudents.length);
  // console.log(expelledStudents.length);

  document.querySelector("#countAll").textContent = allStudents.length + expelledStudents.length;
  document.querySelector("#countEnroled").textContent = allStudents.length;
  document.querySelector("#countExpelled").textContent = expelledStudents.length;
  document.querySelector("#countExpelled").textContent = expelledStudents.length;

  document.querySelector("#slytherynCount").textContent = allStudents.filter(student => student.house.toLowerCase() == "slytherin").length;
  document.querySelector("#gryffindorCount").textContent = allStudents.filter(student => student.house.toLowerCase() == "gryffindor").length;
  document.querySelector("#ravenclawCount").textContent = allStudents.filter(student => student.house.toLowerCase() == "ravenclaw").length;
  document.querySelector("#hufflepuffCount").textContent = allStudents.filter(student => student.house.toLowerCase() == "hufflepuff").length;
};

