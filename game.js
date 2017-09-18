window.onload = function() {

    // variables that will hold objects
    var head, tail, cursors, snake, apple, gameText, playerDirection;
    var directions = Object.freeze({up: 0, down: 1, right: 2, left: 3});
    
    // configuration variables and starting values
    var canvasWidth = 832, canvasHeight = 640; 
    var playerSize = 64;
    var x = 128, y = 0;
    var frameCounter = 0;
    var gameSpeed = 20;
    var score = 0;

    // basic phaser preload/create/update functions

    var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('elephant', 'elephant.png');
        game.load.image('apple', 'apple.png');
    }

    function create() {
        gameText = game.add.text(canvasWidth, 0, "0", {
            font: "28px Arial",
            fill: "#fff"
        });
        gameText.anchor.setTo(1, 0);
        initSnake();
        placeRandomApple();

        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {
        gameText.text = score;
        updateDirection();
        frameCounter++;
        if (frameCounter == gameSpeed) {
            movePlayer();
            if (playerCollidesWithSelf()) {
                alert("The game is over! Your score was: " + score);
                deleteSnake();
                initSnake();
                score = 0;
                gameSpeed = 20;
                playerDirection = undefined;
                x = 128;
                y = 0;
                gameText.text = "";
            }
            if (appleCollidesWithSnake()) {
                score++;
                apple.destroy();
                placeRandomApple();
                gameSpeed--;
                if (gameSpeed <= 5) gameSpeed = 5;
            } else if (playerDirection != undefined) {
                removeTail();
            }
            frameCounter = 0;
        }
    }

    // helper functions

    function initSnake() {
        head = new Object();
        newHead(0, 0);
        tail = head;
        newHead(64, 0);
        newHead(128, 0);

    }

    function deleteSnake() {
        while (tail != null) {
            tail.image.destroy();
            tail = tail.next;
        }
        head = null;
    }

    function placeRandomApple() {
        if (apple != undefined) apple.destroy();
        apple = game.add.image(0, 0, 'apple');
        do {
            apple.position.x = Math.floor(Math.random() * 13) * 64;
            apple.position.y = Math.floor(Math.random() * 10) * 64;
        } while (appleCollidesWithSnake());
    }

    // linked list functions

    function newHead(x, y) {
        var newHead = new Object();
        newHead.image = game.add.image(x, y, 'elephant');
        newHead.next = null;
        head.next = newHead;
        head = newHead;
    }

    function removeTail(x, y) {
        tail.image.destroy();
        tail = tail.next;
    }

    // collision functions

    function appleCollidesWithSnake() {
        // traverse the linked list, starting at the tail
        var needle = tail;
        var collides = false;
        var numTimes = 0;
        while (needle != null) {
            numTimes++;
            if (apple.position.x == needle.image.position.x && 
                apple.position.y == needle.image.position.y) {
                collides = true;
            }
            needle = needle.next;
        }
        return collides;
    }

    function playerCollidesWithSelf() {
        // check if the head has collided with any other body part, starting at the tail
        var needle = tail;
        var collides = false;
        while (needle.next != head) {
            if (needle.image.position.x == head.image.position.x &&
                needle.image.position.y == head.image.position.y) {
                collides = true;
            }
            needle = needle.next;
        }
        return collides;
    }

    // movement functions

    function updateDirection() {
        if (cursors.right.isDown && playerDirection != directions.left) {
            playerDirection = directions.right;
        }
        if (cursors.left.isDown && playerDirection != directions.right) {
            playerDirection = directions.left;
        }
        if (cursors.up.isDown && playerDirection != directions.down) {
            playerDirection = directions.up;
        }
        if (cursors.down.isDown && playerDirection != directions.up) {
            playerDirection = directions.down;
        }
    }

    function movePlayer() {
        if (playerDirection == directions.right) {
            x += playerSize;
        } else if (playerDirection == directions.left) {
            x -= playerSize;
        } else if (playerDirection == directions.up) {
            y -= playerSize;
        } else if (playerDirection == directions.down) {
            y += playerSize;
        }
        if (x <= 0 - playerSize) {
            x = canvasWidth - playerSize;
        } else if (x >= canvasWidth) {
            x = 0;
        } else if (y <= 0 - playerSize) {
            y = canvasHeight - playerSize;
        } else if (y >= canvasHeight) {
            y = 0;
        }
        if (playerDirection != undefined) {
            newHead(x, y);
        }
    }

};
