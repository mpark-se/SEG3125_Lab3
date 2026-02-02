	
// Array of products, each product is an object with different fieldset
// A set of ingredients should be added to products		

// I changed the schema so it follows assignment structure, format like this
// for future products to add - Matt 
var products = [
	//all images source: https://pngtree.com
	{
		name: "brocoli",
		clientStatus: {
			vegetarian: true,
			glutenFree: true,
			diabetic: true,
			lactoseIntolerant: true,
			pescatarian: true
		},
		organic: true,
		image: "Image/broccoli.png",
		price: 1.99
	},
	{
		name: "bread",
		clientStatus: {
			vegetarian: true,
			glutenFree: false,
			diabetic: true,
			lactoseIntolerant: true,
			pescatarian: true
		},
		organic: true,
		image: "Image/bread.png",
		price: 2.35
	},
	{
		name: "salmon",
		clientStatus: {
			vegetarian: false,
			glutenFree: true,
			diabetic: true,
			lactoseIntolerant: true,
			pescatarian: false
		},
		organic: true,
		image: "Image/salmon.png",
		price: 10.00
	},
	{
		name: "yogurt",
		clientStatus: {
			vegetarian: true,
			glutenFree: true,
			diabetic: true,
			lactoseIntolerant: false,
			pescatarian: true
		},
		organic: false,
		image: "Image/yogurt.png",
		price: 3.50
	},
	{
		name: "almond milk",
		clientStatus: {
			vegetarian: true,
			glutenFree: true,
			diabetic: true,
			lactoseIntolerant: true,
			pescatarian: true
		},
		organic: false,
		image: "Image/almond_milk.png",
		price: 4.99
	},
	{
		name: "apples",
		clientStatus: {
			vegetarian: true, 
			glutenFree: true, 
			diabetic: false, 
			lactoseIntolerant: true, 
			pescatarian: true 
		},
		organic: true,
		image: "Image/apple.png",
		price: 3.50
	},
	{
		name: "milk (1L)",
		clientStatus: { 
			vegetarian: true, 
			glutenFree: true, 
			diabetic: true, 
			lactoseIntolerant: false, 
			pescatarian: true 
		},
		organic: false,
		image: "Image/milk.png",
		price: 4.25
	},
	{
		name: "cheese blocks",
		clientStatus: { 
			vegetarian: true, 
			glutenFree: true, 
			diabetic: true, 
			lactoseIntolerant: false, 
			pescatarian: true 
		},
		organic: false,
		image: "Image/cheese.png",
		price: 7.99
	},
	{
		name: "chicken breast",
		clientStatus: { 
			vegetarian: false, 
			glutenFree: true, 
			diabetic: true, 
			lactoseIntolerant: true, 
			pescatarian: false 
		},
		organic: false,
		image: "Image/chicken.png",
		price: 9.00
	},
	{
		name: "tofu",
		clientStatus: { 
			vegetarian: true, 
			glutenFree: true, 
			diabetic: true, 
			lactoseIntolerant: true, 
			pescatarian: true 
		},
		organic: true,
		image: "Image/tofu.png",
		price: 2.99
	},
	{
		name: "pasta",
		clientStatus: { 
			vegetarian: true, 
			glutenFree: false, 
			diabetic: true, 
			lactoseIntolerant: true, 
			pescatarian: true 
		},
		organic: false,
		image: "Image/pasta.png",
		price: 5.50
	},
	{
		name: "eggs (dozen)",
		clientStatus: { vegetarian: true, 
			glutenFree: true, 
			diabetic: true, 
			lactoseIntolerant: true, 
			pescatarian: true 
		},
		organic: true,
		image: "Image/eggs.png",
		price: 4.99
	}
];

function appendProduct(products, data) {
	for (let i = 0; i < data.length; i++) {
		products.append(data[i])
	}
}


// given restrictions provided, make a reduced list of products
// prices should be included in this list, as well as a sort based on price
function restrictListProducts(allProducts, restrictions) {
	let product_names = [];
	// I added data into list so we can carry price information on the return - Matt
	data = []
	for(let i=0; i<allProducts.length; i++) {
		let product = allProducts[i];
		let includeProduct = true;

		for (let j=0; j<restrictions.length; j++) {
			let restriction = restrictions[j];
			// Value for checkbox MUST be the same as key in clientStatus object
			if(product.clientStatus[restriction] != true) {
				includeProduct = false;
				break;
			}
		}

		if(includeProduct) {
			data = [product.name, product.price];
			product_names.push(data);
		}
	}
	return product_names;
}

// Calculate the total price of items, with received parameter being a list of products
function getTotalPrice(chosenProducts) {
	let totalPrice = 0;
	for (let i = 0; i < products.length; i += 1) {
		// If the product name exists in our list of chosen names
		if (chosenProducts.indexOf(products[i].name) > -1) {
			totalPrice += products[i].price;
		}
	}
	return totalPrice;
}
