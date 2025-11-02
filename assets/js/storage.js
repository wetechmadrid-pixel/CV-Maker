// assets/js/templates.js
export function renderCV(data, templateName) {
  const t = templates[templateName] || templates.templateA;
  return t(data);
}

const templates = {
  templateA: (d) => `
    <div class="cv templateA" style="--primary:${d.themeColor}; --font:${d.fontFamily}">
      <div class="header">
        <img class="avatar" src="${d.photo || 'assets/img/placeholder-profile.png'}" alt="avatar" />
        <div>
          <h1>${escapeHTML(d.name || '')}</h1>
          <p class="muted">${escapeHTML(d.title || '')}</p>
          <p class="muted">${[d.email, d.phone, d.location, d.website].filter(Boolean).map(escapeHTML).join(' • ')}</p>
        </div>
      </div>
      ${section('Profile', `<p>${escapeHTML(d.summary || '')}</p>`)}
      ${section('Experience', (d.experience || []).map(expItem).join(''))}
      ${section('Education', (d.education || []).map(eduItem).join(''))}
      ${section('Skills', skills(d.skills))}
      ${section('Projects', (d.projects || []).map(projectItem).join(''))}
    </div>
  `,
  templateB: (d) => `
    <div class="cv templateB" style="--primary:${d.themeColor}; --font:${d.fontFamily}">
      <div class="grid">
        <aside class="sidebar">
          <img class="avatar" src="${d.photo || 'assets/img/placeholder-profile.png'}" alt="avatar" />
          <h1>${escapeHTML(d.name || '')}</h1>
          <p class="muted">${escapeHTML(d.title || '')}</p>
          <h2>Contact</h2>
          <p class="muted">${[d.email, d.phone, d.location, d.website].filter(Boolean).map(escapeHTML).join('<br/>')}</p>
          <h2>Skills</h2>
          ${skills(d.skills)}
        </aside>
        <section class="content">
          ${section('Profile', `<p>${escapeHTML(d.summary || '')}</p>`)}
          ${section('Experience', (d.experience || []).map(expItem).join(''))}
          ${section('Education', (d.education || []).map(eduItem).join(''))}
          ${section('Projects', (d.projects || []).map(projectItem).join(''))}
        </section>
      </div>
    </div>
  `,
  templateC: (d) => `
    <div class="cv templateC" style="--primary:${d.themeColor}; --font:${d.fontFamily}">
      <div class="header">
        <img class="avatar" src="${d.photo || 'assets/img/placeholder-profile.png'}" alt="avatar" />
        <h1>${escapeHTML(d.name || '')}</h1>
        <p class="muted">${escapeHTML(d.title || '')}</p>
        <p class="muted">${[d.email, d.phone, d.location, d.website].filter(Boolean).map(escapeHTML).join(' • ')}</p>
      </div>
      ${section('Profile', `<p>${escapeHTML(d.summary || '')}</p>`)}
      ${section('Experience', (d.experience || []).map(expItem).join(''))}
      ${section('Education', (d.education || []).map(eduItem).join(''))}
      ${section('Skills', skills(d.skills))}
    </div>
  `
};

function section(title, content) {
  if (!content || !content.trim()) return '';
  return `<div class="section"><h2>${title}</h2>${content}</div>`;
}

function expItem(e) {
  if (!e || !e.role) return '';
  return `
    <div class="item">
      <strong>${escapeHTML(e.role)}</strong> — ${escapeHTML(e.company || '')}
      <span class="muted"> | ${escapeHTML(e.start || '')} - ${escapeHTML(e.end || '')}</span>
      <p>${escapeHTML(e.description || '')}</p>
      ${(e.bullets && e.bullets.length) ? `<ul>${e.bullets.map(b => `<li>${escapeHTML(b)}</li>`).join('')}</ul>` : ''}
    </div>
  `;
}

function eduItem(e) {
  if (!e || !e.school) return '';
  return `
    <div class="item">
      <strong>${escapeHTML(e.degree || '')}</strong> — ${escapeHTML(e.school)}
      <span class="muted"> | ${escapeHTML(e.start || '')} - ${escapeHTML(e.end || '')}</span>
      <p>${escapeHTML(e.details || '')}</p>
    </div>
  `;
}

function projectItem(p) {
  if (!p || !p.name) return '';
  const link = p.link ? ` <a href="${encodeURI(p.link)}" target="_blank" rel="noopener">Link</a>` : '';
  return `
    <div class="item">
      <strong>${escapeHTML(p.name)}</strong>${link}
      <p>${escapeHTML(p.description || '')}</p>
    </div>
  `;
}

function skills(arr) {
  if (!arr || !arr.length) return '';
  return `<ul>${arr.map(s => `<li>${escapeHTML(s)}</li>`).join('')}</ul>`;
}

function escapeHTML(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}
