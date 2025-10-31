from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse
from datetime import datetime, timedelta
import screen_brightness_control
import pyautogui
import dotenv
import pywinctl
import pyvolume
import os
dotenv.load_dotenv()

BASE_PATH = os.path.expanduser("~")
DOCUMENTS_PATH = os.path.join(BASE_PATH, "Documents")
DOWNLOADS_PATH = os.path.join(BASE_PATH, "Downloads")
PICTURES_PATH = os.path.join(BASE_PATH, "Pictures")
SCREENSHOTS_PATH = os.path.join(BASE_PATH, "Pictures", "Screenshots")
VIDEOS_PATH = os.path.join(BASE_PATH, "Videos")
MUSIC_PATH = os.path.join(BASE_PATH, "Music")

REPORT_PATH = "https://jira.rampgroup.com/secure/TimesheetReport.jspa?reportKey=jira-timesheet-plugin%3Areport&selectedProjectId=14604&startDate={start_date}&endDate={end_date}&targetUser=sarabjot.singh%40rampgroup.com&projectRoleId=&projectid=14604&filterid=&priority=&commentfirstword=&sum=&groupByField=&sortBy=&sortDir=ASC&Next=Next"
SPRINT_START_DATE = datetime.strptime("2025-10-09", r'%Y-%m-%d')
SPRINT_END_DATE = datetime.strptime("2025-10-22", r'%Y-%m-%d')

