# Open MyGymHere in Expo Go via USB (run while npm run usb is active)
adb reverse tcp:8081 tcp:8081
adb reverse tcp:19000 tcp:19000
adb reverse tcp:19001 tcp:19001
adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081" host.exp.exponent
Write-Host "Opened exp://127.0.0.1:8081 in Expo Go"
