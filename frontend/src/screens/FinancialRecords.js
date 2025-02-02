import React from "react";

const FinancialRecords = () => {
  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      backgroundColor: "#e0f7fa",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
    },
    totalProfit: {
      textAlign: "center",
      backgroundColor: "#000",
      color: "#0f0",
      padding: "10px",
      marginBottom: "20px",
    },
    recordList: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    recordItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 20px",
      borderBottom: "1px solid #ddd",
    },
    lastRecordItem: {
      borderBottom: "none",
    },
    bottomNav: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "20px",
      backgroundColor: "#00796b",
      color: "white",
      padding: "10px 0",
      borderRadius: "8px",
    },
    navButton: {
      background: "none",
      border: "none",
      color: "white",
      fontSize: "14px",
      cursor: "pointer",
    },
    navButtonHover: {
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Financial Records</h1>
      </header>
      <div style={styles.totalProfit}>
        <span>Total profit</span>
        <h2>LKR. 780 000</h2>
      </div>
      <div style={styles.recordList}>
        <div style={styles.recordItem}>
          <span>Buying cost</span>
          <span>LKR. 100 000</span>
        </div>
        <div style={styles.recordItem}>
          <span>Cutting cost</span>
          <span>LKR. 20 000</span>
        </div>
        <div style={styles.recordItem}>
          <span>Burning cost</span>
          <span>LKR. 60 000</span>
        </div>
        <div style={styles.recordItem}>
          <span>Sold price</span>
          <span>LKR. 600 000</span>
        </div>
        <div style={{ ...styles.recordItem, ...styles.lastRecordItem }}>
          <span>Total</span>
          <span>LKR. 780 000</span>
        </div>
      </div>
      <nav style={styles.bottomNav}>
        <button style={styles.navButton}>Home</button>
        <button style={styles.navButton}>Market</button>
        <button style={styles.navButton}>Add</button>
        <button style={styles.navButton}>Alerts</button>
        <button style={styles.navButton}>Profi</button>
      </nav>
    </div>
  );
};

export default FinancialRecords;
