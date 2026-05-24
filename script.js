const studentForm = document.getElementById("studentForm");

const studentIdInput = document.getElementById("studentId");
const fullNameInput = document.getElementById("fullName");
const ageInput = document.getElementById("age");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const contactInput = document.getElementById("contact");
const addressInput = document.getElementById("address");

const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");
const clearAllBtn = document.getElementById("clearAllBtn");
const resetBtn = document.getElementById("resetBtn");

const submitBtn = document.getElementById("submitBtn");
const formTitle = document.getElementById("formTitle");
const emptyMessage = document.getElementById("emptyMessage");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editId = null;

function saveToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

function clearErrors() {
  document.querySelectorAll(".error").forEach((error) => {
    error.textContent = "";
  });
}

function validateForm() {
  clearErrors();

  let isValid = true;
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (studentIdInput.value.trim() === "") {
    document.getElementById("studentIdError").textContent = "Student ID is required";
    isValid = false;
  }

  const duplicateStudent = students.find((student) => {
    return student.studentId === studentIdInput.value.trim() && student.studentId !== editId;
  });

  if (duplicateStudent) {
    document.getElementById("studentIdError").textContent = "Duplicate Student ID is not allowed";
    isValid = false;
  }

  if (fullNameInput.value.trim() === "") {
    document.getElementById("fullNameError").textContent = "Full Name is required";
    isValid = false;
  }

  if (ageInput.value.trim() === "") {
    document.getElementById("ageError").textContent = "Age is required";
    isValid = false;
  } else if (Number(ageInput.value) <= 0) {
    document.getElementById("ageError").textContent = "Age must be positive";
    isValid = false;
  }

  if (emailInput.value.trim() === "") {
    document.getElementById("emailError").textContent = "Email is required";
    isValid = false;
  } else if (!emailPattern.test(emailInput.value.trim())) {
    document.getElementById("emailError").textContent = "Enter a valid email";
    isValid = false;
  }

  if (courseInput.value.trim() === "") {
    document.getElementById("courseError").textContent = "Course is required";
    isValid = false;
  }

  if (contactInput.value.trim() === "") {
    document.getElementById("contactError").textContent = "Contact Number is required";
    isValid = false;
  }

  if (addressInput.value.trim() === "") {
    document.getElementById("addressError").textContent = "Address is required";
    isValid = false;
  }

  return isValid;
}

function displayStudents(studentArray = students) {
  studentList.innerHTML = "";

  if (studentArray.length === 0) {
    emptyMessage.classList.remove("hidden");
    return;
  }

  emptyMessage.classList.add("hidden");

  studentArray.forEach((student) => {
    const card = document.createElement("div");

    card.className =
      "border border-slate-200 rounded-2xl p-5 shadow-sm bg-slate-50 hover:shadow-md transition";

    card.innerHTML = `
      <h3 class="text-xl font-bold text-blue-700 mb-3">${student.fullName}</h3>

      <p><strong>Student ID:</strong> ${student.studentId}</p>
      <p><strong>Age:</strong> ${student.age}</p>
      <p><strong>Email:</strong> ${student.email}</p>
      <p><strong>Course:</strong> ${student.course}</p>
      <p><strong>Contact:</strong> ${student.contact}</p>
      <p><strong>Address:</strong> ${student.address}</p>

      <div class="flex gap-3 mt-4">
        <button onclick="editStudent('${student.studentId}')"
          class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
          Edit
        </button>

        <button onclick="deleteStudent('${student.studentId}')"
          class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
          Delete
        </button>
      </div>
    `;

    studentList.appendChild(card);
  });
}

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const student = {
    studentId: studentIdInput.value.trim(),
    fullName: fullNameInput.value.trim(),
    age: ageInput.value.trim(),
    email: emailInput.value.trim(),
    course: courseInput.value.trim(),
    contact: contactInput.value.trim(),
    address: addressInput.value.trim(),
  };

  if (editId === null) {
    students.push(student);
  } else {
    students = students.map((oldStudent) => {
      if (oldStudent.studentId === editId) {
        return student;
      }
      return oldStudent;
    });
  }

  saveToLocalStorage();
  displayStudents();
  resetForm();
});

function editStudent(id) {
  const student = students.find((student) => student.studentId === id);

  studentIdInput.value = student.studentId;
  fullNameInput.value = student.fullName;
  ageInput.value = student.age;
  emailInput.value = student.email;
  courseInput.value = student.course;
  contactInput.value = student.contact;
  addressInput.value = student.address;

  editId = student.studentId;

  formTitle.textContent = "Edit Student";
  submitBtn.textContent = "Update Student";
}

function deleteStudent(id) {
  const confirmDelete = confirm("Are you sure you want to delete this student?");

  if (confirmDelete) {
    students = students.filter((student) => student.studentId !== id);

    saveToLocalStorage();
    displayStudents();
    resetForm();
  }
}

searchInput.addEventListener("input", function () {
  const searchValue = searchInput.value.toLowerCase();

  const filteredStudents = students.filter((student) => {
    return (
      student.studentId.toLowerCase().includes(searchValue) ||
      student.fullName.toLowerCase().includes(searchValue) ||
      student.course.toLowerCase().includes(searchValue)
    );
  });

  displayStudents(filteredStudents);
});

clearAllBtn.addEventListener("click", function () {
  const confirmClear = confirm("Are you sure you want to clear all student records?");

  if (confirmClear) {
    students = [];
    localStorage.removeItem("students");
    displayStudents();
    resetForm();
  }
});

resetBtn.addEventListener("click", resetForm);

function resetForm() {
  studentForm.reset();
  clearErrors();

  editId = null;

  formTitle.textContent = "Add Student";
  submitBtn.textContent = "Add Student";
}

displayStudents();