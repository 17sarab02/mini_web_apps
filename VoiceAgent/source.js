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
    "open reddit": 60,
    "open twitter": 61,
    "open photo shop": 62, "open photoshop": 62,
    "open current sprint": 63,
    "open time sheet": 64, "open timesheet": 64,
    "open out look": 65, "open outlook": 65,
    "open team": 66, "open teams": 66, "open microsoft teams": 66, "open microsoft team": 66,
    "open one drive": 67, "open onedrive": 67,
    "open drop box": 68, "open dropbox": 68,
    "open google drive": 69, "open g drive": 69, "open gdrive": 69,
    "open g map": 70, "open gmap": 70, "open g maps": 70, "open gmaps": 70, "open google map": 70, "open google maps": 70,
    "open g slide": 71, "open gslide": 71, "open g slides": 71, "open gslides": 71, "open google slide": 71, "open google slides": 71,
    "open g doc": 72, "open gdoc": 72, "open g docs": 72, "open gdocs": 72, "open google doc": 72, "open google docs": 72,
    "open g sheet": 73, "open gsheet": 73, "open g sheets": 73, "open gsheets": 73, "open google sheet": 73, "open google sheets": 73,
    "open g mail": 74, "open gmail": 74, "open google mail": 74,
    "open youtube": 75,
    "open gemini": 76,
    "open chat gpt": 77,
    "open github": 78,
    "open whatsapp": 79,
    "open amazon": 80,
    "open flipkart": 81,
    "open myntra": 82,
    "open ajio": 83,
    "open canva": 84,
    "type my name": 85,
    "type my full name": 86, "type my fullname": 86,
    "type secret password": 87, "type secret pass word": 87,
    "type e mail": 88, "type email": 88,
    "type aadhar id": 89,
    "type phone number": 90
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