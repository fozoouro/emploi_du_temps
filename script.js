const form = document.getElementById('activityForm');
const list = document.getElementById('activityList');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('activityName').value;
  const time = document.getElementById('activityTime').value;
  const category = document.getElementById('activityCategory').value.toLowerCase();

  const li = document.createElement('li');
  li.classList.add(category);
  li.textContent = `${name} - ${new Date(time).toLocaleString()} (${category})`;

  list.appendChild(li);
  form.reset();

  scheduleNotification(name, time);
});

function scheduleNotification(title, time) {
  const delay = new Date(time).getTime() - Date.now();
  if (delay > 0 && Notification.permission === 'granted') {
    setTimeout(() => {
      new Notification("⏰ Rappel", {
        body: `${title} commence maintenant !`,
      });
    }, delay);
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}
