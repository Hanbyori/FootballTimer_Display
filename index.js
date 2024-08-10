const proxyURL = "https://bgo7jtdovk.execute-api.us-east-1.amazonaws.com";
const apiURL = "https://www.fotmob.com/api/";

var matchID;
var searchTeamName;

var date = new Date();
var year;
var month;
var day;
var dateString;

var min = 0;
var sec = 0;

var debugElement;
var statusElement;
var addedTimeIcon;
var addedTimeElement;
var homeNameElement;
var homeScoreElement;
var homeGradient1;
var homeGradient2;
var homeImage;
var awayNameElement;
var awayScoreElement;
var awayGradient1;
var awayGradient2;
var awayImage;

var updatedInterval;

function Init() {
    fetch(`${proxyURL}manual`)
    .then(response => response.json())
    .then(data => {
        initializeDocument();
    })
    .then(() => {
        initializeContent();
    })
    .then(() => {
        updatedInterval = setInterval(updatedContent, 1000);
    })
    .catch(error => {
        console.error('Error:', error)
    });
}

function searchMatchBtn() {
    fetch(`${proxyURL}manual?timer=false&minute=0&second=0&ptScoreReset&status=로딩중&penalty=false&addedTime=0&scoreReset`)
    .then(response => response.json())
    .then(data => {
        const element = document.getElementById("temaInput");
        searchMatch(element.value);
        element.value = null;
    })
    .then(() => {
        updatedInterval = setInterval(updatedContent, 1000);
    })
    .catch(error => {
        console.error('Error:', error)
    });
    const element = document.getElementById("temaInput");
    searchMatch(element.value);
    element.value = null;
}

function nameBtn(isHome) {
    var element;
    var url;
    if (isHome) {
        element = document.getElementById("homeName");
        url = `${proxyURL}manual?home_display=${element.value}`;
    }
    else {
        element = document.getElementById("awayName");
        url = `${proxyURL}manual?away_display=${element.value}`;
    }
    jsonSetup(url);
    element.value = null;
}

function titleBtn() {
    var element;
    var url;
    element = document.getElementById("titleInput");
    url = `${proxyURL}manual?title=${element.value}`;
    jsonSetup(url);
    element.value = null;
}

function colorBtn(isHome) {
    var element1, element2, element3;
    var url;
    if (isHome) {
        element1 = document.getElementById("homeColor1");
        element2 = document.getElementById("homeColor2");
        element3 = document.getElementById("homeColor3");
        url = `${proxyURL}manual?home_baseColor1=${encodeURIComponent(element1.value)}&home_baseColor2=${encodeURIComponent(element2.value)}&home_textColor=${encodeURIComponent(element3.value)}`;
    }
    else {
        element1 = document.getElementById("awayColor1");
        element2 = document.getElementById("awayColor2");
        element3 = document.getElementById("awayColor3");
        url = `${proxyURL}manual?away_baseColor1=${encodeURIComponent(element1.value)}&away_baseColor2=${encodeURIComponent(element2.value)}&away_textColor=${encodeURIComponent(element3.value)}`;
    }
    console.log(element1.value);
    console.log(element2.value);
    console.log(element3.value);
    jsonSetup(url);
}

function addedTimeBtn() {
    var element = document.getElementById("addedTimeInput");
    var url = `${proxyURL}manual?addedTime=${element.value}`;
    jsonSetup(url);
    element.value = null;
}

function setTimeBtn() {
    var element1 = document.getElementById("setMinInput");
    var element2 = document.getElementById("setSecInput");
    var url = `${proxyURL}manual?minute=${element1.value}&second=${element2.value}`;
    jsonSetup(url);
    element1.value = null;
    element2.value = null;
}

function timerStartBtn(min, sec) {
    var url = `${proxyURL}manual?minute=${min}&second=${sec}&timer=true`;
    jsonSetup(url);
}

function BeginMatch() {
    var url = `${proxyURL}manual?timer=false&minute=0&second=0&ptScoreReset&status=경기전&penalty=false&addedTime=0&scoreReset`;
    jsonSetup(url);
}

function halfTimeBtn() {
    var url = `${proxyURL}manual?timer=false&status=하프타임&addedTime=0`;
    jsonSetup(url);
}

function fullTimeBtn() {
    var url = `${proxyURL}manual?timer=false&status=풀타임&addedTime=0`;
    jsonSetup(url);
}

function penaltyBtn() {
    var url = `${proxyURL}manual?timer=false&penalty=true&addedTime=0`;
    jsonSetup(url);
}

