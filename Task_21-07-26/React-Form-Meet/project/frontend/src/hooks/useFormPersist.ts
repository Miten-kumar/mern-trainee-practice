const STORAGE_KEY = 'jobApplicationFormProgress';

// note: we can't store File objects in localStorage, so resume/photo
// fields get stripped out before saving. user just has to re-pick
// the file if they refresh mid way, everything else is kept.
export function saveProgress(step: number, values: Record<string, unknown>) {
  const { resume, photo, ...rest } = values;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, values: rest }));
  } catch (err) {
    // localStorage can fail in private browsing mode, not a big deal if it does
    console.warn('Could not save form progress', err);
  }
}

export function loadProgress(): { step: number; values: Record<string, unknown> } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Could not load saved form progress', err);
    return null;
  }
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
