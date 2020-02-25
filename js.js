// JavaScript Document
window.addEventListener("DOMContentLoaded", getData);
function getData() {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(res => res.json())
    .then(handleData)
    .then(checkBloodstatus)
    .then(appendFunc);
}
const Student = {
  id: "",
  firstName: "",
  middleName: "",
  lastName: "",
  house: "",
  gender: "",
  imagefilename: "",
  bloodStatus: "Muggle-born",
  inquisitor: false,
  prefect: false,
  expelled: false
};
studentArray = [];
let number = 0;
function handleData(myData) {
  myData.forEach(e => {
    const id = number;
    number++;
    const names = e.fullname.split(" ");
    const index = names.indexOf("");
    if (index !== -1) names.splice(index, 1);
    const house = e.house.split(" ");
    const index1 = house.indexOf("");
    if (index1 !== -1) house.splice(index1, 1);
    const gender = e.gender.split(" ");
    const index2 = gender.indexOf("");
    if (index2 !== -1) gender.splice(index2, 1);
    let studentIndex = Object.create(Student);
    studentIndex.firstName =
      names[0].charAt(0).toUpperCase() + names[0].substring(1).toLowerCase();
    if (names.length == 3) {
      studentIndex.middleName =
        names[1].charAt(0).toUpperCase() + names[1].substring(1).toLowerCase();
      studentIndex.lastName =
        names[2].charAt(0).toUpperCase() + names[2].substring(1).toLowerCase();
    }
    if (names.length == 2) {
      studentIndex.lastName =
        names[1].charAt(0).toUpperCase() + names[1].substring(1).toLowerCase();
    }
    studentIndex.house =
      house[0].charAt(0).toUpperCase() + house[0].substring(1).toLowerCase();
    studentIndex.gender =
      gender[0].charAt(0).toUpperCase() + gender[0].substring(1).toLowerCase();
    studentIndex.id = id;
    studentIndex.imagefilename =
      "images/profile/" +
      studentIndex.lastName.toLowerCase() +
      "_" +
      studentIndex.firstName.charAt(0).toLowerCase() +
      ".png";

    studentArray.push(studentIndex);
  });
}
function checkBloodstatus() {
  fetch("https://petlatkea.dk/2020/hogwarts/families.json")
    .then(res => res.json())
    .then(handleBloodData);
}
function handleBloodData(data) {
  data.pure.forEach(e => {
    studentArray.forEach(en => {
      if (e == en.lastName || e == en.middleName) {
        en.bloodStatus = "Pure blood";
      }
    });
  });
  data.half.forEach(d => {
    studentArray.forEach(en => {
      if (d == en.lastName || d == en.middleName) {
        en.bloodStatus = "Half blood";
      }
    });
  });
}
deligator = function() {
  if (this.name == "filter") {
    let filtering = this.value;
    if (this.value == "yes") {
      filtering = true;
    }
    const value = this.options[this.selectedIndex].getAttribute("data-filter");
    filteredList = [];
    if (value == "expelled") {
      (function() {
        filterthis = studentArray.filter(e => e[value] == filtering);
        filteredList.push(filterthis);
      })();
    } else {
      (function() {
        const studentArray2 = updateExpelledList();
        filterthis = studentArray2.filter(e => e[value] == filtering);
        filteredList.push(filterthis);
      })();
    }
    const isset = "filtering";
    const StudId = filteredList;
    appendFunc(isset, StudId);
    return;
  } else {
    if (document.querySelector("[data-active='active']")) {
      document
        .querySelector("[data-active='active']")
        .setAttribute("data-active", "");
    }
    this.setAttribute("data-active", "active");
    const isset = this.dataset.active;
    const StudId = this.dataset.id;
    appendFunc(isset, StudId);
    return;
  }
};

