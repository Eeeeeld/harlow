// Product data
const products = [
    {
        id: 1,
        title: "Daiquiri Dress",
        price: 119000,
        image: "image/Y3.jpg",
        description: "A flowy summer dress with delicate floral patterns and adjustable waist tie. Perfect for beach days or casual outings with its breathable fabric and comfortable fit.",
        badge: "New",
        badgeColor: "var(--accent)"
    },
    {
        id: 2,
        title: "Clover Baby ~ Tanks",
        price: 139000,
        image: "image/Y2.jpg",
        description: "Flowy tank top with adjustable straps and delicate lace details. The subtle sheen and graceful drape make this top ideal for special occasions or elevated everyday wear.",
        badge: "Bestseller",
        badgeColor: "#feca57"
    },
    {
        id: 3,
        title: "Chasing Denim",
        price: 99000,
        image: "image/Y4.jpg",
        description: "Classic denim shorts with comfortable fit and stylish distressing. These versatile shorts can be dressed up with heels or worn casually with sneakers for a chic, relaxed look.",
        badge: "Fresh",
        badgeColor: "var(--fresh)"
    },
    {
        id: 4,
        title: "Southside Beach Shorts",
        price: 109000,
        image: "image/Y5.jpg",
        description: "Ultra-soft beach shorts with elastic waistband and quick-dry fabric. This comfortable piece works equally well for beach days or casual outings with friends.",
        badge: "Boyish",
        badgeColor: "var(--boyish)"
    }
];

// Sliding Advertisement Carousel
const adTrack = document.getElementById('ad-track');
const adSlides = document.querySelectorAll('.ad-slide');
const adButtons = document.querySelectorAll('.ad-btn');

let currentAd = 0;
let adTimer;

function moveAds() {
    currentAd = (currentAd + 1) % adSlides.length;
    adTrack.style.transform = `translateX(-${currentAd * 100}%)`;
}

function startAdAutoSlide() {
    adTimer = setInterval(moveAds, 3000);
}

function stopAdAutoSlide() {
    clearInterval(adTimer);
}

// Pause on hover
const adCarousel = document.getElementById('ad-carousel');
if (adCarousel) {
    adCarousel.addEventListener('mouseenter', stopAdAutoSlide);
    adCarousel.addEventListener('mouseleave', startAdAutoSlide);
    startAdAutoSlide();
}

// Jump to product card and open modal
adButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = parseInt(btn.getAttribute('data-id'));
        const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);

        if (productCard) {
            productCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            setTimeout(() => {
                openModal(productId);
            }, 800);
        }
    });
});

// Cart functionality
let cart = [];

// Load cart from localStorage safely
function loadCart() {
    try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            const parsed = JSON.parse(savedCart);
            // Validate cart data
            if (Array.isArray(parsed)) {
                cart = parsed.filter(item => 
                    item && 
                    typeof item.id === 'number' && 
                    typeof item.quantity === 'number' &&
                    item.quantity > 0 &&
                    products.find(p => p.id === item.id)
                );
            }
        }
    } catch (e) {
        console.error("Error loading cart:", e);
        cart = [];
        localStorage.removeItem("cart");
    }
}

loadCart();

const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cart-items');
const cartFooter = document.getElementById('cart-footer');
const cartTotalPrice = document.getElementById('cart-total-price');

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function syncCart() {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
        console.error("Error saving cart:", e);
    }
}

