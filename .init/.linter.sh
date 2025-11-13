#!/bin/bash
cd /home/kavia/workspace/code-generation/note-calendar-manager-189249-189258/notes_calendar_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

