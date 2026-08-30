#!/bin/bash

# Stop the Android emulator after tests finish
if adb devices 2>/dev/null | grep -q "emulator"; then
  echo "Stopping Android emulator..."
  adb emu kill
  echo "Android emulator stopped."
else
  echo "No Android emulator is running."
fi
