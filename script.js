document.addEventListener("DOMContentLoaded", function () {
  let calendarEl = document.getElementById("calendar");
  let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "fr",
    events: JSON.parse(localStorage.getItem("activities") || "[]"),
    eventClick: function(info) {
      if (confirm("Supprimer cette activité ?")) {
        deleteEventById(calendar, info.event.id);
      }
    }
  });
  calendar.render();

  const form = document.getElementById("activityForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("activityName").value;
    const time = document.getElementById("activityTime").value;
    const category = document.getElementById("activityCategory").value;

    const activity = {
      id: Date.now().toString(),
      title: name + " (" + category + ")",
      start: time,
      color: category === "Travail" ? "#2196f3" : category === "Étude" ? "#4caf50" : "#ff9800"
    };

    addDeletableEvent(calendar, activity);
    form.reset();
    scheduleNotification(activity.title, activity.start);
  });

  function scheduleNotification(title, time) {
    const delay = new Date(time).getTime() - Date.now();
    if (delay > 0 && Notification.permission === "granted") {
      setTimeout(() => {
        new Notification("⏰ Rappel", { body: `${title} commence maintenant !` });
      }, delay);
    }
  }

  function addDeletableEvent(calendar, activity) {
    calendar.addEvent(activity);
    let activities = JSON.parse(localStorage.getItem("activities") || "[]");
    activities.push(activity);
    localStorage.setItem("activities", JSON.stringify(activities));
  }

  function deleteEventById(calendar, id) {
    const event = calendar.getEventById(id);
    if (event) event.remove();
    let activities = JSON.parse(localStorage.getItem("activities") || "[]");
    activities = activities.filter((a) => a.id !== id);
    localStorage.setItem("activities", JSON.stringify(activities));
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});
