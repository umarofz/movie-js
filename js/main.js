let elMovieWrapper = document.querySelector(".movie__wrapper");
let elTemplate = document.querySelector("#movie__card").content;
let elForm = document.querySelector(".form");
let elInput = document.querySelector(".rating__input");
let elInputYear = document.querySelector(".year__input");
let elSelectCategories = document.querySelector(".select__categories");
let elSpan = document.querySelector(".result__span")

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
    
    let inputValue = Number(document.querySelector(".rating__input").value.trim())
    if (inputValue) {
        let numbersArray = []
        for (let i = 0; i < normolizedArray.length; i++) {
            if (inputValue <= normolizedArray[i].imdbRating) {
                numbersArray.push(normolizedArray[i])
            }
        }
        moviesRender(numbersArray , elMovieWrapper)
    } else {
        let inputValueYear = Number(document.querySelector(".year__input").value.trim())
        let yearsArray = []
        for (let i = 0; i < normolizedArray.length; i++) {
            if (inputValueYear == normolizedArray[i].movieYear) {
                yearsArray.push(normolizedArray[i])
            }
        }
        moviesRender(yearsArray , elMovieWrapper)
    }
    
    
})

elSelectCategories.addEventListener("input", function (evt) {
    let selectCategory = elSelectCategories.value;
    
    let filteredArray = normolizedArray.filter(function (item) {
        return item.categories.includes(selectCategory)
    })
    
    if (selectCategory != "all") {
        moviesRender(filteredArray, elMovieWrapper);
    } else {
        moviesRender(normolizedArray, elMovieWrapper);
    }
})


