let elMovieWrapper = document.querySelector(".movie__wrapper");
let elTemplate = document.querySelector("#movie__card").content;
let elForm = document.querySelector(".form");
let elInput = document.querySelector(".rating__input");
let elInputYear = document.querySelector(".year__input");
let elSelectCategories = document.querySelector(".select__categories");
let elSpan = document.querySelector(".result__span")
let elInputSorting = document.querySelector(".form__sorting")

let moviesArray = movies.slice(0, 20);

let normolizedArray = moviesArray.map(item => {
    return {
        title: item.Title.toString(),
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


