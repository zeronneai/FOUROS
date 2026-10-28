/**
 * Four O's Timepieces · Leads backend
 * Google Apps Script web app bound to a Google Sheet.
 *
 * One endpoint, three actions (all POST, JSON body as text/plain):
 *   (no action)          -> website form submission: saves row, emails lead + owner
 *   { action: 'list' }   -> admin panel: returns all leads (requires admin key)
 *   { action: 'status' } -> admin panel: updates a lead's status (requires admin key)
 *
 * The admin key lives in Script Properties (ADMIN_KEY), never in the website code.
 */

const CONFIG = {
  SHEET_NAME: 'Leads',
  // Owner alert emails. Leave EMPTY [] until you know Edward's email:
  // the admin panel works without it.
  OWNER_EMAILS: [],
  // Where the lead's replies go. Leave '' to use the account that owns this script.
  REPLY_TO: '',
  BRAND: "Four O's Timepieces",
  INSTAGRAM_URL: 'https://www.instagram.com/four_os_timepieces/',
  SEND_CONFIRMATION_TO_LEAD: true,
  TIMEZONE: 'America/Denver', // El Paso time
  STATUSES: ['New', 'Contacted', 'Negotiating', 'Sold', 'Not a fit']
};

const HEADERS = [
  'Timestamp', 'Name', 'Email', 'Phone', 'Dream piece',
  'Budget', 'Collector stage', 'Page', 'Source', 'Status', 'Notes'
];

/* ---------- Entry points ---------- */

function doGet() {
  return json_({ ok: true, service: 'fouros-leads' });
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (_) {
    return json_({ ok: false, error: 'bad_json' });
  }

  try {
    if (data.action === 'list') return adminList_(data);
    if (data.action === 'status') return adminStatus_(data);
    return submitLead_(data);
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server_error' });
  }
}

/* ---------- Public: form submission ---------- */

