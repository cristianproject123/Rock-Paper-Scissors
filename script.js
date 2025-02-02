document.addEventListener('DOMContentLoaded', function () {
    let currentPlayerTurn = 1;
    let player1Choice = "";
    let player2Choice = "";
    let isTwoPlayers = false;
    let player1Name = "Player 1";
    let player2Name = "Computer";
    let totalRounds = 1;
    let currentRound = 1;
    let player1Score = 0;
    let player2Score = 0;
    const shapes = ["rock", "paper", "scissors"];

    // Detectar el tipo de evento dependiendo del dispositivo
    const eventType = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';

    // Ocultar secciones al iniciar
    document.getElementById('step-2').classList.add('d-none');
    document.getElementById('step-3').classList.add('d-none');
    document.getElementById('step-4').classList.add('d-none');
    document.getElementById('nextRoundButton').classList.add('d-none'); // Ocultar botón de siguiente ronda al inicio

    // Botón de "Next" (Seleccionar jugadores)
    document.getElementById('nextButton').addEventListener(eventType, function () {
        isTwoPlayers = document.getElementById('twoPlayers').checked;
        document.getElementById('player2-container').classList.toggle('d-none', !isTwoPlayers);
        document.getElementById('step-1').classList.add('d-none');
        document.getElementById('step-2').classList.remove('d-none');
    });

    // Botón de "Start Game" (Ingresar nombres y número de rondas)
    document.getElementById('startGameButton').addEventListener(eventType, function () {
        player1Name = document.getElementById('player1').value || "Player 1";
        player2Name = document.getElementById('player2').value || (isTwoPlayers ? "Player 2" : "Computer");

        const selectedRounds = document.querySelector('input[name="rounds"]:checked');
        totalRounds = selectedRounds ? parseInt(selectedRounds.value) : 1;

        document.getElementById('player1Label').textContent = player1Name;
        document.getElementById('player2Label').textContent = player2Name;
        document.getElementById('turnInfo').textContent = `${player1Name}'s Turn`;
        document.getElementById('roundInfo').textContent = `Round ${currentRound} of ${totalRounds}`;
        document.getElementById('scoreBoard').textContent = `${player1Name}: 0 | ${player2Name}: 0`;

        document.getElementById('step-2').classList.add('d-none');
        document.getElementById('step-3').classList.remove('d-none');
    });

    // Manejo de selección de forma (piedra, papel, tijera)
    document.querySelectorAll('.shape-button').forEach(button => {
        button.addEventListener(eventType, function () {
            const selectedShape = this.dataset.shape;

            if (currentPlayerTurn === 1) {
                player1Choice = selectedShape;
                if (isTwoPlayers) {
                    currentPlayerTurn = 2;
                    document.getElementById('turnInfo').textContent = `${player2Name}'s Turn`;
                } else {
                    player2Choice = shapes[Math.floor(Math.random() * shapes.length)];
                    setTimeout(determineWinner, 1000);
                }
            } else {
                player2Choice = selectedShape;
                setTimeout(determineWinner, 1000);
            }
        });
    });

    // Función para determinar el ganador de la ronda
    function determineWinner() {
        let result = "";

        // Mostrar imágenes de las elecciones de ambos jugadores cuando se determine el ganador
        document.getElementById('player1ChoiceImage').src = `images/player1${capitalize(player1Choice)}.png`;
        document.getElementById('player1ChoiceImage').classList.remove('d-none');

        document.getElementById('player2ChoiceImage').src = `images/player2${capitalize(player2Choice)}.png`;
        document.getElementById('player2ChoiceImage').classList.remove('d-none');

        if (player1Choice === player2Choice) {
            result = "It's a Tie!";
        } else if (
            (player1Choice === "rock" && player2Choice === "scissors") ||
            (player1Choice === "paper" && player2Choice === "rock") ||
            (player1Choice === "scissors" && player2Choice === "paper")
        ) {
            result = `${player1Name} Wins the Round!`;
            player1Score++;
        } else {
            result = `${player2Name} Wins the Round!`;
            player2Score++;
        }

        // Mostrar el resultado en pantalla
        document.getElementById('turnInfo').textContent = result;

        // Actualizar marcador
        document.getElementById('scoreBoard').textContent = `${player1Name}: ${player1Score} | ${player2Name}: ${player2Score}`;

        // Mostrar botón de siguiente ronda
        document.getElementById('nextRoundButton').classList.remove('d-none');

        // Deshabilitar botones de selección hasta que el jugador presione "Siguiente Ronda"
        document.querySelectorAll('.shape-button').forEach(button => {
            button.disabled = true;
        });

        // Ocultar los botones de selección
        document.querySelectorAll('.shape-button').forEach(button => {
            button.classList.add('d-none');  // Ocultar botones
        });

        // Ocultar el título "Select a shape"
        document.getElementById('selectShapeMessage').classList.add('d-none');
    }

    // Botón para avanzar a la siguiente ronda
    document.getElementById('nextRoundButton').addEventListener(eventType, function () {
        if (currentRound < totalRounds) {
            currentRound++;
            document.getElementById('roundInfo').textContent = `Round ${currentRound} of ${totalRounds}`;
            currentPlayerTurn = 1;
            resetRound();
        } else {
            endGame();
        }
    });

    // Reiniciar para la siguiente ronda
    function resetRound() {
        player1Choice = "";
        player2Choice = "";
        document.getElementById('player1ChoiceImage').classList.add('d-none');
        document.getElementById('player2ChoiceImage').classList.add('d-none');
        document.getElementById('turnInfo').textContent = `${player1Name}'s Turn`;

        // Mostrar nuevamente las opciones de selección
        document.querySelectorAll('.shape-button').forEach(button => {
            button.classList.remove('d-none'); // Mostrar botones
            button.disabled = false; // Habilitar botones de selección
        });

        // Mostrar el título "Select a shape" de nuevo
        document.getElementById('selectShapeMessage').classList.remove('d-none');

        // Ocultar el botón de siguiente ronda
        document.getElementById('nextRoundButton').classList.add('d-none');
    }

    // Función para finalizar el juego
    function endGame() {
        document.getElementById('step-3').classList.add('d-none');
        document.getElementById('step-4').classList.remove('d-none');

        let finalMessage = "";
        if (player1Score > player2Score) {
            finalMessage = `Winner: ${player1Name}`;
        } else if (player2Score > player1Score) {
            finalMessage = `Winner: ${player2Name}`;
        } else {
            finalMessage = "It's a Tie!";
        }
        document.getElementById('winnerMessage').textContent = finalMessage;
    }

    // Función auxiliar para capitalizar la primera letra
    function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    // Botón para jugar de nuevo
    document.getElementById('playAgainButton').addEventListener(eventType, function () {
        location.reload();
    });

    // Botón para salir del juego
    document.getElementById('quitButton').addEventListener(eventType, function () {
        location.reload();
    });
});








