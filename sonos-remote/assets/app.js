(function () {
  var WEBHOOK_URL = "http://homeassistant.local:8123/api/webhook/sonos_remote_control";
  var speakerSelect = document.getElementById("speaker-select");
  var statusEl = document.getElementById("status");
  var volumeRange = document.getElementById("vol-slider");
  var volumeValue = document.getElementById("volume-value");
  var nowPlaying = document.getElementById("now-playing");
  var artistEl = document.getElementById("artist");
  var trackEl = document.getElementById("track");
  var muteBtn = document.getElementById("btn-mute");
  var isMuted = false;

  function setStatus(text) {
    statusEl.innerHTML = text;
  }

  function saveSpeaker(value) {
    try {
      localStorage.setItem("sonosSpeaker", value);
    } catch (e) {}
  }

  function loadSpeaker() {
    try {
      return localStorage.getItem("sonosSpeaker") || "kitchen";
    } catch (e) {
      return "kitchen";
    }
  }

  function sendAction(action, volume) {
    var payload = {
      player: speakerSelect.value,
      action: action
    };
    if (action === "volume_set") {
      payload.volume = volume;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", WEBHOOK_URL, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        setStatus("Sent: " + action + " (" + speakerSelect.options[speakerSelect.selectedIndex].text + ")");
        artistEl.innerHTML = "Sent: " + action;
      }
    };
    xhr.send(JSON.stringify(payload));
  }

  function bindButtons() {
    document.getElementById("btn-prev").onclick = function () { sendAction("prev"); };
    document.getElementById("playBtn").onclick = function () { sendAction("play_pause"); };
    document.getElementById("btn-next").onclick = function () { sendAction("next"); };
    document.getElementById("btn-vol-down").onclick = function () { sendAction("volume_down"); };
    document.getElementById("btn-vol-up").onclick = function () { sendAction("volume_up"); };
    muteBtn.onclick = function () {
      if (isMuted) {
        sendAction("unmute");
        isMuted = false;
        muteBtn.innerHTML = "Mute";
      } else {
        sendAction("mute");
        isMuted = true;
        muteBtn.innerHTML = "Unmute";
      }
    };
  }

  function bindVolume() {
    volumeRange.oninput = function () {
      volumeValue.innerHTML = "Volume: " + volumeRange.value + "%";
    };
    volumeRange.onchange = function () {
      var v = parseInt(volumeRange.value, 10);
      if (isNaN(v)) return;
      sendAction("volume_set", v);
    };
  }

  function init() {
    speakerSelect.value = loadSpeaker();
    speakerSelect.onchange = function () { saveSpeaker(speakerSelect.value); };
    bindButtons();
    bindVolume();
    nowPlaying.innerHTML = "Now playing: —";
    volumeValue.innerHTML = "Volume: " + volumeRange.value + "%";
    trackEl.innerHTML = "Sonos Remote";
    artistEl.innerHTML = "Ready";
    setStatus("Ready.");
  }

  init();
})();
