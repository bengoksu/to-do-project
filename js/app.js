// HTML elemanlarını seçiyoruz.
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskButton = document.querySelector("#taskButton");
const taskList = document.querySelector("#taskList");

const totalTask = document.querySelector("#totalTask");
const completedTask = document.querySelector("#completedTask");

const clearAllButton = document.querySelector("#clearAllButton");

const showAllButton = document.querySelector("#showAllButton");
const showActiveButton = document.querySelector("#showActiveButton");
const showCompletedButton = document.querySelector("#showCompletedButton");

// LocalStorage'daki görevleri alıyoruz.
// Kayıt yoksa boş bir dizi oluşturuyoruz.
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Başlangıçta bütün görevler gösterilecek.
let currentFilter = "all";

// Düzenlenen görevin kimliğini burada tutacağız.
// null olması, şu anda hiçbir görevin düzenlenmediği anlamına gelir.
let editingTaskId = null;

// Görevleri localStorage'a kaydeder.
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Sayaçları günceller.
function updateCounters() {
  totalTask.textContent = tasks.length;

  const completedTasks = tasks.filter(function (task) {
    return task.completed === true;
  });

  completedTask.textContent = completedTasks.length;
}

// Seçilen filtreye göre görevleri döndürür.
function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter(function (task) {
      return task.completed === false;
    });
  }

  if (currentFilter === "completed") {
    return tasks.filter(function (task) {
      return task.completed === true;
    });
  }

  return tasks;
}

// Seçili filtre butonunun görünümünü değiştirir.
function updateFilterButtons() {
  showAllButton.className = "btn btn-outline-primary btn-sm";
  showActiveButton.className = "btn btn-outline-primary btn-sm";
  showCompletedButton.className = "btn btn-outline-success btn-sm";

  if (currentFilter === "all") {
    showAllButton.className = "btn btn-primary btn-sm";
  }

  if (currentFilter === "active") {
    showActiveButton.className = "btn btn-primary btn-sm";
  }

  if (currentFilter === "completed") {
    showCompletedButton.className = "btn btn-success btn-sm";
  }
}

// Düzenleme işlemini kapatır.
function resetEditMode() {
  editingTaskId = null;
  taskInput.value = "";
  taskButton.textContent = "Ekle";
}

// Görevleri ekranda gösterir.
function renderTasks() {
  // Önceden ekranda bulunan görevleri temizler.
  taskList.innerHTML = "";

  // Seçilen filtreye uygun görevleri alır.
  const filteredTasks = getFilteredTasks();

  // Görev bulunmuyorsa mesaj gösterir.
  if (filteredTasks.length === 0) {
    const emptyMessage = document.createElement("li");

    emptyMessage.classList.add("list-group-item", "text-center", "text-muted");

    emptyMessage.textContent = "Görev bulunmuyor.";

    taskList.appendChild(emptyMessage);
  }

  // Görevleri tek tek oluşturur.
  filteredTasks.forEach(function (task) {
    const newTask = document.createElement("li");

    newTask.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center",
    );

    // Görev yazısını oluşturur.
    const taskSpan = document.createElement("span");
    taskSpan.textContent = task.text;

    // Görev tamamlandıysa üzerini çizer.
    if (task.completed === true) {
      taskSpan.classList.add("completed");
    }

    // Görev yazısına tıklanınca tamamlanma durumunu değiştirir.
    taskSpan.addEventListener("click", function () {
      task.completed = !task.completed;

      saveTasks();
      renderTasks();
    });

    // Düzenle butonunu oluşturur.
    const editButton = document.createElement("button");

    editButton.textContent = "Düzenle";

    editButton.classList.add("btn", "btn-warning", "btn-sm");

    // Düzenle butonuna basıldığında görev yazısını input'a getirir.
    editButton.addEventListener("click", function () {
      taskInput.value = task.text;

      editingTaskId = task.id;

      taskButton.textContent = "Güncelle";

      taskInput.focus();
    });

    // Sil butonunu oluşturur.
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Sil";

    deleteButton.classList.add("btn", "btn-danger", "btn-sm");

    // Sil butonuna basılınca ilgili görevi siler.
    deleteButton.addEventListener("click", function () {
      tasks = tasks.filter(function (item) {
        return item.id !== task.id;
      });

      // Silinen görev düzenleniyorsa düzenleme modunu kapatır.
      if (editingTaskId === task.id) {
        resetEditMode();
      }

      saveTasks();
      renderTasks();
    });

    // Butonları yan yana tutacak alanı oluşturur.
    const buttonGroup = document.createElement("div");

    buttonGroup.classList.add("d-flex", "gap-2");

    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);

    // Görev yazısını ve butonları listeye ekler.
    newTask.appendChild(taskSpan);
    newTask.appendChild(buttonGroup);

    taskList.appendChild(newTask);
  });

  updateCounters();
}

// Form gönderildiğinde çalışır.
taskForm.addEventListener("submit", function (event) {
  // Formun sayfayı yenilemesini engeller.
  event.preventDefault();

  const taskText = taskInput.value.trim();

  // Boş görev eklenmesini veya güncellenmesini engeller.
  if (taskText === "") {
    alert("Lütfen bir görev yazınız.");
    return;
  }

  // Bir görev düzenleniyorsa mevcut görevi günceller.
  if (editingTaskId !== null) {
    const taskToUpdate = tasks.find(function (task) {
      return task.id === editingTaskId;
    });

    if (taskToUpdate !== undefined) {
      taskToUpdate.text = taskText;
    }

    resetEditMode();
  } else {
    // Düzenleme yapılmıyorsa yeni görev oluşturur.
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    tasks.push(newTask);

    taskInput.value = "";
  }

  saveTasks();
  renderTasks();

  taskInput.focus();
});

// Tümü filtresi
showAllButton.addEventListener("click", function () {
  currentFilter = "all";

  updateFilterButtons();
  renderTasks();
});

// Yapılacak filtresi
showActiveButton.addEventListener("click", function () {
  currentFilter = "active";

  updateFilterButtons();
  renderTasks();
});

// Tamamlanan filtresi
showCompletedButton.addEventListener("click", function () {
  currentFilter = "completed";

  updateFilterButtons();
  renderTasks();
});

// Bütün görevleri siler.
clearAllButton.addEventListener("click", function () {
  if (tasks.length === 0) {
    alert("Silinecek görev bulunmuyor.");
    return;
  }

  const answer = confirm("Tüm görevleri silmek istediğinize emin misiniz?");

  if (answer === true) {
    tasks = [];

    resetEditMode();
    saveTasks();
    renderTasks();
  }
});

// Sayfa açıldığında çalışır.
updateFilterButtons();
renderTasks();
