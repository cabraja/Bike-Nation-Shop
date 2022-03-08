// SET CURRENT PRODUCT ID FROM URL (default is 0)
let product_id = 0;
product_id = window.location.search.replace("?","");
// DEFAULT VALUE FOR CART
localStorage.setItem("cartOpen",false);



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
     // GET WHOLE SHOP
     try {
        ajaxCall("products",printShop)
     } catch (e) {
         console.log("No items in the store.");
     }
     // GET CART ITEMS
     try {
        ajaxCall("products",printCart)
     } catch (e) {
         console.log("No items in the store.");
     }

     // SORTING FUNCTIONS
    $("#sort").on("change",function(){
        try {
            ajaxCall("products",printShop)
        } catch (e) {
            console.log("Problem with filtering.");
        }
    })

$("#price").on("change",function(){

    $(this).next().html($(this).val()+"$");

    try {
        ajaxCall("products",printShop)
    } catch (e) {
        console.log("Problem with filtering.");
    }
})

$(".brand").on("change",function(){
    try {
        ajaxCall("products",printShop)
    } catch (e) {
        console.log("Problem with filtering.");
    }
})

$(".type").on("change",function(){
    try {
        ajaxCall("products",printShop)
    } catch (e) {
        console.log("Problem with filtering.");
    }
})

$(".delivery").on("change",function(){
    try {
        ajaxCall("products",printShop)
    } catch (e) {
        console.log("Problem with filtering.");
    }
})

