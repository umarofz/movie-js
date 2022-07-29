let elForm = document.querySelector(".form");
let elInput = document.querySelector(".rating__input");

let moviesArray = movies.slice(0, 6);

function normolize(array) {
    let newArray = [];
    
    array.forEach(item => {
        let newObject = {};
        
        newObject.title = item.Title.toString();
        newObject.videoUrl = `https://www.youtube.com/watch?v=${item.ytid}`;
        newObject.categories = item.Categories.split("|");
        newObject.movieYear = item.movie_year;
        newObject.imdbRating = item.imdb_rating;
        newObject.img = `https://i.ytimg.com/vi/${item.ytid}/mqdefault.jpg`;
        
        newArray.push(newObject);
    });
    
    return newArray
}


let elMovieWrapper = document.querySelector(".movie__wrapper");
let elTemplate = document.querySelector("#movie__card").content;

let newArray = normolize(moviesArray);

function moviesRender(array, wrapper) {
    wrapper.innerHTML = null;
    let tempFragment = document.createDocumentFragment()
    
    for (const item of array) {
        let templateItem = elTemplate.cloneNode(true)
        templateItem.querySelector(".movie__img").src = item.img
        templateItem.querySelector(".movie__title").textContent = item.title
        templateItem.querySelector(".movie__year").textContent = item.movieYear
        templateItem.querySelector(".movie__rating").textContent = item.imdbRating
        templateItem.querySelector(".movie__url").href = item.videoUrl
        
        tempFragment.appendChild(templateItem)
    }
    wrapper.appendChild(tempFragment)

    
}
moviesRender(newArray, elMovieWrapper)

elForm.addEventListener("submit", function (evt) {
    evt.preventDefault()

    inputValue = elInput.value.trim()
    
    elMovieWrapper.innerHTML = null
   for (const item of newArray) {
    if (inputValue >= 6.5) {
        elMovieWrapper = item.imdbRating >= 6.5
    }
   }
})