function scoreBtn(isHome, score) {
    var url;
    if (isHome) {
        url = `${proxyURL}manual?home_score=${score}`;
    }
    else {
        url = `${proxyURL}manual?away_score=${score}`;
    }
    jsonSetup(url);
}

function ptScoreBtn(isHome, score) {
    var url;
    if (isHome) {
        url = `${proxyURL}manual?home_ptScore=${score}`;
    }
    else {
        url = `${proxyURL}manual?away_ptScore=${score}`;
    }
    jsonSetup(url);
}

function ptScoreResetBtn() {
    var url = `${proxyURL}manual?ptScoreReset`;
    jsonSetup(url);
}

function matchEndBtn() {
    var url = `${proxyURL}manual?timer=false&minute=0&second=0&ptScoreReset&status=경기종료&penalty=false&addedTime=0`;
    jsonSetup(url);
}


function searchMatch(name) {
    fetch(`${proxyURL}teamList`)
    .then(response => response.json())
    .then(data => {
        searchTeamName = data[name].engName;
        dateFormat();
        return matchList();
    })
    .then(() => {
        date = new Date();
        debugElement.innerHTML = "";
    })
    .catch(error => {
        debugElement.innerHTML = `${name} 서버에 정보 없음`;
        console.error('Error:', error)
    });
}

function dateFormat() {
    year = date.getFullYear();
    month = ('0' + (date.getMonth() + 1)).slice(-2);
    day = ('0' + date.getDate()).slice(-2);
    dateString = `${year}${month}${day}`;
}

function matchList() {
    return fetch(`${proxyURL}proxy?url=${apiURL}matches?date=${dateString}&timezone=Asia%2FSeoul&ccode3=KOR`)
    .then(response => response.json())
    .then(data => {
        debugElement.innerHTML = `매치 찾는 중 ${dateString}`;
        let findMatch = false;
        for (let i = 0; i < data.leagues.length; i++) {
            for (let j = 0; j < data.leagues[i].matches.length; j++) {
                if (data.leagues[i].matches[j].home.name === searchTeamName || data.leagues[i].matches[j].away.name === searchTeamName) {
                    debugElement.innerHTML = `매치 찾음`;
                    findMatch = true;
					matchID = data.leagues[i].matches[j].id;
                    return Promise.all([
                        matchDetails(matchID),
                        teamDetails(data.leagues[i].matches[j].home.name, true),
                        teamDetails(data.leagues[i].matches[j].away.name, false)
                    ]);
                }
            }
        }

        if (!findMatch) {
            date.setDate(date.getDate() + 1);
            dateFormat();
            return matchList();
        }
    });
}

function matchDetails(matchID) {
    fetch(`${proxyURL}proxy?url=${apiURL}matchDetails?matchId=${matchID}`)
    .then(response => response.json())
    .then(data => {
        var homeScore = data.header.teams[0].score;
        var awayScore = data.header.teams[1].score;

        var homeImg = data.header.teams[0].imageUrl;
        var awayImg = data.header.teams[1].imageUrl;

        var url = `${proxyURL}manual?home_img=${encodeURIComponent(homeImg)}&away_img=${encodeURIComponent(awayImg)}&home_score=${encodeURIComponent(homeScore)}&away_score=${encodeURIComponent(awayScore)}`

        if (data.header.status.started === true) {
            if (data.header.status.finished === true) {
                url += `&timer=false&minute=0&second=0&ptScoreReset&status=경기종료&penalty=false&addedTime=0`
            }
            else {
                switch (data.header.status.liveTime.short) {
                    case "HT":
                        url += `&timer=false&status=하프타임&addedTime=0`
                        break;
                    case "FT":
                        url += `&timer=false&status=풀타임&addedTime=0`
                        break;
                    case "AET":
                        url += `&timer=false&status=하프타임&addedTime=0&minute=105&second=0`
                        break;
                    case "Pen":
                        url += `?timer=false&penalty=true&addedTime=0&home_ptScore=${encodeURIComponent(data.header.status.liveTime[0])}&away_ptScore=${encodeURIComponent(data.header.status.liveTime[1])}`
                        break;
                    default:
                        const [minutes, seconds] = data.header.status.liveTime.long.split(':').map(Number);
                        url += `&timer=true&addedTime=${data.header.status.liveTime.addedTime}&minute=${minutes}&second=${seconds}`
                }
            }
        }
        else {
            url += `&status=경기전`
        }
        jsonSetup(url);
    })
    .catch(error => console.error('Error:', error));
}

