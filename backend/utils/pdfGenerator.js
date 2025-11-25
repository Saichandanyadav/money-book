const PDFDocument = require("pdfkit");
const { getCurrencySymbol } = require("./currencyUtils");
const path = require("path");

const LOGO_PATH = path.join(__dirname, "../public/AppLogo1.png");

const PRIMARY_COLOR = "#0369A1";
const ACCENT_COLOR = "#0EA5E9";
const TEXT_COLOR = "#334155";
const BLACK_COLOR = "#000000";
const TABLE_HEADER_BG = "#E0F2FE";
const DEVELOPER_NAME = "Sai Chandan Gundaboina"; 

const generateTransactionPdf = (res, user, book, transactions, filters) => {
    const doc = new PDFDocument({ margin: 40, layout: "portrait" });
    const PADDING_X = 40;
    const LINKEDIN_URL = "https://www.linkedin.com/in/saichandanyadav/"; 
    const FOOTER_NAME = "Sai Chandan Chandan";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${book.name}_transactions.pdf"`
    );

    const currencySymbol = getCurrencySymbol(user.country);
    doc.pipe(res);

    const renderHeader = () => {
        const topY = 40;
        const infoYStart = 140;

        try {
            doc.image(LOGO_PATH, PADDING_X, topY, { width: 50, height: 50 });
        } catch (e) {}

        doc.fillColor(PRIMARY_COLOR).fontSize(28).font("Helvetica-Bold")
            .text("Money Book Ledger", PADDING_X + 70, topY + 5);

        const devText = `Developed by: ${DEVELOPER_NAME}`;
        const devTextX = PADDING_X + 70;
        const devTextY = topY + 38;
        
        doc.fillColor(TEXT_COLOR).fontSize(10).font("Helvetica")
            .text(devText, devTextX, devTextY);
        
        const prefix = "Developed by: ";
        const prefixWidth = doc.widthOfString(prefix);
        const nameWidth = doc.widthOfString(DEVELOPER_NAME);
        
        doc.link(devTextX + prefixWidth, devTextY, nameWidth, 10, LINKEDIN_URL);

        doc.fillColor(TEXT_COLOR).fontSize(14).font("Helvetica-Bold")
            .text("Transaction Report", PADDING_X, 115);

        doc.moveTo(PADDING_X, 135).lineTo(doc.page.width - PADDING_X, 135).lineWidth(3).stroke(PRIMARY_COLOR);

        doc.fontSize(9).fillColor(TEXT_COLOR).font("Helvetica")
            .text(`Book: ${book.name}`, PADDING_X, infoYStart)
            .text(`User: ${user.username}`, PADDING_X, infoYStart + 15)
            .text(`Email: ${user.email}`, doc.page.width / 2, infoYStart + 15);

        const filterText = `Filters: Status: ${filters.status || "All"}, Mode: ${filters.modeOfPayment || "All"}`;
        doc.text(filterText, doc.page.width / 2, infoYStart);

        doc.text(`Generated On: ${new Date().toLocaleDateString()}`, PADDING_X, infoYStart, {
            align: "right",
            width: doc.page.width - 2 * PADDING_X
        });

        doc.moveTo(PADDING_X, infoYStart + 38).lineTo(doc.page.width - PADDING_X, infoYStart + 38).lineWidth(0.5).stroke("#CBD5E1");
        
        doc.y = infoYStart + 45; 
    };

    const renderFooter = (totalPages) => {
        const pageNumber = doc.page.index + 1;
        const footerY = doc.page.height - 30;
        const nameText = FOOTER_NAME;
        
        doc.fontSize(7).fillColor(BLACK_COLOR).font("Helvetica");

        const nameWidth = doc.widthOfString(nameText);
        
        doc.text(nameText, PADDING_X, footerY, { align: "left" });
        
        doc.link(
            PADDING_X, 
            footerY,
            nameWidth,
            7, 
            LINKEDIN_URL
        );

        doc.text(`Page ${pageNumber} of ${totalPages}`, PADDING_X, footerY, { align: "right", width: doc.page.width - 2 * PADDING_X });

        doc.moveTo(PADDING_X, footerY - 5).lineTo(doc.page.width - PADDING_X, footerY - 5).lineWidth(0.5).stroke("#E2E8F0");
    };

    const renderTableHeaders = (y) => {
        const headers = ["Date", "Name", "Amount", "Status", "Mode", "Description"];
        const widths = [60, 110, 80, 60, 80, 150];
        let x = PADDING_X;
        const headerWidth = widths.reduce((sum, w) => sum + w, 0);

        doc.rect(PADDING_X, y - 5, headerWidth, 22).fill(TABLE_HEADER_BG);
        doc.fontSize(10).fillColor(PRIMARY_COLOR).font("Helvetica-Bold");

        headers.forEach((h, i) => {
            doc.text(h, x, y, { width: widths[i] });
            x += widths[i];
        });

        doc.font("Helvetica");
        doc.y = y + 22;
    };

    doc.on("pageAdded", () => {
        renderHeader();
        renderTableHeaders(doc.y + 10);
    });

    renderHeader();

    doc.fillColor(PRIMARY_COLOR).fontSize(18).font("Helvetica-Bold")
        .text(
            `Current Balance: ${currencySymbol}${book.totalAmount.toFixed(2)}`,
            PADDING_X,
            doc.y + 5,
            { align: "right", width: doc.page.width - 2 * PADDING_X }
        );

    doc.moveDown(1.5);

    renderTableHeaders(doc.y);
    
    const widths = [60, 110, 80, 60, 80, 150];
    let currentY = doc.y;
    const rowHeight = 25;
    const maxBodyY = doc.page.height - 50;

    transactions.forEach((tx) => {
        if (currentY + rowHeight + 5 > maxBodyY) {
            doc.addPage();
            currentY = doc.y;
        }

        let x = PADDING_X;
        
        const date = new Date(tx.createdAt).toLocaleDateString();
        const amount = `${currencySymbol}${tx.amount.toFixed(2)}`;
        const statusText = tx.status.charAt(0).toUpperCase() + tx.status.slice(1);
        const statusColor = tx.status === "debit" ? "#DC2626" : "#16A34A";

        doc.fontSize(9).fillColor(TEXT_COLOR);
        doc.text(date, x, currentY, { width: widths[0] }); x += widths[0];
        doc.text(tx.name, x, currentY, { width: widths[1] }); x += widths[1];
        doc.text(amount, x, currentY, { width: widths[2], align: "left" }); x += widths[2];

        doc.fillColor(statusColor).font("Helvetica-Bold")
            .text(statusText, x, currentY, { width: widths[3] });

        x += widths[3];

        doc.fillColor(TEXT_COLOR).font("Helvetica")
            .text(tx.modeOfPayment, x, currentY, { width: widths[4] });

        x += widths[4];

        doc.text(tx.description || "-", x, currentY, { width: widths[5] });

        currentY += rowHeight;

        doc.moveTo(PADDING_X, currentY - 5).lineTo(doc.page.width - PADDING_X, currentY - 5).lineWidth(0.2).stroke("#E2E8F0");
        doc.moveDown(0.2);
    });

    const totalPages = doc.page.count;

    for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        renderFooter(totalPages);
    }

    doc.end();
};

module.exports = { generateTransactionPdf };