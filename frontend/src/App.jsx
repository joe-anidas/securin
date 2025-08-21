import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API='http://localhost:3001/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API}/recipes`);
        if (!response.ok) {
          throw new Error(`Failed to fetch recipes: ${response.status}`);
        }

        const json = await response.json();
        setRecipes(json.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderTime = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    const total = Number(minutes) || 0;
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">Recipe Dashboard</h1>
      </header>

      <div className="main-content">
        {loading && <p>Loading recipes...</p>}
        {error && <p className="error">Error: {error}</p>}

        {!loading && !error && (
          <table className="recipes-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Cuisine</th>
                <th>Rating</th>
                <th>Total Time</th>
                <th>Serves</th>
              </tr>
            </thead>
            <tbody>
              {recipes.length === 0 ? (
                <tr>
                  <td colSpan="5">No recipes found</td>
                </tr>
              ) : (
                recipes.map((recipe) => (
                  <tr key={recipe.id}>
                    <td>{recipe.title}</td>
                    <td>{recipe.cuisine || 'N/A'}</td>
                    <td>{recipe.rating || 'N/A'}</td>
                    <td>{renderTime(recipe.total_time)}</td>
                    <td>{recipe.serves || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