function appendFunc(isset, StudId) {
  if (isset == "filtering") {
    const filtered = StudId;
    document.querySelector(".listhere").innerHTML = "";
    filtered[0].forEach(e => {
      const template3 = document.querySelector(".studentlist-template").content;
      const clone3 = template3.cloneNode(true);
      const sname = clone3.querySelector(".studentdetails");
      const firstname = e.firstName;
      const middleName = e.middleName;
      const lastname = e.lastName;
      sname.innerHTML = firstname + `&nbsp` + middleName + `&nbsp` + lastname;
      clone3.querySelector(".studentdetails").setAttribute("data-id", e.id);
      document.querySelector(".listhere").appendChild(clone3);
    });
    clickonStud();
  } else if (isset == "active") {
    document.querySelector(".Prefect").innerHTML = "Instill as Prefect";
    document.querySelector(".Inquisitor").innerHTML = "Instill as Inquisitor";
    const btns = document.querySelectorAll("button");
    btns.forEach(e => {
      e.style.display = "block";
    });
    studentArray.forEach(e => {
      if (e.id == StudId) {
        document.querySelector(".Prefect").setAttribute("data-StudID", e.id);
        document.querySelector(".Expell").setAttribute("data-StudID", e.id);
        document.querySelector(".studentAbout").innerHTML = "";
        const template = document.querySelector(".studentabout_template")
          .content;
        const clone = template.cloneNode(true);
        const sname = clone.querySelector(".Bigname");
        const firstname = e.firstName;
        const middleName = e.middleName;
        const lastname = e.lastName;
        sname.innerHTML = firstname + `&nbsp` + middleName + `&nbsp` + lastname;
        clone.querySelector(".Bigname").setAttribute("data-id", e.id);
        clone.querySelector(".house").textContent = e.house;
        clone.querySelector(".Gender").textContent = e.gender;
        clone.querySelector(".bloodStatus").textContent = e.bloodStatus;
        document
          .querySelector(".crest")
          .setAttribute("src", `images/` + e.house + ".png");
        document.querySelector("body").style.background =
          "var(--" + e.house + "_color)";
        if (e.house == "Slytherin") {
          document.querySelector(".Inquisitor").style.display = "block";
          document
            .querySelector(".Inquisitor")
            .setAttribute("data-btnColour", e.house);
          document
            .querySelector(".Inquisitor")
            .setAttribute("data-StudID", e.id);
        } else {
          document.querySelector(".Inquisitor").style.display = "none";
        }
        document
          .querySelector(".Prefect")
          .setAttribute("data-btnColour", e.house);
        document
          .querySelector(".profileImg")
          .setAttribute("src", e.imagefilename);
        if (e.inquisitor === true) {
          document.querySelector(".Inquisitor").innerHTML =
            "Revoke Inquisitor Status";
          clone.querySelector(".inquisitor").innerHTML = "Inquisitor";
        }
        if (e.prefect === true) {
          document.querySelector(".Prefect").innerHTML =
            "Revoke Prefect Status";
          clone.querySelector(".prefect").innerHTML = "Prefect";
        }
        if (e.expelled === true) {
          clone.querySelector(".expelled").style.display = "block";
          clone.querySelector(".prefect").innerHTML = "";
          clone.querySelector(".inquisitor").innerHTML = "";
          clone.querySelector(".house").textContent = "";
          clone.querySelector(".Gender").textContent = "";
          clone.querySelector(".bloodStatus").textContent = "";
          document.querySelector(".Prefect").style.display = "none";
          document.querySelector(".Inquisitor").style.display = "none";
          document.querySelector(".Expell").style.display = "none";
        }
        document.querySelector(".studentAbout").appendChild(clone);
      }
    });
    return;
  } else if (isset == "updateStudinfo") {
    studentArray.forEach(e => {
      const StudID = StudId;
      if (e.id == StudID) {
        const template = document.querySelector(".studentabout_template")
          .content;
        const clone = template.cloneNode(true);
        document.querySelector(".studentAbout").innerHTML = "";
        const firstname = e.firstName;
        const middleName = e.middleName;
        const lastname = e.lastName;
        const sname = clone.querySelector(".Bigname");
        sname.innerHTML = firstname + `&nbsp` + middleName + `&nbsp` + lastname;
        clone.querySelector(".Bigname").setAttribute("data-id", e.id);
        clone.querySelector(".house").textContent = e.house;
        clone.querySelector(".Gender").textContent = e.gender;
        clone.querySelector(".bloodStatus").textContent = e.bloodStatus;
        if (e.inquisitor === true) {
          document.querySelector(".Inquisitor").innerHTML =
            "Revoke Inquisitor Status";
          clone.querySelector(".inquisitor").innerHTML = "Inquisitor";
        }
        if (e.prefect === true) {
          document.querySelector(".Prefect").innerHTML =
            "Revoke Prefect Status";
          clone.querySelector(".prefect").innerHTML = "Prefect";
        }
        if (e.expelled === true) {
          clone.querySelector(".expelled").style.display = "block";
          clone.querySelector(".prefect").innerHTML = "";
          clone.querySelector(".inquisitor").innerHTML = "";
          clone.querySelector(".house").textContent = "";
          clone.querySelector(".Gender").textContent = "";
          clone.querySelector(".bloodStatus").textContent = "";
          document.querySelector(".Prefect").style.display = "none";
          document.querySelector(".Inquisitor").style.display = "none";
          document.querySelector(".Expell").style.display = "none";
        }
        document.querySelector(".studentAbout").appendChild(clone);
      }
    });
    return;
  } else {
    studentArray.forEach(e => {
      const template = document.querySelector(".studentlist-template").content;
      const clone = template.cloneNode(true);
      const sname = clone.querySelector(".studentdetails");
      const firstname = e.firstName;
      const middleName = e.middleName;
      const lastname = e.lastName;
      sname.innerHTML = firstname + `&nbsp` + middleName + `&nbsp` + lastname;
      clone.querySelector(".studentdetails").setAttribute("data-id", e.id);
      document.querySelector(".listhere").appendChild(clone);

      clickonStud();
      clickonFilter();
    });
  }
}

