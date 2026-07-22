// HTML elemanlarını seçiyoruz.
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");

const totalTask = document.querySelector("#totalTask");
const completedTask = document.querySelector("#completedTask");

const clearAllButton = document.querySelector("#clearAllButton");

const showAllButton = document.querySelector("#showAllButton");
const showActiveButton = document.querySelector("#showActiveButton");
const showCompletedButton = document.querySelector("#showCompletedButton");

// Tarayıcıda kayıtlı görevleri alıyoruz.
// Kayıtlı görev yoksa boş bir dizi oluşturuyoruz.
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Başlangıçta bütün görevleri gösteriyoruz.
let currentFilter = "all";

// Görevleri localStorage içine kaydeder.
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Toplam ve tamamlanan görev sayılarını günceller.
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

// Aktif filtre butonunun görünümünü değiştirir.
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

// Görevleri ekranda gösterir.
function renderTasks() {
  // Önceden gösterilen görevleri temizler.
  taskList.innerHTML = "";

  // Seçilen filtreye uygun görevleri alır.
  const filteredTasks = getFilteredTasks();

  // Görev bulunmuyorsa bilgi mesajı gösterir.
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

    // Görev tamamlandıysa completed sınıfını ekler.
    if (task.completed === true) {
      taskSpan.classList.add("completed");
    }

    // Görev yazısına tıklanınca durumunu değiştirir.
    taskSpan.addEventListener("click", function () {
      task.completed = !task.completed;

      saveTasks();
      renderTasks();
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

      saveTasks();
      renderTasks();
    });

    // Görev yazısını ve sil butonunu liste elemanına ekler.
    newTask.appendChild(taskSpan);
    newTask.appendChild(deleteButton);

    // Liste elemanını görev listesine ekler.
    taskList.appendChild(newTask);
  });

  updateCounters();
}

// Form gönderildiğinde yeni görev ekler.
taskForm.addEventListener("submit", function (event) {
  // Formun sayfayı yenilemesini engeller.
  event.preventDefault();

  // Input içindeki yazıyı alır.
  const taskText = taskInput.value.trim();

  // Boş görev eklenmesini engeller.
  if (taskText === "") {
    alert("Lütfen bir görev yazınız.");
    return;
  }

  // Yeni görev nesnesi oluşturur.
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  // Yeni görevi görevler dizisine ekler.
  tasks.push(newTask);

  saveTasks();
  renderTasks();

  // Input alanını temizler.
  taskInput.value = "";
  taskInput.focus();
});

// Tümü butonu
showAllButton.addEventListener("click", function () {
  currentFilter = "all";

  updateFilterButtons();
  renderTasks();
});

// Yapılacak butonu
showActiveButton.addEventListener("click", function () {
  currentFilter = "active";

  updateFilterButtons();
  renderTasks();
});

// Tamamlanan butonu
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

    saveTasks();
    renderTasks();
  }
});

// Sayfa ilk açıldığında çalışır.
updateFilterButtons();
renderTasks();
