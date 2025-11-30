import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Tailwind-like simple styles
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12, fontFamily: "Helvetica" },
  heading1: { fontSize: 20, marginBottom: 10, color: "#2563eb" },
  heading2: { fontSize: 16, marginVertical: 8, color: "#2563eb" },
  summaryContainer: { flexDirection: "row", marginVertical: 10, justifyContent: "space-between" },
  card: { flex: 1, padding: 10, backgroundColor: "#f0f9ff", borderRadius: 8, textAlign: "center", marginRight: 10 },
  table: { marginVertical: 10, borderWidth: 1, borderColor: "#ccc" },
  tableRow: { flexDirection: "row" },
  tableCell: { flex: 1, padding: 4, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "#ccc", textAlign: "center" },
  tableHeader: { backgroundColor: "#f3f4f6", fontWeight: "bold" },
});

export default function generatePDFDoc({ summary, weekly, roomRevenue, bookingTrend, logoUrl }) {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Hotel logo (falls back to /logo.png in public/) */}
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Image
            src={logoUrl || '/logo.png'}
            style={{ width: 80, height: 80, marginBottom: 6 }}
          />
        </View>
        <Text style={styles.heading1}>Hotel Accounting Report</Text>
        <Text>Generated on {new Date().toLocaleString()}</Text>

        <Text style={styles.heading2}>Summary</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.card}>
            Total Revenue{"\n"}<Text>Rs. {summary.totalRevenue.toLocaleString()}</Text>
          </View>
          <View style={styles.card}>
            Pending Payments{"\n"}<Text>Rs. {summary.pendingPayments.toLocaleString()}</Text>
          </View>
          <View style={styles.card}>
            This Month Revenue{"\n"}<Text>Rs. {summary.monthRevenue.toLocaleString()}</Text>
          </View>
        </View>

        {/* Weekly Report Table */}
        <Text style={styles.heading2}>Weekly Revenue & Bookings</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Week</Text>
            <Text style={styles.tableCell}>Revenue (Rs.)</Text>
            <Text style={styles.tableCell}>Bookings</Text>
          </View>
          {weekly.map(w => (
            <View style={styles.tableRow} key={w._id}>
              <Text style={styles.tableCell}>{w._id}</Text>
              <Text style={styles.tableCell}>{w.totalRevenue.toLocaleString()}</Text>
              <Text style={styles.tableCell}>{w.bookings}</Text>
            </View>
          ))}
        </View>

        {/* Revenue by Room Type Table */}
        <Text style={styles.heading2}>Revenue by Room Type</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Room Type</Text>
            <Text style={styles.tableCell}>Revenue (Rs.)</Text>
          </View>
          {roomRevenue.map(r => (
            <View style={styles.tableRow} key={r.roomType}>
              <Text style={styles.tableCell}>{r.roomType}</Text>
              <Text style={styles.tableCell}>{r.revenue.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Booking Trend Table */}
        <Text style={styles.heading2}>Booking Trend (Last 30 Days)</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Bookings</Text>
          </View>
          {bookingTrend.map(d => (
            <View style={styles.tableRow} key={d.date}>
              <Text style={styles.tableCell}>{d.date}</Text>
              <Text style={styles.tableCell}>{d.bookings}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
