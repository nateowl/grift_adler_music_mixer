// Setting default values for gameplay
let activeAudio = [];
let gamePlay = true;

// Fixes Safari Audio Loading Delay
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();


/**
 * Passes song Id to the item being dragged
 * @param  {[type]} ev     Event that is being called
 * @param  {[type]} songId song id from the DOM
 */
function drag(ev, songId) {
  ev.dataTransfer.setData("text", songId);
}



/**
 * Sets the event to allow drop and change background
 * @param  {string} ev   Event that is being called
 * @param  {string} elem "this" the element that is calling it from DOM
 */
function allowDrop(ev, elem) {
  ev.preventDefault();
  elem.style.backgroundColor = 'rgb(107, 107, 107)';
}

/**
 * Resets the background color after drag element has left the div
 * @param  {string} elem "this" the element that is calling it from DOM
 */
function dragLeave(elem) {
  elem.style.backgroundColor = '';
}

/**
 * Gets data from dragged item
 * @param  {string} ev     Event that is being called
 * @param  {string} dropId Audio player section ID
 * @param  {string} elem   "this" the element that is calling it from DOM
 */
function drop(ev, dropId, elem) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  elem.style.backgroundColor = '';
  plays(data, dropId);
}


/**
 * Plays audio thats been dropped
 * @param  {string} audioId Audio player section ID
 * @param  {string} dropId Audio player section ID
 */
function plays(audioId, dropId) {
   let audio;
   audio = document.getElementById(dropId);
   audio.src = "sounds/" + audioId + ".mp3"
   audio.currentTime = 0;
   activeAudio.push(audio)
   audio.play();
   audio.parentElement.classList.toggle('dropped');
   audio.parentElement.style.backgroundImage = 'url("images/' + audioId + '.svg")';
}



/**
 * Sets volume with slider
 * @param {int} val Value of volume
 * @param {string} dropId Audio player section ID
 */
function setVolume(val, dropId) {
   let audioVolume;
   audioVolume = document.getElementById(dropId);
   audioVolume.volume = val / 101;
  }


/**
 * Mutes the selected audio player
 * @param  {string} dropId Audio player section ID
 * @param  {string} elem "this" the element that is calling it from DOM
 */
function mute(dropId, elem) {
   let audioMute;
   audioMute = document.getElementById(dropId);
   if (audioMute.muted) {
      audioMute.muted = false;
      elem.src = "images/mute.svg";
   } else {
   audioMute.muted = true;
   elem.src = "images/muted.svg"
   }
}

/**
 * Removes selected song in audio player
 * @param  {strong} dropId Audio player section ID
 */
function cancel(dropId) {
   let audioCancel;
   audioCancel = document.getElementById(dropId);
   audioCancel.pause();
   audioCancel.removeAttribute('src');
   audioCancel.load();
   audioCancel.parentElement.classList.remove('dropped');
   audioCancel.parentElement.style.backgroundImage = '';
   activeAudio.pop(audioCancel);
}

// Resets the time of the audio
function resync() {
   for (x of activeAudio) {
      x.currentTime = 0;
   }
}