def place_window(placement_word):
    active_window = pywinctl.getActiveWindow()
    placement = {
        "top_left": (65, 55),
        "top_centre": (960-active_window.width//2, 55),
        "top_right": (1920-active_window.width, 55),
        "centre_left": (65,540-active_window.height//2),
        "centre_centre": (960-active_window.width//2,540-active_window.height//2),
        "centre_right": (1920-active_window.width,540-active_window.height//2),
        "bottom_left": (65,1080-active_window.height),
        "bottom_centre": (960-active_window.width//2,1080-active_window.height),
        "bottom_right": (1920-active_window.width, 1080-active_window.height)        
    }
    coordinates = placement[placement_word]
    active_window.moveTo(int(coordinates[0]), int(coordinates[1]))
    
def open_folder(folder_path=BASE_PATH):
    os.system(f'nautilus {folder_path} &')

def open_chrome(url=''):
    os.system(f"google-chrome \"{url}\"")
    
def close_all_of_type(app_name):
    all_windows = pywinctl.getAllWindows()
    for window in all_windows:
        if window.getAppName() == app_name:
            window.close()
        
def switch_to_window(window_name):
    all_windows = pywinctl.getAllWindows()
    for window in all_windows:
        if not(window.isActive) and (window.title == window_name or window.getAppName() == window_name):
            window.activate()
            break

app = FastAPI(
    title="Number Pair WebSocket Server",
    description="Receives two numbers as a string, calculates the sum, and sends the result back."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def listener_endpoint():
    return FileResponse("/usr/local/bin/recognizer.html")

@app.websocket("/command_ids")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connection_message = await websocket.receive_text()

    try:
        if not(connection_message == "IF_Prototype_LQ-84i"):
            raise Exception("Invalid Connection")
        while True:
            data = await websocket.receive_text()
            try:
                command, payload = [int(p.strip()) for p in data.split(' ')]
                print(data, command, payload)
                if command == 1:
                    pywinctl.getActiveWindow().restore()
                elif command == 2:
                    pywinctl.getActiveWindow().minimize()
                elif command == 3:
                    pywinctl.getActiveWindow().maximize()
                elif command == 4:
                    pyautogui.press('f11')
                elif command == 5:
                    pyautogui.hotkey('alt', 'f4')
                elif command == 6:
                    pyautogui.hotkey('ctrl', 'w')
                elif command == 7:
                    pyautogui.hotkey('ctrl', 'p')
                elif command == 8:
                    pyautogui.hotkey('ctrl', 's')
                elif command == 9:
                    pyautogui.hotkey('ctrl', 'z')
                elif command == 10:
                    pyautogui.hotkey('ctrl', 'x')
                elif command == 11:
                    pyautogui.hotkey('ctrl', 'c')
                elif command == 12:
                    pyautogui.hotkey('ctrl', 'v')
                elif command == 13:
                    for i in range(3):
                        pyautogui.click()
                elif command == 14:
                    for i in range(2):
                        pyautogui.click()
                elif command == 15:
                    pyautogui.hotkey('ctrl', 'a')
                elif command == 16:
                    screen_brightness_control.set_brightness(max(50, payload))
                elif command == 17:
                    pyvolume.pyvolume(payload)
                elif command == 18:
                    screenshot = pyautogui.screenshot()
                    current_datetime = datetime.now()
                    save_path = os.path.join(SCREENSHOTS_PATH, f"Screenshot_{int(current_datetime.timestamp())}.png")
                    screenshot.save(save_path)
                    os.system(f"xclip -selection clipboard -target image/png -i \"{save_path}\"")
                elif command == 19:
                    place_window("top_left")
                elif command == 20:
                    place_window("top_centre")
                elif command == 21:
                    place_window("top_right")
                elif command == 22:
                    place_window("centre_left")
                elif command == 23:
                    place_window("centre_centre")
                elif command == 24:
                    place_window("centre_right")
                elif command == 25:
                    place_window("bottom_left")
                elif command == 26:
                    place_window("bottom_centre")
                elif command == 27:
                    place_window("bottom_right")
                elif command == 28:
                    all_windows = pywinctl.getAllWindows()
                    for window in all_windows:
                        window.minimize()
                elif command == 29:
                    switch_to_window("nautilus")
                elif command == 30:
                    switch_to_window("gnome-terminal-")
                elif command == 31:
                    switch_to_window("Downloads")
                elif command == 32:
                    switch_to_window("Documents")
                elif command == 33:
                    switch_to_window("Pictures")
                elif command == 34:
                    switch_to_window("Screenshots")
                elif command == 35:
                    switch_to_window("Videos")
                elif command == 36:
                    switch_to_window("Music")
                elif command == 37:
                    switch_to_window("chrome")
                elif command == 38:
                    switch_to_window("code")
                elif command == 39:
                    all_windows = pywinctl.getAllWindows()
                    for window in all_windows:
                        window.close()
                elif command == 40:
                    close_all_of_type('nautilus')
                elif command == 41:
                    close_all_of_type('gnome-terminal-')
                elif command == 42:
                    close_all_of_type('chrome')
                elif command == 43:
                    close_all_of_type('code')
                elif command == 44:
                    open_chrome()
                elif command == 45:
                    os.system('code')
                elif command == 46:
                    os.system("blender &")
                elif command == 47:
                    os.system(f'gnome-terminal --working-directory={BASE_PATH} &')
                elif command == 48:
                    open_folder()
                elif command == 49:
                    open_folder(DOWNLOADS_PATH)
                elif command == 50:
                    open_folder(DOCUMENTS_PATH)
                elif command == 51:
                    open_folder(PICTURES_PATH)
                elif command == 52:
                    open_folder(SCREENSHOTS_PATH)
                elif command == 53:
                    open_folder(VIDEOS_PATH)
                elif command == 54:
                    open_folder(MUSIC_PATH)
                elif command == 55:
                    open_chrome("https://soundcloud.com/discover")
                elif command == 56:
                    open_chrome("https://open.spotify.com")
                elif command == 57:
                    open_chrome("https://www.netflix.com")
                elif command == 58:
                    open_chrome("https://www.hotstar.com")
                elif command == 59:
                    open_chrome("https://www.instagram.com")
                elif command == 60:
                    open_chrome("https://discord.com/channels/@me")
                elif command == 61:
                    open_chrome("https://www.reddit.com")
                elif command == 62:
                    open_chrome("https://x.com")
                elif command == 63:
                    open_chrome("https://www.photopea.com")
                elif command == 64:
                    open_chrome("https://jira.rampgroup.com/secure/RapidBoard.jspa?rapidView=1208&projectKey=DEF&quickFilter=11925")
                elif command == 65:
                    start_date = SPRINT_START_DATE
                    end_date = SPRINT_END_DATE
                    current_date = datetime.now()
                    while not(all([start_date < current_date, current_date < end_date])):
                        start_date = start_date + timedelta(days=14)
                        end_date = end_date + timedelta(days=24)
                    target_path = REPORT_PATH.format(start_date=start_date.strftime(r"%Y-%m-%d"), end_date=current_date.strftime(r"%Y-%m-%d"))
                    open_chrome(target_path)
                elif command == 66:
                    open_chrome("https://outlook.office.com/mail")
                elif command == 67:
                    open_chrome("https://teams.microsoft.com/v2")
                elif command == 68:
                    open_chrome("https://onedrive.live.com/?view=1")
                elif command == 69:
                    open_chrome("https://www.dropbox.com/home")
                elif command == 70:
                    open_chrome("https://drive.google.com/drive/my-drive")
                elif command == 71:
                    open_chrome("https://www.google.com/maps/")
                elif command == 72:
                    open_chrome("https://docs.google.com/presentation")
                elif command == 73:
                    open_chrome("https://docs.google.com/document")
                elif command == 74:
                    open_chrome("https://docs.google.com/spreadsheets")
                elif command == 75:
                    open_chrome("https://mail.google.com/mail")
                elif command == 76:
                    open_chrome("https://www.youtube.com")
                elif command == 77:
                    open_chrome("https://gemini.google.com/app")
                elif command == 78:
                    open_chrome("https://chatgpt.com")
                elif command == 79:
                    open_chrome("https://github.com/17sarab02")
                elif command == 80:
                    open_chrome("https://web.whatsapp.com")
                elif command == 81:
                    open_chrome("https://www.amazon.in")
                elif command == 82:
                    open_chrome("https://www.flipkart.com")
                elif command == 83:
                    open_chrome("https://www.myntra.com")
                elif command == 84:
                    open_chrome("https://www.ajio.com")
                elif command == 85:
                    open_chrome("https://www.canva.com/en_in")
                elif command == 86:
                    pyautogui.write(os.getenv("VA_NAME"))
                elif command == 87:
                    pyautogui.write(os.getenv("VA_FULLNAME"))
                elif command == 88:
                    pyautogui.write(os.getenv("VA_PASSWORD"))
                elif command == 89:
                    pyautogui.write(os.getenv("VA_EMAIL"))
                elif command == 90:
                    pyautogui.write(os.getenv("VA_AADHAR"))
                elif command == 91:
                    pyautogui.write(os.getenv("VA_PHONE_NUMBER"))
                
            except ValueError:
                response = f"Error: Invalid numeric value found in input string: '{data}'"
            except Exception as e:
                response = f"Internal Server Error during processing: {e}"

    except WebSocketDisconnect:
        print("WebSocket connection closed.")
        await websocket.close()
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        await websocket.close()

import uvicorn
if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)