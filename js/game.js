'use strict'
var SIZE = 4;
var MINE = '@'
var FLAG = '&'
var firstClick=true;
var gboard = [];
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
    getMineBoard()
}

initGame()

function chooseLevel(){
    //לעשות שהשחק יבחר את הרמה בכפתור
    var level=[];
    for(var i=0;i<3;i++){
        level[i]=SIZE;
        console.log(level[i]);
       if(i!==2) SIZE+=4;
    }
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
            var className = 'cell';
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
    //קדימה
    if (gboard[i - 1][j].mine) count++;
    //אחורה
    if (gboard[i + 1][j].mine) count++;
    //ימינה
    if (gboard[i][j + 1].mine) count++;
    //שמאלה
    if (gboard[i][j - 1].mine) count++;
    // למעלה ימינה באלכסון
    if (gboard[i - 1][j + 1].mine) count++;
    //שמאלה באלכסון למעלה
    if (gboard[i - 1][j - 1].mine) count++;
    //שמאלה באלכסון למטה
    if (gboard[i + 1][j - 1].mine) count++;
    //ימינה באלכסון למטה
    if (gboard[i + 1][j + 1].mine) count++;
    return count;
}

function renderCell(location, value) {
    var i = location.i;
    var j = location.j;
    var elCell = document.querySelector('.selected');
    elCell.innerHTML = value;
}

function cellClicked(elcell) {
    var place = getCellCoord(elcell.id);
    console.log(elcell)
    var i = place.i;
    var j = place.j;
    console.log(place)
    console.log(gboard[i][j].mine)
    if (gboard[i][j].mine) {
        gameOver()
        return;
    }
    var count = findMine(gboard, place)
    // if(count===0) //לבדוק את השכנים של השכנים שלו
    if (count > 0) {
        elcell.classList.add('selected');
        renderCell(place, count)
    }

}

function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[0], j: +parts[1] };
    return coord;
}


function cellMarked(elCell, gboard) {
    console.log(elCell);
    console.log(elCell.id)
    console.log('jj');
    var place = getCellCoord(elCell.id)
    var i = place.i;
    var j = place.j;
    if (gboard[i][j].isMarked) {
        renderBoard(place, ' ')
        gboard[i][j].isMarked = false;
        return;
    }
    renderCell(place, FLAG)
    if (gboard[i][j].mine) {
        gGame.shownCount++;
        if (gGame.markedCount === SIZE / 2) {
            gameOver()
            return;
        }
        gGame.shownCount++;
    }

}

function gameOver() {
    gGame.isOn = false;
    firstClick=true;
}



// function showRightClick()
// {
//     righClick.style.visibility='visible';
//     righClick.style.display='';
//     righClick.style.top=event.y;
//     righClick.style.left=event.x;
// }
//function checkGameOver
//

//expandShown(board, elCell,
// i, j)במקרה ואין שכנים




function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMineBoard() {
    if(firstClick)firstClick=false;
    else return;
    for (var I = 0; I < SIZE / 2; I++) {
        var i = getRandomIntInclusive(0, SIZE - 1);
        var j = getRandomIntInclusive(0, SIZE - 1);
        gboard[i][j].mine = true;
    }
}



// function isEmptyCell(coord) {
//     return gBoard[coord.i][coord.j] === ''
// }



//    function isEmptyCell(gboard){
//    var emptyCell=[];
//     for(var i=0;i<gboard.legth;i++){
//         for(var j=0; j<gboard[i].legth;j++){
//            if(gboard[i][j].mine===false) 
//             console.log('nn')
//              emptyCell[i]={i:i,j:j};
//            }
//         }
//         return emptyCell;
//     }
//     initGame()
//     console.log(isEmptyCell(gboard))

// function onclick(event.button){
//     if(eventbutton===1)
// }