// Render cart items
function renderCartItems() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Your bag is empty</p>
            </div>
        `;
        if (cartFooter) cartFooter.style.display = 'none';
        return;
    }

    cartItems.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        
        totalPrice += product.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${product.title}</h4>
                <div class="cart-item-price">Rp ${product.price.toLocaleString()}</div>
                <div class="cart-item-quantity">
                    <button class="decrease-item" data-id="${product.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" data-id="${product.id}">
                    <button class="increase-item" data-id="${product.id}">+</button>
                </div>
                <button class="remove-item" data-id="${product.id}">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    if (cartTotalPrice) {
        cartTotalPrice.textContent = `Rp ${totalPrice.toLocaleString()}`;
    }
    if (cartFooter) {
        cartFooter.style.display = 'block';
    }
}

// Add to cart
function addToCart(productId, quantity = 1) {
    // Validate inputs
    if (!productId || quantity < 1) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity });
    }

    syncCart();
    updateCartCount();
    renderCartItems();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    syncCart();
    updateCartCount();
    renderCartItems();
}

// Update item quantity
function updateItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const qty = parseInt(newQuantity);
        if (isNaN(qty) || qty < 1) {
            removeFromCart(productId);
        } else {
            item.quantity = qty;
            syncCart();
            updateCartCount();
            renderCartItems();
        }
    }
}

// Modal functionality
const modal = document.getElementById('product-modal');
const overlay = document.getElementById('overlay');
const closeModalBtn = document.querySelector('.close-modal');
const quickViewButtons = document.querySelectorAll('.quick-view');
const addToCartButtons = document.querySelectorAll('.product-actions .btn');
const addToCartModal = document.getElementById('add-to-cart-modal');

// Comments and ratings functionality
let reviews = {};
try {
    const savedReviews = localStorage.getItem('reviews');
    if (savedReviews) {
        reviews = JSON.parse(savedReviews);
    }
} catch (e) {
    console.error("Error loading reviews:", e);
    reviews = {};
}

let currentProductId = null;
let currentRating = 0;

// Star rating selection
const starRating = document.getElementById('star-rating');
if (starRating) {
    starRating.addEventListener('click', (e) => {
        if (e.target.classList.contains('fa-star')) {
            currentRating = parseInt(e.target.dataset.rating);
            updateStarDisplay();
        }
    });
}

function updateStarDisplay() {
    if (!starRating) return;
    const stars = starRating.querySelectorAll('.fa-star');
    stars.forEach((star, index) => {
        if (index < currentRating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

function renderReviews(productId) {
    const list = document.getElementById('comment-list');
    const ratingSummary = document.getElementById('rating-summary');
    
    if (!list || !ratingSummary) return;
    
    list.innerHTML = '';
    const productReviews = reviews[productId] || [];
    
    if (productReviews.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--text); padding: 20px;">No reviews yet. Be the first to review this product!</p>';
        ratingSummary.querySelector('.rating-number').textContent = '0.0';
        ratingSummary.querySelector('.stars').innerHTML = '<i class="far fa-star"></i>'.repeat(5);
        ratingSummary.querySelector('.review-count').textContent = '0 reviews';
        return;
    }
    
    // Calculate average rating
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    ratingSummary.querySelector('.rating-number').textContent = avgRating.toFixed(1);
    
    // Display stars
    const starsHtml = Array(5).fill(0).map((_, i) => 
        i < Math.round(avgRating) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
    ).join('');
    ratingSummary.querySelector('.stars').innerHTML = starsHtml;
    ratingSummary.querySelector('.review-count').textContent = `${productReviews.length} review${productReviews.length > 1 ? 's' : ''}`;
    
    // Render individual reviews
    productReviews.forEach(review => {
        const div = document.createElement('div');
        div.className = 'comment';
        
        const stars = Array(5).fill(0).map((_, i) => 
            i < review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
        ).join('');
        
        div.innerHTML = `
            <div class="review-stars" style="color: #feca57; margin-bottom: 8px;">${stars}</div>
            <p style="margin-bottom: 5px;">${review.text}</p>
            <small style="color: var(--text); font-size: 12px;">${review.date}</small>
        `;
        list.appendChild(div);
    });
}

// Open modal
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !modal) return;

    currentProductId = productId;
    currentRating = 0;

    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-title').textContent = product.title;
    document.getElementById('modal-product-price').textContent = `Rp ${product.price.toLocaleString()}`;
    document.getElementById('modal-product-description').textContent = product.description;
    document.getElementById('product-quantity').value = 1;
    
    if (addToCartModal) {
        addToCartModal.setAttribute('data-id', product.id);
    }

    // Reset star rating display
    if (starRating) {
        const stars = starRating.querySelectorAll('.fa-star');
        stars.forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
    }

    renderReviews(productId);

    modal.classList.add('show');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModalFunc() {
    if (modal) modal.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = 'auto';
    currentRating = 0;
}

// Quick view event listeners
quickViewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const productId = parseInt(productCard.dataset.id);
        openModal(productId);
    });
});

// Add to cart from grid
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productId = parseInt(productCard.dataset.id);
        addToCart(productId, 1);
        
        // Show feedback
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.backgroundColor = '#1dd1a1';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 1000);
    });
});

// Add to cart from modal
if (addToCartModal) {
    addToCartModal.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = parseInt(addToCartModal.getAttribute('data-id'));
        const quantityInput = document.getElementById('product-quantity');
        const quantity = parseInt(quantityInput.value) || 1;
        
        addToCart(productId, quantity);
        
        // Show feedback
        const originalText = addToCartModal.textContent;
        addToCartModal.textContent = 'Added to Cart!';
        addToCartModal.style.backgroundColor = '#1dd1a1';
        
        setTimeout(() => {
            addToCartModal.textContent = originalText;
            addToCartModal.style.backgroundColor = '';
            closeModalFunc();
        }, 800);
    });
}

// Quantity controls in modal
const increaseQtyBtn = document.querySelector('.increase-qty');
const decreaseQtyBtn = document.querySelector('.decrease-qty');

if (increaseQtyBtn) {
    increaseQtyBtn.addEventListener('click', () => {
        const input = document.getElementById('product-quantity');
        if (input) {
            input.value = parseInt(input.value) + 1;
        }
    });
}

if (decreaseQtyBtn) {
    decreaseQtyBtn.addEventListener('click', () => {
        const input = document.getElementById('product-quantity');
        if (input && parseInt(input.value) > 1) {
            input.value = parseInt(input.value) - 1;
        }
    });
}

// Close modal events
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModalFunc);
}

if (overlay) {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModalFunc();
            closeSidebars();
        }
    });
}

// Wishlist functionality
let wishlist = [];
try {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) {
            wishlist = parsed.filter(id => products.find(p => p.id === id));
        }
    }
} catch (e) {
    console.error("Error loading wishlist:", e);
    wishlist = [];
}

function syncWishlist() {
    try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (e) {
        console.error("Error saving wishlist:", e);
    }
}

function toggleWishlist(productId, btn) {
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    } else {
        wishlist.push(productId);
        btn.classList.add('active');
        btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    }
    syncWishlist();
    renderWishlistSidebar();
}

// Init wishlist buttons
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const productId = parseInt(btn.dataset.id);

    if (wishlist.includes(productId)) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    }

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleWishlist(productId, btn);
    });
});

// Add review/comment
const addCommentBtn = document.getElementById('add-comment');
if (addCommentBtn) {
    addCommentBtn.addEventListener('click', () => {
        const input = document.getElementById('comment-input');
        const text = input ? input.value.trim() : '';

        if (!text || currentRating === 0) {
            alert('Please provide both a rating and a comment!');
            return;
        }

        if (!reviews[currentProductId]) {
            reviews[currentProductId] = [];
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        reviews[currentProductId].push({
            text: text,
            rating: currentRating,
            date: dateStr
        });
        
        try {
            localStorage.setItem('reviews', JSON.stringify(reviews));
        } catch (e) {
            console.error("Error saving review:", e);
        }

        if (input) input.value = '';
        currentRating = 0;
        
        // Reset star display
        if (starRating) {
            const stars = starRating.querySelectorAll('.fa-star');
            stars.forEach(star => {
                star.classList.remove('fas');
                star.classList.add('far');
            });
        }
        
        renderReviews(currentProductId);
    });
}

// Cart sidebar functionality
const cartSidebar = document.getElementById('cart-sidebar');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.querySelector('.close-cart');

// Wishlist sidebar
const wishlistSidebar = document.getElementById('wishlist-sidebar');
const wishlistToggle = document.getElementById('wishlist-toggle');
const closeWishlist = document.querySelector('.close-wishlist');

function closeSidebars() {
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (wishlistSidebar) wishlistSidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Toggle cart sidebar
if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (wishlistSidebar) wishlistSidebar.classList.remove('open');
        if (cartSidebar) cartSidebar.classList.add('open');
        if (overlay) overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
}

// Close cart sidebar
if (closeCart) {
    closeCart.addEventListener('click', closeSidebars);
}

// Wishlist toggle
if (wishlistToggle) {
    wishlistToggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (cartSidebar) cartSidebar.classList.remove('open');
        if (wishlistSidebar) wishlistSidebar.classList.add('open');
        if (overlay) overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        renderWishlistSidebar();
    });
}

if (closeWishlist) {
    closeWishlist.addEventListener('click', closeSidebars);
}

function renderWishlistSidebar() {
    const wishlistItems = document.getElementById('wishlist-items');
    if (!wishlistItems) return;
    
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '<p style="text-align:center; padding: 20px;">Your wishlist is empty</p>';
        return;
    }
    
    wishlistItems.innerHTML = '';
    wishlist.forEach(productId => {
        const product = products.find(p => p.id === productId);
        if (product) {
            const item = document.createElement('div');
            item.className = 'wishlist-item';
            item.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <div>
                    <h4 style="font-size: 14px; margin-bottom: 5px;">${product.title}</h4>
                    <p style="color: var(--accent); font-weight: 600;">Rp ${product.price.toLocaleString()}</p>
                </div>
            `;
            wishlistItems.appendChild(item);
        }
    });
}

// Cart item quantity controls
if (cartItems) {
    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('decrease-item')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateItemQuantity(productId, item.quantity - 1);
            }
        } else if (e.target.classList.contains('increase-item')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateItemQuantity(productId, item.quantity + 1);
            }
        } else if (e.target.classList.contains('remove-item')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        }
    });

    // Input change for quantity
    cartItems.addEventListener('change', (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const newQuantity = parseInt(e.target.value);
            if (!isNaN(newQuantity)) {
                updateItemQuantity(productId, newQuantity);
            }
        }
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#cart-toggle' || targetId === '#wishlist-toggle') return;
        
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize
updateCartCount();
renderCartItems();
