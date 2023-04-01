const searchBtn = document.querySelector("button");
const headerHead = document.querySelector(".header-head");
const inputMovie = document.querySelector("#movie");
const movieContainer = document.querySelector(".container");
const searchIcon = document.querySelector(".search-icon");
const searchBar = document.querySelector(".search-bar");
let watchlistHtml;
let movieArr;
let movieDetailArr = [];
let myWatchlistArr = [];

function getWatchlistHtml(movie) {
  return ` <img
class="watchlist-icon"
src="images/watchlistIcon.png"
alt=""
data-watchList="${movie.imdbID}"
/>
<p>watchlist</p>`;
}

function getCheckedHtml() {
  return ` <img
  class="watchlist-icon"
  src="images/checked.png"
  alt=""
 
  />
  <p>watchlist</p>`;
}

function getRemoveHtml(movie) {
  return ` <img
  class="watchlist-icon"
  src="images/removeIcon.png"
  alt=""
  data-remove="${movie.imdbID}"
  />
  <p>watchlist</p>`;
}

///search icon
inputMovie.addEventListener("click", () => {
  searchIcon.classList.add("hidden");
});

function render(movie) {
  movieContainer.innerHTML += ` <div class="discription">
  <img
    class="discription-img"

    src=${movie.Poster}
    alt=""
  />
  <div class="discription-info">
    <div class="disc-heading-container">
      <h2 class="discription-heading"  data-title="${movie.imdbID}">${movie.Title}</h2>
      <img src="images/starIcon.png" alt="" srcset="" />
      <p>${movie.imdbRating}</p>
    </div>

    <div class="info">
      <p class="duration">${movie.Runtime} </p>
      <p class="genere">${movie.Genre}</p>

      <div class="watchlist" >
      ${watchlistHtml}
      </div>

    </div>

    <p class="discription-text">
     ${movie.Plot}
    </p>
  </div>
  </div>
  <hr />`;
}

///render movie
function renderMovie(movie) {
  watchlistHtml = getWatchlistHtml(movie);
  render(movie);
}

////get movie nested fetch
function getMovie() {
  movieDetailArr = [];
  for (let movie of movieArr) {
    fetch(`https://www.omdbapi.com/?t=${movie.Title}&apikey=93170c26`)
      .then((res) => res.json())
      .then((data) => {
        data.addToWatchlist = false;
        movieDetailArr.push(data);
        renderMovie(data);
      });
  }
}
//////get movies

searchBtn.addEventListener("click", getMovies);
function getMovies() {
  movieContainer.innerHTML = "";
  fetch(`https://www.omdbapi.com/?s=${inputMovie.value}&apikey=93170c26`)
    .then((res) => {
      if (!res.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || res.status;
        return Promise.reject(error);
      }
      return res.json();
    })
    .then((data) => {
      movieArr = data.Search;
      getMovie();
    })

    .catch((error) => {
      movieContainer.innerHTML = `<p class="errorMsg">Unable to find what you’re looking for. Please try another search.</p>`;
      console.error("There was an error!", error);
    });

  inputMovie.value = "";
}
function removeIconHtml() {
  for (let movie of myWatchlistArr) {
    watchlistHtml = getRemoveHtml(movie);
    render(movie);
  }
}
///my watchlist

const myWatchlist = document.querySelector(".my-watchlist");
myWatchlist.addEventListener("click", getMyWatchlist);
let watchlistWindow = false;

function getMyWatchlist() {
  if (!watchlistWindow) {
    movieContainer.innerHTML = "";
    headerHead.textContent = "My Watchlist";
    searchBar.classList.add("hidden");
    myWatchlist.textContent = "Search for movies";

    removeIconHtml();
    watchlistWindow = true;
  } else {
    headerHead.textContent = "Find your Film";
    searchBar.classList.remove("hidden");
    myWatchlist.textContent = "My Watchlist";

    movieContainer.innerHTML = "";
    watchlistWindow = false;
  }
  console.log(myWatchlistArr);
}

/////////watchlist
document.addEventListener("click", getTrgetClick);
function getTrgetClick(e) {
  if (e.target.dataset.watchlist) {
    getChecked(e.target.dataset.watchlist);
  }
  if (e.target.dataset.remove) {
    remove(e.target.dataset.remove);
  }
}

function getChecked(id) {
  movieContainer.innerHTML = "";

  for (let movie of movieDetailArr) {
    if (movie.imdbID === id) {
      if (movie.addToWatchlist === false) {
        watchlistHtml = getCheckedHtml();
        movie.addToWatchlist = true;
      }

      var doesExist = myWatchlistArr.some(function (ele) {
        return ele.imdbID === id;
      });

      if (doesExist) {
      } else {
        myWatchlistArr.unshift(movie);
      }
    } else {
      if (movie.addToWatchlist) {
        watchlistHtml = getCheckedHtml();
      } else {
        watchlistHtml = getWatchlistHtml(movie);
      }
    }

    render(movie);
  }
}

function remove(id) {
  movieContainer.innerHTML = "";

  myWatchlistArr = myWatchlistArr.filter((item) => {
    return id !== item.imdbID;
  });

  if (myWatchlistArr.length === 0) {
    movieContainer.innerHTML = "";
  } else {
    removeIconHtml();
  }
}
