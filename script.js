const dishes = {
	mrj: {
		name: "Mutton Rogan Josh",
		image_id: "mutton-rogan-josh.jpg",
		price: {
			"1kg": 65.0,
		},
	}, // Mutton Rogan Josh
	mk: {
		name: "Mutton Kanti",
		image_id: "mutton-kanti.jpg",
		price: {
			"1kg": 75.0,
		},
	}, // Mutton Kanti
	crj: {
		name: "Chicken Rogan Josh",
		image_id: "chicken-rogan-josh.jpg",
		price: {
			"1kg": 45.0,
		},
	}, // Chicken Rogan Josh
	ec: {
		name: "Egg Curry",
		image_id: "egg-curry.jpg",
		price: {
			"6 eggs": 20.0,
			"12 eggs": 40.0,
		},
	}, // Egg Curry
	masc: {
		name: "Masc",
		image_id: "masc.jpg",
		price: {
			"1kg": 75.0,
		},
	}, // Masc
	da: {
		name: "Dum Aloo",
		image_id: "dum-aloo.jpg",
		price: {
			"1kg": 40.0,
		},
	}, // Dum Aloo
	prj: {
		name: "Paneer Rogan Josh",
		image_id: "paneer-rogan-josh.jpg",
		price: {
			"500g": 25.0,
			"1kg": 40.0,
		},
	}, // Paneer Rogan Josh
	pk: {
		name: "Paneer Kalia",
		image_id: "paneer-kalia.jpg",
		price: {
			"500g": 25.0,
			"1kg": 40.0,
		},
	}, // Paneer Kalia
	ny: {
		name: "Nadur Yaknhi",
		image_id: "nadur-yakhni.jpg",
		price: {
			"500g": 30.0,
			"1kg": 50.0,
		},
	}, // Nadur Yaknhi
	sh: {
		name: "Shufta",
		image_id: "shufta.jpg",
		price: {
			"250g": 40.0,
			"500g": 70.0,
		},
	}, // Shufta
	pkt: {
		name: "Paneer Kanti",
		image_id: "paneer-kanti.jpg",
		price: {
			"500g": 30.0,
			"1kg": 55.0,
		},
	}, // Paneer Kanti
	cfrj: {
		name: "Cauliflower Rogan Josh",
		image_id: "cauliflower-rogan-josh.jpg",
		price: {
			"1kg": 55.0,
		},
	}, // Cauliflower Rogan Josh
	wnc: {
		name: "Walnut Chutney",
		image_id: "walnut-chutney.jpg",
		price: {},
	}, // Walnut Chutney
};

if (localStorage.getItem("cart") === null) {
	localStorage.setItem("cart", JSON.stringify([]));
}

document.addEventListener("contextmenu", (event) => event.preventDefault());

const cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCart();

async function addToCart(dish, weight, quantity) {
	if (!weight || quantity < 1)
		return alert(`Please pick a weight/quantity for ${dishes[dish].name}`);

	if (localStorage.getItem("cart") === null) {
		localStorage.setItem("cart", JSON.stringify([]));
	}

	localStorage.setItem(
		"cart",
		JSON.stringify([
			...JSON.parse(localStorage.getItem("cart")),
			{ dish, weight, quantity },
		])
	);

	updateCart();
	openCart();
}

async function updateCart() {
	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	const cartItemsContainer = document.querySelector(".cart-items");
	cartItemsContainer.innerHTML = ""; // Clear previous items
	let tempCart = {};
	let totalAmount = 0;
	let index = 0;

	cart.forEach((item) => {
		const dishDetails = dishes[item.dish];
		const itemTotal = dishDetails.price[item.weight] * item.quantity;
		totalAmount += itemTotal;

		Object.assign(tempCart, {
			[index]: item.dish,
		});

		console.log(dishDetails.price[item.weight]);

		const cartItem = document.createElement("div");
		cartItem.innerHTML = `
            <div class="cart-item">
					<img src="./assets/images/dishes/${dishDetails.image_id}" id="dish-img" />
					<p class="dish-details">${dishDetails.name} (${item.weight}) x ${
			item.quantity
		}</p>
					<div style="flex-direction: column">
                    <div id="dish-${index.toString()}" class="remove-item" onclick="removeFromCart('${
			item.dish
		}')" onmouseover="showBrokenHeart(${index})" onmouseout="hideBrokenHeart(${index})">
										<i class="fa-solid fa-heart fa-lg" id="heart-${index}"></i>
										<i class="fa-solid fa-heart-crack fa-lg" id="broken-heart-${index}" style="display: none;"></i>
						</div>
						<p class="dish-price">$${itemTotal.toFixed(2)}</p>
					</div>
				</div>
        `;
		cartItemsContainer.appendChild(cartItem);
		index++;
	});

	console.log(tempCart);

	document.getElementById("total-amount").innerText = totalAmount.toFixed(2);
	if (cart.length > 0) {
		document.querySelector(".cart-button").classList.add("not_empty");
		document.querySelector(".close-button").style.display = "block";
	} else {
		document.querySelector(".cart-button").classList.remove("not_empty");
	}
}

