const sqlite3 = require("sqlite3").verbose();

const questions = [
  {
    question__es: 'Le ganarias a un leon en un combate',
    question__en: 'Would you win against a lion in a fight',
    choices__es:['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/lion.jpg',
    votes: [0,0,0,0,0],
  },
  {
    question__es: 'Te comerías un kilo de comida',
    question__en: 'Would you be able to eat 1KG of food',
    choices__es:['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/food.jpg',
    votes: [0,0,0,0,0],
  },
  {
    question__es: 'Podrías en una situación de vida o muerte ser capaz de aterrizar un avión',
    question__en: 'Would you in a life or death situation be able to land an airplane',
    choices__es:['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/plane.jpg',
    votes: [0,0,0,0,0],
  },
  {
    question__es: 'Le ganarias a un kanguro con guantes de boxeo en un combate',
    question__en: 'Would you win against a kangaroo with boxing gloves in a fight',
    choices__es:['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/kangaroo.jpg',
    votes: [0,0,0,0,0],
  },
  {
    question__es: 'Podrías sobrevivir 30 días en una isla desierta con provisiones para 15 días',
    question__en: 'Would you win against a kangaroo in a fight',
    choices__es:['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/island.jpg',
    votes: [0,0,0,0,0],
  },
  {
    question__es: 'Ganarías contra 6 niños de siete años en un combate',
    question__en: 'Would you win against 6 seven-year-old children in a fight',
    choices__es:['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/kids.jpg',
    votes: [0,0,0,0,0],
  },
  {
    question__es: 'Te beberías tu propio orin por 10.000 euros',
    question__en: 'Would you drink your own urine for 10,000$',
    choices__es:['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/orine.jpg',
    votes: [0,0,0,0,0],
  },
  {
    question__es: 'Serías capaz de ganar a un oso con un palo como única arma',
    question__en: 'Would you be able to defeat a bear with just a stick as your only weapon',
    choices__es:['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/bear.jpg',
    votes: [0,0,0,0,0],
  },
  {
    question__es: 'Serías capaz de tener sexo con una persona que te de asco si a cambio después puedes practicarlo con tu crush',
    question__en: 'Would you be willing to have sex with someone you find repulsive if, in return, you could later engage in it with your crush',
    choices__es:['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/crush.jpg',
    votes: [0,0,0,0,0],
  },
  {
    question__es: 'Te intercambiarias tu cuerpo con el de un gato durante 48 horas',
    question__en: 'Would you exchange your body with that of a cat for 48 hours',
    choices__es:['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/cat.jpg',
    votes: [0,0,0,0,0],
  },
  {
    question__es: 'Harías un viaje al espacio si tuvieras la oportunidad',
    question__en: 'Would you take a trip to space if you had the chance',
    choices__es:['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/espacio.jpg',
    votes: [0,0,0,0,0],
  },
  {
    question__es: '¿Atravesarías un puente colgante a gran altura sin barandillas',
    question__en: 'Would you cross a high suspension bridge without guardrails',
    choices__es: ['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/puente.jpg',
    votes: [0, 0, 0, 0, 0],
  },
  {
    question__es: 'Caminarías descalzo sobre brasas ardientes pora salvar a dos niños que jamás conocerás',
    question__en: 'Would you walk barefoot on hot coals to save two children you will never know',
    choices__es: ['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/brasas.jpg',
    votes: [0, 0, 0, 0, 0],
  },
  {
    question__es: 'Serías capaz de ganar a 15 patos con droga canbial solo con tus puños',
    question__en: 'Would you be able to defeat 6 ducks on canibal drug with just your hands',
    choices__es: ['Sin duda', 'Sí', 'No estoy seguro', 'No', 'En mi vida'],
    choices__en: ['Eyes closed', 'Yes', 'Not Sure', 'No', 'In my life'],
    src: '/questions/patos.jpg',
    votes: [0, 0, 0, 0, 0],
  },
  // Add 10 more examples as needed
];

const db = new sqlite3.Database(
  "./questions.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQLite database.");

    db.serialize(() => {
      // Create the questions table if it doesn't exist
      db.run(
        `CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY,
          question__es TEXT,
          question__en TEXT,
          choices__es TEXT,
          choices__en TEXT,
          img TEXT,
          votes TEXT
        )`,
        (err) => {
          if (err) {
            return console.error(err.message);
          }
          console.log("Created questions table.");

          // Clear existing data in the questions table
          db.run(`DELETE FROM questions`, (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("All rows deleted from questions.");

            // Insert new data into the questions table
            const insertSql = `INSERT INTO questions(question__es,question__en,choices__es,choices__en, img, votes) VALUES(?, ?, ?, ?, ?, ?)`;

            questions.forEach((q) => {
              const values = [q.question__es, q.question__en, q.question__es, q.question__en, q.src, JSON.stringify(q.votes)];
              db.run(insertSql, values, function (err) {
                if (err) {
                  return console.error(err.message);
                }
                const id = this.lastID;
                console.log(`Row inserted, ID ${id}`);
              });
            });

            // Close the database connection after all insertions are done
            db.close((err) => {
              if (err) {
                return console.error(err.message);
              }
              console.log("Closed the database connection.");
            });
          });
        }
      );
    });
  }
);
