$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

//Update Cart Total
function updateCart(){
    $.ajax({
        url: "/cart/stats",
        type: "get"
    }).done(function(cb){
        $(".simpleCart_total").text("$"+cb.total);
        $("#simpleCart_quantity").text(cb.count);
    });
}
//Get Filters from Product Listings Page
function getFilters(){
    var filters = {};
    if ($(".color-block-active").length > 0){
        filters.color = $(".color-block-active").data("id");
    }

    if ($("input[name='price_range']:checked").val() !== '0'){
        console.log("triggered");
        filters.price_range = $("input[name='price_range']:checked").val();
    }

    filters.sort_by = $("#sort-filter").val();
    filters.category = $("#category").val();
    filters.subcategory = $("#subcategory").val();
    filters.subcat2     = $("#subcat2").val();

    return filters;
}

function setNavBarActive(){
    var category = $("#category").val();
    if (typeof category !== undefined){
        if (category !== 0){
            $(".megamenu .active").removeClass("active");
            $(".navigation-link").each(function(){
                if ($(this).data('link-id') == category){
                    $(this).parent().addClass('active');
                }
            });
        } else {
            $(".nav-home").addClass('active');
        }
    } else {
        $(".nav-home").addClass('active');

    }
}

function pagination(current_page, total){


    if (total > 20){

        var html = "";
        var pages = Math.ceil(total / 20);
        var next_page = current_page + 1;

        if (current_page > 1){
            var prev_page = (current_page - 1);
        }

        if (current_page > 1){
            html += "<li class=\"page-item\"><a class=\"page-link product-page\" href=\"#\" data-page-num=\""+prev_page+"\">Previous Page</a></li>";
            html += "<li class=\"page-item\"><a class=\"page-link product-page\" href=\"#\" data-page-num=\""+(current_page - 1)+"\">"+(current_page - 1)+"</a></li>";
        }

        html += "<li class=\"page-item active\"><a class=\"page-link product-page\" href=\"#\" data-page-num=\""+current_page+"\">"+current_page+"</a></li>";


        if ( next_page <= pages){
            html += "<li class=\"page-item\"><a class=\"page-link product-page\" href=\"#\" data-page-num=\""+next_page+"\">"+next_page+"</a></li>";
        }

        if ( (current_page + 2) <= pages){
            html += "<li class=\"page-item\"><a class=\"page-link product-page\" href=\"#\" data-page-num=\""+(current_page + 2)+"\">"+(current_page + 2)+"</a></li>";
        }

        if (next_page <= pages){
            html += "<li class=\"page-item\"><a class=\"page-link product-page\" href=\"#\" data-page-num=\""+next_page+"\">Next Page</a></li>";
        }

        html += "<li class=\"page-item\"><a class=\"page-link\" id=\"view_all\" href=\"#\">View All</a></li>";

        $(".pagination").html(html);

    } else {
        $(".pagination").html("");
    }
}
function loadProducts(page=1, viewall=false, category=false, subcategory=false){

    if (category){
        $("#category").val(category);
    }

    if (subcategory){
        $("#subcategory").val(subcategory);
    }

    $("#product-listings").html("");
    var filters = getFilters();

    $.ajax({
        type: "post",
        url: "/product_table",
        data: {filters: filters, page: page, view_all: viewall}
    }).done(function(cb){

        var products = cb.products;
        var images   = cb.images;
        var product_count = Object.keys(products).length;
        if (!viewall){
            pagination(page, cb.products_count);
        } else {
            $(".pagination").hide();
        }
        $("#product-count").text(cb.products_count);
        if (product_count > 0){
            $.each(products, function(key, val){
                var url  = "";
                if (typeof images[val.id] !== 'undefined'){
                    var dC = 0;
                    $.each(images[val.id], function(key2, val2){

                        if (val2.default === 1){
                            url = val2.url;
                            dC++;
                        }
                    });

                    if (dC === 0){

                        $.each(images[val.id], function(key2, val2){
                            if(dC === 0){
                                url = val2.url;
                                dC++;
                            }

                        });
                    }

                } else {
                    var url = "img/No_Image_Available.jpg";
                }


                if (val.desc === "null" || val.desc === null){
                    var desc = "";
                } else {
                    var desc = val.desc;
                }
                var html = "<div class=\"product-block\">\n" +
                    "          <a href=\"/product/"+val.id+"\">" +
                    "<div style='height:200px;text-align:center;'>\n";

                if (val.new){
                    html += "<img class='new-overlay' src='img/Picture1.png' alt=''>";
                }

                var newest = encodeURIComponent(url);
                html += "<div class='product-photo' style='background-image: url("+url+")'></div>\n"+
                    // html += "<img class='full-height' src='"+url+"' alt=''>\n"+
                    "</div>\n" +
                    "           <div class=\"special-info grid_1 simpleCart_shelfItem\">\n" +
                    "              <h5 class=\"product-description\">"+val.name+"</h5>\n" +
                    "              <h5 class=\"product-description\">"+desc+"</h5>\n" +
                    "               <div class=\"item_add\"><span class=\"item_price\"><h6>$"+val.price+"</h6></span></div>\n" +
                    "            </div>\n" +
                    "        </div>";


                $("#product-listings").append(html);

            });
        }
        $("#product-listings").fadeIn('slow');
        setNavBarActive();

    });

}

