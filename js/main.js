// Music Mixer Application

// Application coded by Nate Grift
// Graphics done by Natasha Adler

// Global Variables
const songs = document.querySelectorAll(".music__tracks img"),
   dropBoxs = document.querySelectorAll(".drop__box"),
   musicSection = document.querySelectorAll(".music__tracks"),
   muteBtns = document.querySelectorAll(".mute"),
   exitBtns = document.querySelectorAll(".exit"),
   jukebox = document.querySelector(".music__image");

let config = {
   waitTime: 4366, // Wait time before relooping in ms
   typeOfAudio: 'wav' // Type of audio files
}


// Fixes Safari Audio Loading Delay
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();


// LOOPING function
function resync() {
   setTimeout(function() {
      dropBoxs.forEach((item, i) => {
         // Sets Audio Player
         audioPlayer = item.firstElementChild;

         // Removes Faded out class
         item.classList.remove("wait");

         // Makes it not draggable
         item.lastElementChild.draggable = false;

         // Play or reset time
         if (audioPlayer.src) {
            audioPlayer.currentTime = 0;
            if (audioPlayer.duration < 0 || audioPlayer.paused) {
               audioPlayer.play()
               if (!jukebox.classList.contains("music__image--animation")) {
                  jukebox.classList.add("music__image--animation")
                  setTimeout(function(){ jukebox.classList.remove("music__image--animation") }, 2000);
               }
            }
         }

         // Removes img and resets audio
         if (!audioPlayer.src && item.children.length != 1) {
            item.lastElementChild.draggable = true;
            if (musicSection[0].children.length < musicSection[1].children.length) {
            musicSection[0].appendChild(item.lastElementChild);
            } else {
               musicSection[1].appendChild(item.lastElementChild);
            }
            item.classList.add("active")
            sliders[i].value = 50;
         }
      });
      resync();
   }, config.waitTime); // Exact Number for the exact moment of next beat ubove in config settings
}

resync();//Initally run when script runs


// SONGS

// Making able to be dragged and setting data
songs.forEach((song, i) => {
   song.addEventListener('dragstart', function() {
      event.dataTransfer.setData("text/plain", event.target.id);
   })
});


// JUKEBOX
jukebox.addEventListener('dragover', function() {
   event.preventDefault();
});

jukebox.addEventListener('drop', addNext.bind(event))

// Adds to next available spot if possible.
function addNext() {
   let activeLoop = true;
   dropBoxs.forEach((dropbox, i) => {
      event.preventDefault();
      if (dropbox.children.length == 1 && activeLoop) {
         let data = event.dataTransfer.getData("text/plain");
         dropbox.appendChild(document.getElementById(data));
         // AUDIO play from player
         audioElem = dropbox.firstElementChild
         audioElem.src = `sounds/${data}.${config.typeOfAudio}`;
         // Removes background questionmark
         dropbox.classList.remove("active")
         dropbox.classList.add("wait")
         activeLoop = false;
      }
   })
};

// Transfer songs between music sections
musicSection.forEach((section, i) => {
   section.addEventListener('dragover', function() {
      event.preventDefault();
   })
   section.addEventListener('drop', function() {
         event.preventDefault();
         const data = event.dataTransfer.getData("text/plain");
         section.appendChild(document.getElementById(data));
      })
});


// Music Player

// Dragover Handler
dropBoxs.forEach((item, i) => {
   item.addEventListener('dragover', function() {
      event.preventDefault();
   })
});

// Drop Handler
dropBoxs.forEach((item, i) => {
   item.addEventListener('drop', function() {

      // Moves img element
      if (this.children.length == 1) {
         event.preventDefault();
         const data = event.dataTransfer.getData("text/plain");
         event.target.appendChild(document.getElementById(data));


         //AUDIO play from player
         audioElem = this.firstElementChild
         audioElem.src = `sounds/${data}.${config.typeOfAudio}`;

         //Removes background questionmark
         this.classList.remove("active")
         this.classList.add("wait")
      }
   })
});

// Removes child
dropBoxs.forEach((item, i) => {
   item.addEventListener('click', removeImg.bind(item))
});

// MUTE Button
muteBtns.forEach((item, i) => {
   item.addEventListener('click', function() {
      audioPlayer = document.querySelector(`#audio${i}`);
      if (audioPlayer.muted) {
         audioPlayer.muted = false;
         this.src = "images/mute.svg";
      } else {
         audioPlayer.muted = true;
         this.src = "images/muted.svg";
      }
   })
});

// EXIT Button
exitBtns.forEach((item, i) => {
   item.addEventListener('click', removeImg.bind(dropBoxs[i]))
});

function removeImg() {
   if (this.children.length > 1) {
      this.firstElementChild.removeAttribute('src')
      this.classList.add("wait")
   }
}

// SLIDERS for volume
const sliders = document.querySelectorAll('.slider');
sliders.forEach((item, i) => {
   item.addEventListener('input', function() {
      let audioVolume = document.getElementById(`audio${i}`);
      audioVolume.volume = this.value / 101;
   });

});
