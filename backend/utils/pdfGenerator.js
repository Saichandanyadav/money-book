const PDFDocument = require("pdfkit");
const { getCurrencySymbol } = require("./currencyUtils");
const path = require("path");

const LOGO_PATH = path.join(__dirname, "../public/AppLogo1.png");
const FONT_PATH = path.join(__dirname, "../fonts/NotoSans-VariableFont_wdth,wght.ttf");

const PRIMARY_COLOR = "#0369A1";
const TEXT_COLOR = "#334155";
const BLACK_COLOR = "#000000";
const TABLE_HEADER_BG = "#E0F2FE";
const FOOTER_NAME = "Sai Chandan Gundaboina";
const LINKEDIN_URL = "https://www.linkedin.com/in/saichandanyadav/";

const generateTransactionPdf = (res, user, book, transactions, filters) => {
  const doc = new PDFDocument({ margin: 40, layout: "portrait" });
  const PADDING_X = 40;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${book.name}_transactions.pdf"`
  );

  const currencySymbol = getCurrencySymbol(user.country);

  doc.registerFont("Body", FONT_PATH);
  doc.registerFont("Body-Bold", FONT_PATH);
  doc.pipe(res);
  doc.font("Body");

  const renderHeader = () => {
    const top = 40;
    const sectionY = 150;

    try {
      doc.image(LOGO_PATH, PADDING_X, top, { width: 55, height: 55 });
    } catch (e) {}

    doc
      .fillColor(PRIMARY_COLOR)
      .font("Body-Bold")
      .fontSize(26)
      .text("Money Book Ledger", PADDING_X + 70, top + 5);

    const devPrefix = "Developed by: ";
    const devY = top + 40;

    doc
      .fillColor(TEXT_COLOR)
      .font("Body")
      .fontSize(11)
      .text(`${devPrefix}${FOOTER_NAME}`, PADDING_X + 70, devY);

    const prefixWidth = doc.widthOfString(devPrefix);
    const nameWidth = doc.widthOfString(FOOTER_NAME);

    doc.link(PADDING_X + 70 + prefixWidth, devY, nameWidth, 11, LINKEDIN_URL);

    doc
      .fillColor(TEXT_COLOR)
      .font("Body-Bold")
      .fontSize(15)
      .text("Transaction Report", PADDING_X, 115);

    doc
      .moveTo(PADDING_X, 135)
      .lineTo(doc.page.width - PADDING_X, 135)
      .lineWidth(2)
      .stroke(PRIMARY_COLOR);

    doc
      .font("Body")
      .fontSize(11)
      .fillColor(TEXT_COLOR)
      .text(`Book: ${book.name}`, PADDING_X, sectionY)
      .moveDown(0.6)
      .text(`User: ${user.username}`, PADDING_X, doc.y)
      .moveDown(0.6);

    doc.text(`Email: ${user.email}`, doc.page.width / 2, sectionY);

    doc.text(
      `Filters → Status: ${filters.status || "All"} | Mode: ${filters.modeOfPayment || "All"}`,
      doc.page.width / 2,
      sectionY + 16
    );

    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      PADDING_X,
      sectionY,
      { align: "right", width: doc.page.width - 2 * PADDING_X }
    );

    doc
      .moveTo(PADDING_X, sectionY + 40)
      .lineTo(doc.page.width - PADDING_X, sectionY + 40)
      .lineWidth(0.5)
      .stroke("#CBD5E1");

    doc.y = sectionY + 55;
  };

  const renderFooter = (totalPages) => {
    const page = doc.page.index + 1;
    const y = doc.page.height - 30;

    doc
      .fillColor(BLACK_COLOR)
      .font("Body")
      .fontSize(8)
      .text(FOOTER_NAME, PADDING_X, y);

    const nameWidth = doc.widthOfString(FOOTER_NAME);
    doc.link(PADDING_X, y, nameWidth, 8, LINKEDIN_URL);

    doc.text(`Page ${page} of ${totalPages}`, PADDING_X, y, {
      align: "right",
      width: doc.page.width - 2 * PADDING_X,
    });

    doc
      .moveTo(PADDING_X, y - 6)
      .lineTo(doc.page.width - PADDING_X, y - 6)
      .lineWidth(0.4)
      .stroke("#E2E8F0");
  };

  const renderTableHeaders = (y) => {
    const headers = ["Date", "Name", "Amount", "Status", "Mode", "Description"];
    const widths = [70, 100, 70, 70, 80, 130];
    const totalWidth = widths.reduce((a, b) => a + b, 0);

    doc.rect(PADDING_X, y - 6, totalWidth, 26).fill(TABLE_HEADER_BG);
    doc.fillColor(PRIMARY_COLOR).font("Body-Bold").fontSize(11);

    let x = PADDING_X;
    headers.forEach((head, i) => {
      doc.text(head, x, y, { width: widths[i] });
      x += widths[i];
    });

    doc.font("Body");
    doc.y = y + 28;
  };

  doc.on("pageAdded", () => {
    renderHeader();
    renderTableHeaders(doc.y + 10);
  });

  renderHeader();

  doc
    .fillColor(PRIMARY_COLOR)
    .fontSize(18)
    .font("Body-Bold")
    .text(`Current Balance: ${currencySymbol}${book.totalAmount.toFixed(2)}`, PADDING_X, doc.y, {
      align: "right",
      width: doc.page.width - 2 * PADDING_X,
    });

  doc.moveDown(1.5);
  renderTableHeaders(doc.y);

  const widths = [70, 100, 70, 70, 80, 130];
  const rowHeight = 28;
  let y = doc.y;
  const maxY = doc.page.height - 50;

  transactions.forEach((tx) => {
    if (y + rowHeight + 5 > maxY) {
      doc.addPage();
      y = doc.y;
    }

    const date = new Date(tx.createdAt).toLocaleDateString();
    const amount = `${currencySymbol}${tx.amount.toFixed(2)}`;
    const statusColor = tx.status === "debit" ? "#DC2626" : "#16A34A";

    let x = PADDING_X;
    doc.fillColor(TEXT_COLOR).fontSize(10).font("Body");
    doc.text(date, x, y, { width: widths[0] });
    x += widths[0];

    doc.text(tx.name, x, y, { width: widths[1] });
    x += widths[1];

    doc.text(amount, x, y, { width: widths[2] });
    x += widths[2];

    doc.fillColor(statusColor).font("Body-Bold");
    doc.text(tx.status.toUpperCase(), x, y, { width: widths[3] });
    x += widths[3];

    doc.fillColor(TEXT_COLOR).font("Body");
    doc.text(tx.modeOfPayment, x, y, { width: widths[4] });
    x += widths[4];

    doc.text(tx.description || "-", x, y, { width: widths[5] });
    y += rowHeight;

    doc
      .moveTo(PADDING_X, y - 6)
      .lineTo(doc.page.width - PADDING_X, y - 6)
      .lineWidth(0.3)
      .stroke("#E2E8F0");
  });

  const totalPages = doc.page.count;
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    renderFooter(totalPages);
  }

  doc.end();
};

module.exports = { generateTransactionPdf };
