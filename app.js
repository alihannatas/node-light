import express from "express";

const app = express();
const port = 3000;

//ejs template engine
app.set("view engine", "ejs");

//static files middleware
app.use(express.static('public'));

app.get("/", (req, res, next) => {
    res.render("index"); 
})

app.get("/about", (req, res, next) => {
    res.render("about");
})

app.listen(port, () => {
    console.log("Server is running")
})