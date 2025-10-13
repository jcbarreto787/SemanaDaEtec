function conclusion(checkbox) {
  const span = checkbox.nextElementSibling
  if (checkbox.checked) {
    span.style.textDecoration = "line-through"
    span.style.color = "gray"
  } else {
    span.style.textDecoration = "none"
    span.style.color = "black"
  }
  saveTasks()
}

function clearTasks() {
  if (
    (checkboxes = document.querySelectorAll(".todo-list input:checked").length)
  ) {
    localStorage.removeItem("tasks")
    document.querySelector(".todo-list").innerHTML = ""
  }
}

function saveTasks() {
  const tasks = []
  document.querySelectorAll(".todo-list li").forEach((li) => {
    const text = li.querySelector("span").textContent
    const checked = li.querySelector("input").checked
    tasks.push({ text, checked })
  })
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks")) || []
  saved.forEach((task) => addTaskToDOM(task.text, task.checked))
}

function addTask(event) {
  event.preventDefault()
  const inputTask = event.target.task
  const textTask = inputTask.value.trim()

  if (!textTask) {
          Swal.fire({
            position: "top-center",
            icon: "error",
            title: "Você não digitou nada!",
            showConfirmButton: false,
            timer: 3000,
            text: "Por favor, digite algo para adicionar à sua lista de tarefas.",
          })
    return
  }

  addTaskToDOM(textTask, false)
  inputTask.value = ""
  saveTasks()
}

function addTaskToDOM(text, checked) {
  const li = document.createElement("li")
  li.className = "checkbox"
  li.innerHTML = `
        <input type="checkbox" onclick="conclusion(this)" ${
          checked ? "checked" : ""
        }>
        <span>${text}</span>
      `
  document.querySelector(".todo-list").appendChild(li)
}

document.querySelector("#form-add-todo").addEventListener("submit", addTask)
loadTasks()
