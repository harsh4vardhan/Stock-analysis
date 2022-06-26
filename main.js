
var response_stock;
var countries;
function uploadfile() {

    var files = document.getElementById("file").files;

    if (files.length > 0) {

        var formData = new FormData();
        formData.append("file", files[0]);

        var xhttp = new XMLHttpRequest();

        // Set POST method and ajax file path
        xhttp.open("POST", "/backend/uploader.php", true);

        // call on request changes state
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var response = this.responseText;
                if (response == 1) {
                    alert("Upload successfully.");
                } else {
                    alert("Uploaded");
                }
            }
        };

        // Send request with data
        xhttp.send(formData);

    } else {
        alert("Please select a file");
    }

}

function ShowValueOfStock(stock) {
    var table = document.getElementById("table");
    table.style.display = "block";
    var input = document.getElementById("myInput");
    console.log('value', input.value);
    var xmlHttp = new XMLHttpRequest();
    fetch('/backend/Api/StockController.php?stock_name=' + input.value, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    })

        .then((response) => {


            return response_stock = response.json();
        })
        .then((response) => {
            if (response.data.date_of_price.length > 0) {
                console.log('response before table', response.desc);
                table_creator(response.data);
            }
            else {
                alert("record not found");
            }
        });

}

function table_creator(response) {
    
    console.log('response in table', response);
    var table = document.getElementById("tbody");
    table.style.border = "2px solid";
    while (table.firstChild) {
        table.removeChild(table.lastChild);
    }

    for (let i = 0; i < response.date_of_price.length; i++) {
        var tablerow = document.createElement("tr");
        var tabledata_price = document.createElement("td");
        var tabledata_date = document.createElement("td");
        tabledata_price.innerHTML = response.price[i];
        tabledata_date.innerHTML = response.date_of_price[i];
        tablerow.appendChild(tabledata_date);
        tablerow.appendChild(tabledata_price);
        table.appendChild(tablerow);
        tablerow.style.border = "2px solid";
        // console.log('date_of_price', response.date_of_price[i]);
        tabledata_price.setAttribute("class", "td");
        tabledata_date.setAttribute("class", "td");
    }
    $(document).ready(function () {
        $('#table').DataTable();
    });
}
function calculateProfit() {

    console.log('max profit');
    var input = document.getElementById("myInput");
    var start_date = document.getElementById("start_date");
    var end_date = document.getElementById("end_date");
    console.log('vals', input.value, start_date.value, end_date.value);
    console.log('value', input.value);
    var xmlHttp = new XMLHttpRequest();

    fetch('backend/Api/PriceController.php?stock_name=' + input.value + '&start_date=' + start_date.value + '&end_date=' + end_date.value, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    })

        .then((response) => {


            return response.json();
        }).then((response) => {
            console.log('unsuccse',response);
            if (response.description != "Unsuccessfull") {
                show_range(response);
            }
            else {
                alert("no record for stock " + input.value)
            }
        })

}
function show_range(res) {
    var value = document.getElementById("values");
    value.style.display = "block";
    while (value.firstChild) {
        value.removeChild(value.lastChild);
    }
    console.log('range', res);
    var heading = document.createElement("h3");
    heading.innerHTML = "Values In The Given Range Of <span style='color:blue;'>Available Start Date </span>" + "<span style='color:f68fa0'>" + res.data.date_of_price[0] + "</span>" + " - <span style='color:blue;'>Available End Date </span>" + "<span style='color:f68fa0'>" + res.data.date_of_price[res.data.price.length - 1] + "</span>";
    value.appendChild(heading);
    var profit = document.createElement("p");
    profit.innerHTML = "1) MAX PROFIT FOR 200 SHARES IN THE GIVEN RANGE = " + res.data.maxprofit;
    value.appendChild(profit);
    var buyDate = document.createElement("p");
    buyDate.innerHTML = "2) BEST DATES TO BUY =";
    for (let i = 0; i < res.data.buy_date.length; i++) {
        buyDate.innerHTML = buyDate.innerHTML + res.data.buy_date[i];
    }
    value.appendChild(buyDate);
    var sellDate = document.createElement("p");
    value.appendChild(sellDate);

    sellDate.innerHTML = "3) BEST DATES TO SELL =";
    for (let i = 0; i < res.data.sell_date.length; i++) {
        console.log('s');
        if (res.data.buy_date[0] < res.data.sell_date[i]) {
            sellDate.innerHTML = sellDate.innerHTML + res.data.sell_date[i];
        }
    }
    var mean_element = document.createElement("p");
    mean_element.innerHTML = "4) MEAN PRICE FOR RANGE OF DATE = " + res.data.mean;
    value.appendChild(mean_element);
    var std_dev_element = document.createElement("p");
    std_dev_element.innerHTML = "5) STANDARD DEVIATION FOR RANGE OF DATE = " + res.data.standard_deviation;
    value.appendChild(std_dev_element);
}
function load_data() {
    console.log('load data');
    fetch('backend/Api/StockNameController.php', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    })

        .then((response) => {


            return response.json();
        }).then((response) => {
            fill_names(response);
        })


}
function fill_names(response) {
    console.log('responses', response);
    autocomplete(document.getElementById("myInput"), response.stock_names);
}
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}