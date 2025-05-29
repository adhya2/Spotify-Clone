//console.log("Let's write javascript");
let currentSong = new Audio();
let songs;
let currFolder;


function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes < 10 ? "0" + minutes : minutes}:${secs < 10 ? "0" + secs : secs}`;
}




async function getSongs(folder) {
  currFolder = folder;
  //let a = await fetch(`http://192.168.49.141:5500/${currFolder}/`);
  let a = await fetch(`http://127.0.0.1:5500/${currFolder}/`);
  let response = await a.text();
  //console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  //console.log(as);
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`/${currFolder}/`)[1]);
    }
  }

  //showing all songs in playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  let infoResponse = await fetch(`/${currFolder}/info.json`)
let info = await infoResponse.json();
let albumTitle = info.title;
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                <img class="invert" src="images/music.svg"  alt="">
                <div class="info">
                  <div>${song
        .replaceAll("%20", " ")
        .replaceAll(".mp3", "")}</div>
        
                  <div>${albumTitle}</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="images/play.svg" alt="">
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
      // console.log(
      //   e.querySelector(".info").firstElementChild.innerHTML + ".mp3"
      // );
      playMusic(e.querySelector(".info").firstElementChild.innerHTML + ".mp3");
    });
  });
  //console.log(songs);
  return songs;
}



const playMusic = (track, pause = false) => {
  // let audio = new Audio(`/${folder}/` + track);
  // audio.play();
  currentSong.src = `/${currFolder}/` + track;
  if (pause == false) {
    currentSong.play();
    play.src = "images/pause.svg"
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track.replaceAll(".mp3", ""))
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
};

async function displayAlbums() {
  //let a = await fetch(`http://192.168.49.141:5500/songs/`);
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div"); //this div only in memory not on webpage
  div.innerHTML = response;
  //console.log(div)
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")
  cardContainer.innerHTML = "";
  //console.log(anchors)
  let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    if (e.href.includes("/songs/")) {
      //console.log(e.href.split('/').slice(-1)[0])
      let folder = e.href.split('/').slice(-1)[0]
      //getting data of each folder
      //let a = await fetch(`http://192.168.49.141:5500/songs/${folder}/info.json`);
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      //console.log(response)
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
              <div class="play">
                <svg
                  data-encore-id="icon"
                  role="img"
                  aria-hidden="true"
                  class="e-9911-icon e-9911-baseline"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="black"
                >
                  <path
                    d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"
                  ></path>
                </svg>
              </div>

              <img 
                src="/songs/${folder}/cover.jpg"
                alt=""
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`
    }
  }


  //playlist loads as per the card ie album is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    //console.log(e)
    e.addEventListener("click", async item => {
      //console.log(item, item.currentTarget.dataset)
      //console.log(item.target.dataset)
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0], false)

    })
  })
}


async function main() {
  songs = await getSongs("songs/mix"); //all songs list
  //console.log(songs);
  playMusic(songs[0], true)

  //displaying albums on page ie populate card containers
  displayAlbums()



  //event listener to songbuttons prev next play
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "images/pause.svg"
    }
    else {
      currentSong.pause();
      play.src = "images/play.svg"
    }
  })

  //time update in abovebar
  currentSong.addEventListener("timeupdate", () => {
    //console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
  })

  //seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    //e.target.getBoundingClientRect().width (giving tot width how much could have been clicked)
    //console.log(e.target.getBoundingClientRect().width , e.offsetX)
    let percent = e.offsetX / e.target.getBoundingClientRect().width
    document.querySelector(".circle").style.left = percent * 100 + "%";
    currentSong.currentTime = ((currentSong.duration) * percent)
  })

  //event listener for hamburger
  document.querySelector(".hamburgerContainer").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
  })

  //event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
  })

  //event listener for previous next button 
  previous.addEventListener("click", () => {
    //console.log("Previous was clicked")
    //console.log(currentSong)
    let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
    //console.log(index)
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1], false)
    }
  })

  next.addEventListener("click", () => {
    // console.log("next was clicked")
    // console.log(currentSong.src);
    // console.log(songs)
    // console.log(currentSong.src.split('/'))
    // console.log(currentSong.src.split('/').slice(-1)[0]) // need to find index of this in songs
    let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
    //console.log(index)
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1], false)
    }
  })

  //eventlistener to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    //console.log(e, e.target, e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;
    if(currentSong.volume > 0){
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("images/mute.svg" , "images/volume.svg");
    }
  })

  // //playlist loads as per the card ie album is clicked
  // Array.from(document.getElementsByClassName("card")).forEach((e) => {
  //   console.log(e)
  //   e.addEventListener("click", async item => {
  //     console.log(item, item.currentTarget.dataset)
  //     //console.log(item.target.dataset)
  //     songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

  //   })
  // })

  //event listener to mute
  document.querySelector(".volume>img").addEventListener("click", (e)=>{
    //console.log(e.target)
    if(e.target.src.includes("images/volume.svg")){
      e.target.src = e.target.src.replace("images/volume.svg" , "images/mute.svg");
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
      e.target.src = e.target.src.replace("images/mute.svg" , "images/volume.svg");
      currentSong.volume = 0.1;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0.1;
    }
  })
}



main();
