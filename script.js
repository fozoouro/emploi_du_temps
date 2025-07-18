let calendar;
let tasks = [];

// Charger depuis localStorage au démarrage
window.addEventListener('load', () => {
  const saved = localStorage.getItem('tasks');
  if (saved) tasks = JSON.parse(saved);

  const calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek'
    },
    events: tasks.map((task, i) => ({
      id: i,
      title: `${task.title} (${task.category})`,
      start: task.datetime,
      backgroundColor: getCategoryColor(task.category)
    })),
    eventClick: function(info) {
      if (confirm("Supprimer cette activité ?")) {
        tasks.splice(info.event.id, 1);
        saveTasks();
        calendar.refetchEvents();
      }
    }
  });

  calendar.render();
});

// Ajouter une tâche
document.getElementById('task-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const datetime = document.getElementById('datetime').value;
  const category = document.getElementById('category').value;

  tasks.push({ title, datetime, category, notified: false });
  saveTasks();

  calendar.addEvent({
    id: tasks.length - 1,
    title: `${title} (${category})`,
    start: datetime,
    backgroundColor: getCategoryColor(category)
  });

  this.reset();
});

// Couleur par catégorie
function getCategoryColor(cat) {
  switch (cat) {
    case "travail": return "#ffeeba";
    case "perso": return "#d4edda";
    case "sport": return "#cce5ff";
    case "autre": return "#f8d7da";
    default: return "#e8f0fe";
  }
}

// Sauvegarde
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Notifications système
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Vérification des rappels toutes les 60s
setInterval(() => {
  const now = new Date();
  tasks.forEach(task => {
    const time = new Date(task.datetime);
    const diff = (time - now) / 1000 / 60;
    if (diff >= 0 && diff < 10 && !task.notified) {
      showNotification(task.title, time.toLocaleString());
      task.notified = true;
    }
  });
  saveTasks();
}, 60000);

function showNotification(title, time) {
  if (Notification.permission === "granted") {
    new Notification("📅 Rappel", {
      body: `${title} à ${time}`,
      icon: "https://cdn-icons-png.flaticon.com/512/3595/3595455.png"
    });
  }
}

// PWA: Enregistrer le service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('✅ Service Worker enregistré'))
    .catch(err => console.log('❌ Erreur SW:', err));
}
