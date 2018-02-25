/************
Global data
**************/
/*Variables
-------------*/
let user;
const QUESTIONS = 3;
const CHOICES = 4;
let questionsArr = [];
let shuffled = [];
let index = 0;
// let score = 0;
let score = {
    notRun: QUESTIONS,
    pass: 0,
    fail: 0
}

/*Question Prototypes
---------------------*/
class Question {
    constructor(id, type, title) {
    this.id = id;
    this.type = type;
    this.title = title;
    }
}
// Type: Complete
class Complete extends Question {
    constructor(id, type, title, qBody, ans) {
        super(id, type, title);
        this.qBody = qBody;
        this.ans = ans;
    }
}
// Type: Multi Choice
class Choice {
    constructor(id, val, isCorrect) {
      this.id = id;
      this.val = val;
      this.isCorrect = isCorrect;
    }
}
class Multi extends Question {
    constructor(id, type, title, choices, qBody) {
        super(id, type, title);
        this.choices = choices;
        this.qBody = qBody;
    }
}
// Type DnD
class DragImages {
    constructor(id, src, alt, dest) {
        this.id = id;
        this.src = src;
        this.alt = alt;
        this.dest = dest;
    }
}

class DnD extends Question {
    constructor(id, type, title, images, qBody) {
        super(id, type,title);
        this.dragables = images;
        this.qBody = qBody;
    }
}