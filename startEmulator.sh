# !/bin/bash

# Start the Android emulator
nohup emulator -avd Pixel_4 > emulator.log 2>&1 &
adb wait-for-device
echo "Waiting for Android to finish booting..."
while [ "$(adb shell getprop sys.boot_completed | tr -d '\r')" != "1" ]; do sleep 2; done
adb shell input keyevent 82 >/dev/null 2>&1 || true
echo "Android is ready."