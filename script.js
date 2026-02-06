document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Check for saved user preference
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
        body.classList.add('dark-mode');
    }

    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // Save preference
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // Optional: Add active state to nav links on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
    // Advanced Cart Logic
    const cart = [];
    const cartCountEl = document.getElementById('cart-count');
    const floatingCart = document.getElementById('floating-cart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Add to Cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const image = button.getAttribute('data-image');

            const item = { name, price, image };
            cart.push(item);
            updateCart();

            // Visual Feedback
            const originalText = button.textContent;
            button.textContent = 'Added!';
            button.style.backgroundColor = '#2C5F2D';

            // Show Floating Cart
            if (floatingCart.classList.contains('hidden')) {
                floatingCart.classList.remove('hidden');
                setTimeout(() => floatingCart.classList.remove('hidden'), 100);
            }

            // Pulse Cart
            floatingCart.style.transform = 'scale(1.2)';
            setTimeout(() => floatingCart.style.transform = 'scale(1)', 200);

            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 1000);
        });
    });

    // Open Cart Modal
    floatingCart.addEventListener('click', () => {
        cartModal.classList.remove('hidden');
        renderCartItems();
    });

    // Close Cart Modal
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    function closeCart() {
        cartModal.classList.add('hidden');
    }

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Thank you for your order! Your coffee is being brewed.');
        cart.length = 0;
        updateCart();
        closeCart();
    });

    function updateCart() {
        cartCountEl.textContent = cart.length;
        renderCartItems();

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalEl.textContent = '$' + total.toFixed(2);

        if (cart.length === 0) {
            floatingCart.classList.add('hidden');
        }
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
            return;
        }

        cart.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item-row');
            itemEl.innerHTML = `
                <div class="cart-item-img" style="background-image: url('${item.image || 'https://via.placeholder.com/60'}')"></div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>$${item.price.toFixed(2)}</span>
                </div>
                <button class="remove-btn" onclick="removeCartItem(${index})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    // Global function for removal
    window.removeCartItem = (index) => {
        cart.splice(index, 1);
        updateCart();
    };
});

