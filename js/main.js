/******************
UserName step
*********************/
// Username keyUp
function fOnUserKeyUp() {
    $("#examinee").keyup(function(){
        let userName = $("#examinee").val();
        // case no/partial input
        if (userName.length < 3) {
            fUserState("empty");
        }
        // case valid input
        else if (fIsValidUser(userName)) {
            fUserState("valid");
            user = userName;
        }
        // case invalid
        else {
            fUserState("invalid");
        }
    });
}
// UserName validator
function fIsValidUser(userName) {
    // case too long
    if (userName.length > 20) {
        return false;
    }

    // case invalid characters
    let patt = /^[a-zA-Z0-9_\u05D0-\u05EA]*$/g;
    let res = userName.match(patt);
    if (res == null) {
        return false;
    }

    // case valid username
    return true;
}
// Username GUI handler
function fUserState(state){
    // case no input
    if (state == "empty") {
        // icon box
        $("#examineeDiv span").css("background-color", "#eeeeee");
        // icon
        $("#examineeDiv i").css("color", "#555555");
        // next button
        $("#setUserBtn").addClass("disabled");
        $("#setUserBtn").attr("disabled");
    }

    // case valid input
    else if (state == "valid") {
        // icon box
        $("#examineeDiv span").css("background-color", "#b3ffb3");
        // icon
        $("#examineeDiv i").css("color", "#008000");
        // next button
        $("#setUserBtn").removeAttr("disabled");
        $("#setUserBtn").removeClass("disabled");
    }

    else if(state == "invalid") {
        // icon box
        $("#examineeDiv span").css("background-color", "#ffcccc");
        // icon
        $("#examineeDiv i").css("color", "#ff4d4d");
        // next button
        $("#setUserBtn").addClass("disabled");
        $("#setUserBtn").attr("disabled");
    }
}
// Click set user
function fOnUserClick(){
    $("#setUserBtn").click(function(){
        // Render generic HTML
        $("#userName").text(user); 
        $("#cardRoot").empty();
        $(".next-wrapper").empty();
        fRenderPagi();
        fRenderQwrapper();
        fAnimate();
        fRenderQbuttons();

        // Add generic event listeners
        fOnNextClick();
        fOnClickCheck();

        // Render first question
        fRenderQuestion();
        $(".sidebar-col .panel").removeClass("hide");
        $(".sidebar-col").css("padding-top", "20px");
    });
}
// On click set user render pagination & load first (random) question
function fRenderPagi(){
    let pagination = 
        '<ul class="pagination">'
        + '<li class="active"><a>1</a></li>'
        + '<li class="disabled"><a>2</a></li>'
        + '<li class="disabled"><a>3</a></li>'
        + '</ul>';
    $("#pagiWrapper").html(pagination);
    $(".sidebar-col #currQuestion span").text((index + 1));
}

/******************
Questions step
******************/
/* Render HTML
--------------*/
// WRAPPER
function fRenderQwrapper(){
    // Set
    let title = '<div class="panel panel-default title-wrapper text-center"></div>';
    let question = '<div class="questionBody-wrapper"></div>';
    // Render
    let output = '<div class="question-wrapper">' + title + question + '</div>';
    $("#cardRoot").html(output);
}
// BUTTONS
function fRenderQbuttons(){
    let buttons = 
        '<div class="ansBtn-wrapper">'
        + '<div><button id="nextBtn" type="button" class="btn btn-primary btn-lg next-btn hide">המשך</button></div>'
        + '<div><button id="testBtn" type="button" class="btn btn-info btn-lg test-btn hide">בדוק</button></div>'
        + '</div>';
    $(".question-wrapper").after(buttons);
}
// QUESTION
function fRenderQuestion(){
     // Title
     let title = '<h1>' + shuffled[index].title + '</h1>';
     $(".title-wrapper").html(title);
     // Body
     $(".questionBody-wrapper").html(shuffled[index].qBody);
     // Reset buttons
     $("#nextBtn").addClass("hide");
     $("#testBtn").addClass("hide");
     /* Type
     --------*/
    //  COMPLETE
     if (shuffled[index].type == "complete") {
        $("#testBtn").removeClass("hide");
        fOnKeyPressEnter(index);
     }
     // MULTI
     else if (shuffled[index].type =="multi") {
        fOnSelectAns(index);
     }
    // DRAG N DROP
    else if (shuffled[index].type == "dNd") {
        $("#testBtn").removeClass("hide");
    }
}

/* BUTTONS - Event Listeners
-----------------------*/
// CHECK ANSWER
function fOnClickCheck(){
    $("#testBtn").click(function(){
        fFeedbackHandler();
    });
}
// NEXT
function fOnNextClick() {
    $("#nextBtn").click(function(){
        index++;
        // Render HTML
        $(".title-wrapper").empty();
        $(".questionBody-wrapper").empty();
        // Case incompleted
        if (index < QUESTIONS) {
            fRenderQuestion();
            fAnimate();
        }
        // case completed
        else {
            $("#cardRoot").empty();
            let scoreMsg = 
                '<h1 id=scoreMsg class="text-center">' + user + ', סיימת את המבחן.' + '<br>' 
                + 'ענית נכון על ' + score.pass + " שאלות מתוך " + QUESTIONS + '</h1>';
            $("#cardRoot").html(scoreMsg);   
            $(".sidebar-col").css("padding-top", "0");
        }
        // Handle pagination state
        fPagiHandler();
    });
}

