fetch("https://kea-alt-del.dk/t5/api/categories")
    .then(function (response) {
        return response.json()
    }).then(function (data) {
        data.forEach(showCategory)
        getProducts();
    })


function getProducts() {
    fetch("https://kea-alt-del.dk/t5/api/productlist")
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            data.forEach(showDish)
        })
}



//create and append divs for cattegories in the main

function showCategory(category) {
    console.log(category);

    let listElem = document.createElement("li");
    listElem.classList.add(category);
    let anchorTag = document.createElement("a");
    anchorTag.innerHTML = category;
    anchorTag.setAttribute("href", `#${category}`);


    document.querySelector("ul").appendChild(listElem);
    document.querySelector(`.${category}`).appendChild(anchorTag);



    //---------------------------------------------------------------------------------------------------
    let sectionCategory = document.createElement("section"); // Create a section element
    sectionCategory.setAttribute("id", category); //add {category name} class to the section
    // or sectionCategory.setAttribute("id", category);
    let header1 = document.createElement("h1"); // Create a h1 element
    header1.innerHTML = category; //add {category name} class to the h1
    let dishesContainer = document.createElement("article"); // Create an article element (container of all the dishes which contains a grid)
    dishesContainer.classList.add("dishes_container");


    document.querySelector("main").appendChild(sectionCategory); // Append section to main
    document.querySelector(`section#${category}`).appendChild(header1); // Append h1 to section
    document.querySelector(`section#${category}`).appendChild(dishesContainer); // Append article container to section




    //create navigation link


}





//Select the MODAL-background container and add a class hide to it when the container is clicked
const modal = document.querySelector(".modal-background");
modal.addEventListener("click", () => {
    modal.classList.add("hide");
});


function showDish(dish) {
    console.log(dish);

    const template = document.querySelector("template").content;
    const myClone = template.cloneNode(true);

    //category variable to assign every section to the category section

    myClone.querySelector(".dish_image").style.backgroundImage = `url("imgs/small/${dish.image}-sm.jpg")`;
    myClone.querySelector(".dish_name").textContent = dish.name;

    if (dish.vegetarian == false) {
        myClone.querySelector(".vegetarian").style.display = "none";
    }

    myClone.querySelector(".short_description").textContent = dish.shortdescription;

    if (!dish.discount) {
        myClone.querySelector(".discount_symbol").remove();
        myClone.querySelector(".discount_text").remove();

        myClone.querySelector(".actual_price").textContent = `${dish.price} kr`;


    } else {
        myClone.querySelector(".dkk_symbol").remove();
        myClone.querySelector(".actual_price").remove();

        myClone.querySelector(".discount_text .previous_price").textContent = `Was ${dish.price} kr`;
        myClone.querySelector(".discount_text .actual_price").textContent = `${dish.price-(Math.round(dish.price*dish.discount/100))} kr`;
        //Math.ceil
        //Math.floor
    }


    //SOLD OUT

    if (dish.soldout) {
        myClone.querySelector(".dish").classList.add("soldOut");
    } else {
        //do nothing
    }


    //MODAL

    myClone.querySelector("button").addEventListener("click", () => {
        fetch(`https://kea-alt-del.dk/t5/api/product?id=${dish.id}`)
            .then(res => res.json())
            .then(showDetails);
    });



    //append each dish to the right category section
    document.querySelector(`#${dish.category} article.dishes_container`).appendChild(myClone);

}



//MODAL function to add content to it
function showDetails(data) {

    modal.querySelector(".modal-name").textContent = data.name;
    modal.querySelector(".modal-description").textContent = data.longdescription;


    if (!data.discount) {
        modal.querySelector(".modal-price").textContent = `${data.price} kr`;
    } else {
        modal.querySelector(".modal-price").textContent = `${data.price-(Math.round(data.price*data.discount/100))} kr`;
    }


    //ALLERGENS

    if (data.allergens != "") {
        modal.querySelector(".alergens").style.display = "block";
        modal.querySelector(".alergens_text").textContent = data.allergens;
    } else {
        modal.querySelector(".alergens").style.display = "none";
    }

    //ALCOHOL

    if (data.alcohol>0) {
        modal.querySelector(".modal-alcohol").style.display = "block";
        modal.querySelector(".modal-alcohol").textContent = `*This product contains alcohol`;
    } else {
        modal.querySelector(".modal-alcohol").style.display = "none";
    }

    modal.classList.remove("hide");
}
