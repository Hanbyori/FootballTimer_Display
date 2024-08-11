const proxyURL = "https://e1n19tllva.execute-api.us-east-1.amazonaws.com/dev/";

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

var statusData = null;

function Init() {
    fetch(`${proxyURL}status`)
    .then(response => response.json())
    .then(data => {
        statusData = data; // 전역 변수에 저장
        initializeDocument();
        initializeContent(); // 데이터가 준비된 후 호출
        updatedInterval = setInterval(updatedContent, 1000);
    })
    .catch(error => {
        console.error('Error:', error)
    });
}

function initializeDocument() {
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
    awayGradient1 = document.getElementById("awayGradient1");
    awayGradient2 = document.getElementById("awayGradient2");
    awayImage = document.getElementById("awayTeam-image");
    titleElement = document.getElementById("title");
}

function initializeContent() {
    if (statusData) {
        statusElement.innerHTML = statusData.gameInfo.info;
        addedTimeElement.innerHTML = "";
        addedTimeIcon.classList.add("disabled-svg");
        homeNameElement.innerHTML = statusData.homeTeam.home_display;
        homeGradient1.style.stopColor = statusData.homeTeam.home_baseColor1;
        homeGradient2.style.stopColor = statusData.homeTeam.home_baseColor2;
        homeImage.setAttribute('href', statusData.homeTeam.home_img);
        document.documentElement.style.setProperty('--homeTextColor', statusData.homeTeam.home_textColor);
        homeScoreElement.innerHTML = statusData.gameInfo.home_score;
        awayNameElement.innerHTML = statusData.awayTeam.away_display;
        awayGradient1.style.stopColor = statusData.awayTeam.away_baseColor1;
        awayGradient2.style.stopColor = statusData.awayTeam.away_baseColor2;
        awayImage.setAttribute('href', statusData.awayTeam.away_img);
        document.documentElement.style.setProperty('--awayTextColor', statusData.awayTeam.away_textColor);
        awayScoreElement.innerHTML = statusData.gameInfo.away_score;
        titleElement.innerHTML = statusData.gameInfo.title;
    }
}

function updatedContent() {
    fetch(`${proxyURL}status`)
    .then(response => response.json())
    .then(data => {
        const homeUpdate = new Promise(resolve => {
            homeNameElement.innerHTML = data.homeTeam.home_display;
            homeGradient1.style.stopColor = data.homeTeam.home_baseColor1;
            homeGradient2.style.stopColor = data.homeTeam.home_baseColor2;
            homeImage.setAttribute('href', data.homeTeam.home_img);
            document.documentElement.style.setProperty(`--homeTextColor`, data.homeTeam.home_textColor);
            homeScoreElement.innerHTML = data.gameInfo.home_score;
            resolve();
        });

        const awayUpdate = new Promise(resolve => {
            awayNameElement.innerHTML = data.awayTeam.away_display;
            awayGradient1.style.stopColor = data.awayTeam.away_baseColor1;
            awayGradient2.style.stopColor = data.awayTeam.away_baseColor2;
            awayImage.setAttribute('href', data.awayTeam.away_img);
            document.documentElement.style.setProperty(`--awayTextColor`, data.awayTeam.away_textColor);
            awayScoreElement.innerHTML = data.gameInfo.away_score;
            resolve();
        });

        return Promise.all([homeUpdate, awayUpdate]).then(() => {
            if (data.gameInfo.penalty) {
                statusElement.innerHTML = `${data.gameInfo.home_ptScore} : ${data.gameInfo.away_ptScore}`;
            } else if (data.gameInfo.timer) {
                statusElement.innerHTML = `${data.gameInfo.min.toString().padStart(2, '0')}:${data.gameInfo.sec.toString().padStart(2, '0')}`;
            } else {
                statusElement.innerHTML = data.gameInfo.info;
            }

            if (data.gameInfo.addedTime > 0) {
                addedTimeElement.innerHTML = `+${data.gameInfo.addedTime}`;
                addedTimeIcon.classList.remove("disabled-svg");
            } else {
                addedTimeElement.innerHTML = "";
                addedTimeIcon.classList.add("disabled-svg");
            }

            titleElement.innerHTML = data.gameInfo.title;
        });
    })
    .catch(error => {
        console.error('Error:', error)
    });
}

document.addEventListener('DOMContentLoaded', Init);
