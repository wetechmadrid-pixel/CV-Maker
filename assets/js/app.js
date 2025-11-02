// assets/js/app.js
import { renderCV } from './templates.js';
import { saveDraft, loadDraft } from './storage.js';
import { exportToPDF } from './export.js';

const state = {
  name: '', title: '', email: '', phone: '', location: '', website: '',
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  photo: '',
  themeColor: '#0b5fff',
  fontFamily: 'Inter,Arial,sans-serif',
  template: 'templateA',
};

const $ = (s) => document.querySelector(s);
const cvRoot = $('#cv-root');

function updatePreview() {
  cvRoot.innerHTML = renderCV(state, state.template);
}

function bindInputs() {
  ['name','title','email','phone','location','website','summary'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => { state[id] = el.value; updatePreview(); });
  });

  $('#theme-color').addEventListener('input', (e) => { state.themeColor = e.target.value; updatePreview(); });
  $('#font-select').addEventListener('change', (e) => { state.fontFamily = e.target.value; updatePreview(); });

  $('#template-select').addEventListener('change', (e) => { state.template = e.target.value; updatePreview(); });

  $('#photo').addEventListener('change', handlePhotoUpload);

  $('#add-skill').addEventListener('click', () => {
    const input = $('#skill-input'); const val = input.value.trim(); if (!val) return;
    state.skills.push(val); input.value=''; renderSkillChips(); updatePreview();
  });

  $('#add-experience').addEventListener('click', () => addExperience());
  $('#add-education').addEventListener('click', () => addEducation());
  $('#add-project').addEventListener('click', () => addProject());

  $('#btn-save-draft').addEventListener('click', () => saveDraft(state));
  $('#btn-load-draft').addEventListener('click', () => {
    const data = loadDraft();
    if (data) { Object.assign(state, data); hydrateUI(); updatePreview(); } else { alert('No draft found.'); }
  });

  $('#btn-save-pdf').addEventListener('click', () => exportToPDF('#cv-root .cv'));
}

function handlePhotoUpload(e) {
  const file = e.target.files?.[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { state.photo = reader.result; updatePreview(); };
  reader.readAsDataURL(file);
}

function renderSkillChips() {
  const list = $('#skills-list'); list.innerHTML = '';
  state.skills.forEach((s, idx) => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.innerHTML = `${s} <button data-i="${idx}" class="remove">x</button>`;
    list.appendChild(chip);
  });
  list.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = +e.target.getAttribute('data-i'); state.skills.splice(i,1);
      renderSkillChips(); updatePreview();
    });
  });
}

function addExperience(data = {}) {
  state.experience.push({ role: data.role||'', company: data.company||'', start: data.start||'', end: data.end||'', description: data.description||'', bullets: data.bullets||[] });
  renderExperienceForms(); updatePreview();
}

function renderExperienceForms() {
  const root = $('#experience-list'); root.innerHTML = '';
  state.experience.forEach((e, i) => {
    const el = document.createElement('div'); el.className = 'card';
    el.innerHTML = `
      <div class="field-row">
        <div class="field-group"><label>Role</label><input data-k="role" data-i="${i}" value="${e.role}" /></div>
        <div class="field-group"><label>Company</label><input data-k="company" data-i="${i}" value="${e.company}" /></div>
      </div>
      <div class="field-row">
        <div class="field-group"><label>Start</label><input data-k="start" data-i="${i}" placeholder="Jan 2022" value="${e.start}" /></div>
        <div class="field-group"><label>End</label><input data-k="end" data-i="${i}" placeholder="Present" value="${e.end}" /></div>
      </div>
      <div class="field-group"><label>Description</label><textarea data-k="description" data-i="${i}">${e.description}</textarea></div>
      <div class="field-group">
        <label>Bullets</label>
        <div class="bullets" id="bullets-${i}"></div>
        <div class="field-row">
          <input id="bullet-input-${i}" placeholder="Add bullet" />
          <button data-i="${i}" class="add-bullet">Add</button>
        </div>
      </div>
      <button class="remove-card" data-i="${i}">Remove Experience</button>
    `;
    root.appendChild(el);
  });

  root.querySelectorAll('input[data-k], textarea[data-k]').forEach(el => {
    el.addEventListener('input', () => {
      const i = +el.getAttribute('data-i'); const k = el.getAttribute('data-k');
      state.experience[i][k] = el.value; updatePreview();
    });
  });

  root.querySelectorAll('.add-bullet').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.getAttribute('data-i');
      const input = document.getElementById(`bullet-input-${i}`);
      const val = input.value.trim(); if (!val) return;
      state.experience[i].bullets.push(val); input.value=''; renderBullets(i); updatePreview();
    });
  });

  root.querySelectorAll('.remove-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.getAttribute('data-i'); state.experience.splice(i,1);
      renderExperienceForms(); updatePreview();
    });
  });

  state.experience.forEach((_, i) => renderBullets(i));
}

