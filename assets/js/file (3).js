// assets/js/storage.js
const KEY = 'cv-maker-draft-v1';

export function saveDraft(state) {
  try {
    const data = JSON.stringify(state);
    localStorage.setItem(KEY, data);
    alert('Draft saved!');
  } catch (e) {
    console.error(e);
    alert('Failed to save draft.');
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error(e);
    alert('Failed to load draft.');
    return null;
  }
}
