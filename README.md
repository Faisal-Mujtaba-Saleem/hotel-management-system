📄 ESC/POS Print API – Documentation
🔹 Overview

This project is a Node.js based API that allows printing text on ESC/POS-compatible printers. It supports both USB and Network (Ethernet/WiFi) connected printers.

The API exposes a single endpoint POST /api/print, which accepts the text to print, number of copies, and printer connection details.

🔹 Packages Used

escpos – Core library for ESC/POS printing.
escpos-network – Plugin for network-connected printers.
escpos-usb – Plugin for USB-connected printers.
express – Web framework to create the REST API.
dotenv – Loads environment variables from .env.

🔹 Installation
npm i escpos
npm i escpos-network
npm i escpos-usb
npm i express dotenv

🔹 How It Works
1. Printer Device Detection

The function getPrinterDevice(printerName, connectionType) detects the printer type:

USB: Directly finds the first connected USB printer.
Ethernet/WiFi: Requires printerName in the format IP_ADDRESS:PORT.

Example: "192.168.0.240:9100" (default port 9100 if not provided).

2. Printing Flow

API receives input parameters via req.body.
A connection to the printer is established.
Printing commands are sent using the ESC/POS library.
Multiple copies are handled via a loop.

The printer receives:
- Left-aligned text
- Divider line
- Provided message
- Feed lines
- Paper cut

🔹 API Endpoint
POST /api/print
Request Body
{
  "text": "Hello world from a network printer!",
  "printerName": "<printer_ip>",
  "copies": 1,
  "connectionType": "ethernet"
}

Parameters
- text (string, required) → Message to print.
- printerName (string, required)
  For USB: not required.
  For Network: IP:PORT format.
- copies (number, optional) → Number of print copies (default: 1).
- connectionType (string, required) → "usb", "ethernet", or "wifi".

Example Success Response
{
  "success": true,
  "message": "Print job for '192.168.0.240' sent successfully."
}

Example Error Response
{
  "success": false,
  "message": "Could not connect to printer '192.168.0.240'."
}

🔹 Server Startup
node app.js

Server runs at:
http://localhost:3000

✅ In summary:
This API takes text input, determines printer type (USB or Network), connects to the printer, and sends the print command with the requested number of copies.
