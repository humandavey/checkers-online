const board = document.querySelector(".board");

let selectedPiece;
let proposedMove;

addEventListener("click", (event) => {
    if (event.target.classList.contains("piece")) {
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

    if (selectedPiece != null && proposedMove != null) {

        if (isValidMove(selectedPiece, proposedMove)) {
            selectedPiece.parentNode.classList.remove("yellow");
            selectedPiece.parentNode.classList.add("black");

            proposedMove.appendChild(selectedPiece);

            selectedPiece = null;
            proposedMove = null;
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

    if ((pieceLocation.row + 1 == moveLocation.row && pieceLocation.column + 1 == moveLocation.column) || (pieceLocation.row + 1 == moveLocation.row && pieceLocation.column - 1 == moveLocation.column) || (pieceLocation.row - 1 == moveLocation.row && pieceLocation.column - 1 == moveLocation.column) || (pieceLocation.row - 1 == moveLocation.row && pieceLocation.column + 1 == moveLocation.column)) {
        return true;
    }

    if (pieceLocation.row + 2 == moveLocation.row && pieceLocation.column + 2 == moveLocation.column && isSpaceTakenByOppositeTeam(getTeamOfPiece(piece), pieceLocation.row + 1, pieceLocation.column + 1)) {
        let hopped = getPieceAt(pieceLocation.row + 1, pieceLocation.column + 1);
        hopped.parentNode.removeChild(hopped);
        return true;
        
    }
    if (pieceLocation.row + 2 == moveLocation.row && pieceLocation.column - 2 == moveLocation.column && isSpaceTakenByOppositeTeam(getTeamOfPiece(piece), pieceLocation.row + 1, pieceLocation.column - 1)) {
        let hopped = getPieceAt(pieceLocation.row + 1, pieceLocation.column - 1);
        hopped.parentNode.removeChild(hopped);
        return true;
    }
    if (pieceLocation.row - 2 == moveLocation.row && pieceLocation.column - 2 == moveLocation.column && isSpaceTakenByOppositeTeam(getTeamOfPiece(piece), pieceLocation.row - 1, pieceLocation.column - 1)) {
        let hopped = getPieceAt(pieceLocation.row - 1, pieceLocation.column - 1);
        hopped.parentNode.removeChild(hopped);
        return true;
    }
    if (pieceLocation.row - 2 == moveLocation.row && pieceLocation.column + 2 == moveLocation.column && isSpaceTakenByOppositeTeam(getTeamOfPiece(piece), pieceLocation.row - 1, pieceLocation.column + 1)) {
        let hopped = getPieceAt(pieceLocation.row - 1, pieceLocation.column + 1);
        hopped.parentNode.removeChild(hopped);
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