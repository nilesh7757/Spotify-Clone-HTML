// console.log("Hello World")
let currentSong = new Audio();
let currFold;
function formatSeconds(seconds) {
    // Ensure the input is a number and non-negative
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }

    // Convert the input to an integer to avoid any fractional seconds
    seconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format minutes and seconds to always be two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder){
    currFold = folder;
    let a = await fetch(`http://192.168.93.191:3000/${folder}/`)
    let respon = await a.text();
    let d = document.createElement("div");
    d.innerHTML = respon;
    let td = d.getElementsByTagName("a")
    // td = td.getElementsByTagName("a")
    console.log(td)
    let songs = []
    for (let index = 0; index < td.length; index++) {
        const element = td[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${currFold}/`)[1])
        }
    }
    return songs
}

const playMusic = (track,pause = false)=>{
    currentSong.src = `/${currFold}/` + track;
    document.querySelector(".timeline").innerHTML = `${formatSeconds(currentSong.currentTime)} / ${formatSeconds(currentSong.duration)}`
    if(!pause){    
        currentSong.play()
        playbtn.src = "pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track.replaceAll(".mp3","")) + `<div>- Nilesh</div>`
    
}

async function main(){
    let songs = await getSongs("Songs/NCS")
    playMusic(songs[0],true);
    let songUl = document.querySelector(".songNames").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + ` <li class = "infoCard">
        <div class="info">
            <div>${(song.replaceAll("%20"," ")).replaceAll(".mp3","")}</div>
            <div>Nilesh</div>
        </div>
        <div class="mbtn"><img src="playlist-play.svg" alt=""></div>
        </li>`;
        Array.from(document.querySelector(".songNames").getElementsByTagName("li")).forEach(e => {
            (e).addEventListener("click",element =>{
                playMusic(e.querySelector(".info").firstElementChild.innerHTML+".mp3")
            })
        })

    }

        playbtn.addEventListener("click", ()=>{
            if(currentSong.paused){
                currentSong.play()
                playbtn.src = "pause.svg"
            }
            else{
                currentSong.pause()
                playbtn.src = "play.svg"
            }
        })


        currentSong.addEventListener("timeupdate",()=>{
            document.querySelector(".timeline").innerHTML = `${formatSeconds(currentSong.currentTime)} / ${formatSeconds(currentSong.duration)}`
            document.querySelector(".circle").style.left = ((currentSong.currentTime)/(currentSong.duration))*100 + "%";
            if(currentSong.currentTime == currentSong.duration){
                playbtn.src = "play.svg";
            }
        })


        document.querySelector(".bar").addEventListener("click",e=>{
            let a = (e.offsetX/e.target.getBoundingClientRect().width)*100;
            document.querySelector(".circle").style.left = a + "%";
            currentSong.currentTime = a*currentSong.duration/100;

           
        })


        document.querySelector(".hamburger").addEventListener("click", e=>{
            document.querySelector(".left").style.left = "0";
        })

        document.querySelector(".X").addEventListener("click", e=>{
            document.querySelector(".left").style.left = "-120%";
        })

        next.addEventListener("click", e=>{
           let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
           playMusic(songs[(index+1) % songs.length])
        })

        prev.addEventListener("click", e=>{
           let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
           if(index==0){
            playMusic(songs[songs.length - 1]);
           }
           else{
           playMusic(songs[(index-1) % songs.length])
           }
        })

        range.addEventListener("change",e=>{
            currentSong.volume = parseInt(e.target.value)/100;
            if(e.target.value == 0){
                mic.src = "mute.svg";
                
            }
            else{
                    mic.src = "volume.svg";
                }
        })

        Array.from(document.getElementsByClassName("card")).forEach(e=>{
            // console.log(e)
            e.addEventListener("click",()=>{
                window.location.href = "https://drive.google.com/file/d/1HP6SPY3CBu1KbNxOJR5Dt5GejbiR8QFh/view?usp=drive_link";
                // window.open("https://drive.google.com/file/d/1HP6SPY3CBu1KbNxOJR5Dt5GejbiR8QFh/view?usp=drive_link","__blank")
            })
        })


}


main()