async function removeFromCart(dish) {
	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	const updatedCart = cart.filter((item) => item.dish !== dish);
	localStorage.setItem("cart", JSON.stringify(updatedCart));
	updateCart();
}

async function closeCart() {
	const cart = document.querySelector(".cart");
	cart.classList.remove("active");
	document.querySelector(".close-button").style.display = "none";
	document.querySelector(".cart-items").innerHTML = "";
	document.getElementById("total-amount").innerText = "0.00";
	const overlay = document.getElementById("cart-overlay");
	if (overlay) {
		overlay.style.display = "none";
		document.body.removeChild(overlay);
		document.body.style.overflow = "auto";
	}
}

async function openCart() {
	const cart = document.querySelector(".cart");
	cart.classList.toggle("active");
	let overlay = document.getElementById("cart-overlay");
	if (!overlay) {
		overlay = document.createElement("div");
		overlay.id = "cart-overlay";
		overlay.style.position = "fixed";
		overlay.style.top = "0";
		overlay.style.left = "0";
		overlay.style.width = "100vw";
		overlay.style.height = "100vh";
		overlay.style.background = "rgba(0,0,0,0.4)";
		overlay.style.zIndex = "999";
		overlay.style.transition = "opacity 0.3s";
		document.body.style.overflow = "hidden";
		overlay.onclick = closeCart;
		document.body.appendChild(overlay);
	} else {
		overlay.style.display = "block";
	}
	cart.style.zIndex = "1000";
	document.querySelector(".close-button").style.display = "block";
	updateCart();
}

async function checkout() {
	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	if (cart.length === 0) {
		alert("Your cart is empty. Please add items before checking out.");
		return;
	}

	let totalAmount = cart.reduce((total, item) => {
		return total + dishes[item.dish].price[item.weight] * item.quantity;
	}, 0);

	let order = ``;

	cart.forEach((item) => {
		const dishDetails = dishes[item.dish];

		order =
			order +
			`*${dishDetails.name}* (${item.weight}) x ${item.quantity}. Price: $${
				dishDetails.price[item.weight] * item.quantity
			}\n`;
	});

	order = order + `Total: $${totalAmount.toFixed(2)}`;

	clearValues();

	window.location.href = `https://wa.me/12624021530?text=${encodeURI(
		`Hello! I would like to order:\n ${order}`
	)}`;
}

async function clearValues() {
	localStorage.setItem("cart", JSON.stringify([]));
	updateCart();
	closeCart();
	closeConfirmationPopup();
}

const nonVegLoadMoreButton = document.getElementById("nonVegLoadMoreButton");
const nonVegHiddenPhotos = document.querySelectorAll(".dish.hidden-nonveg");
const vegLoadMoreButton = document.getElementById("vegLoadMoreButton");
const vegHiddenPhotos = document.querySelectorAll(".dish.hidden-veg");

async function loadMore(dishType) {
	switch (dishType) {
		case "veg":
			vegHiddenPhotos.forEach((photo) => photo.classList.remove("hidden-veg"));
			vegLoadMoreButton.style.display = "none";
			break;

		case "non-veg":
			nonVegHiddenPhotos.forEach((photo) =>
				photo.classList.remove("hidden-nonveg")
			);
			nonVegLoadMoreButton.style.display = "none";
			break;

		default:
			break;
	}
}

async function showBrokenHeart(index) {
	const heartIcon = document.getElementById(`heart-${index}`);
	const brokenHeartIcon = document.getElementById(`broken-heart-${index}`);
	console.log(index);
	// if (!heartIcon || !brokenHeartIcon) return;
	document.getElementById(`dish-${index}`).style.color = "#aa0000";
	heartIcon.style.display = "none";
	brokenHeartIcon.style.display = "block";
}

async function hideBrokenHeart(index) {
	const heartIcon = document.getElementById(`heart-${index}`);
	const brokenHeartIcon = document.getElementById(`broken-heart-${index}`);
	// if (!heartIcon || !brokenHeartIcon) return;
	document.getElementById(`dish-${index}`).style.color = "#000";
	heartIcon.style.display = "block";
	brokenHeartIcon.style.display = "none";
}
