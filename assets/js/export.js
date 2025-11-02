// assets/js/export.js
export function exportToPDF(selector) {
  const element = document.querySelector(selector);
  if (!element) return;

  const opt = {
    margin: [10, 10, 10, 10],
    filename: 'cv.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const prevWidth = element.style.width;
  const prevMinHeight = element.style.minHeight;
  element.style.width = '210mm';
  element.style.minHeight = '297mm';

  // html2pdf is loaded globally from CDN
  window.html2pdf().from(element).set(opt).save().then(() => {
    element.style.width = prevWidth;
    element.style.minHeight = prevMinHeight;
  });
}