function renderBullets(i) {
  const container = document.getElementById(`bullets-${i}`); container.innerHTML = '';
  state.experience[i].bullets.forEach((b, j) => {
    const row = document.createElement('div'); row.className = 'bullet-row';
    row.innerHTML = `<span>${b}</span><button data-i="${i}" data-j="${j}" class="remove-bullet">x</button>`;
    container.appendChild(row);
  });
  container.querySelectorAll('.remove-bullet').forEach(btn => {
    btn.addEventListener('click', () => {
      const ii = +btn.getAttribute('data-i'); const jj = +btn.getAttribute('data-j');
      state.experience[ii].bullets.splice(jj,1); renderBullets(ii); updatePreview();
    });
  });
}

function addEducation(data = {}) {
  state.education.push({ school: data.school||'', degree: data.degree||'', start: data.start||'', end: data.end||'', details: data.details||'' });
  renderEducationForms(); updatePreview();
}

function renderEducationForms() {
  const root = $('#education-list'); root.innerHTML = '';
  state.education.forEach((e, i) => {
    const el = document.createElement('div'); el.className = 'card';
    el.innerHTML = `
      <div class="field-row">
        <div class="field-group"><label>School</label><input data-k="school" data-i="${i}" value="${e.school}" /></div>
        <div class="field-group"><label>Degree</label><input data-k="degree" data-i="${i}" value="${e.degree}" /></div>
      </div>
      <div class="field-row">
        <div class="field-group"><label>Start</label><input data-k="start" data-i="${i}" value="${e.start}" /></div>
        <div class="field-group"><label>End</label><input data-k="end" data-i="${i}" value="${e.end}" /></div>
      </div>
      <div class="field-group"><label>Details</label><textarea data-k="details" data-i="${i}">${e.details}</textarea></div>
      <button class="remove-card" data-i="${i}">Remove Education</button>
    `;
    root.appendChild(el);
  });

  root.querySelectorAll('input[data-k], textarea[data-k]').forEach(el => {
    el.addEventListener('input', () => {
      const i = +el.getAttribute('data-i'); const k = el.getAttribute('data-k');
      state.education[i][k] = el.value; updatePreview();
    });
  });

  root.querySelectorAll('.remove-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.getAttribute('data-i'); state.education.splice(i,1);
      renderEducationForms(); updatePreview();
    });
  });
}

function addProject(data = {}) {
  state.projects.push({ name: data.name||'', link: data.link||'', description: data.description||'' });
  renderProjectForms(); updatePreview();
}

function renderProjectForms() {
  const root = $('#projects-list'); root.innerHTML = '';
  state.projects.forEach((p, i) => {
    const el = document.createElement('div'); el.className = 'card';
    el.innerHTML = `
      <div class="field-row">
        <div class="field-group"><label>Name</label><input data-k="name" data-i="${i}" value="${p.name}" /></div>
        <div class="field-group"><label>Link</label><input data-k="link" data-i="${i}" value="${p.link}" /></div>
      </div>
      <div class="field-group"><label>Description</label><textarea data-k="description" data-i="${i}">${p.description}</textarea></div>
      <button class="remove-card" data-i="${i}">Remove Project</button>
    `;
    root.appendChild(el);
  });

  root.querySelectorAll('input[data-k], textarea[data-k]').forEach(el => {
    el.addEventListener('input', () => {
      const i = +el.getAttribute('data-i'); const k = el.getAttribute('data-k');
      state.projects[i][k] = el.value; updatePreview();
    });
  });

  root.querySelectorAll('.remove-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.getAttribute('data-i'); state.projects.splice(i,1);
      renderProjectForms(); updatePreview();
    });
  });
}

function hydrateUI() {
  ['name','title','email','phone','location','website','summary'].forEach(id => {
    const el = document.getElementById(id); el.value = state[id] || '';
  });
  document.getElementById('theme-color').value = state.themeColor;
  document.getElementById('font-select').value = state.fontFamily;
  document.getElementById('template-select').value = state.template;

  renderSkillChips();
  renderExperienceForms();
  renderEducationForms();
  renderProjectForms();
}

function init() {
  bindInputs(); hydrateUI(); updatePreview();
}
document.addEventListener('DOMContentLoaded', init);
