const API_URL = 'http://localhost:4000';

const jobListEl = document.getElementById('job-list');

document.getElementById('email-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const payload = {
    to: form.to.value,
    subject: form.subject.value,
    body: form.body.value,
    priority: form.priority.value,
  };

  const res = await fetch(`${API_URL}/api/jobs/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (res.ok) {
    trackJob('email', data.jobId);
    form.reset();
  } else {
    alert(data.message || 'Failed to queue email job');
  }
});

document.getElementById('image-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const payload = { imageUrl: form.imageUrl.value, priority: form.priority.value };

  const res = await fetch(`${API_URL}/api/jobs/image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (res.ok) {
    trackJob('image', data.jobId);
  } else {
    alert(data.message || 'Failed to queue image job');
  }
});

// adds a row for the job and starts polling its status every 1.5s
// until it reaches a final state (completed or failed)
function trackJob(queue, jobId) {
  const li = document.createElement('li');
  li.id = `job-${queue}-${jobId}`;
  li.innerHTML = `
    <strong>${queue}</strong> #${jobId} - <span class="state">queued</span>
    <div class="progress-bar"><div class="progress-bar-fill" style="width:0%"></div></div>
  `;
  jobListEl.prepend(li);

  const intervalId = setInterval(() => pollJob(queue, jobId, intervalId), 1500);
  pollJob(queue, jobId, intervalId);
}

async function pollJob(queue, jobId, intervalId) {
  const res = await fetch(`${API_URL}/api/jobs/${queue}/${jobId}`);
  if (!res.ok) return;
  const data = await res.json();

  const li = document.getElementById(`job-${queue}-${jobId}`);
  if (!li) return;

  const stateEl = li.querySelector('.state');
  const fillEl = li.querySelector('.progress-bar-fill');

  stateEl.textContent = data.state;
  stateEl.className = `state state-${data.state}`;
  fillEl.style.width = `${data.progress || 0}%`;

  const isDone = data.state === 'completed' || data.state === 'failed';

  if (data.state === 'failed') {
    const detail = document.createElement('div');
    detail.className = 'hint';
    detail.textContent = `Failed: ${data.failedReason} (attempt ${data.attemptsMade})`;
    li.appendChild(detail);
  }

  if (isDone) {
    clearInterval(intervalId);
  }
}

document.getElementById('refresh-stats').addEventListener('click', loadStats);
loadStats();

async function loadStats() {
  const [emailRes, imageRes] = await Promise.all([
    fetch(`${API_URL}/api/jobs/email/stats`),
    fetch(`${API_URL}/api/jobs/image/stats`),
  ]);
  const emailData = await emailRes.json();
  const imageData = await imageRes.json();

  document.getElementById('email-stats').textContent = JSON.stringify(emailData.counts, null, 2);
  document.getElementById('image-stats').textContent = JSON.stringify(imageData.counts, null, 2);
}
