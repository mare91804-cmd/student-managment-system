
const STORAGE_KEY = "studentManagementInternship";

function getStudents() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

const form = document.getElementById("studentForm");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const students = getStudents();
  const editId = document.getElementById("editId").value;

  const student = {
    id: editId || String(Date.now()),
    studentId: document.getElementById("studentId").value.trim(),
    name: document.getElementById("studentName").value.trim(),
    department: document.getElementById("department").value,
    year: document.getElementById("year").value,
    mark: Number(document.getElementById("mark").value),
    status: document.getElementById("status").value
  };

  if (!student.studentId || !student.name) {
    alert("Please enter the Student ID and full name.");
    return;
  }

  if (!Number.isFinite(student.mark) ||
      student.mark < 0 || student.mark > 100) {
    alert("The mark must be between 0 and 100.");
    return;
  }

  const duplicate = students.some(item =>
    item.studentId.toLowerCase() === student.studentId.toLowerCase() &&
    item.id !== editId
  );

  if (duplicate) {
    alert("This Student ID already exists.");
    return;
  }

  const updated = editId
    ? students.map(item => item.id === editId ? student : item)
    : [...students, student];

  saveStudents(updated);

  form.reset();
  document.getElementById("editId").value = "";
  document.getElementById("formTitle").textContent = "Register New Student";
  document.getElementById("saveButton").textContent = "Save Student";

  renderAll();

  alert(editId ? "Student updated successfully!" : "Student registered successfully!");
});

form.addEventListener("reset", function() {
  setTimeout(() => {
    document.getElementById("editId").value = "";
    document.getElementById("formTitle").textContent = "Register New Student";
    document.getElementById("saveButton").textContent = "Save Student";
  }, 0);
});

function renderStudents() {
  const table = document.getElementById("studentTable");
  const query = document.getElementById("searchInput").value.toLowerCase();

  const students = getStudents().filter(student =>
    [
      student.studentId,
      student.name,
      student.department,
      student.status
    ].some(value => String(value).toLowerCase().includes(query))
  );

  document.getElementById("emptyMessage").style.display =
    students.length ? "none" : "block";

  table.innerHTML = students.map(student => `
    <tr>
      <td>${escapeHTML(student.studentId)}</td>
      <td>${escapeHTML(student.name)}</td>
      <td>${escapeHTML(student.department)}</td>
      <td>${escapeHTML(student.year)}</td>
      <td>${Number(student.mark).toFixed(1)}</td>
      <td>${escapeHTML(student.status)}</td>
      <td>
        <button class="action-btn edit-btn"
          data-action="edit" data-id="${escapeHTML(student.id)}">
          Edit
        </button>
        <button class="action-btn delete-btn"
          data-action="delete" data-id="${escapeHTML(student.id)}">
          Delete
        </button>
      </td>
    </tr>
  `).join("");
}

document.getElementById("searchInput").addEventListener("input", renderStudents);

document.getElementById("studentTable").addEventListener("click", function(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const students = getStudents();
  const student = students.find(item => item.id === button.dataset.id);

  if (!student) return;

  if (button.dataset.action === "edit") {
    document.getElementById("editId").value = student.id;
    document.getElementById("studentId").value = student.studentId;
    document.getElementById("studentName").value = student.name;
    document.getElementById("department").value = student.department;
    document.getElementById("year").value = student.year;
    document.getElementById("mark").value = student.mark;
    document.getElementById("status").value = student.status;

    document.getElementById("formTitle").textContent = "Edit Student";
    document.getElementById("saveButton").textContent = "Update Student";

    document.getElementById("register").scrollIntoView({
      behavior: "smooth"
    });
  }

  if (button.dataset.action === "delete") {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      saveStudents(students.filter(item => item.id !== student.id));
      renderAll();
    }
  }
});

function renderDashboard() {
  const students = getStudents();

  document.getElementById("totalStudents").textContent = students.length;

  document.getElementById("totalDepartments").textContent =
    new Set(students.map(student => student.department)).size;

  const average = students.length
    ? students.reduce((sum, student) => sum + Number(student.mark), 0)
      / students.length
    : 0;

  document.getElementById("averageMark").textContent = average.toFixed(1);

  document.getElementById("passingStudents").textContent =
    students.filter(student => Number(student.mark) >= 50).length;
}

function renderRankings() {
  const table = document.getElementById("rankingTable");

  const students = getStudents().sort(
    (a, b) => Number(b.mark) - Number(a.mark)
  );

  document.getElementById("rankingEmpty").style.display =
    students.length ? "none" : "block";

  table.innerHTML = students.map((student, index) => {
    const mark = Number(student.mark);

    const performance = mark >= 85
      ? "Excellent"
      : mark >= 70
      ? "Good"
      : mark >= 50
      ? "Pass"
      : "Needs Improvement";

    return `
      <tr>
        <td class="rank-number">${index + 1}</td>
        <td>${escapeHTML(student.studentId)}</td>
        <td>${escapeHTML(student.name)}</td>
        <td>${escapeHTML(student.department)}</td>
        <td>${mark.toFixed(1)}</td>
        <td>${performance}</td>
      </tr>
    `;
  }).join("");
}

function renderAll() {
  renderDashboard();
  renderStudents();
  renderRankings();
}

renderAll();
