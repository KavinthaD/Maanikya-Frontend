# Maanikya
 This mobile app helps gemstone business owners track inventories, manage finances, and streamline operations. Features include AI-generated gem descriptions, QR code scanning for identification, and real-time tracking. It simplifies processes, reduces errors, and enhances transparency.

 steps to try apk locally

 1. eas build -p android --profile production

 2. download aab file generated

 3. download bundle tool for local testing https://github.com/google/bundletool/releases (need playstore console for production)

 4. move bundletool and aab file into 1 directory and run following commands

 mkdir %USERPROFILE%\.android
 keytool -genkey -v -keystore %USERPROFILE%\.android\debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"

 (build debug keystore)

 5. move keystore to same directory

 6. run following command A:\> java -jar bundletool-all-1.18.1.jar build-apks --bundle=A:\maanikya-beta.aab --output=A:\maanikya-beta.apks --mode=universal --ks=A:\debug.keystore --ks-pass=pass:android --ks-key-alias=androiddebugkey --key-pass=pass:android

 7. change .apks file into .zip and and extact the universal.apk

 8. adb install A:\signed-maanikya.apk (or the name of the apk file)
 - make sure old maanikya apk is uninstalled.
