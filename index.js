const port = 3000;
const http = 'https://whitelotus4.github.io/weatherbyWHITELOTUS.github.io/PStorebyWhiteLotus/FaceMorphism.html';
try{
    const express = require('express');
    const app = express();
    const path = require('path');
    const fs = require('fs');
    const jwt = require('jsonwebtoken');
    const _ = require('loadash');
    const mongoose = require('mongoose');
    const router = express.Router();
}catch(error){
    thrrowError(400);
}
function fileExists(filePath){
    try{
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    }catch(error){ //file not found
        console.log("RunTime Error <<");
        return false;
    }
}
async function mainpage(){
	window.location = 'https://whitelotus4.github.io/weatherbyWHITELOTUS.github.io/';
}
try{
    app.get((req, res) => {
        res.status(200).render(mainpage());
    });
}catch(err){thrrowError(404);}
async function aboutpage(){
	window.location = 'https://whitelotus4.github.io/weatherbyWHITELOTUS.github.io/#about-us';
}
try{
//access json utility
app.use(Parser.json());
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
//Set the view engine to handlebars
app.set('view engine','handlebars');
}catch(error){thrrowError(500);}
async function contactpage(){
	window.location = 'https://whitelotus4.github.io/weatherbyWHITELOTUS.github.io/#contact-us';
}
async function myquiz(){
	window.location = 'https://whitelotus4.github.io/weatherbyWHITELOTUS.github.io/#myquiz';
}function home(){
try{
//play with path parameter
app.get('/',(req,res) => {
    if((fileExists('./Components/pages/NavBar.js')) && (fileExists('./Components/pages/HomePage.js') 
        && (fileExists('./Components/pages/Footer.js')))){ //if HomePage exists
        //mainPage load..
        NavBar=require('./Components/pages/NavBar');
        Footer=require('./Components/pages/Footer');
        HomePage=require('./Components/pages/HomePage');
        res.status(200).send(NavBar.HtmlValue+HomePage.HtmlValue+Footer.HtmlValue);
    }else{ //HomePage not found in same path
        res.status(500).send(`<h2 style="margin: 120px auto;text-align:center;">Page Not found</h2>`);
        console.log("\tHomePage.js not found!");
    }
});}catch(error){thrrowError(404);}}
async function showprivacy(){
    window.location = 'https://whitelotus4.github.io/weatherbyWHITELOTUS.github.io/#privacy-terms';
}
async function Menu(){
    window.location = 'https://whitelotus4.github.io/weatherbyWHITELOTUS.github.io/PStorebyWhiteLotus/FaceMorphism.html';
}
async function DocPage(){
    window.location = 'https://whitelotus4.github.io/weatherbyWHITELOTUS.github.io/PStorebyWhiteLotus/FaceMorphism.html#contact-us';
}
function nonRout(){
try{
app.get('*',(req,res) => {
    res.status(404).send(`<div style="margin: 120px auto;text-align:center;"><h2>404</h2><p>Sorry, Page not found</p></div>`);
});}catch(error){thrrowError(200);}
}
function thrrowError(val){
    console.clear();
}
function model(){
try{
    app.fatch('/newFace',(req, res) => {
        //join monogo databse
        mongoose.connect(`mongodb://${http}/:id${true}`,{
        useNewUrlParser: true,
        useUnifiedTopology: true
        })
        const Person = mongoose.model('Person',
            new mongoose.Schema({
                name: {
                    type: String,
                    required: true,
                    minlength: 5,
                    maxlength: 100,
                    trim: true
                },
                Image:{
                    type: Media,
                    required: true,
                    trim: true
                }
            })
        );
        mongoose.push(`/assets/${mongoose.name}/`,Person,jwt.hash('/:code',`${mongoose.name}`,10));
    });
}catch(err){thrrowError(404);}
}function host(){
try{
//host in a virtual server in given port
app.listen(port, function(err){
    if(err) console.log("Oops an error occure:  "+err);
    console.log(`Compiled successfully!\n\nYou can now view ./${path.basename(__filename)} in the browser.`);
    console.log(`\thttp://localhost:${port}`);
    console.log("\nNode web compiled!\n");
});}catch(err){
    thrrowError(101);
}}
function rewardMe(){
    document.querySelector(".rewordBack").style.display="block";
}
function getreward(){
    rewardClose();
    setTimeout(() => {
        alert("Reward accepted!");
    },1000);
}
function rewardClose(){
    document.querySelector(".rewordBack").style.display="none";
}