/* KEY PRESS - Event Listeners
-----------------------------*/
// COMPLETE question - Enter
function fOnKeyPressEnter(qId){
    $("#ans").keypress(function(event){
        if (shuffled[qId].type == "complete"){
            if (event.keyCode === 10 || event.keyCode === 13) {
                // Handle user input
                event.preventDefault();
                fFeedbackHandler(qId)
            }
        }
    });
}

/* MOUSE - Event listeners
--------------------------*/
// MULTI question - Select
function fOnSelectAns(qId) {
    $('input[type=radio]').change(function(){
        fFeedbackHandler(qId);
    });
}
// DRAG N DROP - Draggable/dropable handlers
function allowDrop (ev) {
    ev.preventDefault ();
 }
 function drag (ev) {
   ev.dataTransfer.setData ("src", ev.target.id);
 }
 function drop (ev) {
   ev.preventDefault ();
   let src = document.getElementById (ev.dataTransfer.getData ("src"));
   let srcParent = src.parentNode;
   let tgt = ev.currentTarget.firstElementChild;
 
   ev.currentTarget.replaceChild (src, tgt);
   srcParent.appendChild (tgt);
 }

/* GUI & STATE Handlers
----------------------*/
// FEEDBACK
function fFeedbackHandler() {
    let ans;
    let userAns;
    /* COMPLETE question
    --------------------------*/
    if (shuffled[index].type == "complete") {
        // Get user input
        userAns = $("#ans").val();
        ans = shuffled[index].ans;
    }
    
    /* MULTI question
    --------------------------*/
    else if (shuffled[index].type == "multi") {
        ans = "choice_";
        for (let i = 0; i < shuffled[index].choices.length; i++) {
            if (shuffled[index].choices[i].isCorrect) {
                ans += i;
                break;
            }
        }
        // Get user answer
        userAns = $('input[type=radio]:checked').attr("id");
    }

    /* DRAG N DROP question
    -------------------------------*/
    else if (shuffled[index].type == "dNd") {
        ans = true;
        userAns = true;

        for (let i = 0; i < imagesArr.length; i++) {
            let parent = $("#" + imagesArr[i].id).parent().attr("id");
            if (imagesArr[i].dest != parent) {
                userAns = false;
                break; 
            }
        }
    }  

    /* VALIDATE user answer
    --------------------*/
    // Correct
    if (userAns == ans) {
        // render positive feedback
        let success = 
            '<div class="alert alert-success">'
                + '<strong>כל כבוד!</strong> ענית נכון על השאלה.'
            + '</div>';
        $(".questionBody-wrapper").html(success);
        score.pass++;              
    }
    // Incorrect
    else {
        // render negative feedback
        let fail = 
            '<div class="alert alert-danger">'
                + '<strong>תשובה שגויה...</strong>  בהצלחה בפעם הבאה!'
            + '</div>';
        $(".questionBody-wrapper").html(fail);   
        score.fail++;             
    }
    score.notRun--;

    /* Handle question buttons
    --------------------------*/
    $("#nextBtn").removeClass("hide");
    $("#testBtn").addClass("hide");

    /* Handle progress bar
    --------------------------*/
    fProgressBar();
}
// PAGINATION
function fPagiHandler(){
    if (index < QUESTIONS) {
        $("#pagiWrapper li").removeClass("disabled");
        $("#pagiWrapper li").removeClass("active");
        $("#pagiWrapper li:nth-of-type(" + (index + 1) + ")").addClass("active");
        $("#currQuestion span").text((index + 1));
    }
    else {
        $("#pagiWrapper").empty();
        $(".sidebar-col").empty();
    }
}
// ANIMATION
function fAnimate() {
    $("#cardRoot").animate({
        opacity: '0.1'
    }, "slow");

    $("#cardRoot").animate({
        opacity: '1'
    }, "slow");
}
// PROGRESS BAR
function fProgressBar() {
    // Set score
    $("#NotRunRate span").text(score.notRun);
    $("#passRate span").text(score.pass);
    $("#failRate span").text(score.fail);

    // Set aria labels
    $("#NotRunRate").attr("aria-valuenow", score.notRun);
    $("#passRate").attr("aria-valuenow", score.pass);
    $("#failRate").attr("aria-valuenow", score.fail);

    // Set width
    let notRun = fCalcProgWidth("notRun");
    let pass = fCalcProgWidth("pass");
    let fail = fCalcProgWidth("fail");


    $("#NotRunRate").css("width", notRun);
    $("#passRate").css("width", pass);
    $("#failRate").css("width", fail);
}
function fCalcProgWidth(state) {
    let portion = score[state];
    switch (portion) {
        case 0:
            return "0";
        case 1:
            return "30%";
        case 2:
            return "60%";
        case 3: 
            return "100%";
    }
}
// Debug helper functions
function fDebug(){
    console.log("shuffled:"); //DEBUG
    console.log(shuffled); //DEBUG
    console.log("************************************"); //DEBUG
}

$(document).ready(function(){
    /* Init questions data
    ----------------------*/
    fSetQuestions(); // Generate
    shuffled = fShuffle(); //shuffle
    
    /* username phase
    ------------------*/
    fOnUserKeyUp();
    fOnUserClick();
    
    /*questions phase
    -----------------*/
    fDebug(0);
});