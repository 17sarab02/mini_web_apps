window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const MAPPING = {
    "restore": 1,
    "minimise": 2,
    "maximize": 3,
    "full screen": 4,
    "close window": 5,
    "close tab": 6,
    "print": 7,
    "save": 8,
    "undo": 9,
    "cut": 10,
    "copy": 11,
    "paste": 12,
    "select block": 13,
    "select word": 14,
    "select all": 15,
    "brightness": 16,
    "volume": 17,
    "screen shot": 18, "screenshot": 18,
    "top left": 19, "left top": 19,
    "top centre": 20, "centre top": 20,
    "top right": 21, "right top": 21,
    "centre left": 22, "left centre": 22,
    "centre centre": 23,
    "centre right": 24, "right centre": 24,
    "bottom left": 25, "left bottom": 25,
    "bottom centre": 26, "centre bottom": 26,
    "bottom right": 27, "right bottom": 27,
    "switch desktop": 28,
    "switch folder": 29, "switch folders": 29,
    "switch terminal": 30, "switch terminals": 30,
    "switch download": 31, "switch downloads": 31,
    "switch document": 32, "switch documents": 32,
    "switch picture": 33, "switch pictures": 33,
    "switch screenshot": 34, "switch screenshots": 34,
    "switch video": 35, "switch video": 35,
    "switch music": 36,
    "switch chrome": 37,
    "switch vs code": 38, "switch vscode": 38,
    "close all": 39,
    "close folder": 40, "close folders": 40,
    "close terminal": 41, "close terminals": 41,
    "close chrome": 42,
    "close vs code": 43, "close vscode": 43,
    "start chrome": 44, "open chrome": 44,
    "start vs code": 45, "start vscode": 45, "open vs code": 45, "open vscode": 45,
    "start blender": 46, "open blender": 46,
    "open terminal": 47, "open terminals": 47, "launch terminal": 47, "launch terminals": 47,
    "open folders": 48, "open folder": 48,
    "open download": 49, "open downloads": 49,
    "open document": 50, "open documents": 50,
    "open picture": 51, "open pictures": 51,
    "open screenshot": 52, "open screenshots": 52,
    "open video": 53, "open videos": 53,
    "open music": 54,
    "open sound cloud": 55, "open soundcloud": 55,
    "open spotify": 56,
    "open netflix": 57,
    "open hotstar": 58,
    "open instagram": 59,
    "open discord": 60,
    "open reddit": 61,
    "open twitter": 62,
    "open photo shop": 63, "open photoshop": 63,
    "open current sprint": 64,
    "open time sheet": 65, "open timesheet": 65,
    "open out look": 66, "open outlook": 66,
    "open team": 67, "open teams": 67, "open microsoft teams": 67, "open microsoft team": 67,
    "open one drive": 68, "open onedrive": 68,
    "open drop box": 69, "open dropbox": 69,
    "open google drive": 70, "open g drive": 70, "open gdrive": 70,
    "open g map": 71, "open gmap": 71, "open g maps": 71, "open gmaps": 71, "open google map": 71, "open google maps": 71,
    "open g slide": 72, "open gslide": 72, "open g slides": 72, "open gslides": 72, "open google slide": 72, "open google slides": 72,
    "open g doc": 73, "open gdoc": 73, "open g docs": 73, "open gdocs": 73, "open google doc": 73, "open google docs": 73,
    "open g sheet": 74, "open gsheet": 74, "open g sheets": 74, "open gsheets": 74, "open google sheet": 74, "open google sheets": 74,
    "open g mail": 75, "open gmail": 75, "open google mail": 75,
    "open youtube": 76,
    "open gemini": 77,
    "open chat gpt": 78,
    "open github": 79,
    "open whatsapp": 80,
    "open amazon": 81,
    "open flipkart": 82,
    "open myntra": 83,
    "open ajio": 84,
    "open canva": 85,
    "type my name": 86,
    "type my full name": 87, "type my fullname": 87,
    "type secret password": 88, "type secret pass word": 88,
    "type e mail": 89, "type email": 89,
    "type aadhar id": 90,
    "type phone number": 91
}

const audioElement = document.querySelector('audio')
audioElement.volume = 0.35

let command_connection;
function startWebsocket() {
    command_connection = new WebSocket('ws://localhost:8000/command_ids')

    command_connection.onopen = (event) => {
        command_connection.send('IF_Prototype_LQ-84i');
    };

    command_connection.onclose = function () {
        command_connection = null
        setTimeout(startWebsocket, 2000)
    }
}

startWebsocket();

let firstTime = true;

function popCompleted(element_to_phase, createOrNot) {
    element_to_phase.classList.add("Vanished")
    let parent_element = element_to_phase.parentNode
    setTimeout(() => {
        parent_element.removeChild(element_to_phase)
        if (createOrNot) {
            const new_command = document.createElement('h2');
            new_command.classList.add('CommandToFill');
            parent_element.appendChild(new_command);
        }
    }, 300)
}

if (window.SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    const uniqueWords = new Set();
    const commandPhrases = Object.keys(MAPPING);

    commandPhrases.forEach(phrase => {
        const words = phrase.trim().split(/\s+/).filter(word => word.length > 0);
        words.forEach(word => uniqueWords.add(word));
    });
    const wordsArray = Array.from(uniqueWords);
    wordsArray.push('at')
    const wordList = wordsArray.join(' | ');
    const grammar = `#JSGF V1.0; grammar commands; public <command> = ${wordList} ;`;

    window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    if (window.SpeechGrammarList) {
        const speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1.0);
        recognition.grammars = speechRecognitionList;
    }

    recognition.onstart = function () {
        console.log('At your service :3');
    };

    recognition.onresult = function (event) {
        if (firstTime) {
            const firstTitle = document.querySelector(".FirstTitle")
            popCompleted(firstTitle, false)
            firstTime = false;
        }
        let full_phrase = ""
        let phrase_element = document.querySelector(".CommandToFill")
        for (let i = 0; i < event.results.length; i++) {
            full_phrase = `${full_phrase.trim()} ${event.results[i][0].transcript.trim()}`
        }
        const phrase_parts = full_phrase.trim().split(" ").filter(element => (element != "a" && element != "an" && element != "the" && element != "to"))
        full_phrase = phrase_parts.join(" ").toLowerCase()
        phrase_element.innerText = full_phrase

        const brightness_regex = /^brightness at (\d+)$/
        const volume_regex = /^volume at (\d+)$/

        const brightness_match = full_phrase.match(brightness_regex)
        const volume_match = full_phrase.match(volume_regex)
        const command_match = MAPPING[full_phrase]

        console.log(full_phrase, brightness_match, volume_match, command_match)
        if (brightness_match) {
            command_connection.send(`16 ${brightness_match[1]}`)
            audioElement.play()
            recognition.abort()
        }
        else if (volume_match) {
            command_connection.send(`17 ${volume_match[1]}`)
            audioElement.play()
            popCompleted(phrase_element, true)
            recognition.abort()
        }
        else if (command_match && command_match != 16 && command_match != 17) {
            command_connection.send(`${command_match} 0`);
            audioElement.play()
            popCompleted(phrase_element, true)
            recognition.abort()
        }
        else if (event.results[0].isFinal) {
            popCompleted(phrase_element, true)
        }
    };

    recognition.onerror = function (event) { }
    recognition.onend = function () { recognition.start() };

    try { recognition.start() }
    catch (e) { console.error('Could not start recognition:', e); }
}
else { console.log('Speech Recognition API not supported in this browser.') }