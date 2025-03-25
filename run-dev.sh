#!/bin/bash

# Shell script to run the frontend and backend servers simultaneously

echo "Starting Virtual Audio Guide Development Servers..."

# Start the backend server in a new terminal
if [[ "$OSTYPE" == "darwin"* ]]; then
  # MacOS
  osascript -e 'tell app "Terminal" to do script "cd '$PWD'/backend && python manage.py runserver 8000"'
else
  # Linux
  gnome-terminal -- bash -c "cd $PWD/backend && python manage.py runserver 8000; exec bash" 2>/dev/null || \
  xterm -e "cd $PWD/backend && python manage.py runserver 8000; exec bash" 2>/dev/null || \
  konsole -e "cd $PWD/backend && python manage.py runserver 8000; exec bash" 2>/dev/null || \
  echo "Could not open a new terminal window. Please start the backend server manually."
fi

# Wait for backend to initialize
sleep 2

# Start the frontend server in a new terminal
if [[ "$OSTYPE" == "darwin"* ]]; then
  # MacOS
  osascript -e 'tell app "Terminal" to do script "cd '$PWD'/frontend && npm start"'
else
  # Linux
  gnome-terminal -- bash -c "cd $PWD/frontend && npm start; exec bash" 2>/dev/null || \
  xterm -e "cd $PWD/frontend && npm start; exec bash" 2>/dev/null || \
  konsole -e "cd $PWD/frontend && npm start; exec bash" 2>/dev/null || \
  echo "Could not open a new terminal window. Please start the frontend server manually."
fi

echo "Servers started!"
echo "Backend running at: http://localhost:8000"
echo "Frontend running at: http://localhost:3000"
echo "Close the terminal windows to stop the servers." 