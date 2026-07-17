/**
 * Vinu Birthday Bash — RSVP backend
 *
 * One-time setup:
 * 1. Create a Google Sheet named "Vinu Birthday Bash RSVPs" (or any name).
 * 2. Extensions → Apps Script → paste this entire file → Save.
 * 3. Deploy → New deployment → Type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the Web App URL into config.js → rsvpEndpoint
 * 5. Run setupSheet() once from the Apps Script editor (Run ▶)
 *    to create headers (authorize when prompted).
 *
 * On each RSVP this script will:
 *  - Append a row to the sheet (File → Download → Microsoft Excel)
 *  - Email a confirmation to the guest
 *  - Email vk00345@gmail.com a flat attendee list + .xlsx attachment
 */

var HOST_EMAIL = "vk00345@gmail.com";
var SHEET_NAME = "RSVPs";
var EVENT_NAME = "Vinu's Birthday Bash — Around the World";

function setupSheet() {
  var sheet = getOrCreateSheet_();
  ensureHeaders_(sheet);
}

function doPost(e) {
  try {
    var data = parseBody_(e);
    var sheet = getOrCreateSheet_();
    ensureHeaders_(sheet);

    var row = [
      new Date(),
      String(data.name || "").trim(),
      String(data.email || "").trim(),
      String(data.attendance || "").trim(),
      Number(data.guests) || 1,
      String(data.nights || "").trim(),
      String(data.message || "").trim(),
    ];

    if (!row[1] || !row[2] || !row[3]) {
      return json_({ ok: false, error: "Name, email, and attendance are required." });
    }

    sheet.appendRow(row);

    sendGuestConfirmation_(row[1], row[2], row[3], row[4]);
    sendHostDigest_(sheet);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

function doGet() {
  return ContentService.createTextOutput(
    EVENT_NAME + " RSVP endpoint is live."
  ).setMimeType(ContentService.MimeType.TEXT);
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Empty request body.");
  }
  return JSON.parse(e.postData.contents);
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error("Open this script from a Google Sheet (Extensions → Apps Script).");
  }
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Email",
      "Attendance",
      "Guests",
      "Nights",
      "Message",
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
  }
}

function sendGuestConfirmation_(name, email, attendance, guests) {
  var subject = "RSVP received — " + EVENT_NAME;
  var body = [
    "Hi " + name + ",",
    "",
    "Thanks for your RSVP to " + EVENT_NAME + ".",
    "",
    "Your reply: " + attendance,
    "Guests (including you): " + guests,
    "",
    "Dates: December 4–7, 2026 · Kissimmee, Florida",
    "Theme: Rat Pack Meets Mickey Mouse",
    "",
    "If anything changes, just reply to this email or submit the form again.",
    "",
    "See you there,",
    "Vinu",
  ].join("\n");

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body,
    name: "Vinu Birthday Bash",
    replyTo: HOST_EMAIL,
  });
}

function sendHostDigest_(sheet) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return;

  var yes = [];
  var maybe = [];
  var no = [];
  var yesHeadcount = 0;
  var maybeHeadcount = 0;

  for (var i = 1; i < values.length; i++) {
    var name = values[i][1];
    var email = values[i][2];
    var attendance = String(values[i][3] || "");
    var guests = Number(values[i][4]) || 1;
    var nights = values[i][5] || "";
    var line =
      "- " +
      name +
      " (" +
      guests +
      (guests === 1 ? " guest" : " guests") +
      ") — " +
      email +
      (nights ? " · " + nights : "");

    var key = attendance.toLowerCase();
    if (key === "yes") {
      yes.push(line);
      yesHeadcount += guests;
    } else if (key === "maybe") {
      maybe.push(line);
      maybeHeadcount += guests;
    } else {
      no.push(line);
    }
  }

  var body = [
    "New RSVP received for " + EVENT_NAME + ".",
    "",
    "CURRENT ATTENDEES (Yes) — " + yes.length + " replies, " + yesHeadcount + " people",
    yes.length ? yes.join("\n") : "(none yet)",
    "",
    "MAYBE — " + maybe.length + " replies, " + maybeHeadcount + " people",
    maybe.length ? maybe.join("\n") : "(none)",
    "",
    "CAN'T MAKE IT — " + no.length + " replies",
    no.length ? no.join("\n") : "(none)",
    "",
    "Full spreadsheet (also attached as Excel):",
    SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    "",
    "Tip: In the Sheet, use File → Download → Microsoft Excel (.xlsx).",
  ].join("\n");

  MailApp.sendEmail({
    to: HOST_EMAIL,
    subject:
      "Birthday RSVPs — " +
      yesHeadcount +
      " attending / " +
      maybeHeadcount +
      " maybe",
    body: body,
    name: "Vinu Birthday Bash RSVP",
    attachments: [exportSheetAsExcel_()],
  });
}

function exportSheetAsExcel_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var url =
    "https://docs.google.com/spreadsheets/d/" +
    ss.getId() +
    "/export?format=xlsx";
  var response = UrlFetchApp.fetch(url, {
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
  });
  return response.getBlob().setName("vinu-birthday-bash-rsvps.xlsx");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
