// app.js

require("dotenv").config();
const express = require("express");
const escpos = require("escpos");

// Load plugins explicitly
escpos.Network = require("escpos-network");
escpos.USB = require("escpos-usb");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to get the correct printer device
const getPrinterDevice = (printerName, connectionType) => {
  switch (connectionType.toLowerCase()) {
    case "usb":
      // Automatically finds the first available USB printer
      return new escpos.USB();

    case "ethernet":
    case "wifi": {
      // Format: "192.168.0.100:9100"
      const [host, port] = printerName.split(":");
      if (!host) {
        throw new Error("Invalid network printer name. Use 'IP_ADDRESS:PORT' format.");
      }
      return new escpos.Network(host, parseInt(port || 9100, 10));
    }

    default:
      throw new Error("Unsupported connection type. Use 'usb', 'ethernet', or 'wifi'.");
  }
};

// Print API endpoint
app.post("/api/print", async (req, res) => {
  try {
    const { text, printerName, copies, connectionType } = req.body;

    if (!text || !printerName || !connectionType) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: text, printerName, or connectionType.",
      });
    }

    const device = getPrinterDevice(printerName, connectionType);
    const printer = new escpos.Printer(device);

    await new Promise((resolve, reject) => {
      device.open((err) => {
        if (err) {
          console.error("Printer connection error:", err);
          return reject(new Error(`Could not connect to printer '${printerName}'.`));
        }

        for (let i = 0; i < (copies || 1); i++) {
          printer
            .align("lt")
            .size(0, 0)
            .text(`Test Print - Copy ${i + 1}`)
            .text("----------------------------------")
            .text(text)
            .feed(3)
            .cut();
        }

        printer.close();
        resolve();
      });
    });

    console.log(`✅ Print job sent successfully to ${printerName}`);
    res.status(200).json({
      success: true,
      message: `Print job for '${printerName}' sent successfully.`,
    });
  } catch (error) {
    console.error("❌ Error during printing process:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An internal server error occurred.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🖨️ ESC/POS Print server running at http://localhost:${PORT}`);
});