function clickonStud() {
  const clickName = document.querySelectorAll(".studentdetails");
  clickName.forEach(e => {
    e.addEventListener("click", (e = deligator));
  });
}

function clickonFilter() {
  document.querySelector(".filter").addEventListener("change", (e = deligator));
}
function clickonFilter2() {
  const filter = document.querySelector(".filter");
  filter.addEventListener("click", (e = deligator));
  filter.click();
}

const identifyStud = function() {
  const StudID = this.dataset.studid;
  const action = this.dataset.btn.toLowerCase();
  if (action == "expelled") {
    updateExpelledList();
  }
  Takeaction(action, StudID);
};

function Takeaction(action, StudID) {
  studentArray.forEach(e => {
    if (e.id == StudID) {
      if (e[action] == false) {
        e[action] = true;
      } else {
        e[action] = false;
      }
    }
    const isset = "updateStudinfo";
    appendFunc(isset, StudID);
    updateExpelledList();
  });
}

const buttons = document.querySelectorAll("button");
buttons.forEach(e => {
  e.addEventListener("click", (e = identifyStud));
});

function updateExpelledList() {
  document.querySelector(".listhere").innerHTML = "";
  NoExpelledStuds = studentArray.filter(
    studentArray => studentArray.expelled === false
  );
  apendlist(NoExpelledStuds);
  clickonFilter2();
  return NoExpelledStuds;
}

function apendlist(NoExpelledStuds) {
  NoExpelledStuds.forEach(e => {
    const template = document.querySelector(".studentlist-template").content;
    const clone = template.cloneNode(true);
    const sname = clone.querySelector(".studentdetails");
    const firstname = e.firstName;
    const middleName = e.middleName;
    const lastname = e.lastName;
    sname.innerHTML = firstname + `&nbsp` + middleName + `&nbsp` + lastname;
    clone.querySelector(".studentdetails").setAttribute("data-id", e.id);
    document.querySelector(".listhere").appendChild(clone);
    clickonStud();
    clickonFilter();
  });
}

document.querySelector(".search").addEventListener("keyup", search);
// I have been using this search functions since 2 semester. At first I had no Idea how it worked, but I do now.
function search() {
  let input, filter, li, a, i, txtValue;
  input = document.querySelector(".search");
  filter = input.value.toUpperCase();
  li = document.getElementsByClassName("readthis");
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByClassName("studentdetails")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
