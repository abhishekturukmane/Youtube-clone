//https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=surfing&
//key=AIzaSyDFRKNy78QgYP-yc98bdFSATY1u30VoMi0
//api key for youtube
//AIzaSyDFRKNy78QgYP-yc98bdFSATY1u30VoMi0 
//sirs key-AIzaSyBprXF9JkoIn4TKCLOCXd9HLOujKmt9evk
let searchInput=document.getElementById("search-input");
let apiKey="AIzaSyDHqF2gjF6wbStfvtjOTnr0y5q3MDIGVo4";
localStorage.setItem("api_key",apiKey);
let container=document.getElementById("container1");
function searchVideos(){
    let searchValue=searchInput.value;
    //fetch list of videos
    container.innerHTML='';
    fetchVideos(searchValue);
}

async function fetchVideos(searchValue){

    const endpoint=`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchValue}&key=${apiKey}`;
    try{

        

        let response= await fetch(endpoint);
        let result= await response.json();
        //console.log(result);
        for(let i=0;i<result.items.length;i++)
        {
            let video=result.items[i];
            let videoStats=await fetchStats(video.id.videoId);
            if(videoStats.items.length >0 )
            {
                result.items[i].videoStats=videoStats.items[0].statistics;
                result.items[i].duration=videoStats.items[0].contentDetails.duration;
            }
        }
        showThumbnails(result.items);
    }
    catch(error){

        alert("error");
    }


}
function getViews(n){
    if(n<1000) return n;
    else if(n>=1000 && n<=999999){
        n/=1000;
        n=parseInt(n);
        return n+"K";
    }
    return parseInt(n/1000000)+"M";
}

function showThumbnails(items){
    for(let i=0;i<items.length;i++){

        let videoItems=items[i];
        let imageUrl=videoItems.snippet.thumbnails.high.url;
        let videoElement=document.createElement("div");
       
        videoElement.addEventListener("click",()=>{
            navigateToVideo(videoItems.id.videoId);
        });
        let videoChildren=
                    `<img src="${imageUrl}"/>
                    <p class="title">${videoItems.snippet.title}</p>
                    <b>${formattedData(videoItems.duration)}</b>
                    <p class="channel-name">${videoItems.snippet.channelTitle}</p>
                    <p class="view-count">${videoItems.videoStats ? getViews(videoItems.videoStats.viewCount)+" views" : "NA"}</p>    `;
        videoElement.innerHTML=videoChildren;
        container.append(videoElement);
    }
}

function navigateToVideo(videoId)
{
    let path=`/video.html`;
    if(videoId)
    {
        document.cookie=`video_id=${videoId}; path=${path}`
        //http://127.0.0.1:5500/Youtube%20clone/video.html
        let linkItems=document.createElement("a");
        linkItems.href="http://127.0.0.1:5500/video.html";
        linkItems.target="_blank";
        linkItems.click();
    }
    else
    {
        alert("Go to youtube to watch video");
    }
}
async function fetchStats(videoId)
{
    const endpoint=`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=statistics,contentDetails&id=${videoId}`;
    let response= await fetch(endpoint);
    let result=await response.json();
    return result;
}
function formattedData(duration){
    if(!duration)
        return "NA";
    let hrs=duration.slice(2,4);
    let mins=duration.slice(5,7);
    let seconds;
    if(duration.length>8)
    {
        seconds=duration.slice(8,10);
    }
    let str=`${hrs}:${mins}`;
    seconds && (str+=`:${seconds}`);
    return str;
}






