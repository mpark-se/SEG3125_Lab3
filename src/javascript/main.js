var globalCart = [];
var globalRestrictions = [];


// This function is called when any of the tab is clicked
// It is adapted from https://www.w3schools.com/howto/howto_js_tabs.asp

function openInfo(evt, tabName) {

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
	if(tabName === 'Products') {
		populateListProductChoices(globalRestrictions, "displayProduct");
	}

}


	
// generate a checkbox list from a list of products
// it makes each product name as the label for the checkbos

function populateListProductChoices(restrictions, slct2) {
    var s2 = document.getElementById(slct2);
	
	// s2 represents the <div> in the Products tab, which shows the product list, so we first set it empty
    s2.innerHTML = "";
		
	// obtain a reduced list of products based on restrictions
    var optionArray = restrictListProducts(products, restrictions);
	// Sort the via price, ascending - Matt
	optionArray.sort((a, b) => a[1] - b[1]);

	// for each item in the array, create a checkbox element, each containing information such as:
	// <input type="checkbox" name="product" value="Bread">
	// <label for="Bread">Bread/label><br>
		
	for (i = 0; i < optionArray.length; i++) {

		let nameOnly = optionArray[i][0]; 
		let productPrice = optionArray[i][1];
		let productObj = products.find(p => p.name === nameOnly);

		var productTable = document.createElement("div");
        productTable.style.display = "flex";
        productTable.style.alignItems = "center";
        productTable.style.marginBottom = "15px";
        productTable.style.gap = "15px"; 

		//Create the image element
		var img = document.createElement("img");
		img.src = productObj.image; 
		img.style.width = "50px";
		img.style.height = "50px";
		productTable.appendChild(img);

		//Create the label (This is where we show the price to the user)
		var label = document.createElement('label');
		label.htmlFor = nameOnly;
		var labelText = nameOnly + " $" + productPrice;
		label.appendChild(document.createTextNode(labelText));
		productTable.appendChild(label);

		//Div container to place A +/- buttons and quantity selector
		var qtyDiv = document.createElement("div");
		qtyDiv.style.display = "flex";
		qtyDiv.style.alignItems = "center";
		qtyDiv.style.gap = "10px";

		let qtyInput = document.createElement("input");
		qtyInput.type = "text";
		qtyInput.name = "quantity";
		qtyInput.value = 0;
		qtyInput.min = 0;
		qtyInput.style.width = "40px";
		qtyInput.style.textAlign = "center";
		//qtyInput.readOnly = true; 

		let minusButton = document.createElement("button");
		minusButton.innerText = "-";
		minusButton.type = "button";
		minusButton.style.cursor = "pointer";
		minusButton.style.width = "30px";
		minusButton.style.height = "30px";
		minusButton.onclick = () => {
			if (Number(qtyInput.value) > 0){
				qtyInput.value = Number(qtyInput.value) - 1;
			}
        };

		let addButton = document.createElement("button");
		addButton.innerText = "+";
		addButton.type = "button";
		addButton.style.cursor = "pointer";
		addButton.style.width = "30px";
		addButton.style.height = "30px";
		addButton.onclick = () => {
            qtyInput.value = Number(qtyInput.value) + 1;
        };

		qtyDiv.appendChild(minusButton);
		qtyDiv.appendChild(qtyInput);
		qtyDiv.appendChild(addButton);


		productTable.appendChild(qtyDiv);
		s2.appendChild(productTable);


		// Some added context here
		/*productPrice = " $" + productPrice;
		productName += productPrice;*/

		
	}
}
	
// This function is called when the "Add selected items to cart" button in clicked
// The purpose is to build the HTML to be displayed (a Paragraph) 
// We build a paragraph to contain the list of selected items, and the total price

// This replaces your old selectedItems function
function selectedItems() {
	//use const to "lock in" the product rows at this moment
	const productRows = document.getElementById("displayProduct").children;

	for (let i = 0; i < productRows.length; i++) {
		const row = productRows[i];
		const label = row.querySelector('label');
		const productName = label.textContent.split(" $")[0];
		const qtyInput = row.querySelector('input[name="quantity"]');
		const quantity = Number(qtyInput.value);

		if (quantity > 0) {
        	let cartItem = globalCart.find(item => item.name === productName);
			if (cartItem) {
				cartItem.quantity += quantity;
			} else {
				globalCart.push({ name: productName, quantity });
			}
        qtyInput.value = 0;
    	}
	}
    updateCartDisplay();
}

// New function to handle drawing the cart and the Remove buttons used online help to get items from a page using divs/tables and rows
function updateCartDisplay() {
    const c = document.getElementById('displayCart');
    c.innerHTML = "";

    const para = document.createElement("p");
    para.innerHTML = "<b>Items in your cart:</b><br>";

    globalCart.forEach(item => {
        const productObj = products.find(p => p.name === item.name);

        const itemDiv = document.createElement("div");
        itemDiv.style.margin = "10px 0";

        const text = document.createTextNode(`${item.name} x${item.quantity} - $${(productObj.price * item.quantity).toFixed(2)}`);
        itemDiv.appendChild(text);

        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Remove";
        removeBtn.type = "button";
        removeBtn.style.marginLeft = "15px";
        removeBtn.style.cursor = "pointer";
        removeBtn.onclick = () => removeItemFromCart(item.name);
        itemDiv.appendChild(removeBtn);

        para.appendChild(itemDiv);
    });

    c.appendChild(para);

    const total = globalCart.reduce((sum, item) => {
        const productObj = products.find(p => p.name === item.name);
        return sum + productObj.price * item.quantity;
    }, 0);

    c.appendChild(document.createTextNode(`Total Price: $${total.toFixed(2)}`));
}

// Change size of text for visually impaired
function enlargeText() {
	if (document.getElementById("enlargeText").value == "false") {
		document.body.style.fontSize = '150%';
		document.getElementById("enlargeText").value = "true";
	}
	else {
		document.body.style.fontSize = '100%';
		document.getElementById("enlargeText").value = "false";
	}
	
}

function removeItemFromCart(productName) {
    globalCart = globalCart.filter(item => item.name !== productName);
    updateCartDisplay();
}

/*
function updateProductList() {
	let restrictions = [];
	let checkboxes = document.getElementsByName("dietSelect");
	for (let i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			restrictions.push(checboxes[i].value);
		}
	}

	populateListProductChoices(restrictions, "displayProduct");
} */

function restrictions(value) {
	if(globalRestrictions.includes(value)) {
		let index = globalRestrictions.indexOf(value);
		globalRestrictions.splice(index, 1);
	} else {
		globalRestrictions.push(value);
	}
}
