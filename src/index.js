// Simple cart functionality for CryptoFlow Plumbing Store
let cart = [];

function updateCartCount() {
    let cartCount = cart.length;
    let cartCountElem = document.getElementById('cart-count');
    if (!cartCountElem) {
        // Create cart count element in header if it doesn't exist
        const nav = document.querySelector('header nav ul');
        const li = document.createElement('li');
        li.innerHTML = `<a href="#cart">Cart (<span id="cart-count">0</span>)</a>`;
        nav.appendChild(li);
        cartCountElem = document.getElementById('cart-count');
    }
    cartCountElem.textContent = cartCount;
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <span class="price">$${product.price.toFixed(2)}</span>
        <button>Add to Cart</button>
    `;
    // Add event listener to button
    card.querySelector('button').addEventListener('click', () => {
        cart.push({ name: product.name, price: `$${product.price.toFixed(2)}` });
        updateCartCount();
        alert(`${product.name} added to cart!`);
    });
    return card;
}

document.addEventListener('DOMContentLoaded', () => {
    // Ensure product grid exists
    let grid = document.querySelector('.product-grid');
    if (!grid) {
        // Create product grid if missing
        const productsSection = document.getElementById('products');
        if (productsSection) {
            grid = document.createElement('div');
            grid.className = 'product-grid';
            productsSection.appendChild(grid);
        } else {
            // If #products section is missing, create it in main
            const main = document.querySelector('main');
            const section = document.createElement('section');
            section.id = 'products';
            const h2 = document.createElement('h2');
            h2.textContent = 'Featured Products';
            grid = document.createElement('div');
            grid.className = 'product-grid';
            section.appendChild(h2);
            section.appendChild(grid);
            if (main) main.appendChild(section);
        }
    }
    // Fetch products from json-server and render them
    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(products => {
            grid.innerHTML = '';
            products.forEach(product => {
                const card = createProductCard(product);
                grid.appendChild(card);
            });
        })
        .catch(err => {
            console.error('Failed to load products:', err);
        });
    updateCartCount();
    

    // Handle product form submission
    const form = document.getElementById('add-product-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('product-name').value.trim();
            const description = document.getElementById('product-description').value.trim();
            const price = parseFloat(document.getElementById('product-price').value);
            let image = document.getElementById('product-image').value.trim();
            const category = document.getElementById('product-category').value.trim();
            if (!name || !description || isNaN(price) || !category) {
                alert('Please fill in all fields correctly.');
                return;
            }
            // Auto-match image to product name if left blank or if user requests
            if (!image) {
                const lower = name.toLowerCase();
                if (lower.includes('pipe wrench')) {
                    image = 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80';
                } else if (lower.includes('adjustable wrench')) {
                    image = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80';
                } else if (lower.includes('pvc pipe') || lower.includes('pipes')) {
                    image = 'https://images.unsplash.com/photo-1503389152951-9c3d8bca6c63?auto=format&fit=crop&w=400&q=80';
                } else if (lower.includes('insulation')) {
                    image = 'https://images.unsplash.com/photo-1503389152951-9c3d8bca6c63?auto=format&fit=crop&w=400&q=80';
                } else {
                    image = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'; // generic tool
                }
            }
            const newProduct = { name, description, price, image, category };
            // POST to json-server
            fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            })
            .then(res => res.json())
            .then(addedProduct => {
                const card = createProductCard(addedProduct);
                grid.appendChild(card);
                form.reset();
            })
            .catch(() => alert('Failed to add product.'));
        });
    }
});