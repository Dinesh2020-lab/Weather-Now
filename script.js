const apiKey = ' https://api.themoviedb.org/3 '; // Replace with your own OMDb API key

function searchMovie() {
  const query = document.getElementById('searchInput').value;
  const movieList = document.getElementById('movieList');
  movieList.innerHTML = ''; // Clear previous results

  if (!query) {
    alert('Please enter a movie name.');
    return;
  }

  fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") {
        data.Search.forEach(movie => {
          const movieDiv = document.createElement('div');
          movieDiv.classList.add('movie');
          movieDiv.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/100x150'}" alt="${movie.Title}">
            <div>
              <h2>${movie.Title}</h2>
              <p>Year: ${movie.Year}</p>
              <p>Type: ${movie.Type}</p>
            </div>
          `;
          movieList.appendChild(movieDiv);
        });
      } else {
        movieList.innerHTML = `<p>No results found.</p>`;
      }
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      movieList.innerHTML = `<p>Error fetching movie data. Try again later.</p>`;
    });
}

