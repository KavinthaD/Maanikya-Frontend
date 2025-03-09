<View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalIndicator} />
          </View>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleTakePhoto}
          >
            <Icon name="camera-alt" size={24} color="#170969" />
            <Text style={styles.modalButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleChooseFromGallery}
          >
            <Icon name="photo-library" size={24} color="#170969" />
            <Text style={styles.modalButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>




const handleCameraPress = () => {
    setModalVisible(true);
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImageCropPicker.openCamera({
        width: 600,
        height: 600,
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        cropping: true,
        cropperCircleOverlay: false,
        cropperStatusBarColor: "#9CCDDB",
        cropperToolbarColor: "#9CCDDB",
      });

      if (result && result.path) {
        setForm((prev) => ({ ...prev, photos: [result.path] }));
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    } finally {
      setModalVisible(false);
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        width: 600,
        height: 600,
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        cropping: true,
        cropperCircleOverlay: false,
        cropperStatusBarColor: "#9CCDDB",
        cropperToolbarColor: "#9CCDDB",
      });

      if (result && result.path) {
        setForm((prev) => ({ ...prev, photos: [result.path] }));
      }
    } catch (error) {
      console.error("Error choosing from gallery:", error);
    } finally {
      setModalVisible(false);
    }
  };