let selectedPiece;
let proposedMove;

addEventListener("click", (event) => {
    if (event.target.classList.contains("piece")) {
        selectedPiece = event.target;
        proposedMove = null;

        selectedPiece.parentNode.classList.remove("black");
        selectedPiece.parentNode.classList.add("yellow");
    } else if (event.target.classList.contains("tile") && event.target.classList.contains("black") && selectedPiece != null) {
        proposedMove = event.target;
    }

    if (selectedPiece != null && proposedMove != null) {
        selectedPiece.parentNode.classList.remove("yellow");
        selectedPiece.parentNode.classList.add("black");

        proposedMove.appendChild(selectedPiece);

        selectedPiece = null;
        proposedMove = null;
    }
});