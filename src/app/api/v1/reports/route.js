// app/api/v1/reports/route.js
import { NextResponse } from "next/server";
import { ReportServices } from "@/services/report.service";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "roomRevenue") {
      const data = await ReportServices.getRevenueByRoomType();
      return NextResponse.json(data);
    }

    if (type === "bookingTrend") {
      const data = await ReportServices.getBookingTrend();
      return NextResponse.json(data);
    }

    const summary = await ReportServices.getReportSummary();
    const weekly = await ReportServices.getWeeklyReport();

    return NextResponse.json({ summary, weekly });
  } catch (err) {
    console.error("Report Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
