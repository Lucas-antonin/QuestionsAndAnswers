const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const connection = require("./database/database")
const Question = require("./database/Question")
const Answer = require("./database/Answer")


connection.authenticate().then(()=>{
    console.log("Connected with database")
}).catch((err)=>{
    console.log(err)
})

//Ejs
app.set('view engine', 'ejs');
app.use(express.static('public'))

//Body Parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//Routes
app.get("/",(req,res)=>{
    Question.findAll({raw: true, order:[
        ["id", "DESC"]
        ]}).then((questions)=>{
        res.render("index", {questions: questions});
    })

});

app.get("/ask",(req,res)=>{
    res.render("ask")
})

app.post("/saveQuestion",(req,res)=>{
    var title = req.body.title;
    var description = req.body.description;
    Question.create({
        title: title,
        description: description
    }).then(()=>{
        res.redirect("/")
        console.log("Question saved successfully")
    })
})

app.get("/question/:id",(req,res)=>{
    var id = req.params.id;
    Question.findOne({
        where: {id: id}
    }).then((question)=>{


        if(question != undefined){
            Answer.findAll({
                where: {questionId: question.id},
                order:[["id", "DESC"]]
            }).then((answers)=>{
                res.render("question", {question: question, answers: answers})
            })
        }else{
            res.redirect("/")
        }

    })
})

app.post("/answer",(req,res)=>{
var answer = req.body.answer;
var questionId = req.body.questionId;

Answer.create({
    body: answer,
    questionId: questionId
}).then(()=>{
    res.redirect("/question/"+questionId)
})

})

app.listen('8080',()=>{
    console.log("Server have been opened");
});