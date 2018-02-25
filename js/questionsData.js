// Bind draggable & droppable elements
const imagesArr = [
    new DragImages("drag_0", "img/qId_2/ans_0.png", "Ans 0", "dropCol_3"),
    new DragImages("drag_1", "img/qId_2/ans_1.png", "Ans 1", "dropCol_0"),
    new DragImages("drag_2", "img/qId_2/ans_2.png", "Ans 2", "dropCol_2"),
    new DragImages("drag_3", "img/qId_2/ans_3.png", "Ans 3", "dropCol_1")    
];

/* Set Quiz questions
---------------------*/
// Instanciate question objects
function fSetQuestions(){
    // COMPLETE
    let completeBody = 
        '<form class="form-horizontal">'
            + '<div class="form-group complete-group">'
                + '<label class="control-label complete-label" for="ans">השמש בצבע</label>'
                + '<input type="text" class="form-control complete-input" id="ans" name="ans">'
            + '</div>'
        + '</form>';
    let completeQ = new Complete(0, "complete", "שאלת השלמה", completeBody, "צהוב");
    questionsArr.push(completeQ);

    // MULTI
    let title = 'שאלה אמריקאית';
    let choices = [];
    for (let i = 0; i < CHOICES; i++) {
        let val = "תשובה מספר " + i;
        choices.push(new Choice(i, val, false));
    }
    choices[1].isCorrect = true;

    let multiBody = '';
    for (let i = 0; i < choices.length; i++) {
        multiBody += 
        '<div class="input-group multi">'
            + '<span class="input-group-addon multi">'
                + '<input type="radio" aria-label="choiceSelect" id="choice_' + i + '" name="options">'
            + '</span>'
            + '<input type="text" class="form-control multi" aria-label="choiceText" disabled value="' + choices[i].val + '">'
        + '</div>';
    }

    let multiQ = new Multi(1, "multi", title, choices, multiBody);
    questionsArr.push(multiQ);

    // DRAG N DROP
    let dNdDragBox = '<div class="row drag-row">';
    for (let i = 0; i < imagesArr.length; i++) {
        dNdDragBox += 
            '<div id="dragCol_' + i + '" class="col-xs-6 col-md-3 drag-col" ondrop="drop(event)" ondragover="allowDrop(event)">'
                + '<img id="' + imagesArr[i].id + '" src="' + imagesArr[i].src + '" alt = "' + imagesArr[i].alt + '"'
                + 'class="thumbnail img-responsive img-drag" draggable="true" ondragstart="drag(event)">'
            + '</div>';      
    }
    dNdDragBox += '</div>';

    let dndDropBox = '<div class="row drop-row">';
    for (let i = 0; i < imagesArr.length; i++) {
        dndDropBox += 
            '<div id="dropCol_' + i + '" class="col-xs-6 col-md-3 dropColClass" ondrop="drop(event)" ondragover="allowDrop(event)">'
                + '<div id="drop_' + i + '" class="thumbnail text-center div-drop"></div>'
            + '</div>';
    }
    dndDropBox += '</div>';

    let direction = 
        '<div class="row">'
            + '<div class="col-md-4"></div>'
            + '<div class="col-xs-12 col-md-4">'
                +'<i class="fa fa-4x fa-arrow-left text-center" aria-hidden="true"></i></div>'
            + '</div>'
            + '<div class="col-md-4"></div>';            

    let dndBody = dNdDragBox + dndDropBox + direction;
    let dNdQ = new DnD(2, "dNd", "שאלת גרירה", imagesArr, dndBody);
    questionsArr.push(dNdQ);
}

// Shuffle questions order (random)
function fShuffle(){
    // set indices range
    let indices = [];
    for (let i = 0; i < QUESTIONS; i++) {
        indices.push(i);
    }

    // create shuffled set of indices
    const qSet = new Set();
    while (qSet.size < QUESTIONS) {
        let rand = Math.floor(Math.random() * (QUESTIONS));
        qSet.add(rand);
    }

    // Convert the shuffled set of indices to array of Question objects
    indices.splice(0, indices.length);
    indices = Array.from(qSet);

    let randQarr = [];
    for (let i = 0; i < indices.length; i++) {
        let curr = indices[i];
        randQarr.push(questionsArr[curr]);
    }
    return randQarr;
}