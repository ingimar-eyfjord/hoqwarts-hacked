// JavaScript Document
window.addEventListener("DOMContentLoaded", getData, clickonSort2, clickonSort);
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
    // find me
    // here is a filtered array
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
    // studID is a parameter in appendFunc that is actually based on a peramiter of another function, but here I am sending the Array into the function instead
    // Which will be used by the function in one of the IF statements, (if (isset == "filtering"))
    const StudId = filteredList;
    appendFunc(isset, StudId);
    sortfilterd = "sortfiltered";
    sortFunction(StudId, sortfilterd);
    return filteredList;
  } else {
    if (document.querySelector("[data-active='active']")) {
      document
        .querySelector("[data-active='active']")
        .setAttribute("data-active", "");
    }
    this.setAttribute("data-active", "active");
    const isset = this.dataset.active;
    // Here the student ID is actually the Student ID, and will be used as such, read previous comment for more info
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
    clickonData("General", studentArray);
    return;
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
          .querySelector(".filter")
          .setAttribute("data-btnColour", e.house);
        document.querySelector(".sort").setAttribute("data-btnColour", e.house);
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
        }
        if (e.expelled == true) {
          document.querySelector(".Prefect").classList.add("displaynone");
          document.querySelector(".Inquisitor").classList.add("displaynone");
          document.querySelector(".Expell").classList.add("displaynone");
        }
        if (e.expelled == false) {
          document.querySelector(".Prefect").classList.remove("displaynone");
          document.querySelector(".Inquisitor").classList.remove("displaynone");
          document.querySelector(".Expell").classList.remove("displaynone");
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
          document.querySelector(".Prefect").classList.add("displaynone");
          document.querySelector(".Inquisitor").classList.add("displaynone");
          document.querySelector(".Expell").classList.add("displaynone");
          document.querySelector("body").style.background = "";
          document
            .querySelector(".crest")
            .setAttribute("src", "images/hogwarts-crest.png");
        }
        if (e.expelled == false) {
          document.querySelector(".Prefect").classList.remove("displaynone");
          document.querySelector(".Inquisitor").classList.remove("displaynone");
          document.querySelector(".Expell").classList.remove("displaynone");
        }
        document.querySelector(".studentAbout").appendChild(clone);
        clickonData("General", studentArray);
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
    });
    clickonStud();
    clickonFilter();
    clickonSort();
    clickonSort2();
    clickonData("General", studentArray);
  }
}

function clickonData(isset, array) {
  let huffC = 0;
  let slythC = 0;
  let ravenC = 0;
  let gryffC = 0;
  let activeC = 0;
  let expelledC = 0;

  if (isset == "General") {
    array.forEach(e => {
      if (e.house == "Hufflepuff") {
        huffC++;
      }
      if (e.house == "Slytherin") {
        slythC++;
      }
      if (e.house == "Ravenclaw") {
        ravenC++;
      }
      if (e.house == "Gryffindor") {
        gryffC++;
      }
      if (e.expelled) {
        expelledC++;
      } else {
        activeC++;
      }
    });
  }
  const huff = document.querySelector(".Hufflepuff_stats");
  huff.textContent = huffC;
  const slyth = document.querySelector(".Slytherin_stats");
  slyth.textContent = slythC;
  const raven = document.querySelector(".Ravenclaw_stats");
  raven.textContent = ravenC;
  const gryff = document.querySelector(".Gryffindor_stats");
  gryff.textContent = gryffC;
  const active = document.querySelector(".numberOfStudActive");
  active.textContent = activeC;
  const expelled = document.querySelector(".numberOfStudExpelled");
  expelled.textContent = expelledC;
  const displayed = document.querySelector(".numberOfStudDisplayed");
  const list = document.querySelectorAll(".studentdetails");

  displayed.textContent = Array.from(list).length;
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

function clickonSort() {
  document.querySelector(".sort").addEventListener("change", clickOnFilter);
}
function clickonSort2() {
  const sort = document.querySelector(".sort");
  sort.addEventListener("click", sortFunction);
}
function clickOnFilter() {
  const filter = document.querySelector(".filter");
  filter.click();
}
sorthisList = [];
function sortFunction(list, sortfiltered) {
  const sorter = document.querySelector(".sort");
  if (sortfiltered == "sortfiltered") {
    sorthisList = [];
    sorthisList.push(list);

    if (sorter.value == "First name") {
      const sorted = sorthisList[0][0].sort(compare);
      appendSorted(sorted);
      console.log("hello");
    } else if (sorter.value == "Last name") {
      const sorted = sorthisList[0][0].sort(compare2);
      appendSorted(sorted);
    }
  } else {
    if (sorter.value == "First name") {
      console.log("hello");
      sortedArray = studentArray.sort(compare);

      appendSorted(sortedArray);
    } else if (sorter.value == "Last name") {
      sortedArray = studentArray.sort(compare2);
      appendSorted(sortedArray);
    }
  }
}

function appendSorted(sorted) {
  document.querySelector(".listhere").innerHTML = "";
  sorted.forEach(e => {
    const template = document.querySelector(".studentlist-template").content;
    const clone = template.cloneNode(true);
    const sname = clone.querySelector(".studentdetails");
    const firstname = e.firstName;
    const middleName = e.middleName;
    const lastname = e.lastName;
    sname.innerHTML = firstname + `&nbsp` + middleName + `&nbsp` + lastname;
    clone.querySelector(".studentdetails").setAttribute("data-id", e.id);
    document.querySelector(".listhere").appendChild(clone);
  });
  clickonStud();
  document.querySelector(".filter").click();
  clickonData("General", studentArray);
}
// I had to make these two functions static for now. As is was struggling with the sorting function. I had way to many knots to tie and
// to make the sorting wor, but it does work now.
function compare(a, b) {
  const sortBy = "firstName";
  const ValueA = a[sortBy];
  const ValueB = b[sortBy];
  let comparison = 0;
  if (ValueA > ValueB) {
    comparison = 1;
  } else if (ValueA < ValueB) {
    comparison = -1;
  }
  return comparison;
}
function compare2(a, b) {
  const sortBy = "lastName";
  const ValueA = a[sortBy];
  const ValueB = b[sortBy];
  let comparison = 0;
  if (ValueA > ValueB) {
    comparison = 1;
  } else if (ValueA < ValueB) {
    comparison = -1;
  }
  return comparison;
}

const identifyStud = function() {
  const StudID = this.dataset.studid;
  const action = this.dataset.btn.toLowerCase();

  Takeaction(action, StudID);
  if (action == "expelled") {
    updateExpelledList();
  }
};
// Expell/Inquisitor/Prefect function
function Takeaction(action, StudID) {
  studentArray.forEach(e => {
    if (e.id == StudID) {
      if (e[action] == false) {
        e[action] = true;
      } else {
        e[action] = false;
      }
      if (action == "expelled") {
        e.house = "";
      }
    }
    const isset = "updateStudinfo";
    StudID = StudID;
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
  // const isset = "General";
  // clickonData(isset, NoExpelledStuds);
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
