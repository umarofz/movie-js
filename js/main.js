let elMovieWrapper = document.querySelector(".movie__wrapper");
let elTemplate = document.querySelector("#movie__card").content;
let elBookmarkTemplate = document.querySelector("#bookmark__template").content;
let elForm = document.querySelector(".form");
let elInput = document.querySelector(".rating__input");
let elInputYear = document.querySelector(".year__input");
let elSelectCategories = document.querySelector(".select__categories");
let elModalTitle = document.querySelector(".modal__title");
let elModalBody = document.querySelector(".modal__body");
let elSpan = document.querySelector(".result__span")
let elInputSorting = document.querySelector(".form__sorting")
let elBookmarkWrapper = document.querySelector(".bookmark__wrapper")

let moviesArray = movies.slice(0, 30);
let localMovies = JSON.parse(localStorage.getItem("bookmarkedMovies"))
let bookmarkedMovies = localMovies ? localMovies: [];
renderBookmarks(bookmarkedMovies)

let normolizedArray = moviesArray.map(item => {
    return {
        id: item.imdb_id,
        title: item.Title.toString(),
        summary: item.summary,
        videoUrl: `https://www.youtube.com/watch?v=${item.ytid}`,
        categories: item.Categories.split("|"),
        movieYear: item.movie_year,
        imdbRating: item.imdb_rating,
        img: `https://i.ytimg.com/vi/${item.ytid}/mqdefault.jpg`
    }
});

function getCategories(array) {
    let categoriesArray = [];
    
    for (const item of array) {
        for (const itemCategory of item.categories) {
            if (!categoriesArray.includes(itemCategory)) {
                categoriesArray.push(itemCategory)
            }
        }
    }
    
    return categoriesArray
}

let movieCategories = getCategories(normolizedArray)


// let newArray = normolize(moviesArray);

function renderCategories(array, wrapper) {
    let tempFragment = document.createDocumentFragment();
    
    for (const item of array) {
        let newOption = document.createElement("option");
        newOption.textContent = item;
        newOption.value = item;
        
        tempFragment.appendChild(newOption);
    }
    
    wrapper.appendChild(tempFragment)
}
renderCategories(movieCategories.sort(), elSelectCategories)



function moviesRender(array, wrapper) {
    wrapper.innerHTML = null;
    elSpan.textContent = array.length;
    let tempFragment = document.createDocumentFragment()
    
    for (const item of array) {
        let templateItem = elTemplate.cloneNode(true)
        templateItem.querySelector(".movie__img").src = item.img
        templateItem.querySelector(".movie__title").textContent = item.title
        templateItem.querySelector(".movie__year").textContent = item.movieYear
        templateItem.querySelector(".movie__rating").textContent = item.imdbRating
        templateItem.querySelector(".movie__categories").textContent = item.categories
        templateItem.querySelector(".movie__url").href = item.videoUrl
        templateItem.querySelector(".movie__info").dataset.movieId = item.id
        templateItem.querySelector(".movie__bookmark").dataset.bookmarkId = item.id
        
        tempFragment.appendChild(templateItem)
    }
    wrapper.appendChild(tempFragment)
    
    
}
moviesRender(normolizedArray, elMovieWrapper);

elForm.addEventListener("submit" , function (evt) {
    evt.preventDefault()
    
    let inputYear = elInputYear.value.trim();
    let inputRating = elInput.value.trim();
    let inputSorting = elInputSorting.value.trim();
    let inputCategory = elSelectCategories.value.trim();
    
    let filteredArray = normolizedArray.filter(function (item) {
        let isTrue = inputCategory == "all" ? true: item.categories.includes(inputCategory);
        let validation = item.movieYear >= inputYear && item.imdbRating >= inputRating && isTrue
        return validation
    })
    
    if (inputSorting == "rating_high_low") {
        filteredArray.sort((a, b) => {
            return b.imdbRating - a.imdbRating
        })
    };
    if (inputSorting == "rating_low_high") {
        filteredArray.sort((a, b) => {
            return a.imdbRating - b.imdbRating
        })
    };
    if (inputSorting == "year_high_low") {
        filteredArray.sort((a, b) => {
            return b.movieYear - a.movieYear
        })
    };
    if (inputSorting == "year_low_high") {
        filteredArray.sort((a, b) => {
            return a.movieYear - b.movieYear
        })
    };
    if (inputSorting == "a-z") {
        filteredArray.sort((a, b) => {
            return a === b ? 0 : (a.title < b.title) ? -1 : 1;
        })
    };
    if (inputSorting == "z-a") {
        filteredArray.sort((a, b) => {
            return a === b ? 0 : (a.title < b.title) ? 1 : -1;
        })
    };
    moviesRender(filteredArray, elMovieWrapper);
})


elMovieWrapper.addEventListener("click", function (evt) {
    let currentId = evt.target.dataset.movieId;
    let currentBookmarkId = evt.target.dataset.bookmarkId;
    
    if (currentId) {
        let foundInfo = normolizedArray.find(function(item) {
            return item.id == currentId
        })
        
        elModalTitle.textContent = foundInfo.title
        elModalBody.textContent = foundInfo.summary
    }
    
    if (currentBookmarkId) {
        let foundMovie = normolizedArray.find(function(item) {
            return item.id == currentBookmarkId
        })
        
        if (bookmarkedMovies.length == 0) {
            bookmarkedMovies.unshift(foundMovie)
            localStorage.setItem("bookmarkedMovies", JSON.stringify(bookmarkedMovies))
        } else {
            let isMovieInArray = bookmarkedMovies.find(function(item) {
                return item.title == foundMovie.title
            })
            
            if (!isMovieInArray) {
                bookmarkedMovies.unshift(foundMovie)
                localStorage.setItem("bookmarkedMovies", JSON.stringify(bookmarkedMovies))
            }
        }
        renderBookmarks(bookmarkedMovies)
    }
})


function renderBookmarks(arrayOfMovies) {
    elBookmarkWrapper.innerHTML = null;
    
    let fragment = document.createDocumentFragment();
    
    for (const item of arrayOfMovies) {
        let bookmarkItem = elBookmarkTemplate.cloneNode(true)
        
        bookmarkItem.querySelector(".bookmark__title").textContent = item.title;
        bookmarkItem.querySelector(".bookmark__remove-btn").dataset.bookmarkId = item.id;

        fragment.appendChild(bookmarkItem)
    }

    elBookmarkWrapper.appendChild(fragment)
}

elBookmarkWrapper.addEventListener("click", function(evt) {
    let bookmarkedMovieId = evt.target.dataset.bookmarkId;

    if (bookmarkedMovieId) {
        let foundBookmarkedMovie = bookmarkedMovies.findIndex(function(item) {
            return item.id == bookmarkedMovieId
        })

        bookmarkedMovies.splice(foundBookmarkedMovie, 1);
        localStorage.setItem("bookmarkedMovies", JSON.stringify(bookmarkedMovies))
    }
    renderBookmarks(bookmarkedMovies);
})
