const board = document.querySelector(".board");
const header = document.querySelector("#header");

let turn = "black";
let gameOver = false;

let blackLosses = 0;
let redLosses = 0;

let selectedPiece;
let proposedMove;
/*  TODO LIST

    Piece Count - needs displaying
    Tie Checker

*/

function resetGame() {
    location.reload();
}

addEventListener("click", (event) => {

    if (event.target.classList.contains("piece")) {
        if (gameOver) {
            return;
        }

        if (selectedPiece != null) {
            selectedPiece.parentNode.classList.remove("yellow");
            selectedPiece.parentNode.classList.add("black");
        }

        selectedPiece = event.target;
        proposedMove = null;

        selectedPiece.parentNode.classList.remove("black");
        selectedPiece.parentNode.classList.add("yellow");
    } else if (event.target.classList.contains("tile") && event.target.classList.contains("black") && selectedPiece != null) {
        proposedMove = event.target;
    }

    if (selectedPiece != null && proposedMove != null && (getTeamOfPiece(selectedPiece) == turn || turn.includes("+"))) {

        if (isValidMove(selectedPiece, proposedMove)) {
            selectedPiece.parentNode.classList.remove("yellow");
            selectedPiece.parentNode.classList.add("black");

            proposedMove.appendChild(selectedPiece);

            if (shouldBeCrown(selectedPiece)) {
                turnCrown(selectedPiece);
            }

            selectedPiece = null;
            proposedMove = null;

            if (!turn.includes("+")) {
                switchTurn();
            }

            if (redLosses == 12) {
                header.innerHTML = "Checkers - BLACK WON!";
                gameOver = true;
            } else if (blackLosses == 12) {
                header.innerHTML = "Checkers - RED WON!";
                gameOver = true;
            }
        }
    }
});

function isSpaceTaken(row, column) {
    return board.children[column].children[row].children.length > 0;
}

function getPieceAt(row, column) {
    return board.children[column].children[row].children[0];
}

function isSpaceTakenByOppositeTeam(currentTeam, row, column) {
    var path = board.children[column].children[row].children[0].src;

    if (isSpaceTaken(row, column) && path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("_")) != currentTeam) {
        return true;
    }
    return false;
}

function getTeamOfPiece(piece) {
    const path = piece.src;
    return path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("_"));
}