$(".custom-dropdown-item").on("click", function(){
    var thisColor = $(this).find(".dropdown-color-block").css("background-color");
    console.log(thisColor);
});

$(".size-swatch").on("click",  function(){
    $(".size-swatch").removeClass('size-swatch-active');
    $(this).addClass('size-swatch-active');
});

$(".size-swatch-large").on("click",  function(){
    $(".size-swatch-large").removeClass('size-swatch-active');
    $(this).addClass('size-swatch-active');
});

$("#style-dropdown").on("change", function(){
    var img_url = $("#style-dropdown option:selected").data("image-url");
    $(".example-photo").html("<img src='"+img_url+"' alt='' class='img-responsive'>");

})

$(".custom-second-page-link").on("click", function(){

    var type = $(this).attr("id");

    switch(type){
        case "custom-tees-womens":
            var url = "/custom/womens_dropdown";
            var show = "size-swatches-non-infant";
            break;

        case "custom-tees-men":
            var url = "/custom/mens_dropdown";
            var show = "size-swatches-non-infant";
            break;

        case "custom-tees-youth":
            var url = "/custom/youth_dropdown";
            var show = "size-swatches-non-infant";
            break;

        case "custom-tees-toddler":
            var url = "/custom/toddler_dropdown";
            var show = "size-swatches-non-infant";
            break;

        case "custom-tees-infant":
            var url = "/custom/infant_dropdown";
            var show = "size-swatches-infant";
            break;

        default:
            var url = "/custom/womens_dropdown";
            var show = "size-swatches-non-infant";
            break;
    }

    $.ajax({
        url: url,
        type: "get"
    }).done(function(cb){
        var html = "";
        $.each(cb, function(key,val){
            if (key === 0){
                $(".example-photo").html("<img src='"+val.image+"' alt='' class='img-responsive'>");
            }
            html += "<option value='"+val.id+"' data-image-url='"+val.image+"'>"+val.name+"</option>";
        });

        $("#"+show).removeClass('hide').addClass('d-flex');
        $("#style-dropdown").html(html);
        $(".custom-header").text("Southern Lea Custom T-Shirt Order");
        $(".custom-tees-pane").hide().addClass("hide");
        $(".custom-tshirt-selection").fadeIn("slow").removeClass('hide');

    });




});
$("#custom-tees").on("click", function(){

    $(".first-pane").addClass('hide');
    $(".custom-tees-pane").fadeIn('slow').removeClass('hide');

});
$(document).on("click", ".navigation-link", function(e){
    e.preventDefault();
    $("#page-nav input[name='category']").val($(this).data("link-id"));
    $("#page-nav input[name='subcategory']").val("0");
    $("#page-nav input[name='subcat2']").val("0");
    $("#page-nav").submit();
});

$(document).on("click", ".navigation-link-2", function(e){
    e.preventDefault();
    $("#page-nav input[name='category']").val($(this).data("category-id"));
    $("#page-nav input[name='subcategory']").val($(this).data("link-id"));
    $("#page-nav input[name='subcat2']").val($(this).data('subcat-id'));
    $("#page-nav").submit();
});

$("#paypal_pay").on("click", function(e){
    e.preventDefault();

    var name = $("input[name='name']").val();
    var email = $("input[name='email']").val();
    var add1 = $("input[name='address1']").val();
    var add2 = $("input[name='address2']").val();
    var city = $("input[name='city']").val();
    var state = $("input[name='state']").val();
    var zip   = $("input[name='zipcode']").val();
    var phone = $("input[name='phone']").val();
    var shipping = $("#shipping-type").val();



    if ( (name.length > 1) && (email.length > 1) && (add1.length > 1) && (city.length > 1) && (state.length > 1) && (zip.length > 2) && (phone.length > 2)){

        if (add2.length === 0)
        {
            add2 = false;
        }

        $.ajax({
            url: "/orders",
            type: "post",
            data: {name: name, address_1: add1, address_2: add2, city: city, state: state, zip_code: zip, phone: phone, email: email, shipping: shipping}
        }).done(function(cb){
            $("#paypal_form").submit();
        });
    }
    else
    {
        $("#check-fields").modal('toggle');
        return false;
    }
});


//Empty Cart button handler
$(".simpleCart_empty").on("click", function(e){
    e.preventDefault();
    $.ajax({
        url: "/cart",
        type: "delete"
    }) .done(function(){
        $(".simpleCart_total").text("$0.00");
        $("#simpleCart_quantity").text("0");
        $(".price-details").remove();
        $(".cart-total").remove();
        $(".cart-items").replaceWith("            <div class=\"col-md-12 col-lg-12 col-sm-12\">\n" +
            "                <h3 class=\"text-center\">Shopping Cart Empty</h3>\n" +
            "            </div>");
    })
});

