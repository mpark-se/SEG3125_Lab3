var globalCart = [];
var globalRestrictions = [];
// Default sort will sort price ascending - Matt
var globalArraySort = (a, b) => a[1] - b[1]

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
		populateListProductChoices(globalRestrictions, "displayProduct", globalArraySort);
	}
}

/**
 * Generate a checkbox list from a list of products. 
 * It makes each product name as the label for the checkbox
 * @param {Array} restrictions - The list of restrictions
 * @param {string} slct2 - The string of element to append list of products onto
 * @param {(a:Array)=>void} [sortArray=null] - The sortArray function for custom sorting, 
 * 		null by default which will sort by ascending
 * @param {bool} [cartDisplay=null] - The bool flag to mark whether user is loading products or cart page
 */
function populateListProductChoices(restrictions, slct2, sortArray, cartDisplay = null) {

    var s2 = document.getElementById(slct2);
	
	// s2 represents the <div> in the Products tab, which shows the product list, so we first set it empty
    s2.innerHTML = "";
		
	// obtain a reduced list of products based on restrictions
    var optionArray = null;

	if (cartDisplay != null) {
		optionArray = []
		for (i = 0; i < globalCart.length; i++) {
			const valueListMap = Object.values(globalCart[i]).map(value => value);
			optionArray.push(valueListMap)
		}	
	} else {
		optionArray = restrictListProducts(products, restrictions);
	}

	// Sort the product to display - Matt
	optionArray.sort(sortArray);

	// for each item in the array, create a checkbox element, each containing information such as:
	// <input type="checkbox" name="product" value="Bread">
	// <label for="Bread">Bread/label><br>
	for (i = 0; i < optionArray.length; i++) {

		let nameOnly = optionArray[i][0]; 
		// Small update to show cents - Matt
		let productPrice = optionArray[i][1].toFixed(2);
		let productObj = products.find(p => p.name === nameOnly);
		var productCard = document.createElement("div");
		productCard.className = "product-card";

		// Product card--> img + h4 + p + p + button


		//Create the image element
		var img = document.createElement("img");
		img.src = productObj.image; 
		img.style.width = "50px";
		img.style.height = "50px";
		productCard.appendChild(img);

		//Create the label (This is where we show the price to the user)
		var label = document.createElement('h4');
		label.innerText = nameOnly;
		productCard.appendChild(label);

		var price = document.createElement('p');
		price.innerText = `$${productPrice}`;
		productCard.appendChild(price);


		//Div container to place A +/- buttons and quantity selector
		var qtyDiv = document.createElement("div");
		qtyDiv.className = "qty-controls";

		let qtyInput = document.createElement("input");
		qtyInput.type = "text";
		qtyInput.name = "quantity";
		if (cartDisplay != null) {qtyInput.value = optionArray[i][2]}
		else {qtyInput.value = 0;}
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
				if (cartDisplay != null) {
					globalCart.forEach((elem) => {
						if (elem.name == nameOnly) { 
							elem.quantity -=1 
							updateCartDisplay()
						}
					})
				}
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
			if (cartDisplay != null) {
				globalCart.forEach((elem) => {
					if (elem.name == nameOnly) { 
						elem.quantity +=1 
						updateCartDisplay()
					}
				})
			}
        };

		qtyDiv.appendChild(minusButton);
		qtyDiv.appendChild(qtyInput);
		qtyDiv.appendChild(addButton);

		productCard.appendChild(qtyDiv);

		if (cartDisplay != null) {
			const removeBtn = document.createElement("button");
			removeBtn.innerText = "Remove";
			removeBtn.type = "button";
			removeBtn.style.marginLeft = "15px";
			removeBtn.style.cursor = "pointer";
			removeBtn.onclick = () => removeItemFromCart(nameOnly);
			qtyDiv.appendChild(removeBtn);
		}

		productCard.appendChild(qtyDiv);
		s2.appendChild(productCard);
	}
}
	
