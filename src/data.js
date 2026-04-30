const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const EXCEL_PATH = path.join(__dirname, '..', 'game input.xlsx');
const CSV_PATH = path.join(__dirname, '..', 'game input.csv');

const HEADERS = [
  'date',
  'round 1',
  'round 2',
  'round 3',
  'score (out of 3)',
  'raffle prize',
  'full name',
  'company',
  'company email'
];

function formatDate(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function csvEscape(value) {
  const s = value == null ? '' : String(value);
  if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

// Append-only CSV mirror. Survives even when the xlsx is locked open in Excel,
// so entries are never silently dropped during the festival.
function appendCsvRow(row) {
  const line = row.map(csvEscape).join(',') + '\n';
  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, '﻿' + HEADERS.map(csvEscape).join(',') + '\n', 'utf8');
  }
  fs.appendFileSync(CSV_PATH, line, 'utf8');
}

function saveEntry(data) {
  const row = [
    formatDate(new Date()),
    data.round1 || '',
    data.round2 || '',
    data.round3 || '',
    data.score,
    data.rafflePrize || '',
    data.fullName || '',
    data.company || '',
    data.companyEmail || ''
  ];

  let csvOk = false;
  let csvError = null;
  try {
    appendCsvRow(row);
    csvOk = true;
  } catch (err) {
    csvError = err.message;
  }

  let xlsxOk = false;
  let xlsxError = null;
  try {
    let workbook;
    let sheet;
    if (fs.existsSync(EXCEL_PATH)) {
      workbook = XLSX.readFile(EXCEL_PATH);
      sheet = workbook.Sheets[workbook.SheetNames[0]];
    } else {
      workbook = XLSX.utils.book_new();
      sheet = XLSX.utils.aoa_to_sheet([HEADERS]);
      XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
    }
    XLSX.utils.sheet_add_aoa(sheet, [row], { origin: -1 });
    XLSX.writeFile(workbook, EXCEL_PATH);
    xlsxOk = true;
  } catch (err) {
    xlsxError = err.code === 'EBUSY' ? 'Excel file is open — close it and try again.' : err.message;
  }

  // The csv is the safety net. As long as csv succeeded, the entry is durable.
  if (csvOk) return { success: true, xlsx: xlsxOk, xlsxError };
  return { success: false, error: xlsxError || csvError || 'Unknown error' };
}

module.exports = { saveEntry };
