import { StyleSheet } from "react-native";

// Shared styles for Order screens (Orders.js and Tracker.js)
export const orderStyles = StyleSheet.create({
  // Loading and error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#9CCDDB',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  
  // Order list items
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  orderContainer: {
    flexDirection: "row",
    backgroundColor: "rgb(255, 255, 255)",
    margin: 5,
    padding: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(228, 227, 227, 0.61)",
    elevation: 9,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 12,
    borderRadius: 40,
  },
  orderDetails: {
    flex: 1,
    overflow: 'hidden', // Ensure content doesn't overflow
  },
  orderTypeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9CCDDB", // Theme color
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  orderUsername: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  orderName: {
    color: "#000",
    fontWeight: "600",
  },
  orderId: {
    fontSize: 13,
    color: "#444",
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    marginTop: 2,
  },
  
  // Modal Common Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
  },
  modalContent: {
    backgroundColor: "rgb(220, 220, 220)",
    borderWidth: 2,
    borderColor: "rgba(228, 227, 227, 0.61)",
    width: "80%",
    height: "50%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  modalImage: {
    width: 100, 
    height: 100, 
    borderRadius: 10,
    marginBottom: 25, 
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Order tracking modal styles
  trackingModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  trackingModalContent: {
    width: '90%',
    height: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    position: 'relative',
  },
  trackingModalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginVertical: 10,
  },
  trackingScrollContainer: {
    paddingBottom: 20,
  },
  
  // Gem scroll styles
  gemScroll: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    backgroundColor: 'rgba(172, 168, 168, 0.21)',
  },
  gemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  gemId: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
  },
  noGemsText: {
    fontStyle: 'italic',
    color: '#888',
    padding: 20,
  },
  
  // Price and rating row
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ratingSection: {
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  
  // Divider
  dividerContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
  },
  
  orderDet: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  statusBoxRequest: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 40,
    padding: 10,       // Add consistent padding
    marginBottom: 10,  // Add consistent bottom margin
  },
  statusBoxAccept: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 40,
  },
  statusBoxConfirm: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 40,
  },
  statusBoxComplete: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 40,
  },
  statusBoxPayment: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 40,
  },
  statusText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  dateText: {
    color: "white",
    fontSize: 12,
    marginTop: 5
  },
  
  // Action buttons
  completeButton: {
    paddingVertical: 12,
    borderRadius: 10,
    width: '80%',
    marginTop: 20,
    alignSelf: "center"
  },
  paidButton: {
    paddingVertical: 14,
    borderRadius: 10,
    width: '80%',
    marginTop: 20,
    alignSelf: "center"
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  },
  orderStatus: {
    marginTop:10, // Reduce top margin
    paddingBottom: 20,
    
  },
  // For specific button styles used in orders
  declineButton: {
    borderRadius: 8,
    width: "40%",
  },
  acceptButton: {
    borderRadius: 8,
    width: "40%",
  },
  sendButton: {
    padding: 10,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#ffffff99",

    width: "80%",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor:"white"
  },
  modalNote: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    fontStyle: 'italic',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  spacer: {
    height: 20,
  },
  gemScrollContent: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  gemModalContainer: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 80,
  },
  gemModalId: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
    textAlign: 'center',
  },
  // Add these new styles for the updated tracker modal
  orderDetailsContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  noteContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  historyNotesContainer: {
    marginTop: 0, // Reduced from 15 to 0 to remove space
    marginHorizontal: 40,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 10,
  },
  historyNotesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 5,
  },
  historyNoteItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#c7c7c7',
  },
  historyNoteDate: {
    fontSize: 12,
    color: '#777',
    marginBottom: 2,
  },
  historyNoteText: {
    fontSize: 14,
    color: '#333',
  },
  gemModalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },
  gemModalType: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 2,
  },
  gemModalWeight: {
    fontSize: 12,
    marginVertical: 1,
  },
  gemModalColor: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  gemContainer: {
    padding: 10,
    marginRight: 15,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    minWidth: 120,
    minHeight: 182,
  },
  fixedButtonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 15,
  },
  modalContentWithButtons: {
    paddingBottom: 80, // Add padding to account for fixed buttons
  },
  fixedButton: {
    backgroundColor: '#9CCDDB',
    flex: 1,
    margin: 15,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Add these new styles to the StyleSheet
  receiptContainer: {
    width: '100%',
    padding: 10,
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  receiptStatus: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  receiptPreview: {
    width: 250,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9CCDDB',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    width: '90%',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  changeImageButton: {
    backgroundColor: '#777',
    padding: 8,
    borderRadius: 5,
  },
  buttonTextSmall: {
    color: 'white',
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: '#9CCDDB',
    marginTop: 15,
    width: '80%',
  },
  paymentButtonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  pendingPaymentBadge: {
    backgroundColor: '#FFA726', // Orange color
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  pendingPaymentText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusBoxPayment: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    marginHorizontal: 40,
  },
  paymentPreviewContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  receiptPreviewButton: {
    flex: 0.4,
    alignItems: 'center',
  },

  receiptThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 5,
  },

  viewReceiptText: {
    fontSize: 12,
    color: '#3498db',
    marginTop: 2,
  },

  noReceiptContainer: {
    flex: 0.4,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    height: 80,
  },

  noReceiptText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  confirmPaymentButton: {
    flex: 0.55,
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmPaymentText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  cancelButton: {
    backgroundColor: '#FF4444'
  },
  confirmButton: {
    backgroundColor: '#4CAF50'
  }
});