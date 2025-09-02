// utils/ExpensePDF.jsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Styling for PDF
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  groupTitle: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 12,
    color: "#0f766e",
  },
  section: {
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: "1px solid #eee",
  },
  label: {
    fontWeight: "bold",
  },
});

export const MyPDF = ({ groupName, groupExpenses, userId, summary }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Expense Report - {groupName}</Text>

      {summary && (
        <View style={styles.section}>
          <Text style={styles.label}>Summary</Text>
          <Text>Paid: ₹{summary.paid.toFixed(2)}</Text>
          <Text>Received: ₹{summary.received.toFixed(2)}</Text>
          <Text>Balance: ₹{summary.balance.toFixed(2)}</Text>
        </View>
      )}

      {groupExpenses.map((exp, index) => (
        <View style={styles.section} key={index}>
          <Text>
            {index + 1}. {exp.description} - ₹{exp.amount}
          </Text>
          <Text>
            Paid by:{" "}
            {exp.paidBy?._id === userId
              ? "You"
              : exp.paidBy?.fullName || "Unknown"}
          </Text>
          <Text>
            Date:{" "}
            {new Date(exp.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);

export const CombinedPDF = ({ allExpenses, groupNameMap, userId, groupSummary }) => (
  <Document>
    {Object.entries(allExpenses).map(([groupId, groupExpenses], index) => {
      const summary = groupSummary.find((s) => s.groupId === groupId);
      return (
        <Page key={index} style={styles.page}>
          <Text style={styles.title}>Expense Report</Text>
          <Text style={styles.groupTitle}>
            Group: {groupNameMap[groupId] || "Unknown Group"}
          </Text>

          {summary && (
            <View style={styles.section}>
              <Text style={styles.label}>Summary</Text>
              <Text>Paid: ₹{summary.paid.toFixed(2)}</Text>
              <Text>Received: ₹{summary.received.toFixed(2)}</Text>
              <Text>Balance: ₹{summary.balance.toFixed(2)}</Text>
            </View>
          )}

          {groupExpenses.map((exp, idx) => (
            <View style={styles.section} key={idx}>
              <Text>
                {idx + 1}. {exp.description} - ₹{exp.amount}
              </Text>
              <Text>
                Paid by:{" "}
                {exp.paidBy?._id === userId
                  ? "You"
                  : exp.paidBy?.fullName || "Unknown"}
              </Text>
              <Text>
                Date:{" "}
                {new Date(exp.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
          ))}
        </Page>
      );
    })}
  </Document>
);
