// route.js
// Import the necessary modules for SQLite
import path from "path"
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Initialize a variable to hold the SQLite database connection
let db = null;

// Handler for GET requests to retrieve all todos
export async function GET(req, res) {
  // Open a new connection if there is none
  if (!db) {
    const dbPath = path.resolve(process.cwd(), "questions.db");

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }

  // Query to get all todos from the "todo" table
  const todos = await db.all("SELECT * FROM questions LIMIT 14");
  // Return the todos as a JSON response with a 200 status code
  return new Response(JSON.stringify(todos), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
}

export async function POST(req) {
  const data = await req.json();

  let sqlGetFromId = `SELECT *
  FROM questions
  WHERE id  = ?`;

  let sqlPostFromId = `UPDATE questions
    SET votes = ?
    WHERE id  = ?`;

  if (!db) {
    const dbPath = path.resolve(process.cwd(), "questions.db");

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }
  let question = await db.get(sqlGetFromId,[data.id],(err,row)=>{
    if(err){console.log(err)};
  })
  let votes = JSON.parse(question.votes);
  votes[data.voted] += 1;
  let votesString = JSON.stringify(votes);
  console.log(typeof(votesString));
  db.run(sqlPostFromId,[votesString,data.id],(err,row)=>{
    if(err){console.log(err)}
    console.log(row);
  })


  return new Response({}, {
    headers: { "content-type": "application/json" },
    status: 200,
  });
}