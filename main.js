const quiz = [
    { name: 'Superman', realName: 'Clark Kent' },
    { name: 'Wonder Woman', realName: 'Diana Prince' },
    { name: 'Batman', realName: 'Bruce Wayne' },
];

function random (a, b = 1) {
    // if only 1 argument is provided, we need to swap the values of a and b
    if (b === 1) {
        [ a, b ] = [ b, a ];
    }
    return Math.floor((b - a + 1) * Math.random()) + a;
}

function shuffle (array) {
    for (let i = array.length; i; i--) {
        let j = random(i) - 1;
        [ array[ i - 1 ], array[ j ] ] = [ array[ j ], array[ i - 1 ] ];
    }
}

const view = {
    score: document.querySelector('#score strong'),
    question: document.getElementById('question'),
    result: document.getElementById('result'),
    info: document.getElementById('info'),
    start: document.getElementById('start'),
    response: document.querySelector('#response'),
    timer: document.querySelector('#timer strong'),
    render (target, content, attributes) {
        Object.keys(attributes || []).forEach(key => target.setAttribute(key, attributes[ key ]));
        target.innerHTML = content;
    },
    show (element) {
        element.style.display = 'block';
    },
    hide (element) {
        element.style.display = 'none';
    },
    setup () {
        this.show(this.question);
        this.show(this.response);
        this.show(this.result);
        this.hide(this.start);
        this.render(this.score, game.score);
        this.render(this.result, '');
        this.render(this.info, '');
        this.resetForm();
    },
    resetForm () {
        this.response.answer.value = '';
        this.response.answer.focus();
    },
    teardown () {
        this.hide(this.question);
        this.hide(this.response);
        this.show(this.start);
    }
};

view.start.addEventListener('click', () => game.start(quiz), false);

const game = {
    start (quiz) {
        this.secondsRemaining = 20;
        this.timer = setInterval(this.countdown, 1000);
        view.render(view.timer, game.secondsRemaining);

        view.hide(view.start);
        this.score = 0;
        this.questions = [ ...quiz ];
        view.setup();
        this.ask();
    },
    check (event) {
        event.preventDefault();
        const response = view.response.answer.value;
        const answer = this.question.realName.toLowerCase();
        if (response.toLowerCase() === answer) {
            view.render(view.result, 'Correct!', { 'class': 'correct' });
            this.score++;
            view.render(view.score, this.score);
        } else {
            view.render(view.result, `Wrong! The correct answer was ${answer}`, { 'class': 'wrong' });
        }
        view.resetForm();
        this.ask();
    },
    gameOver () {
        view.render(view.info, `Game Over, you scored ${this.score} point${this.score !== 1 ? 's' : ''}`);
        view.teardown();
        clearInterval(this.timer);
    },
    ask (name) {
        if (this.questions.length > 0) {
            shuffle(this.questions);
            this.question = this.questions.shift();
            const question = `What is ${this.question.name}'s real name?`;
            view.render(view.question, question);
        }
        else {
            this.gameOver();
        }
    },
    countdown () {
        game.secondsRemaining--;
        view.render(view.timer, game.secondsRemaining);
        if (game.secondsRemaining <= 0) {
            game.gameOver();
        }
    },
};

view.response.addEventListener('submit', (event) => game.check(event), false);
view.hide(view.response);