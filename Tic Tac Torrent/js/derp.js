var

$winState = $('#win-state'),
$newGame = $('#new-game'),

// Game logic.
board = [],
player = 1,
boardSize = 3,

gameActive = false,

Start = function(){
    board = [];
    gameActive = true;
    for(var i = 0; i < boardSize; i++){
        board[i] = [];
        for(var j = 0; j < boardSize; j++){
            board[i].push(0);
        }
    }
},

Play = function(x, y){
    if(board[x][y] == 0){
        board[x][y] = player;
    }
    checkState();
    changePlayer();
},

changePlayer = function(){
    if(player == 1) player = 2;
    else player = 1;
},

youWin = function(){
    gameActive = false;
    $currentPlayer.css('top', '-10%');
    $winState.html('Player '+player+' wins!').css('left', 0);
    setTimeout(function(){$newGame.css('left', 0);}, 300);
},

youDraw = function(){
    gameActive = false;
    $currentPlayer.css('top', '-10%');
    $winState.html('The result is a draw!').css('left', 0);
    setTimeout(function(){$newGame.css('left', 0);}, 300);
},

checkState = function(){
    var numConnected = null;
    var numZero = 0;
    for(var x = 0; x < boardSize; x++){
        numConnected = 0;
        for(var y = 0; y < boardSize; y++){
            if(board[x][y] == 0)            numZero++;
            if(board[x][y] == player)       numConnected++;
            else numConnected = 0;
            if(numConnected == boardSize)   youWin();
        }
    }
    numConnected = 0;
    for(var y = 0; y < boardSize; y++){
        numConnected = 0;
        for(var x = 0; x < boardSize; x++){
            if(board[x][y] == 0)            numZero++;
            if(board[x][y] == player)       numConnected++;
            else numConnected = 0;
            if(numConnected == boardSize)   youWin();
        }
    }
    numConnected = 0;
    for(var x = 0; x < boardSize; x++){
        if(board[x][x] == player)           numConnected++;
        else numConnected = 0;
        if(numConnected == boardSize)       youWin();
    }
    numConnected = 0;
    for(var x = boardSize-1, y = 0; x >= 0; x--, y++){
        if(board[x][y] == player)           numConnected++;
        else numConnected = 0;
        if(numConnected == boardSize)       youWin();
    }
    if(numZero == 0 && gameActive)          youDraw();
},

// User interface.
// Options elements.
$optionsMenu = $('#options-menu'),
$rowTemplate = $($('#row-template').html()),
$boxTemplate = $($('#box-template').html()),
$xTemplate = $($('#x-template').html()),
$oTemplate = $($('#o-template').html()),
$gridSmaller = $('#grid-smaller'),
$gridLarger = $('#grid-larger'),
$optionsGridSpace = $('#options-menu #content #grid-space'),
$normalButton = $('#options-menu #normal-mode'),
// $romanButton = $('#options-menu #roman-mode'),
$beginHolder = $('#begin-holder'),
$beginButton = $('#begin-button'),

// Gameboard elements.
$gameGridSpace = $('#gameboard #grid-space'),
$currentPlayer = $('#current-player'),
$gameRow = null,
$gameBox = null,

//mode = 0,       // 0 = normal, 1 = roman.

setOptionsMenuEventListeners = function(){
    $gridLarger
    .on('click', function(){
        if (boardSize<6){
            boardSize++;
            drawOptionsMenuGrid(boardSize);
        }
    }); 
    $gridSmaller
    .on('click', function(){
        if (boardSize>3){
            $(this).css('transform', 'scale(0.9)');
            setTimeout(function(){$gridSmaller.css('transform', 'scale(1)');}, 200);
            boardSize--;
            drawOptionsMenuGrid(boardSize);
        }
    });
    // $normalButton.on('click', function(){

    // });
    // $romanButton.on('click', function(){

    // });
    $beginButton
    .on('click', function(){
        $(this).css('transform', 'scale(0.9)');
        setTimeout(function(){$beginButton.css('transform', 'scale(1)');}, 200);
        Start();
        $optionsMenu.css('top', '-150%');
        setTimeout(function(){setUpGame();}, 500);
        setTimeout(function(){
            $gameBox.css({'opacity': 1, 'transform': 'scale(1)'});
            $currentPlayer.html('Player '+player+'\'s turn.').css('top', 0);
        }, 1000);
    });

    $newGame
    .on('click', function(){
        $(this).css('transform', 'scale(0.9)');
        setTimeout(function(){$newGame.css('transform', 'scale(1)');}, 200);
        $winState.css('left', '-35%');
        $gameBox.css({'opacity': 0, 'transform': 'scale(2)'});
        $newGame.css('left', '-50%');
        setTimeout(function(){
            $optionsMenu.css('top', '50%');
        }, 600);
    });
},

setUpGame = function(){
    drawGameGrid(boardSize);
    cacheGameboardElements();
    setGameEventListeners();
},

cacheGameboardElements = function(){
    $gameRow = $('#gameboard #grid-space .row');
    $gameBox = $('#gameboard #grid-space .box');
},

setGameEventListeners = function(){
    $gameRow.on('click', '.box', function(){
        if (gameActive){
            if (board[Number($(this).attr('id'))][Number($(this).parent('.row').attr('id').replace(/[A-Za-z$-]/g, ""))] == 0){
                if (player == 1) $(this).children('.x').css({'transform': 'scale(1)', 'opacity': 1});
                else if (player == 2) $(this).children('.o').css({'transform': 'scale(1)', 'opacity': 1});

                Play(Number($(this).attr('id')), Number($(this).parent('.row').attr('id').replace(/[A-Za-z$-]/g, "")))
                $currentPlayer.html('Player '+player+'\'s turn.');
            }
        }
    });
},

drawOptionsMenuGrid = function(length){
    $optionsGridSpace.html('');
    for (var i = 0; i < length; i++){
        $optionsGridSpace.append($rowTemplate.clone().attr('id', 'row'+i));
        for (var j = 0; j < length; j++){
            $('#options-menu #row'+i).append($boxTemplate.clone().css({'height': (90/length)+'px', 'width': (90/length)+'px'}));
        }
    }
},

drawGameGrid = function(length){
    $gameGridSpace.html('');
    for (var i = 0; i < length; i++){
        $gameGridSpace.append($rowTemplate.clone().attr('id', 'row'+i));
        for (var j = 0; j < length; j++){
            $('#gameboard #row'+i).append($boxTemplate.clone().attr('id', j).css({
                'height': (360/length)+'px', 
                'width': (360/length)+'px'
            }));
            $('#gameboard #row'+i+' #'+j).append(
                $xTemplate.clone().css('margin', (25/length)+'px')
            ).append(
                $oTemplate.clone().css('margin', (25/length)+'px')
            );
        }
    }
},

optionsMenuSetup = function(){
    setOptionsMenuEventListeners();
    drawOptionsMenuGrid(boardSize);
                };