function teamDetails(name, isHome) {
    var isFind = false;
    var display;
    var color1;
    var color2;
    var color3;
    var url;

    fetch(`${proxyURL}teamList`)
    .then(response => response.json())
    .then(data => {
        for (let key in data) {
            if (data.hasOwnProperty(key) && data[key].engName === name) {
                display = data[key].korName;
                color1 = data[key].baseColor1;
                color2 = data[key].baseColor2;
                color3 = data[key].textColor;
                break;
            }
            else {
                display = "No Info";
                color1 = "#000000";
                color2 = "#000000";
                color3 = "#ffffff";
            }
        }

        if (isHome) {
                document.getElementById("homeColor1").value = color1;
                document.getElementById("homeColor2").value = color2;
                document.getElementById("homeColor3").value = color3;
                url = `${proxyURL}manual?home_display=${encodeURIComponent(display)}&home_baseColor1=${encodeURIComponent(color1)}&home_baseColor2=${encodeURIComponent(color2)}&home_textColor=${encodeURIComponent(color3)}`;
        }
        else {
                document.getElementById("awayColor1").value = color1;
                document.getElementById("awayColor2").value = color2;
                document.getElementById("awayColor3").value = color3;
                url = `${proxyURL}manual?away_display=${encodeURIComponent(display)}&away_baseColor1=${encodeURIComponent(color1)}&away_baseColor2=${encodeURIComponent(color2)}&away_textColor=${encodeURIComponent(color3)}`;
        }
        jsonSetup(url);
    })
    .catch(error => console.error('Error:', error));
}

function jsonSetup(url) {
    fetch(url)
    .then(response => response.json())
    .catch(error => console.error('Error:', error));
}

function initializeDocument() {
    debugElement = document.getElementById('Debug');
    statusElement = document.getElementById("n_633");
    addedTimeIcon = document.querySelector(".n_5");
    addedTimeElement = document.getElementById("n_0");
    homeNameElement = document.getElementById("home__q");
    homeScoreElement = document.getElementById("n_");
    homeGradient1 = document.getElementById("homeGradient1");
    homeGradient2 = document.getElementById("homeGradient2");
    homeImage = document.getElementById("homeTeam-image");
    awayNameElement = document.getElementById("away__q");
    awayScoreElement = document.getElementById("n__k");
    awayradient1 = document.getElementById("awayGradient1");
    awayGradient2 = document.getElementById("awayGradient2");
    awayImage = document.getElementById("awayTeam-image");
    titleElement = document.getElementById("title");

    debugElement.innerHTML = "";
}

function initializeContent() {
    console.log("이니셜");
    fetch(`${proxyURL}manual`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("homeColor1").value = data.home.baseColor1;
        document.getElementById("homeColor2").value = data.home.baseColor2;
        document.getElementById("homeColor3").value = data.home.textColor;

        document.getElementById("awayColor1").value = data.away.baseColor1;
        document.getElementById("awayColor2").value = data.away.baseColor2;
        document.getElementById("awayColor3").value = data.away.textColor;
    })
    .catch(error => {
        console.error('Error:', error)
    });
}

function updatedContent() {
    fetch(`${proxyURL}manual`)
    .then(response => response.json())
    .then(data => {
        if (data.penalty) {
            statusElement.innerHTML = `${data.home.ptScore} : ${data.away.ptScore}`;
        }
        else {
            statusElement.innerHTML = data.status;
        }

        if (data.timer) {
            statusElement.innerHTML = `${data.minute.toString().padStart(2, '0')}:${data.second.toString().padStart(2, '0')}`;
        }
        else {
            if (!data.penalty) {
                statusElement.innerHTML = data.status;
            }
        }
    
        if (data.addedTime > 0) {
            addedTimeElement.innerHTML = `+${data.addedTime}`;
            addedTimeIcon.classList.remove("disabled-svg");
        }
        else {
            addedTimeElement.innerHTML = "";
            addedTimeIcon.classList.add("disabled-svg");
        }
    
        homeNameElement.innerHTML = data.home.display;
        homeScoreElement.innerHTML = data.home.score;
        homeGradient1.style.stopColor = data.home.baseColor1;
        homeGradient2.style.stopColor = data.home.baseColor2;
        homeImage.setAttribute('href', data.home.img);
        document.documentElement.style.setProperty(`--homeTextColor`, data.home.textColor);
    
        awayNameElement.innerHTML = data.away.display;
        awayScoreElement.innerHTML = data.away.score;
        awayradient1.style.stopColor = data.away.baseColor1;
        awayGradient2.style.stopColor = data.away.baseColor2;
        awayImage.setAttribute('href', data.away.img);
        document.documentElement.style.setProperty(`--awayTextColor`, data.away.textColor);

        titleElement.innerHTML = data.title;
    })
    .catch(error => {
        console.error('Error:', error)
    });
}

document.addEventListener('DOMContentLoaded', Init);