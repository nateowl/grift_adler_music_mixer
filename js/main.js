// Setting default values for gameplay
let activeAudio = [];
let cancelAudio = [null, null, null, null, null];
let songsFaded = [null, null, null, null, null];
let gamePlay = true;


// Fixes Safari Audio Loading Delay
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();


// Resets the time of the audio ** AUTOMATICALLY LOOPING **
function resync() {
   setTimeout(function(){
      for (x of activeAudio) {
         x.parentElement.classList.remove('wait');
      }
   }, 3900);
   setTimeout(function(){
      for (x of activeAudio) {
         x.currentTime = 0;
         if (x.duration < 0 || x.paused) {
            x.play();
         }

      }
      resync();
   }, 4366); // Exact Number for the exact moment of next beat
   clearClass();

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


// Default Classes Dropbox
function clearClass() {
   const audioPlayer = document.querySelectorAll('.drop__box');
   audioPlayer.forEach((elem, x) => {
   elem.classList.remove('exitOut');
   elem.classList.remove('droppable');
   elem.classList.remove('wait');

   if (cancelAudio[x]) {
      cancelAudio[x] = null;
      elem.style.removeProperty('backgroundImage');
      elem.style.backgroundImage = '';
   }
});
}


//Creates Event listeners for the Audio Players, with drop, dragleave, dragover
const audioPlayer = document.querySelectorAll('.drop__box');
audioPlayer.forEach((elem, x) => {

   // Drop function when user drops desired song on audio player
   elem.addEventListener('drop', function(event) {
      if (!cancelAudio[x]) {
      event.preventDefault();
      let data = event.dataTransfer.getData("text");
      let dropId = `audio${x}`;
      plays(data, dropId);


      if (songsFaded[x]) {
         const songOld = document.getElementById(songsFaded[x]);
         songOld.classList.remove('notActive');
         songOld.setAttribute('draggable', true);
         songsFaded[x] = null;
      }
      songsFaded[x] = data;
      const song = document.getElementById(data);
      song.classList.add('notActive');
      song.setAttribute('draggable', false);
      }

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
 * Plays Song called from when song is dropped
 * @param  {string} songId Song Id to signal what song to play
 * @param  {string} dropId Drop Id of what Audio Player
 */
function plays(songId, dropId) {
   let audio;
   audio = document.getElementById(dropId);
   audio.src = `sounds/${songId}.wav`;
   audio.currentTime = 0;
   if (!activeAudio.includes(audio)) {
   activeAudio.push(audio);
}
   audio.load();
   audio.parentElement.classList.toggle('dropped');
   audio.parentElement.classList.add('wait');
   audio.parentElement.style.backgroundImage = 'url("images/' + songId + '.svg")';
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
const forceExit = document.querySelectorAll('.forceExit');
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


   // FORCE Cancel Buttons
   forceExit.forEach((elem, x) => {
      elem.addEventListener('click', function(event) {
         clearClass();
         // Stops the audio from playing
         let audioCancel = document.getElementById(`audio${x}`);
         audioCancel.pause();
         audioCancel.removeAttribute('src');
         audioCancel.parentElement.classList.remove('dropped');
         audioCancel.parentElement.style.backgroundImage = '';

         // Removes the faded out class and makes it accessable again
         if (activeAudio.includes(audioCancel)) {
         const song = document.getElementById(songsFaded[x]);
         song.classList.remove('notActive');
         song.setAttribute('draggable', true);
         songsFaded[x] = null;
         }
         activeAudio.pop(audioCancel);
         });
      });


   // Cancel Buttons
   exit.forEach((elem, x) => {
      elem.addEventListener('click', function(event) {
         let audioCancel = document.getElementById(`audio${x}`);

         // Stops the audio from playing and removes classes
         activeAudio.pop(audioCancel);
         if (audioCancel.duration >= 0) {
         audioCancel.parentElement.classList.remove('dropped');
         audioCancel.parentElement.classList.remove('wait');
         audioCancel.parentElement.classList.add('exitOut');

         cancelAudio.splice(x, 1, audioCancel);
         console.log(cancelAudio)

         // Removes the faded out class and makes it accessable again
         const song = document.getElementById(songsFaded[x]);
         console.log(songsFaded[x])
         song.classList.remove('notActive');
         song.setAttribute('draggable', true);
         songsFaded[x] = null;
         }
         });
      });


// INFO BUTTON
   const infoBtn = document.getElementById('infoBtn');
   const info = document.getElementById('info');
   infoBtn.addEventListener('click', function(event) {
      info.classList.remove('hidden');
   });

   const exitBtns = document.querySelectorAll('.exitBtn');
   exitBtns.forEach((elem, x) => {
      elem.addEventListener('click', function() {
      info.classList.add('hidden');
      });
   });



resync(); // Starts the resync Timer
