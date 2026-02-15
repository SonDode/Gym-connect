import './style.css';

const recentWorkouts = [
  { id: 101, date: '14 Feb 2026', title: 'Împins - Piept & Triceps', volume: '450 kg' },
  { id: 102, date: '12 Feb 2026', title: 'Tracțiuni - Spate & Biceps', volume: '520 kg' }
];

const historyList = document.querySelector('#history-list');
const startWorkoutBtn = document.querySelector('#start-workout-btn');

const renderHistory = () => {
  if (!historyList) return;

  historyList.innerHTML = recentWorkouts.map(workout => `
    <li class="history-item">
      <div class="history-info">
        <strong class="workout-title">${workout.title}</strong>
        <span class="workout-date">${workout.date}</span>
      </div>
      <div class="history-volume">
        <span class="volume-badge">${workout.volume}</span>
      </div>
    </li>
  `).join('');
};

if (startWorkoutBtn) {
  startWorkoutBtn.addEventListener('click', () => {
    console.log('Init workout session...');
  });
}

renderHistory();