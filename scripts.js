$(document).ready(function() {
    howMany();
});

var origBoard,
    player1,
    player2,
    depth = 0;


//first button function to determine number of players which calls...
function howMany() {
    $('#playerNumber').removeClass('hidden');
    $('.players').click(function() {
        if ($(this).attr('id') == 'btn1') {
            $('#p1name').text('Puny Human:');
            $('#p2name').text('Computer Overlord:');
            $('#turn1').text('Puny Human, it is your turn...')
            team(1);
        } else {
            team(2);
        }
    });
}

//second button function to determine 'X' vs 'O'
function team(num) {
    $('.scoreboard').removeClass('not-visible');
    if (num == 2) {
        $('#choice').text('Player 1 choose your side...');
    }
    $('#playerNumber').addClass('hidden');
    $('#playerType').removeClass('hidden');
    $('.type').click(function() {
        if ($(this).attr('id') == 'btnX') {
            gameOn(num, 'X');
        } else {
            gameOn(num, 'O');
        }

        $('#playerType').addClass('hidden');
        $('#game').removeClass('hidden');
    });
}

//start continuously running game w/ score tally
function gameOn(num, team) {
    var p1Turn = true;

    //set teams
    player1 = team;
    if (team == 'X') {
        player2 = 'O';
    } else {
        player2 = 'X';
    }

    //set board
    origBoard = Array.from(Array(9).keys());
    $('#turn1').removeClass('not-visible');

    //player clicks
    $('.gamebtn').click(function() {
        var square = this.id;
        if ($('#' + square).text() != '') {
            alert('This square hase already been played, please choose again...');
        } else {

            //two player game
            if (num == 2) {
                if (p1Turn) {
                    turn(player1, square);
                    $('#turn1').addClass('not-visible');
                    $('#turn2').removeClass('not-visible');
                    p1Turn = false;
                } else {
                    $('#turn2').addClass('not-visible');
                    $('#turn1').removeClass('not-visible');
                    turn(player2, square);
                    p1Turn = true;
                }

                //one player game
            } else {
                //player1 turn
                turn(player1, square);
                $('#turn1').addClass('not-visible');
                //ai player turn
                Hal(origBoard, player2);

            }
        }
    });
}

//upon turn click, update square text, origBoard Array with move of player, then check win and check tie
function turn(team, square) {
    $('#' + square).text(team);
    origBoard[square] = team;

    if (checkWin(origBoard, team)) {
        if (team == player1) {
            adjustScore('Player 1');
            setTimeout(function() {
                alert('Player 1, you win!');
                reset();
            }, 50);
        } else {
            adjustScore('Player 2');
            setTimeout(function() {
                alert('Player 2, you win!');
                reset();
            }, 50);
        }
    } else {
        if (checkTie(origBoard)) {
            setTimeout(function() {
                alert('This match is a tie.');
                reset();
            }, 50);
        }
    }
}

function Hal(board, team) {
    setTimeout(function() {
        var move = bestSpot();

        $('#' + move).text(team);
        origBoard[move] = team;

        if (checkWin(origBoard, team)) {
            adjustScore('Player 2');
            setTimeout(function() {
                alert('You Lose, Puny Human');
                reset();
            }, 20);
        } else if (checkTie(origBoard)){
            setTimeout(function() {
                alert('This match is a tie.');
                reset();
            }, 50);
        }
        $('#turn1').removeClass('not-visible');
    }, 500);
}

function bestSpot() {
    return minimax(origBoard, player2).index;
}

function minimax(board, player) {
    var spaces = availableSpaces(board);
    depth++;
    if (checkWin(board, player2)) {
        return { score: 10 + depth };
    } else if (checkWin(board, player1)) {
        return { score: -10 - depth };
    } else if (checkTie(board)) {
        return { score: 0 };
    }

    var moves = [];
    for (var i = 0; i < spaces.length; i++) {
        var move = {};
        var result;
        move.index = board[spaces[i]];
        board[spaces[i]] = player;

        if (player == player2) {
            result = minimax(board, player1);

            move.score = result.score;
        } else {
            result = minimax(board, player2);
            move.score = result.score;
        }

        board[spaces[i]] = move.index;
        moves.push(move);
    }

    var bestMove;
    var bestScore;
    if (player == player2) {
        bestScore = -100000000;
        for (var j = 0; j < moves.length; j++) {
            if (moves[j].score > bestScore) {
                bestScore = moves[j].score;
                bestMove = j;
            }
        }
    } else {
        bestScore = 100000000;
        for (var k = 0; k < moves.length; k++) {
            if (moves[k].score < bestScore) {
                bestScore = moves[k].score;
                bestMove = k;
            }
        }
    }

    return moves[bestMove];
}


function availableSpaces(board) {
    var emptySpaces = [];
    board.map(function(el) {
        if (el != 'X' && el != 'O') {
            emptySpaces.push(el);
        }
    });
    return emptySpaces;
}

//check for win by looping through all winning posibilities 
function checkWin(board, team) {
    const winArrays = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (var i = 0; i < winArrays.length; i++) {
        // statements
        if (board[winArrays[i][0]] == team && board[winArrays[i][1]] == team && board[winArrays[i][2]] == team) {
            return true;
        }
    }
    return false;
}

//check for tie when origBoard becomes all X or O
function checkTie(board) {
    if (board.every(isNaN)) {
        return true;
    } else {
        return false;
    }
}

//adjust score based on win
function adjustScore(player) {
    var score1 = $('#player-1').val();
    var score2 = $('#player-2').val();

    if (player == 'Player 1') {
        score1 = Number(score1);
        score1 += 1;
        $('#player-1').val(score1);
    } else {
        score2 = Number(score2);
        score2 += 1;
        $('#player-2').val(score2);
    }
}

//reset board to original parameters to continue playing
function reset() {
    origBoard = Array.from(Array(9).keys());
    $('.gamebtn').text('');
}