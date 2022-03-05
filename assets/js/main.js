// SET CURRENT PRODUCT ID FROM URL (default is 0)
let product_id = 0;
product_id = window.location.search.replace("?","");



$(document).ready(function(){

    // GET TRENDING ITEMS
   try{
        ajaxCall("products",printTrending);
    }catch(e){
        console.log("No products found.");
    }
    // GET SINGLE PRODUCT
    try{
        ajaxCall("products",printOneItem)
    }catch(e){
        console.log("No product found with that ID.");
    }

})



// AJAX CALL
const ajaxCall = (file,callback) =>{
    $.ajax({
        url: "assets/data/" + file + ".json",
        method: "get",
        dataType: "json",
        success: function(data){
            callback(data);
        },
        error: function(err){
            console.log(err);
        }
    });
}

// PRINT TRENDING ITEMS
const printTrending = (data) =>{
    let div = document.getElementById("trending");

    div.innerHTML = "";

    data.forEach(item => {
        if(item.topSale){
            div.innerHTML += `
                <a href="${item.href}">
                <div class="product">
                    <img src="${item.img.src}" alt="${item.img.alt}">
                    <h4>${item.brand}</h4>
                    <h5 class="product-name">${item.name}</h5>
                    <h5 class="product-type">${item.type}</h5>
                    <h6><i class="fa-solid fa-star-half-stroke"></i> ${item.reviews.number} |${item.reviews.amount} Reviews</h6>
                </div>
                </a>
            `;
        }
    })
}

// GET ONE ITEM
const printOneItem = (data) => {

    let div = document.getElementById("single-product")
    div.innerHTML = "";

    data.forEach(item => {
        if(item.id == product_id){
            div.innerHTML = `
                <div id="product-left">
                    <img src="${item.img.src}" alt="${item.img.alt}">
                    <div id="product-contact">
                            <p><i class="fa-solid fa-phone"></i> 0800 001 010</p>
                            <p><i class="fa-solid fa-envelope"></i> info@bikenation.com</p>
                            <p><i class="fa-solid fa-truck"></i> ${item.freeDelivery ? "Free Delivery" : "Paid Delivery"}</p>
                            <p><i class="fa-solid fa-dolly"></i> ${item.inStock ? "In Stock" : "Out of Stock"}</p>
                </div>
                </div>
                <div id="product-right">
                    <h4>${item.brand}</h4>
                    <h3>${item.name}</h3>
                    <h6>${item.type}</h6>
                    <h5 class="old-price">${item.price.oldPrice ? item.price.oldPrice+"$ " : ""}</h5>
                    <h5>${item.price.newPrice}$</h5>
                    <ul>
                        <li>Best Use: ${item.details.bestUse}</li>
                        <li>Frame Material: ${item.details.frameMaterial}</li>
                        <li>Wheel Size: ${item.details.wheelSize} inches</li>
                        <li>Tires: ${item.details.tires}</li>
                        <li>Weight: ${item.details.weight} kg</li>
                    </ul>
                    <button id="add-to-cart">Add To Cart</button>
                </div>
            `;
        }
    })
}