function isValidMove(piece, move) {
    const pieceLocation = getLocationOfPiece(piece);
    const moveLocation = getLocationOfTile(move);

    if (!isCrown(piece)) {
        if (getTeamOfPiece(piece) == "black") {
            if (getLocationOfPiece(piece).column > getLocationOfTile(move).column) {
                return false;
            }
        } else {
            if (getLocationOfPiece(piece).column < getLocationOfTile(move).column) {
                return false;
            }
        }
    }
    if (turn.includes("+")) {
        if (getTeamOfPiece(piece) == turn.substring(0, turn.length-1)) {
            if ((pieceLocation.row + 1 == moveLocation.row && pieceLocation.column + 1 == moveLocation.column) || (pieceLocation.row + 1 == moveLocation.row && pieceLocation.column - 1 == moveLocation.column) || (pieceLocation.row - 1 == moveLocation.row && pieceLocation.column - 1 == moveLocation.column) || (pieceLocation.row - 1 == moveLocation.row && pieceLocation.column + 1 == moveLocation.column)) {
                turn = turn.substring(0, turn.length-1);
                return true;
            }
        }
    } else if ((pieceLocation.row + 1 == moveLocation.row && pieceLocation.column + 1 == moveLocation.column) || (pieceLocation.row + 1 == moveLocation.row && pieceLocation.column - 1 == moveLocation.column) || (pieceLocation.row - 1 == moveLocation.row && pieceLocation.column - 1 == moveLocation.column) || (pieceLocation.row - 1 == moveLocation.row && pieceLocation.column + 1 == moveLocation.column)) {
        return true;
    }


    if (pieceLocation.row + 2 == moveLocation.row && pieceLocation.column + 2 == moveLocation.column && isSpaceTakenByOppositeTeam(getTeamOfPiece(piece), pieceLocation.row + 1, pieceLocation.column + 1)) {
        let hopped = getPieceAt(pieceLocation.row + 1, pieceLocation.column + 1);
        if (getTeamOfPiece(hopped) == "red") {
            redLosses++;
        } else {
            blackLosses++;
        }
        hopped.parentNode.removeChild(hopped);

        if (getTeamOfPiece(piece) == "black" && turn == "black+") {
            turn = "red+";
        } else if (getTeamOfPiece(piece) == "red" && turn == "red+") {
            turn = "black+";
        }
        header.innerHTML = "Checkers - " + (turn.charAt(0).toUpperCase() + turn.substring(1)).replaceAll("+", "") + "'s Move";

        if (!turn.includes("+")) {
            switchTurn();
            turn += "+";
        }
        
        return true;
    }
    if (pieceLocation.row + 2 == moveLocation.row && pieceLocation.column - 2 == moveLocation.column && isSpaceTakenByOppositeTeam(getTeamOfPiece(piece), pieceLocation.row + 1, pieceLocation.column - 1)) {
        let hopped = getPieceAt(pieceLocation.row + 1, pieceLocation.column - 1);
        if (getTeamOfPiece(hopped) == "red") {
            redLosses++;
        } else {
            blackLosses++;
        }
        hopped.parentNode.removeChild(hopped);

        if (getTeamOfPiece(piece) == "black" && turn == "black+") {
            turn = "red+";
        } else if (getTeamOfPiece(piece) == "red" && turn == "red+") {
            turn = "black+";
        }
        header.innerHTML = "Checkers - " + (turn.charAt(0).toUpperCase() + turn.substring(1)).replaceAll("+", "") + "'s Move";

        if (!turn.includes("+")) {
            switchTurn();
            turn += "+";
        }
        return true;
    }
    if (pieceLocation.row - 2 == moveLocation.row && pieceLocation.column - 2 == moveLocation.column && isSpaceTakenByOppositeTeam(getTeamOfPiece(piece), pieceLocation.row - 1, pieceLocation.column - 1)) {
        let hopped = getPieceAt(pieceLocation.row - 1, pieceLocation.column - 1);
        if (getTeamOfPiece(hopped) == "red") {
            redLosses++;
        } else {
            blackLosses++;
        }
        hopped.parentNode.removeChild(hopped);

        if (getTeamOfPiece(piece) == "black" && turn == "black+") {
            turn = "red+";
        } else if (getTeamOfPiece(piece) == "red" && turn == "red+") {
            turn = "black+";
        }
        header.innerHTML = "Checkers - " + (turn.charAt(0).toUpperCase() + turn.substring(1)).replaceAll("+", "") + "'s Move";

        if (!turn.includes("+")) {
            switchTurn();
            turn += "+";
        }
        return true;
    }
    if (pieceLocation.row - 2 == moveLocation.row && pieceLocation.column + 2 == moveLocation.column && isSpaceTakenByOppositeTeam(getTeamOfPiece(piece), pieceLocation.row - 1, pieceLocation.column + 1)) {
        let hopped = getPieceAt(pieceLocation.row - 1, pieceLocation.column + 1);
        if (getTeamOfPiece(hopped) == "red") {
            redLosses++;
        } else {
            blackLosses++;
        }
        hopped.parentNode.removeChild(hopped);

        if (getTeamOfPiece(piece) == "black" && turn == "black+") {
            turn = "red+";
        } else if (getTeamOfPiece(piece) == "red" && turn == "red+") {
            turn = "black+";
        }
        header.innerHTML = "Checkers - " + (turn.charAt(0).toUpperCase() + turn.substring(1)).replaceAll("+", "") + "'s Move";

        if (!turn.includes("+")) {
            switchTurn();
            turn += "+";
        }
        return true;
    }
    
}

function getLocationOfTile(tile) {
    let moveColumn = -1;
    for (let i = 0; i < tile.parentNode.parentNode.children.length; i++) {
        if (tile.parentNode.parentNode.children[i] == tile.parentNode) {
            moveColumn = i;
        }
    }
    let moveRow = -1;
    for (let i = 0; i < tile.parentNode.children.length; i++) {
        if (tile.parentNode.children[i] == tile) {
            moveRow = i;
        }
    }
    return { row: moveRow, column: moveColumn };
}

function getLocationOfPiece(piece) {
    return getLocationOfTile(piece.parentNode);
}

function turnCrown(piece) {
    const team = getTeamOfPiece(piece);
    piece.src = "/assets/" + team + "_crown.png";
}

function shouldBeCrown(piece) {
    if (getTeamOfPiece(piece) == "black") {
        return getLocationOfPiece(piece).column == 7;
    }
    return getLocationOfPiece(piece).column == 0;
}

function isCrown(piece) {
    return piece.src.includes("crown");
}

function switchTurn() {
    if (turn == "black") {
        turn = "red";
    } else {
        turn = "black";
    }
    header.innerHTML = "Checkers - " + turn.charAt(0).toUpperCase() + turn.substring(1) + "'s Move";
}