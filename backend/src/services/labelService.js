const puppeteer = require('puppeteer');

const generateLabel = async (booking) => {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();

    // 4x6 inch label content (approx 384x576 pixels at 96dpi)
    const content = `
      <html>
        <head>
          <style>
            body { font-family: 'Courier New', Courier, monospace; width: 4in; height: 6in; padding: 20px; border: 2px solid black; }
            .header { text-align: center; border-bottom: 2px solid black; padding-bottom: 10px; }
            .section { margin-top: 15px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            .title { font-weight: bold; font-size: 1.2em; }
            .barcode { margin: 20px auto; text-align: center; font-size: 2em; border: 1px dashed black; padding: 10px; }
            .qr { float: right; width: 80px; height: 80px; border: 1px solid black; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">COURIER BOOKING</div>
            <div>Booking ID: ${booking.bookingId}</div>
          </div>
          
          <div class="section">
            <strong>SENDER:</strong><br/>
            ${booking.senderName}<br/>
            ${booking.senderAddress}<br/>
            PH: ${booking.senderPhone}
          </div>

          <div class="section">
            <strong>RECEIVER:</strong><br/>
            ${booking.receiverName}<br/>
            ${booking.receiverAddress}<br/>
            PH: ${booking.receiverPhone}
          </div>

          <div class="section">
            <div class="qr">QR TRACK</div>
            <strong>WEIGHT:</strong> ${booking.parcelWeight || 0} KG<br/>
            <strong>DATE:</strong> ${new Date().toLocaleDateString()}
          </div>

          <div class="barcode">
            |||| || | |||| | ||<br/>
            ${booking.awbNumber || booking.bookingId}
          </div>
        </body>
      </html>
    `;

    await page.setContent(content);
    const buffer = await page.pdf({ format: 'A6', printBackground: true });
    
    await browser.close();
    return buffer;
  } catch (err) {
    if (browser) await browser.close();
    console.error('PDF Error:', err.message);
    throw new Error('Failed to generate shipping label');
  }
};

module.exports = generateLabel;