function submitLead_(data) {
  // Honeypot: bots fill hidden fields, humans don't
  if (data.website) return json_({ ok: true });

  const lead = {
    name: clean_(data.name, 80),
    email: clean_(data.email, 120).toLowerCase(),
    phone: clean_(data.phone, 40),
    dreamPiece: clean_(data.dreamPiece, 200),
    budget: clean_(data.budget, 40),
    stage: clean_(data.stage, 60),
    page: clean_(data.page, 200),
    source: clean_(data.source, 40) || 'popup'
  };

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email);
  const phoneOk = lead.phone.replace(/\D/g, '').length >= 7;
  if (!emailOk) lead.email = '';
  if (!phoneOk) lead.phone = '';
  if (!emailOk && !phoneOk) return json_({ ok: false, error: 'contact_required' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  let timestamp;
  try {
    const sheet = getSheet_();
    timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm');
    sheet.appendRow([
      timestamp, lead.name, lead.email, lead.phone, lead.dreamPiece,
      lead.budget, lead.stage, lead.page, lead.source, 'New', ''
    ].map(safeCell_));
  } finally {
    lock.releaseLock();
  }

  // Emails never block the save: if one fails, the lead is already stored
  try { if (CONFIG.OWNER_EMAILS.length) notifyOwner_(lead, timestamp); } catch (err) { console.error(err); }
  try { if (CONFIG.SEND_CONFIRMATION_TO_LEAD && lead.email) confirmLead_(lead); } catch (err) { console.error(err); }

  return json_({ ok: true });
}

/* ---------- Admin: list + status ---------- */

function checkKey_(data) {
  const key = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
  if (!key) return false;
  const given = String(data.key || '');
  // Constant-time-ish compare
  if (given.length !== key.length) return false;
  let diff = 0;
  for (let i = 0; i < key.length; i++) diff |= given.charCodeAt(i) ^ key.charCodeAt(i);
  return diff === 0;
}

function adminList_(data) {
  if (!checkKey_(data)) {
    Utilities.sleep(800); // slow down guessing
    return json_({ ok: false, error: 'unauthorized' });
  }
  const sheet = getSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return json_({ ok: true, leads: [], statuses: CONFIG.STATUSES });

  const values = sheet.getRange(2, 1, last - 1, HEADERS.length).getDisplayValues();
  const leads = values.map(function (r, i) {
    return {
      id: i + 2, // sheet row number
      timestamp: r[0], name: r[1], email: r[2], phone: unsafe_(r[3]),
      dreamPiece: r[4], budget: r[5], stage: r[6], page: r[7],
      source: r[8], status: r[9] || 'New', notes: r[10] || ''
    };
  }).filter(function (l) { return l.timestamp; }).reverse(); // newest first

  return json_({ ok: true, leads: leads, statuses: CONFIG.STATUSES });
}

function adminStatus_(data) {
  if (!checkKey_(data)) {
    Utilities.sleep(800);
    return json_({ ok: false, error: 'unauthorized' });
  }
  const row = parseInt(data.id, 10);
  const sheet = getSheet_();
  if (!row || row < 2 || row > sheet.getLastRow()) return json_({ ok: false, error: 'bad_id' });

  if (data.status !== undefined) {
    if (CONFIG.STATUSES.indexOf(data.status) === -1) return json_({ ok: false, error: 'bad_status' });
    sheet.getRange(row, 10).setValue(data.status);
  }
  if (data.notes !== undefined) {
    sheet.getRange(row, 11).setValue(safeCell_(clean_(data.notes, 1000)));
  }
  return json_({ ok: true });
}

/* ---------- Emails ---------- */

function notifyOwner_(lead, timestamp) {
  const piece = lead.dreamPiece || 'Open to suggestions';
  const subject = 'New lead: ' + piece + (lead.budget ? ' · ' + lead.budget : '');

  const rows = [
    ['Name', esc_(lead.name || 'Not provided')],
    ['Dream piece', esc_(piece)],
    ['Budget', esc_(lead.budget || 'Not provided')],
    ['Collector stage', esc_(lead.stage || 'Not provided')],
    ['Email', lead.email ? '<a href="mailto:' + esc_(lead.email) + '" style="color:#C9A55C">' + esc_(lead.email) + '</a>' : 'Not provided'],
    ['Phone', lead.phone ? '<a href="tel:' + esc_(lead.phone) + '" style="color:#C9A55C">' + esc_(lead.phone) + '</a>' : 'Not provided'],
    ['Received', esc_(timestamp + ' (El Paso)')]
  ];

  const table = rows.map(function (r) {
    return '<tr><td style="padding:10px 16px 10px 0;color:#8A857B;font-size:12px;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap">'
      + esc_(r[0]) + '</td><td style="padding:10px 0;color:#F5F2EC;font-size:15px">' + r[1] + '</td></tr>';
  }).join('');

  const html = wrap_(
    '<p style="margin:0 0 6px;color:#C9A55C;font-size:11px;letter-spacing:.3em;text-transform:uppercase">New lead</p>'
    + '<h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:26px;color:#F5F2EC;font-weight:600">' + esc_(piece) + '</h1>'
    + '<table style="border-collapse:collapse;width:100%">' + table + '</table>'
    + '<p style="margin:28px 0 0;color:#8A857B;font-size:13px">See and manage every lead in your admin panel.</p>'
  );

  const options = { name: CONFIG.BRAND + ' Website', htmlBody: html };
  if (lead.email) options.replyTo = lead.email;
  MailApp.sendEmail(CONFIG.OWNER_EMAILS.join(','), subject, stripHtml_(html), options);
}

function confirmLead_(lead) {
  const first = lead.name ? lead.name.split(' ')[0] : '';
  const greeting = first ? 'Hi ' + esc_(first) + ',' : 'Hi,';
  const pieceLine = lead.dreamPiece
    ? 'We noted your interest in the <strong style="color:#F5F2EC">' + esc_(lead.dreamPiece) + '</strong>. '
    : '';

  const html = wrap_(
    '<p style="margin:0 0 6px;color:#C9A55C;font-size:11px;letter-spacing:.3em;text-transform:uppercase">' + esc_(CONFIG.BRAND) + '</p>'
    + '<h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:26px;color:#F5F2EC;font-weight:600">Your next piece, noted.</h1>'
    + '<p style="margin:0 0 16px;color:#B8B2A7;font-size:15px;line-height:1.7">' + greeting + '</p>'
    + '<p style="margin:0 0 16px;color:#B8B2A7;font-size:15px;line-height:1.7">Thank you for sharing what you are looking for. '
    + pieceLine + 'We will personally review your request and reach out shortly with options that fit you.</p>'
    + '<p style="margin:0 0 28px;color:#B8B2A7;font-size:15px;line-height:1.7">In the meantime, see what just arrived:</p>'
    + '<a href="' + CONFIG.INSTAGRAM_URL + '" style="display:inline-block;padding:14px 28px;border:1px solid #C9A55C;color:#F5F2EC;text-decoration:none;font-size:12px;letter-spacing:.2em;text-transform:uppercase">View on Instagram</a>'
  );

  const options = { name: CONFIG.BRAND, htmlBody: html };
  if (CONFIG.REPLY_TO) options.replyTo = CONFIG.REPLY_TO;
  MailApp.sendEmail(lead.email, 'Your next piece, noted.', stripHtml_(html), options);
}

function wrap_(inner) {
  return '<div style="background:#0A0A0B;padding:40px 16px;font-family:Helvetica,Arial,sans-serif">'
    + '<div style="max-width:520px;margin:0 auto;background:#141416;border:1px solid #2A2A2C;padding:36px 32px">'
    + inner
    + '</div></div>';
}

/* ---------- Helpers ---------- */

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function clean_(value, max) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, max);
}

