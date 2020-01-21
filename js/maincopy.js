// Setting default values for gameplay
let activeAudio = [];
let gamePlay = true;


// Fixes Safari Audio Loading Delay
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();


// Resets the time of the audio (Possibly removing in future)
function resync() {
   for (x of activeAudio) {
      x.currentTime = 0;
   }
}

//Creates Event listeners for the songs, with dragstart and sets Id & Src's
const songs = document.querySelectorAll('.songs');
songs.forEach((elem, x) => {
   elem.setAttribute('draggable', true);
   elem.id = `song${x}`;
   elem.src = `images/song${x}.svg`;
   elem.addEventListener('dragstart', function(event) {
         event.dataTransfer.setData("text", elem.id);
   });
});



//Creates Event listeners for the Audio Players, with drop, dragleave, dragover
const audioPlayer = document.querySelectorAll('.drop__box');
audioPlayer.forEach((elem, x) => {

   // Drop function when user drops desired song on audio player
   elem.addEventListener('drop', function(event) {
      event.preventDefault();
      let data = event.dataTransfer.getData("text");
      elem.classList.remove('droppable');
      let dropId = `audio${x}`
      plays(data, dropId);
   });

   // Adds droppable class when object not being hovered over
   elem.addEventListener('dragover', function(event) {
      event.preventDefault();
      elem.classList.add('droppable');
   });

   // Removes droppable class when object not being hovered over
   elem.addEventListener('dragleave', function(event) {
         elem.classList.remove('droppable');
   });
});


/**
 * Plays audio thats been dropped
 * @param  {string} songId Song Id
 * @param  {string} dropId Audio player section ID
 */
function plays(audioId, dropId) {
   let audio;
   audio = document.getElementById(dropId);
   audio.src = "sounds/" + audioId + ".wav"
   audio.currentTime = 0;
   activeAudio.push(audio)
   audio.play();
   audio.parentElement.classList.toggle('dropped');
   audio.parentElement.style.backgroundImage = 'url("images/' + audioId + '.svg")';
}



//Creates Event listeners for the Sliders
const slider = document.querySelectorAll('.slider');
slider.forEach((elem, x) => {

   elem.addEventListener('input', function(event) {
      let audioVolume = document.getElementById(`audio${x}`);
      audioVolume.volume = this.value / 101;
   });
});



//Mute and Exit Button
const mute = document.querySelectorAll('.mute');
const exit = document.querySelectorAll('.exit');

   // Mute Buttons
   mute.forEach((elem, x) => {
      elem.addEventListener('click', function(event) {
         let audioMute = document.getElementById(`audio${x}`);
         if (audioMute.muted) {
            audioMute.muted = false;
            elem.src = "images/mute.svg";
         } else {
         audioMute.muted = true;
         elem.src = "images/muted.svg";
         }
      });
      });

   // Cancel Buttons
   exit.forEach((elem, x) => {
      elem.addEventListener('click', function(event) {
         let audioCancel = document.getElementById(`audio${x}`);
         audioCancel.pause();
         audioCancel.removeAttribute('src');
         audioCancel.load();
         audioCancel.parentElement.classList.remove('dropped');
         audioCancel.parentElement.style.backgroundImage = '';
         activeAudio.pop(audioCancel);
         });
      });
