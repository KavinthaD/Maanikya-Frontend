import React from "react";

const BurnerFinancialRecords = () => {
  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      padding: "30px",
      backgroundColor: "#9CCDDB",
      minHeight: "100vh", // Ensures full height
      display: "flex",
      flexDirection: "column",
    },
    // header: {
    //   textAlign: "center",
    //   marginBottom: "20px",
    // },
    totalProfit: {
      textAlign: "center",
      backgroundColor: "#000",
      color: "#0f0",
      padding: "30px",
      marginBottom: "20px",
    },
    recordList: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      marginBottom: "10px",
    },
    recordItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "20px 60px",
      borderBottom: "30px",
    },
    lastRecordItem: {
      borderBottom: "none",
    },
    bottomNav: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "auto", // Pushes the footer to the bottom
      backgroundColor: "#9CCDDB",
      color: "white",
      padding: "10px 0",
      borderRadius: "8px",
    },
    navButton: {
      background: "none",
      border: "none",
      color: "#9CCDDB",
      fontSize: "14px",
      cursor: "pointer",
    },
    navButtonHover: {
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.container}>
      {/* <header style={styles.header}>
        <h1>Financial Records</h1>
      </header> */}
      <div style={styles.totalProfit}>
        <span>Total profit</span>
        <h2>LKR. 780 000</h2>
      </div>
      <div style={styles.recordList}>
        <div style={styles.recordItem}>
          <span>Burner cs001</span>
          <span>LKR. 100 000</span>
        </div>
      </div>
      <div style={styles.recordList}>
        <div style={styles.recordItem}>
          <span>Burner cs002</span>
          <span>LKR. 20 000</span>
        </div>
      </div>
      <div style={styles.recordList}>
        <div style={styles.recordItem}>
          <span>Burner PJ004</span>
          <span>LKR. 60 000</span>
        </div>
      </div>
      <div style={styles.recordList}>
        <div style={styles.recordItem}>
          <span>Burner IHP006</span>
          <span>LKR. 600 000</span>
        </div>
      </div>
      <div style={styles.recordList}>
        <div style={{ ...styles.recordItem, ...styles.lastRecordItem }}>
          <span>Total</span>
          <span>LKR. 780 000</span>
        </div>
      </div>
    </div>
  );
};

export default BurnerFinancialRecords;