$("#shipping-type").on("change", function(){
    var option = $(this).val();
    switch (option){
        case "1":
            $("#cart-total").removeClass("hide");
            $("#total-shipping").removeClass("hide");
            $("#total-shipping-free").addClass('hide');
            $("#cart-total-free").addClass("hide");
            $("#paypal_form  #total_amount").val($("#cart-total").text().replace("$", ""));
            break;

        case "2":
            $("#cart-total").addClass("hide");
            $("#total-shipping").addClass("hide");
            $("#total-shipping-free").removeClass('hide');
            $("#cart-total-free").removeClass("hide");
            $("#paypal_form  #total_amount").val($("#cart-total-free").text().replace("$", ""));
            break;
    }
});



$("#size-modal").on("hidden.bs.modal", function(e){
    e.preventDefault();
    $("#special-id").val("");
    $("#product-added").addClass('hide');
    $("#product-size").removeClass('hide');
});

$(document).on("click", ".show-size-modal", function(e){
    e.preventDefault();
    var special_id = $(this).data('special-id');
    $("#special-id").val(special_id);
    $("#size-modal").modal('toggle');
});

$(document).on("click", ".show-confirm-modal", function(e){
    e.preventDefault();
    var special_id = $(this).data('special-id');
    $.ajax({
        url: "/cart/addspecial",
        type: "post",
        data: {id: special_id}
    }).done(function(cb){
        updateCart();
        $("#added-to-cart-modal").modal('toggle');
    });
});

$(document).on("click", '#add-to-cart-special', function(e){
    e.preventDefault();
    var special_id = $("#special-id").val();
    $.ajax({
        url: "/cart/addspecial",
        type: "post",
        data: {id: special_id, size: $("#select-a-size").val()}
    }).done(function(cb){
        updateCart();
        $("#product-size").addClass('hide');
        $("#product-added").removeClass('hide');
    });
});

$(document).on("click", '#special-proceed', function(e){
    e.preventDefault();
    var special_id = $("#special-id").val();
    $.ajax({
        url: "/cart/addspecial",
        type: "post",
        data: {id: special_id, size: $("#select-a-size").val()}
    }).done(function(cb){
        window.location.href="/cart";
    });
});

//Add To Cart button handler
$("#add_to_cart").on("click", function(){
    var product_size_id = $(this).data('product-size');
    var product_id      = $(this).data('product-id');
    var size_checked    = $("input[name='size-picker-radio']:checked").val();
    var qty             = $("#quantity").val();

    $.ajax({
        url: "/cart/add",
        type: "put",
        data: {product: product_id, size: size_checked, quantity: qty, size_id: product_size_id}
    }).done(function(cb){
        updateCart();
        $("#added-to-cart-modal").modal('toggle');
    });
});

$(document).on("click", "#confirm-delete-button", function(){
    var row_id = $(this).data('row-id');

    $.ajax({
        url: "/cart/delete",
        type: "post",
        data: {rowId: row_id}
    }).done(function(cb){
        window.location.reload();
    });
});
$(document).on("click", ".remove-cart-item", function(){
    var row_id = $(this).data('row-id');
    $("#confirm-delete-button").data('row-id', row_id);
    $("#confirm-delete").modal('toggle');

});

//Change Main Product Details Photo
$(document).on("click", ".preview-photo > img", function(){
    $(".main-photo > .profile-image").attr('src', $(this).attr("src"));
});

// Load Default Product Listings Table
if ($("#product-listings").length){
    loadProducts();
}

// Discount Filter
$(document).on("click", "input[name='price_range']", function(){
    loadProducts();
});

$(document).on("click", "#view_all", function(){
    loadProducts(1, true);
});

$(document).on("change", "#sort-filter", function(){
    loadProducts();
});

$('#list-tab a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
});

$(".size-picker-item").on("click", function(){
    $(this).find('input')[0].click();
});

$("#size-select").on("change", function(){
    var size_id = $(this).val();
    $.ajax({
        url: "/product/size/"+size_id,
        type: "get"
    }).done(function(cb){
        $("#product-code").text(cb.product_code);
        if (cb.quantity > 0){
            $("#stock").html("Availability: <span class='text-green'>In Stock</span>");
        } else {
            $("#stock").html("Availability: <span class='text-red'>Out Of Stock</span>");
        }
        $("#quantity-in-stock").text(cb.quantity);
        $("#your-price").text("$"+cb.price);
        $("#add_to_cart").data('product-size', cb.id);
    })
});

//Color Block Filter
$(document).on("click", ".color-block", function(){
    if ($(this).hasClass('color-block-active')){
        $(this).removeClass('color-block-active');
        $(this).css('box-shadow', 'none');
        loadProducts();
    } else {
        $(".color-block-active").css('box-shadow', 'none').removeClass('color-block-active');
        $(this).addClass('color-block-active');
        $(this).css('box-shadow', '0px 0px 3px 2px '+$(this).css('background-color'));
        loadProducts();
    }

});

//Pagination Link handling
$(document).on("click", ".product-page", function(e){
    e.preventDefault();
    loadProducts($(this).data("page-num"), false);
    $("html, body").animate({ scrollTop: 0 }, "slow");
});