$("#clear-filters").on("click",function(){
    clearFilters();
    try {
        ajaxCall("products",printShop)
    } catch (e) {
        console.log("Problem with filtering.");
    }
})

    $(document).on("click","#add-to-cart",function(){
        addToCart($(this).data("id"));

        $("#modal").css({"margin-top":"6vh"});
        setTimeout(function(){
            $("#modal").css({"margin-top":"-200px"})
        },2000)

        try {
            ajaxCall("products",printCart)
        } catch (e) {
            console.log("Problem with loading cart.");
        }
    })

    $(document).on("click","#open-cart",function(){

        let cartOpen = localStorage.getItem("cartOpen");

        if(cartOpen === "false"){
            $("#cart-wrapper").css("transform","translateX(0%)");
            localStorage.setItem("cartOpen","true");
        }
        else{
            $("#cart-wrapper").css("transform","translateX(100%)");
            localStorage.setItem("cartOpen","false");
        }

    })
    $(document).on("click","#empty-cart",function(){
        localStorage.removeItem("bikeId");
        try {
            ajaxCall("products",printCart)
        } catch (e) {
            console.log("Problem with loading cart.");
        }
    })

    $(document).on("click","#burger",function(){
        $("#nav-alt").css("transform","translateX(0%)")
    })

    $(document).on("click","#close-nav",function(){
        $("#nav-alt").css("transform","translateX(100%)")
    })

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
                    <div class="available-colors">
                    <h5>Available Colors:</h5>
                        <div class="colors">
                        ${printColors(item.colors)}
                        </div>
                    </div>
                    <ul>
                        <li>Best Use: ${item.details.bestUse}</li>
                        <li>Frame Material: ${item.details.frameMaterial}</li>
                        <li>Wheel Size: ${item.details.wheelSize} inches</li>
                        <li>Tires: ${item.details.tires}</li>
                        <li>Weight: ${item.details.weight} kg</li>
                    </ul>
                    <button id="add-to-cart" data-id="${item.id}">Add To Cart</button>
                </div>
            `;
        }
    })
}

const printColors = (colors) => {
    let text = "";
    colors.forEach(color => {
        text += `
            <div class="color" style="background-color:#${color}"></div>
        `;
    })

    return text;
}


// PRINT WHOLE SHOP
const printShop = (data) => {
    let div = document.getElementById("shop-right");

    data = sortFilter(data);
    data = priceFilter(data);
    data = brandFilter(data);
    data = typeFilter(data);
    data = deliveryFilter(data);

    div.innerHTML = "";

    data.forEach(item => {
            div.innerHTML += `
                <a href="${item.href}">
                <div class="product">
                    <div class="product-image" style="background-image:url('${item.img.src}')"></div>
                    <h4>${item.brand}</h4>
                    <h5 class="product-name">${item.name}</h5>
                    <h6 class="shop-price ">${item.price.newPrice}$</h6>
                    <h5 class="product-type">${item.type}</h5>
                    <h6><i class="fa-solid fa-star-half-stroke"></i> ${item.reviews.number} |${item.reviews.amount} Reviews</h6>
                </div>
                </a>
            `;
        }
    )
}


// FILTERS FOR SHOP ======================================================================

const sortFilter = (data) =>{
    let sortValue = document.getElementById("sort").value;

    if(sortValue === "a-z"){
        data.sort((a,b) => a.name > b.name ? 1 : -1);
    }
    if(sortValue === "z-a"){
        data.sort((a,b) => a.name < b.name ? 1 : -1);
    }
    if(sortValue === "priceDesc"){
        data.sort((a,b) => a.price.newPrice < b.price.newPrice ? 1 : -1);
    }
    if(sortValue === "priceAsc"){
        data.sort((a,b) => a.price.newPrice > b.price.newPrice ? 1 : -1);
    }

    return data;
}

const priceFilter = (data) => {
    let priceValue = document.getElementById("price").value;
    let newData = data.filter(item => item.price.newPrice < priceValue);

    return newData;
}

const brandFilter = (data) => {
    let chosenbrands = [];
    $(".brand:checked").each(function(){
        chosenbrands.push($(this).val());
        
    })

    if(chosenbrands.length > 0){
        return data.filter(item => chosenbrands.includes(item.brand));
    }

    return data;
}

const typeFilter = (data) => {
    let chosenTypes = [];
    $(".type:checked").each(function(){
        chosenTypes.push($(this).val());
        
    })

    if(chosenTypes.length > 0){
        return data.filter(item => chosenTypes.includes(item.type));
    }

    return data;
}

const deliveryFilter = (data) => {
    
    if(document .getElementById("freeDelivery").checked){
        return data.filter(item => item.freeDelivery === true)
    }
    if(document .getElementById("paidDelivery").checked){
        return data.filter(item => item.freeDelivery === false)
    }

    return data;
}

const clearFilters = () => {
    $("#price").val(4000);

    $(".brand").each(function(){
        $(this).prop("checked",false);
    })

    $(".type").each(function(){
        $(this).prop("checked",false);
    })

    $(".delivery").each(function(){
        $(this).prop("checked",false);
    })
}


// CART FUNCTIONS =========================================================================


const addToCart = (data) => {
    if(localStorage.getItem("bikeId") !== null){
        let current = localStorage.getItem("bikeId");
        current += ","+data;
        localStorage.setItem("bikeId",current);
    }
    else{
        localStorage.setItem("bikeId",data);
    }
}

const printCart = (data) => {

    let bikeIds = localStorage.getItem("bikeId");
    let cartDiv = document.getElementById("cart");
    cartDiv.innerHTML = "";

    // FUNCTION TO COUNT THE DUPLICATES (QUANTITY)
    const countDuplicates = (id) => {
        let count = 0;
        bikeIds.forEach(item => {
            if(item == id){
                count++;
            }
        })

        return count;
    }


    if(bikeIds !== null){
       bikeIds = bikeIds.split(",");

        data.forEach(item => {
            if(bikeIds.includes(String(item.id))){
            cartDiv.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-left" style="background-image:url('${item.img.src}')"></div>
                    <div class="cart-item-right">
                        <h5>${item.brand}</h5>
                        <h4>${item.name}</h4>
                        <h6>${item.price.newPrice*countDuplicates(item.id)} $</h6>
                        <p>Quantity: ${countDuplicates(item.id)}</p>
                    </div>
                </div>
            `;
       }
    })
    }else{
        cartDiv.innerHTML = "<span>Nothing in cart yet...<span>";
    }

}
