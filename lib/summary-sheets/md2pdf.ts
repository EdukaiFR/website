import { marked } from 'marked';
import './md2pdf.css';

import html2pdf from "html2pdf.js";

/**
 * Generate and download a PDF from a markdown string.
 * @param courseTitle The title to use in the PDF filename.
 * @param markdown The markdown content to convert.
 */
export async function generateMarkdownPdf(courseTitle: string, markdown: string) {
  const htmlContent = await marked.parse(markdown);

  const element = document.createElement('div');
  element.className = 'markdown-pdf';
  element.innerHTML = htmlContent;

  const today = new Date().toISOString().slice(0, 10);
  const filename = `${courseTitle}-summarySheet-${today}.pdf`;

  const options = {
    margin: 1,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'in',
      format: 'letter',
      orientation: 'portrait',
    },
  };

  await html2pdf().set(options).from(element).save();
}
