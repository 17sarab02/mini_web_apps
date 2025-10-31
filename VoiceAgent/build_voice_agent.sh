killall voice_agent
sudo rm -rf build dist voice_agent.spec
sudo rm -rf /usr/local/bin/voice_agent
sudo rm -rf /usr/local/bin/recognizer.html
pyinstaller --onefile voice_agent.py
sudo cp recognizer.html /usr/local/bin
sudo cp dist/voice_agent /usr/local/bin
sudo cp .env /usr/local/bin
sudo rm -rf build dist voice_agent.spec