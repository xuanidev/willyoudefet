// route.js
// Import the necessary modules for SQLite
import path from "path"
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Initialize a variable to hold the SQLite database connection
let db = null;

export async function POST(req) {
  const data = await req.json();
  console.log(data);

  if (!db) {
    const dbPath = path.resolve(process.cwd(), "questions.db");

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }
  // Assuming 'data.votes' is a JSON object
  console.log(data.votes);
  if (data.votes && typeof data.votes === "object" && data.votes.length > 0){
    // Extract values from the JSON object and convert them into an array
    data.votes = Object.values(data.votes);
    console.log("Converted votes to array:", data.votes[0]);

    let sqlGetNotInIds = `SELECT *
                     FROM questions
                     WHERE id NOT IN (${data.votes.map(() => '?').join(', ')})`;
                    
    const todos = await db.all(sqlGetNotInIds, data.votes, (err, rows) => {
      if (err) {
        console.log(err);
        console.error(err.message);
        return;
      }
    });
    if(todos.length !== 0){
      const responseObj = {
        todos,
        allVisited:false,
      };
      return new Response(JSON.stringify(responseObj) , {
        headers: { "content-type": "application/json" },
        status: 200,
      });
    }
  }
    const todos = await db.all("SELECT * FROM questions LIMIT 14");
    const responseObj = {
      todos,
      allVisited: true,
    };
    return new Response(JSON.stringify(responseObj), {
      headers: { "content-type": "application/json" },
      status: 200,
    });

}