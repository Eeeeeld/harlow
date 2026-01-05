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
        adCarousel.addEventListener('mouseenter', stopAdAutoSlide);
        adCarousel.addEventListener('mouseleave', startAdAutoSlide);

        // Jump to product card
        adButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.getAttribute('data-id');
                const productCard = document.querySelector(
                    `.product-card[data-id="${productId}"]`
                );

                if (productCard) {
                    productCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            });
        });

        // Init
        startAdAutoSlide();


        // Cart functionality
        let cart = JSON.parse(localStorage.getItem("cart")) || [];;
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartFooter = document.getElementById('cart-footer');
        const cartTotalPrice = document.getElementById('cart-total-price');

        // Update cart count
        function updateCartCount() {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        function syncCart() {
            localStorage.setItem("cart", JSON.stringify(cart));
        }

        // Render cart items
        function renderCartItems() {
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Your bag is empty</p>
                    </div>
                `;
                cartFooter.style.display = 'none';
                return;
            }

            cartItems.innerHTML = '';
            let totalPrice = 0;

            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
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

            cartTotalPrice.textContent = `Rp ${totalPrice.toLocaleString()}`;
            cartFooter.style.display = 'block';
        }

        // Add to cart
        function addToCart(productId, quantity = 1) {
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ id: productId, quantity });
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
                item.quantity = parseInt(newQuantity);
                if (item.quantity < 1) {
                    removeFromCart(productId);
                } else {
                    syncCart();
                    renderCartItems();
                }
            }
        }

        // Modal functionality
        const modal = document.getElementById('product-modal');
        const overlay = document.getElementById('overlay');
        const closeModal = document.querySelector('.close-modal');
        const quickViewButtons = document.querySelectorAll('.quick-view');
        const addToCartButtons = document.querySelectorAll('.product-actions .btn');
        const addToCartModal = document.getElementById('add-to-cart-modal');

        // Open modal
        function openModal(productId) {
            const product = products.find(p => p.id === productId);
            if (product) {
                document.getElementById('modal-product-image').src = product.image;
                document.getElementById('modal-product-image').alt = product.title;
                document.getElementById('modal-product-title').textContent = product.title;
                document.getElementById('modal-product-price').textContent = `Rp ${product.price.toLocaleString()}`;
                document.getElementById('modal-product-description').textContent = product.description;
                document.getElementById('product-quantity').value = 1;
                document.getElementById('add-to-cart-modal').setAttribute('data-id', product.id);
                
                modal.classList.add('show');
                overlay.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        }

        // Close modal
        function closeModalFunc() {
            modal.classList.remove('show');
            overlay.classList.remove('show');
            document.body.style.overflow = 'auto';
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
                const productCard = e.target.closest('.product-card');
                const productId = parseInt(productCard.dataset.id);
                addToCart(productId);
                
                // Show feedback
                button.textContent = 'Added!';
                setTimeout(() => {
                    button.textContent = 'Add to Cart';
                }, 1000);
            });
        });

        // Add to cart from modal
        addToCartModal.addEventListener('click', () => {
            const productId = parseInt(addToCartModal.getAttribute('data-id'));
            const quantity = parseInt(document.getElementById('product-quantity').value);
            addToCart(productId, quantity);
            closeModalFunc();
        });

        // Quantity controls in modal
        document.querySelector('.increase-qty').addEventListener('click', () => {
            const input = document.getElementById('product-quantity');
            input.value = parseInt(input.value) + 1;
        });

        document.querySelector('.decrease-qty').addEventListener('click', () => {
            const input = document.getElementById('product-quantity');
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        });

        // Close modal events
        closeModal.addEventListener('click', closeModalFunc);
        overlay.addEventListener('click', closeModalFunc);
    
        // Wishlist functionality
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        function syncWishlist() {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
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
        }

        // Init wishlist buttons
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productId = parseInt(btn.dataset.id);

            if (wishlist.includes(productId)) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
            }

            btn.addEventListener('click', () => {
                toggleWishlist(productId, btn);
            });
        });

        // Comments functionality
        let comments = JSON.parse(localStorage.getItem('comments')) || {};
        let currentProductId = null;

        function renderComments(productId) {
            const list = document.getElementById('comment-list');
            list.innerHTML = '';

            (comments[productId] || []).forEach(text => {
                const div = document.createElement('div');
                div.className = 'comment';
                div.textContent = text;
                list.appendChild(div);
            });
        }

        // Modify openModal function (IMPORTANT)
        function openModal(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            currentProductId = productId;

            document.getElementById('modal-product-image').src = product.image;
            document.getElementById('modal-product-title').textContent = product.title;
            document.getElementById('modal-product-price').textContent = `Rp ${product.price.toLocaleString()}`;
            document.getElementById('modal-product-description').textContent = product.description;

            renderComments(productId);

            modal.classList.add('show');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        // Add comment
        document.getElementById('add-comment').addEventListener('click', () => {
            const input = document.getElementById('comment-input');
            const text = input.value.trim();

            if (!text) return;

            if (!comments[currentProductId]) {
                comments[currentProductId] = [];
            }

            comments[currentProductId].push(text);
            localStorage.setItem('comments', JSON.stringify(comments));

            input.value = '';
            renderComments(currentProductId);
        });

        // Cart sidebar functionality
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartToggle = document.getElementById('cart-toggle');
        const closeCart = document.querySelector('.close-cart');

        // Toggle cart sidebar
        cartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('open');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        // Close cart sidebar
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
            overlay.classList.remove('show');
            document.body.style.overflow = 'auto';
        });

        // Overlay click
        overlay.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
            overlay.classList.remove('show');
            document.body.style.overflow = 'auto';
        });

        // Cart item quantity controls
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

        // Header scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                document.getElementById('main-header').classList.add('scrolled');
            } else {
                document.getElementById('main-header').classList.remove('scrolled');
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        updateCartCount();
        renderCartItems();
