const baseURL = "https://css-js-education.onrender.com"

const courseTable = document.querySelector("#courseTable");

async function deleteCourse(e) {
  e.preventDefault();
  const id = document.querySelector(".deleteForm").getAttribute("id");
  await axios.delete(`${baseURL}/deleteCourse?id=${id}`).then((res) => alert(res.data));
  window.location.reload();
}

document.querySelector(".deleteForm").addEventListener("submit", deleteCourse);

async function editCourse(e) {
  e.preventDefault();
  const data = {
    id: +document.querySelector(".editForm").getAttribute("id"),
    name: e.target.editName.value,
    slug: e.target.editSlug.value,
    description: e.target.editDescription.value,
  };
  console.log(data);
  await axios.patch(`${baseURL}/updateCourse`, data).then((res) => alert(res.data));
  e.target.editName.value = "";
  e.target.editSlug.value = "";
  e.target.editDescription.value = "";
  window.location.reload();
}

document.querySelector(".editForm").addEventListener("submit", editCourse);

function getCourse(id) {
  return axios.get(`${baseURL}/getCourse?id=${id}`).then((res) => res.data);
}

function getAllCourse() {
  axios.get(`${baseURL}/getAllCourses`).then((res) => {
    const courses = res.data;
    courses.forEach((course) => {
      const tr = () => document.createElement("tr");
      const td = () => document.createElement("td");
      const button = () => document.createElement("button");

      const trCourse = tr();
      trCourse.setAttribute("id", course.id);

      const tdId = document.createElement("th");
      tdId.setAttribute("scope", "row");
      tdId.textContent = course.id;
      const tdName = td();
      tdName.textContent = course.name;
      const tdSlug = td();
      tdSlug.textContent = course.slug;
      const tdDescription = td();
      tdDescription.textContent = course.description;

      const editBtn = button();
      editBtn.textContent = "Edit";
      editBtn.setAttribute("class", "btn btn-success me-2");
      editBtn.setAttribute("type", "button");
      editBtn.addEventListener("click", async () => {
        const a = document.createElement("a");
        a.setAttribute("data-bs-toggle", "modal");
        a.setAttribute("data-bs-target", "#editCourse");
        a.style.display = "none";
        document.body.append(a);
        a.click();
        const courseData = await getCourse(course.id);
        document.querySelector(".editForm #editName").value = courseData.name;
        document.querySelector(".editForm #editSlug").value = courseData.slug;
        document.querySelector(".editForm #editDescription").value = courseData.description;
        document.querySelector(".editForm").setAttribute("id", courseData.id);
      });

      const deleteBtn = button();
      deleteBtn.textContent = "Delete";
      deleteBtn.setAttribute("class", "btn btn-danger");
      deleteBtn.setAttribute("type", "button");
      deleteBtn.setAttribute("data-bs-toggle", "modal");
      deleteBtn.setAttribute("data-bs-target", "#deleteCourse");
      document.querySelector(".deleteForm").setAttribute("id", course.id);

      const tdTools = td();
      tdTools.append(editBtn, deleteBtn);

      trCourse.append(tdId, tdName, tdSlug, tdDescription, tdTools);

      courseTable.append(trCourse);
    });
  });
}

getAllCourse();

const courseForm = document.querySelector("#courseForm");

async function createCourseFunc(e) {
  e.preventDefault();
  const data = {
    name: e.target.name.value,
    slug: e.target.slug.value,
    description: e.target.description.value,
  };
  await axios.post(`${baseURL}/createCourse`, data).then((res) => alert(res.data));

  e.target.name.value = "";
  e.target.slug.value = "";
  e.target.description.value = "";
  window.location.reload();
}

courseForm.addEventListener("submit", createCourseFunc);
