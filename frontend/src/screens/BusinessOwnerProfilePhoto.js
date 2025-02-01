import REact, {useState} from "react";
import { StyleSheet } from "react-native";
import { Alert, TouchableOpacity } from "react-native";

const BusinessOwnerProfilePhoto = ({navigation}) =>{
    //select or take the gem image
    const [photo, setPhoto] = useState(null);

    //select photo from gallery
    const selectPhoto = () =>{
        launchImage(
            {
                mediaType: "photo",
                quality: 1,
            },
            (response) =>{
                if(response.didCancel){
                    Alert.alert("No photo");
                }else if(response.errorCode){
                    Alert.alert("Error occured",response.errorMessage);
                }else{
                    setPhoto(response.assests[0].uri);       //store selected photo uri
                }
            }
        );
    };

    //take a new photo 
    const takePhoto =() =>{
        launchCamera(
            {
                mediaType: "photo",
                quality: 1,
            },
            (response) =>{
                if(response.didCancel){
                    Alert.alert("Camera stopped");
                }else if(response.errorCode){
                    Alert.alert("Error", response.errorMessage);
                }else{
                    setPhoto(response.assests[0].uri);  //take image uri
                }
            }
        );
    };
    return(
        <View style= {styles.container}>
            {/* Heading*/ }
            <View style ={styles.topic}>
                <Icon name="arrow-left" size={20} color="white" />
                <Text style={styles.topicName}>Scan</Text>
            </View>

            {/* select or take photo */}
            <View style={styles.photo}>
                {photo ?(
                    <Image source = {{uri:photo}} style={styles.profilePhoto} />
                ) : (
                    <Image source = {{uri: "https://e7.pngegg.com/pngimages/982/97/png-clipart-computer-icons-camera-iphone-graphy-camera-photography-camera-icon-thumbnail.png"}}  style = {styles.cameraIcon} />
                )}
                
            </View>

            {/* button that open the gallery and selects image */ }
            <TouchableOpacity  style={styles.button} onPress = {selectPhoto} >
                <Text style={styles.buttonText} >Open gallery</Text>
            </TouchableOpacity>
    
        </View>
    );
};


const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "a9c9d3",
        alignItems: "center",
        justifyContent: "center",
    },
    topic:{
        width: "100%",
        backgroundColor: "#082f4f",
        padding:15,
        alignItems: "center",
        position: "absolute",
        top: 0,
    },
    topicName:{
      color:"#fff",
      fontSize: 18,
      fontWeight: "bold",  
    },
    photo:{
        backgroundColor: "e3f1fc",
        width: 180,
        height: 180,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        marginBottom: 20,
    },
    cameraIcon: {
        width: 80,
        height: 80,
        tintColor: "black",
    },
    profilePhoto:{
        width: 180,
        height: 180,
        borderRadius: 15,
    },
    button:{
        backgroundColor: "0c3c60",
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 5,
    },
    buttonText:{
        color:"fff",
        fontSize: 16,
    },
});

export default BusinessOwnerProfilePhoto;