// Prevents formula injection in the sheet (values starting with = + - @)
function safeCell_(value) {
  const v = String(value);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

// Removes the protective apostrophe when reading back (e.g. "'+1 915...")
function unsafe_(value) {
  return String(value).replace(/^'/, '');
}

function esc_(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function stripHtml_(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------- Run these from the editor ---------- */

// 1) Run once: creates the Leads tab, generates the admin key, asks for permissions.
//    Copy the key from the execution log: that is the admin panel password.
function setup() {
  getSheet_();
  const props = PropertiesService.getScriptProperties();
  let key = props.getProperty('ADMIN_KEY');
  if (!key) {
    key = Utilities.getUuid().replace(/-/g, '').slice(0, 20);
    props.setProperty('ADMIN_KEY', key);
  }
  Logger.log('Leads sheet ready. ADMIN KEY (panel password): ' + key);
}

// Sets an easy-to-remember admin password. Edit NEW_PASSWORD, run this
// function once, then erase the password from here and save (so it doesn't
// stay written in the code). No redeploy needed: it takes effect immediately.
function setAdminPassword() {
  const NEW_PASSWORD = 'WRITE-YOUR-PASSWORD-HERE';
  if (NEW_PASSWORD === 'WRITE-YOUR-PASSWORD-HERE' || NEW_PASSWORD.length < 8) {
    throw new Error('Write a password of at least 8 characters in NEW_PASSWORD first.');
  }
  PropertiesService.getScriptProperties().setProperty('ADMIN_KEY', NEW_PASSWORD);
  Logger.log('Admin password updated. Now erase it from this function and save.');
}

// Generates a brand new admin key (use if the old one leaked). Old key stops working.
function rotateAdminKey() {
  const key = Utilities.getUuid().replace(/-/g, '').slice(0, 20);
  PropertiesService.getScriptProperties().setProperty('ADMIN_KEY', key);
  Logger.log('NEW ADMIN KEY: ' + key);
}

// 2) Test end to end: writes a row and sends the confirmation to the email below.
function testLead() {
  const fake = {
    postData: {
      contents: JSON.stringify({
        name: 'Test Lead',
        email: Session.getActiveUser().getEmail(),
        phone: '9155550100',
        dreamPiece: 'Rolex Submariner Starbucks',
        budget: '$10K to $20K',
        stage: 'Building my collection',
        page: 'test',
        source: 'editor-test'
      })
    }
  };
  Logger.log(doPost(fake).getContent());
}
