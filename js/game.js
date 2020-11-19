'use strict'
var SIZE = 4;
var MINE = 'פצצה'
var FLAG = 'דגל'
var firstClick = true;
var gboard = [];
var gTimerIntervalId;
var gStartTimer;
var gneighbors=[];
var l=1;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function initGame() {
    gGame.isOn = true;
    gboard = buildBoard()
    renderBoard(gboard)
}


function chooseLevel() {
    l++;
        if(l===4){
            SIZE=4;
            gboard = buildBoard()
            renderBoard(gboard)
            return;
        } 
        SIZE += 4;
        gboard = buildBoard()
        renderBoard(gboard)
}

function RenderCell(location, value) {
    var elCell = document.querySelector(location);
    elCell.innerText= value;
  }

function buildBoard() {
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = {
                isShown: false,
                mine: false,
                isMarked: false,
                a: ' '
            }
        }
    }
    return board;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].mine) board[i][j].mine = false;
            else var cell = board[i][j].a;
            var tdId = `${i}-${j}`;
            var className = 'cell cell' + i + '-' + j;;
            strHtml += `<td id="${tdId}" class="${className}" onclick="cellClicked(this)"; oncontextmenu="cellMarked(this,gboard)">
                            ${cell}
                        </td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.board-container');
    elMat.innerHTML = strHtml;
}







function findMine(gboard, { i: i, j: j }) {
    var count = 0; 
    var I=0;
    if(i===0 && j===0){
        gneighbors[I]={i:i + 1, j:j }
        if (gboard[i + 1][j].mine) count++;//אחורה
        gneighbors[I++]={i:i, j:j+1 }
        if (gboard[i][j + 1].mine) count++;//ימינה
        gneighbors[I++]={i:i+1, j:j+1 }
        if (gboard[i + 1][j + 1].mine) count++; //ימינה באלכסון למטה
        return count;
    }
    if(i===gboard.length-1 && j===gboard.length-1){
        gneighbors[I]={i:i - 1, j:j }
        if (gboard[i - 1][j].mine) count++;//קדימה
        gneighbors[I++]={i:i-1, j:j-1 } 
        if (gboard[i - 1][j - 1].mine) count++;//שמאלה באלכסון למעלה
        gneighbors[I++]={i:i, j:j-1 } 
        if (gboard[i][j - 1].mine) count++; //שמאלה
            return count;
    }
    if(i===gboard.length-1 && j===0){
        gneighbors[I]={i:i, j:j+1 }
        if (gboard[i][j + 1].mine) count++;//ימינה
        gneighbors[I++]={i:i - 1, j:j }
        if (gboard[i - 1][j].mine) count++;//קדימה
        gneighbors[I++]={i:i - 1, j:j+1 }
        if(gboard[i-1][j+1].mine)count++//ימינה באלכסון למעלה
          return count;
    }
    if(i===0 && j===gboard.length-1){
        gneighbors[I]={i:i + 1, j:j }
        if (gboard[i + 1][j].mine) count++;//אחורה
        gneighbors[I++]={i:i, j:j+1 }  
        if (gboard[i][j - 1].mine) count++; //שמאלה
        gneighbors[I++]={i:i+1, j:j+1 } 
        if (gboard[i + 1][j - 1].mine) count++; //שמאלה באלכסון למטה
        return count;
    }
    if(i===0){
        gneighbors[I]={i:i + 1, j:j }
        if (gboard[i + 1][j].mine) count++;//אחורה
        gneighbors[I++]={i:i, j:j+1 }
        if (gboard[i][j + 1].mine) count++;//ימינה
        gneighbors[I++]={i:i, j:j+1 }  
        if (gboard[i][j -1].mine) count++; //שמאלה
        gneighbors[I++]={i:i+1, j:j+1 } 
        if (gboard[i + 1][j + 1].mine) count++;//ימינה באלכסון למטה 
        gneighbors[I++]={i:i+1, j:j+1 }           
        if (gboard[i + 1][j - 1].mine) count++; //שמאלה באלכסון למטה
         return count;
    }
    if(j===0){
        gneighbors[I]={i:i - 1, j:j }
        if (gboard[i - 1][j].mine) count++;//קדימה
        gneighbors[I++]={i:i + 1, j:j }
        if (gboard[i + 1][j].mine) count++;//אחורה
        gneighbors[I++]={i:i, j:j+1 }
        if (gboard[i][j + 1].mine) count++; //ימינה
        gneighbors[I++]={i:i+1, j:j-1 }  
       if(gboard[i-1][j+1].mine)count++//ימינה באלכסון למעלה
       gneighbors[I++]={i:i+1, j:j+1 } 
       if (gboard[i + 1][j + 1].mine) count++;//ימינה באלכסון למטה  
       return count;
    }
    if(i===gboard.length-1){
        gneighbors[I]={i:i - 1, j:j }
        if (gboard[i - 1][j].mine) count++;//קדימה
        gneighbors[I++]={i:i, j:j+1 }
        if (gboard[i][j + 1].mine) count++;//ימינה
        gneighbors[I++]={i:i, j:j-1 }
        if (gboard[i][j - 1].mine) count++; //שמאלה
        gneighbors[I++]={i:i+1, j:j-1 } 
        if(gboard[i-1][j+1].mine)count++//ימינה באלכסון למעלה
        gneighbors[I++]={i:i-1, j:j-1 }  
        if (gboard[i - 1][j - 1].mine) count++; //שמאלה באלכסון למעלה
        return count;
    }
     if(j===gboard.length-1){
        gneighbors[I]={i:i - 1, j:j }
        if (gboard[i - 1][j].mine) count++;//קדימה
        gneighbors[I++]={i:i + 1, j:j }
        if (gboard[i + 1][j].mine) count++;//אחורה
        gneighbors[I++]={i:i, j:j-1 }
        if (gboard[i][j - 1].mine) count++; //שמאלה
        gneighbors[I++]={i:i-1, j:j-1 } 
        if (gboard[i - 1][j - 1].mine) count++; //שמאלה באלכסון למעלה
        gneighbors[I++]={i:i+1, j:j+1 } 
        if (gboard[i + 1][j - 1].mine) count++; //שמאלה באלכסון למטה
        return count;
     }
     gneighbors[I]={i:i - 1, j:j }
    if (gboard[i - 1][j].mine) count++;//קדימה
    gneighbors[I++]={i:i + 1, j:j }
    if (gboard[i + 1][j].mine) count++;//אחורה
    gneighbors[I++]={i:i, j:j+1 }
    if (gboard[i][j + 1].mine) count++;//ימינה
    gneighbors[I++]={i:i, j:j-1 }
    if (gboard[i][j - 1].mine) count++;//שמאלה
    gneighbors[I++]={i:i+1, j:j-1 }  
    if (gboard[i + 1][j - 1].mine) count++;//שמאלה באלכסון למטה
    gneighbors[I++]={i:i+1, j:j+1 }   
    if (gboard[i + 1][j + 1].mine) count++; //ימינה באלכסון למטה
    gneighbors[I++]={i:i-1, j:j-1 }  
    if (gboard[i - 1][j - 1].mine) count++; //שמאלה באלכסון למעלה
    gneighbors[I++]={i:i+1, j:j-1 }  
    if(gboard[i-1][j+1].mine)count++//ימינה באלכסון למעלה
    return count;
}


function cellClicked(elcell) {
    var place = getCellCoord(elcell.id);
    var i = place.i;
    var j = place.j;
    if (gboard[i][j].mine) {
        gameOver()
        return;
    }
    var count = findMine(gboard, place)
    if (count > 0) {
        renderCell(place, count)
    }else if(count===0){
        if(firstClick){
            firstClick=false;
            getMineBoard()
            startTimer()
            return;
        }else{
            var neighbors=gneighbors.slice();
            for(var i=0;i<neighbors.length;i++){
                    count= findMine(gboard, neighbors[i])
                    if(count>0) renderCell(neighbors[i], count)
                }

            }
        }
    
    }



function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[0], j: +parts[1] };
    return coord;
}


function cellMarked(elCell, gboard) {
    var place = getCellCoord(elCell.id)
    var i = place.i;
    var j = place.j;
    if (gboard[i][j].isMarked) {
        renderCell(place, ' ')
        gboard[i][j].isMarked = false;
        return;
    }
    renderCell(place, FLAG)
    gboard[i][j].isMarked=true;
        if (gGame.markedCount === SIZE / 2) {
            gameOver()
            return;
        }
        gGame.shownCount++;
    }



function gameOver() {
    for(var i=0; i<gboard.length;i++){
        for(var j=0;j<gboard[0].length;j++){
            if(gboard[i][j].mine){
                renderCell({i:i,j:j},MINE);
            }
        }
    }
    initTimer()
    clearInterval(gTimerIntervalId);
    console.log('game over!')
    gGame.isOn = false;
    firstClick = true;
}





function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMineBoard() {
    for (var I = 0; I < SIZE*SIZE/5; I++) {
        var i = getRandomIntInclusive(0, SIZE - 1);
        var j = getRandomIntInclusive(0, SIZE - 1);
         console.log({i:i,j:j});
         gboard[i][j].mine = true;
    }
}

function renderCell(location, value) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }




function initTimer() {
    var elTimer = document.getElementById('timer');
    elTimer.innerText = '00 : 00';
}


function startTimer() {
    if (!gTimerIntervalId) {
        gStartTimer = getTime();
        gTimerIntervalId = setInterval(renderTimer, 10);
    }
}


function getTime() {
    return Date.now();
}

function renderTimer() {
    var delta = getTime() - gStartTimer;
    var time = timeFormatter(delta);
    var elTimer = document.getElementById('timer');
    elTimer.innerText = time;
}

function timeFormatter(timeInMilliseconds) {
    var time = new Date(timeInMilliseconds);
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();
    var milliseconds = time.getMilliseconds().toString();

    if (minutes.length < 2) {
        minutes = '0' + minutes;
    }

    if (seconds.length < 2) {
        seconds = '0' + seconds;
    }

    while (milliseconds.length < 3) {
        milliseconds = '0' + milliseconds;
    }

    return minutes + ' : ' + seconds;

}