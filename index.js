import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const db = new pg.Client({
  user:"postgres",
  password:"password",
  host: "localhost",
  database:"Permalist",
  port:5432
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {

  try{
  const result = await db.query("SELECT * FROM items");
  items = result.rows;

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items
  });
  }catch(err){
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try{
  await db.query("INSERT INTO items (title) VALUES ($1)",[item]);
  res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
    const updatedItemTitle = req.body.updatedItemTitle;
    const updatedItemId = req.body.updatedItemId;

    try{
      db.query("UPDATE items SET title=$1 WHERE id=$2", [updatedItemTitle,updatedItemId]);
      res.redirect("/");
    }catch(err){
      console.log(err);
    }

});

app.post("/delete", async (req, res) => {
  const deleteItemId = req.body.deleteItemId;

  try{
      db.query("DELETE FROM items WHERE id=$1",[deleteItemId]);
      res.redirect("/");
  }catch(err){
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
