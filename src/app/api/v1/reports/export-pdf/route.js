import "@/lib/mongoose/connectDB";
import fs from 'fs';
import path from "path";
import generatePDFDoc from "@/utlis/convertHTML2PDF";
import { renderToStream } from "@react-pdf/renderer";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@/models/user.model";
import { ReportServices } from "@/services/report.services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkUserId = (await currentUser()).id;
    const user = await User.findOne({ clerkUserId });
    if (!user) throw new Error("Authenticated user not found");

    const reportService = new ReportServices(user._id);
    const summary = await reportService.getReportSummary();
    const weekly = await reportService.getWeeklyReport();
    const roomRevenue = await reportService.getRevenueByRoomType();
    const bookingTrend = await reportService.getBookingTrend();

    // Compute absolute path to public logo so react-pdf can load it (file system path)
    const logoPath = path.join(process.cwd(), "src", "assets", "logo.png");
    const logoData = fs.readFileSync(logoPath).toString("base64");
    const logoBase64 = `data:image/png;base64,${logoData}`;

    const doc = generatePDFDoc({
      summary,
      weekly,
      roomRevenue,
      bookingTrend,
      logoUrl: logoBase64, // pass base64 here
    });

    // Render PDF to buffer
    const stream = await renderToStream(doc);
    const chunks = [];
    for await (let chunk of stream) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=Hotel_Accounting_Report.pdf",
      },
    });
  } catch (err) {
    console.error("PDF Generation Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
