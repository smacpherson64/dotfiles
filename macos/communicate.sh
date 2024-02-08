#!/bin/bash

osascript -e "display alert \"Communication Reminder\" message \"EOB is approaching. Communicate with Chelsea about expecations.\"" &
PID=$!

while ps -p $PID > /dev/null
do
  afplay /System/Library/Sounds/Submarine.aiff
done

wait