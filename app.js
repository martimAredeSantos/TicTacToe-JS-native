const App = {
    $:{
        menu: document.querySelector('[data-id="menu"]'),
        menuItems: document.querySelector('[data-id="menu-items"]'),
        resetBtn: document.querySelector('[data-id="reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
        squares: document.querySelectorAll('[data-id="square"]'),
        modal: document.querySelector('[data-id="modal"]'),
        modalText: document.querySelector('[data-id="modal-text"]'),
        modalBtn: document.querySelector('[data-id="modal-btn"]'),
        turn: document.querySelector('[data-id="turn"]'),
        turnText: document.querySelector('[data-id="turn-text"]'), //mod
        p1Wins: document.querySelector('[data-id="p1-wins"]'), //mod
        p2Wins: document.querySelector('[data-id="p2-wins"]'), //mod
        ties: document.querySelector('[data-id="ties"]'), //mod
    },

    state:{
        moves: [],
        p1Wins: +0,
        p2Wins: +0,
        ties: +0,
    },

    getGameStatus(moves){

        const p1Moves = moves.filter(move => move.playerId === 1).map(move => +move.squareId)
        const p2Moves = moves.filter(move => move.playerId === 2).map(move => +move.squareId)

        const winningPatterns = [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 5, 7],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9],
        ];

        let winner = null;

        winningPatterns.forEach(pattern =>{
            const p1Wins = pattern.every(v => p1Moves.includes(v))
            const p2Wins = pattern.every(v => p2Moves.includes(v))

            if(p1Wins) {
                winner = 1
                App.$.p1Wins.textContent = +App.state.p1Wins +1; //mod
                App.state.p1Wins = +App.$.p1Wins.textContent //mod
            }

            if(p2Wins) {
                winner = 2
                App.$.p2Wins.textContent = +App.state.p2Wins +1; //mod
                App.state.p2Wins = +App.$.p2Wins.textContent //mod
            }
        });

        return{
            status: moves.length ===9 || winner != null ? "complete" : "in-progress",
            winner
        }
    },

    init(){
        App.registerEventListeners()
    },

    registerEventListeners(){
        App.$.menu.addEventListener("click", () => {
            App.$.menuItems.classList.toggle("hidden")
        });

        App.$.resetBtn.addEventListener("click", () => {
            window.location.reload();
        });

        App.$.newRoundBtn.addEventListener("click", () => {
            App.state.moves = [];
            App.$.squares.forEach(square => square.replaceChildren());
        });

        App.$.modalBtn.addEventListener("click", () => {
            App.state.moves = [];
            App.$.squares.forEach(square => square.replaceChildren());
            App.$.modal.classList.add("hidden");

            const turnLabel = document.createElement("p");
            const turnIcon = document.createElement("i");
            App.$.turn.replaceChildren(turnIcon,turnLabel)
            turnLabel.innerText = "Player 1 you are up!"
            turnIcon.classList.add('fa-solid', "fa-x", "turquoise");


        })
        
        App.$.squares.forEach( square => {
            square.addEventListener("click", () => {

                const hasMove = (squareId) => {
                    const existingMove = App.state.moves.find(move => move.squareId === squareId)
                    return existingMove != null
                }

                if(hasMove(+square.id)){
                    return
                }

                const lastMove = App.state.moves.at(-1)
                const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
                const currentPlayer = App.state.moves.length === 0 ? 1 : getOppositePlayer(lastMove.playerId);
                const nextPlayer = getOppositePlayer(currentPlayer);

                const squareIcon = document.createElement("i");
                const turnIcon = document.createElement("i");
                const turnLabel = document.createElement("p");
                turnLabel.innerText = `Player ${nextPlayer}, you are up!`
                
                if (currentPlayer === 1){
                    squareIcon.classList.add('fa-solid', "fa-x", "turquoise");
                    turnIcon.classList.add('fa-solid', "fa-o", "yellow");
                    turnLabel.classList = "yellow"
                }else{
                    squareIcon.classList.add('fa-solid', "fa-o", "yellow");
                    turnIcon.classList.add('fa-solid', "fa-x", "turquoise");
                    turnLabel.classList = "turquoise"
                }

                App.$.turn.replaceChildren(turnIcon,turnLabel)
                
                App.state.moves.push({
                    squareId: +square.id,
                    playerId: currentPlayer
                })

                //console.log(App.state);

                square.replaceChildren(squareIcon);

                const game = App.getGameStatus(App.state.moves);

                if(game.status === "complete"){

                    App.$.modal.classList.remove("hidden")

                    let message = "";
                    if(game.winner){
                        message = `Player ${game.winner} wins!`
                    }else{
                        message = 'Tie!'
                        App.$.ties.textContent = +App.state.ties +1; //mod
                        App.state.ties = App.$.ties.textContent; //mod
                    }
                    App.$.modalText.textContent = message
                }
            })
        })
    }
};

window.addEventListener("load",()=> {App.init()})



