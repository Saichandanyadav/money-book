const PDFDocument = require("pdfkit");
const path = require("path");
const { getCurrencySymbol } = require("./currencyUtils");

const LOGO_PATH = path.join(__dirname, "../public/AppLogo1.png");
const NOTO_FONT_PATH = path.join(__dirname, "../public/fonts/NotoSans-Regular.ttf");
const PRIMARY_COLOR = "#0369A1";
const TEXT_COLOR = "#334155";
const TABLE_HEADER_BG = "#E0F2FE";
const DEVELOPER_NAME = "Sai Chandan Gundaboina";

const generateTransactionPdf = (res, user, book, transactions = [], filters = {}) => {
  try {
    const doc = new PDFDocument({ margin: 40, layout: "portrait" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${book.name}_transactions.pdf"`);
    doc.pipe(res);
    const currencySymbol = getCurrencySymbol(user.country);
    doc.registerFont("NotoSans", NOTO_FONT_PATH);
    doc.font("NotoSans");
    const PADDING_X = 40;

    const renderHeader = () => {
      try { doc.image(LOGO_PATH, PADDING_X, 40, { width: 50, height: 50 }); } catch {}
      doc.fillColor(PRIMARY_COLOR).fontSize(28).text("Money Book Ledger", PADDING_X + 70, 45);
      doc.fontSize(10).fillColor(TEXT_COLOR).text(`Developed by: ${DEVELOPER_NAME}`, PADDING_X + 70, 78);
      doc.fillColor(TEXT_COLOR).fontSize(14).text("Transaction Report", PADDING_X, 115);
      doc.moveTo(PADDING_X, 135).lineTo(doc.page.width - PADDING_X, 135).lineWidth(3).stroke(PRIMARY_COLOR);
      doc.fontSize(9).fillColor(TEXT_COLOR)
        .text(`Book: ${book.name}`, PADDING_X, 140)
        .text(`User: ${user.username}`, PADDING_X, 155)
        .text(`Email: ${user.email}`, doc.page.width / 2, 155)
        .text(`Filters: Status: ${filters.status || "All"}, Mode: ${filters.modeOfPayment || "All"}`, doc.page.width / 2, 140)
        .text(`Generated On: ${new Date().toLocaleDateString()}`, PADDING_X, 140, { align: "right", width: doc.page.width - 2 * PADDING_X });
      doc.moveTo(PADDING_X, 178).lineTo(doc.page.width - PADDING_X, 178).lineWidth(0.5).stroke("#CBD5E1");
      doc.y = 185;
    };

    const renderTableHeaders = (y) => {
      const headers = ["Date", "Name", "Amount", "Status", "Mode", "Description"];
      const widths = [60, 110, 80, 60, 80, 150];
      let x = PADDING_X;
      const headerWidth = widths.reduce((sum, w) => sum + w, 0);
      doc.rect(PADDING_X, y - 5, headerWidth, 22).fill(TABLE_HEADER_BG);
      doc.fontSize(10).fillColor(PRIMARY_COLOR).font("NotoSans");
      headers.forEach((h, i) => { doc.text(h, x, y, { width: widths[i] }); x += widths[i]; });
      doc.font("NotoSans");
      doc.y = y + 22;
    };

    const renderFooter = (totalPages) => {
      const pageNumber = doc.page.index + 1;
      const footerY = doc.page.height - 30;
      const LINKEDIN_URL = "https://www.linkedin.com/in/saichandanyadav/";
      doc.fontSize(7).fillColor(TEXT_COLOR).text(DEVELOPER_NAME, PADDING_X, footerY);
      const nameWidth = doc.widthOfString(DEVELOPER_NAME);
      doc.link(PADDING_X, footerY, nameWidth, 7, LINKEDIN_URL);
      doc.text(`Page ${pageNumber} of ${totalPages}`, PADDING_X, footerY, { align: "right", width: doc.page.width - 2 * PADDING_X });
      doc.moveTo(PADDING_X, footerY - 5).lineTo(doc.page.width - PADDING_X, footerY - 5).lineWidth(0.5).stroke("#E2E8F0");
    };

    doc.on("pageAdded", () => { renderHeader(); renderTableHeaders(doc.y + 10); });

    renderHeader();
    doc.fillColor(PRIMARY_COLOR).fontSize(18).text(`Current Balance: ${currencySymbol}${book.totalAmount.toFixed(2)}`, PADDING_X, doc.y + 5, { align: "right", width: doc.page.width - 2 * PADDING_X });
    doc.moveDown(1.5);
    renderTableHeaders(doc.y);

    const widths = [60, 110, 80, 60, 80, 150];
    let currentY = doc.y;
    const rowHeight = 25;
    const maxBodyY = doc.page.height - 50;

    transactions.forEach((tx) => {
      if (currentY + rowHeight + 5 > maxBodyY) { doc.addPage(); currentY = doc.y; }
      let x = PADDING_X;
      const date = new Date(tx.createdAt).toLocaleDateString();
      const amount = `${currencySymbol}${tx.amount.toFixed(2)}`;
      const statusColor = tx.status === "debit" ? "#DC2626" : "#16A34A";
      doc.fontSize(9).fillColor(TEXT_COLOR).text(date, x, currentY, { width: widths[0] }); x += widths[0];
      doc.text(tx.name, x, currentY, { width: widths[1] }); x += widths[1];
      doc.text(amount, x, currentY, { width: widths[2], align: "left" }); x += widths[2];
      doc.fillColor(statusColor).font("NotoSans").text(tx.status.charAt(0).toUpperCase() + tx.status.slice(1), x, currentY, { width: widths[3] }); x += widths[3];
      doc.fillColor(TEXT_COLOR).font("NotoSans").text(tx.modeOfPayment, x, currentY, { width: widths[4] }); x += widths[4];
      doc.text(tx.description || "-", x, currentY, { width: widths[5] });
      currentY += rowHeight;
      doc.moveTo(PADDING_X, currentY - 5).lineTo(doc.page.width - PADDING_X, currentY - 5).lineWidth(0.2).stroke("#E2E8F0");
    });

    const totalPages = doc.page.count;
    for (let i = 0; i < totalPages; i++) { doc.switchToPage(i); renderFooter(totalPages); }

    doc.end();
  } catch (err) {
    console.error("PDF generation failed:", err);
    if (!res.headersSent) res.status(500).send("PDF generation failed");
  }
};

module.exports = { generateTransactionPdf };
