console.log("Let's write javascript");
let currentSong = new Audio();


function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
}



async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  //console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  console.log(as);
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  //console.log(songs);
  return songs;
}



const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  // audio.play();
  currentSong.src = "/songs/" + track;
  if(pause == false){
      currentSong.play();
      play.src = "pause.svg"
  }
  
  document.querySelector(".songinfo").innerHTML = decodeURI(track.replaceAll(".mp3", ""))
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
};



async function main() {
  let songs = await getSongs(); //all songs list
  console.log(songs);
  playMusic(songs[0], true)

  //showing all songs in playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                  <div>${song
                    .replaceAll("%20", " ")
                    .replaceAll(".mp3", "")}</div>
                  <div>Adhya</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="play.svg" alt="">
                </div>
               </li>`;
  }

  //event listener to the songs
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    //console.log(e);
    //console.log(e.querySelector(".info").firstElementChild.innerHTML)
    e.addEventListener("click", (elements) => {
      console.log(
        e.querySelector(".info").firstElementChild.innerHTML + ".mp3"
      );
      playMusic(e.querySelector(".info").firstElementChild.innerHTML + ".mp3");
    });
  });

  //event listener to songbuttons prev next play
  play.addEventListener("click", ()=> {
    if(currentSong.paused){
      currentSong.play();
      play.src = "pause.svg"
    }
    else{
      currentSong.pause();
      play.src = "play.svg"
    }
  })

  //time update in abovebar
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%"
  })

  //seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    //e.target.getBoundingClientRect().width (giving tot width how much could have been clicked)
    //console.log(e.target.getBoundingClientRect().width , e.offsetX)
    let percent = e.offsetX / e.target.getBoundingClientRect().width
    document.querySelector(".circle").style.left = percent * 100 +"%";
    currentSong.currentTime = ((currentSong.duration) * percent)
  })
}



main();