// This function is called when the "Add selected items to cart" button in clicked
// The purpose is to build the HTML to be displayed (a Paragraph) 
// We build a paragraph to contain the list of selected items, and the total price
function selectedItems() {
	//use const to "lock in" the product rows at this moment
	const productRows = document.getElementById("displayProduct").children;
	let totalQuantity = 0;

	for (let i = 0; i < productRows.length; i++) {
		const row = productRows[i];
		const label = row.querySelector('label');
		const productName = label.textContent.split(" $")[0];
		const qtyInput = row.querySelector('input[name="quantity"]');
		const quantity = Number(qtyInput.value);

		/* To track quantity amount so we can show button change, as well as
		efficiency in running updatedCardDisplay() func - Matt */
		totalQuantity += quantity;
		// Need to get price as well to pass down to global cart - Matt
		const price = Number(label.innerText.slice(label.innerText.indexOf('$') + 1))

		if (quantity > 0) {
        	let cartItem = globalCart.find(item => item.name === productName);
			if (cartItem) {
				cartItem.quantity += quantity;
			} else {
				globalCart.push({ 
					name: productName, 
					price: price,
					quantity: quantity,
				});
			}
        qtyInput.value = 0;
    	}
	}

	// This is to confirm to user that our add to cart request went through - Matt
	if (totalQuantity > 0) {
		// Moving update display here - only need to run when cart changes - Matt
		updateCartDisplay();

		const addCartButton = document.getElementById("addCart");
		const addCartButtonDisabled = document.getElementById("addCartDisabled");

		addCartButton.style.display = "none";
		addCartButtonDisabled.style.display = "block";
		setTimeout(() => {
			console.log("Added to Cart!")
			addCartButton.style.display = "block";
			addCartButtonDisabled.style.display = "none";
		}, 1000)
	}
}

// New function to handle drawing the cart and the Remove buttons used online help to get items from a page using divs/tables and rows
function updateCartDisplay() {

	populateListProductChoices(globalRestrictions, "displayCart", globalArraySort, true);
	
    const c = document.getElementById('displayCart');

	/* Moved all this below to selectedItems to dynamically be able to calculate quantity - Matt
    // c.innerHTML = "";

    // const para = document.createElement("p");
    // para.innerHTML = "<b>Items in your cart:</b><br>";

    // globalCart.forEach(item => {
    //     const productObj = products.find(p => p.name === item.name);

    //     const itemDiv = document.createElement("div");
    //     itemDiv.style.margin = "10px 0";

    //     const text = document.createTextNode(`${item.name} x${item.quantity} - $${(productObj.price * item.quantity).toFixed(2)}`);
    //     itemDiv.appendChild(text);

    //     const removeBtn = document.createElement("button");
    //     removeBtn.innerText = "Remove";
    //     removeBtn.type = "button";
    //     removeBtn.style.marginLeft = "15px";
    //     removeBtn.style.cursor = "pointer";
    //     removeBtn.onclick = () => removeItemFromCart(item.name);
    //     itemDiv.appendChild(removeBtn);

    //     para.appendChild(itemDiv);
    // });

    // c.appendChild(para);
	*/

    const total = globalCart.reduce((sum, item) => {
        const productObj = products.find(p => p.name === item.name);
        return sum + productObj.price * item.quantity;
    }, 0);

    c.appendChild(document.createTextNode(`Total Price: $${total.toFixed(2)}`));
}

// Change size of text for visually impaired
// Added a second button that will switch with another to change text - Matt
function enlargeText() {
	const buttonOn = document.getElementById("enlargeTextOn");
	const buttonOff = document.getElementById("enlargeTextOff");
	if (buttonOn.value == "false") {
		document.body.style.fontSize = '150%';
		buttonOn.value = "true";
		buttonOn.style.display = "none";
		buttonOff.style.display = "block";
	}
	else {
		document.body.style.fontSize = '100%';
		buttonOn.value = "false";
		buttonOn.style.display = "block";
		buttonOff.style.display = "none";
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

/**
 * Assigns the correct sorting algo for filtering products
 * @param {string} sortString - The string value for which sort function to select
 */
function getSortFilter(sortString) {

	switch(sortString) {
		case "p_ascend":
			globalArraySort = (a, b) => a[1] - b[1];
			populateListProductChoices(globalRestrictions, "displayProduct", globalArraySort);
			break;
		case "p_descend":
			globalArraySort = (a, b) => b[1] - a[1];
			populateListProductChoices(globalRestrictions, "displayProduct", globalArraySort);
			break;
		case "a_ascend":
			globalArraySort = (a, b) => a[0].localeCompare(b[0]);
			populateListProductChoices(globalRestrictions, "displayProduct", globalArraySort);
			break;
		case "a_descend":
			globalArraySort = (a, b) => b[0].localeCompare(a[0]);
			populateListProductChoices(globalRestrictions, "displayProduct", globalArraySort);
			break;
	}
}