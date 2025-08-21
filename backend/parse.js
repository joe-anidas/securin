const mysql = require('mysql2/promise');
const fs = require('fs').promises;

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'securin'
};

const createTableSQL = `
  CREATE TABLE IF NOT EXISTS recipes (
    id INT(255) AUTO_INCREMENT PRIMARY KEY,
    cuisine VARCHAR(250) NOT NULL,
    title VARCHAR(250) NOT NULL,
    rating FLOAT,
    prep_time INT(255),
    cook_time INT(255),
    total_time INT(255),
    description TEXT,
    nutrients LONGTEXT,
    serves VARCHAR(500)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`;

async function main() {
  let connection;
  
  try {

    connection = await mysql.createConnection(dbConfig);
    await connection.execute(createTableSQL);

    const jsonData = await fs.readFile('./US_recipes_null.json', 'utf8');
    const recipes = JSON.parse(jsonData);
    
    let successCount = 0;
    let errorCount = 0;
  
    const recipeArray = Object.values(recipes);
    for (let i = 0; i < recipeArray.length; i++) {
      const recipe = recipeArray[i];
      
      try {

        const convertNaNToNull = (value) => {
          if (value === null || value === undefined || value === '') return null;
          if (typeof value === 'number' && isNaN(value)) return null;
          return value;
        };
        
        const recipeData = [
          recipe.cuisine || 'Unknown',
          recipe.title || 'Untitled Recipe',
          convertNaNToNull(recipe.rating),
          convertNaNToNull(recipe.prep_time),
          convertNaNToNull(recipe.cook_time),
          convertNaNToNull(recipe.total_time),
          recipe.description || '',
          JSON.stringify(recipe.nutrients) || '', 
          recipe.serves || ''
        ];
        

        const insertSQL = `
          INSERT INTO recipes (
            cuisine, title, rating, prep_time, cook_time, 
            total_time, description, nutrients, serves
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const result = await connection.execute(insertSQL, recipeData);
        successCount++;
       
        
      } catch (error) {
        console.error(`Error inserting recipe ${i + 1}:`, error.message);
        console.error(`Recipe data:`, recipe);
        errorCount++;
      }
    }

    console.log(`Successfully inserted: ${successCount} recipes`);
    console.log(`Errors: ${errorCount} recipes`);
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

main().catch(console.error);
