document.addEventListener('DOMContentLoaded', function() {
    // Carrito de compras
    class ShoppingCart {
        constructor() {
            this.cart = JSON.parse(localStorage.getItem('cart')) || [];
            this.initElements();
            this.initEvents();
            this.initCarousel();
            this.renderCart();
        }
        
        initElements() {
            this.elements = {
                cartOverlay: document.getElementById('cartOverlay'),
                cartTrigger: document.querySelector('#cartButton'),
                cartClose: document.querySelector('.close-cart'),
                continueShopping: document.querySelector('.continue-shopping'),
                cartItemsContainer: document.querySelector('.cart-items-container'),
                cartBadge: document.querySelector('.cart-count'),
                subtotalAmount: document.querySelector('.subtotal-amount'),
                checkoutBtn: document.querySelector('.checkout-btn'),
                emptyCartMessage: document.querySelector('.empty-cart-message'),
                carouselTrack: document.querySelector('.carousel-track'),
                prevBtn: document.querySelector('.prev-btn'),
                nextBtn: document.querySelector('.next-btn')
            };
        }
        
        initEvents() {
            // Abrir/cerrar carrito
            this.elements.cartTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCart(true);
            });
            
            this.elements.cartClose.addEventListener('click', () => this.toggleCart(false));
            this.elements.continueShopping.addEventListener('click', () => this.toggleCart(false));
            
            // Cerrar al hacer click fuera del carrito
            this.elements.cartOverlay.addEventListener('click', (e) => {
                if (e.target === this.elements.cartOverlay) {
                    this.toggleCart(false);
                }
            });
            
            // Delegación de eventos para los items del carrito
            this.elements.cartItemsContainer.addEventListener('click', (e) => {
                const itemElement = e.target.closest('.cart-item');
                if (!itemElement) return;
                
                const index = itemElement.dataset.index;
                
                if (e.target.closest('.decrease-quantity')) {
                    this.updateQuantity(index, -1);
                } else if (e.target.closest('.increase-quantity')) {
                    this.updateQuantity(index, 1);
                } else if (e.target.closest('.remove-item')) {
                    this.removeItem(index);
                }
            });
            
            // Menú móvil
            const menuToggle = document.querySelector('.menu-toggle');
            const nav = document.querySelector('nav');
            
            if (menuToggle && nav) {
                menuToggle.addEventListener('click', () => {
                    nav.classList.toggle('active');
                });
            }
        }
        
        initCarousel() {
            if (!this.elements.carouselTrack) return;
            
            const slides = document.querySelectorAll('.carousel-slide');
            const slideWidth = slides[0].getBoundingClientRect().width + 20; // +20 por el gap
            let currentIndex = 0;
            
            // Posicionar slides
            slides.forEach((slide, index) => {
                slide.style.left = `${index * slideWidth}px`;
            });
            
            // Eventos de navegación
            if (this.elements.nextBtn) {
                this.elements.nextBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % slides.length;
                    this.moveCarousel(currentIndex, slideWidth);
                });
            }
            
            if (this.elements.prevBtn) {
                this.elements.prevBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                    this.moveCarousel(currentIndex, slideWidth);
                });
            }
            
            // Eventos para añadir al carrito
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-to-cart')) {
                    const productCard = e.target.closest('.carousel-slide');
                    const product = {
                        id: productCard.querySelector('h3').textContent.trim(),
                        name: productCard.querySelector('h3').textContent,
                        description: productCard.querySelector('.description').textContent,
                        price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '').replace(/\./g, '')),
                        image: productCard.querySelector('img').src,
                        quantity: 1
                    };
                    this.addItem(product);
                }
            });
        }
        
        moveCarousel(index, slideWidth) {
            this.elements.carouselTrack.style.transform = `translateX(-${index * slideWidth}px)`;
        }
        
        toggleCart(show) {
            if (show) {
                document.body.style.overflow = 'hidden';
                this.elements.cartOverlay.classList.add('active');
            } else {
                document.body.style.overflow = '';
                this.elements.cartOverlay.classList.remove('active');
            }
        }
        
        addItem(product) {
            const existingItem = this.cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({...product, quantity: 1});
            }
            
            this.saveCart();
            this.renderCart();
            this.showAddedFeedback(product.name);
        }
        
        updateQuantity(index, change) {
            this.cart[index].quantity += change;
            
            if (this.cart[index].quantity < 1) {
                this.cart.splice(index, 1);
            }
            
            this.saveCart();
            this.renderCart();
        }
        
        removeItem(index) {
            this.cart.splice(index, 1);
            this.saveCart();
            this.renderCart();
        }
        
        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        }
        
        calculateSubtotal() {
            return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
        
        renderCart() {
            // Limpiar contenedor
            this.elements.cartItemsContainer.innerHTML = '';
            
            // Renderizar items
            this.cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.dataset.index = index;
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-description">${item.description}</p>
                        <p class="cart-item-price">$${(item.price * item.quantity).toLocaleString()}</p>
                        <div class="cart-item-actions">
                            <button class="quantity-btn decrease-quantity">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn increase-quantity">+</button>
                            <button class="remove-item">Eliminar</button>
                        </div>
                    </div>
                `;
                this.elements.cartItemsContainer.appendChild(cartItem);
            });
            
            // Actualizar subtotal
            const subtotal = this.calculateSubtotal();
            this.elements.subtotalAmount.textContent = `$${subtotal.toLocaleString()}`;
            
            // Actualizar badge
            const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
            this.elements.cartBadge.textContent = totalItems;
            
            // Mostrar/ocultar mensaje de carrito vacío
            if (this.cart.length === 0) {
                document.querySelector('.cart-drawer').classList.add('cart-empty');
                this.elements.checkoutBtn.disabled = true;
            } else {
                document.querySelector('.cart-drawer').classList.remove('cart-empty');
                this.elements.checkoutBtn.disabled = false;
            }
        }
        
        showAddedFeedback(productName) {
            const feedback = document.createElement('div');
            feedback.className = 'cart-feedback';
            feedback.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>${productName} añadido al carrito</span>
            `;
            
            document.body.appendChild(feedback);
            
            setTimeout(() => {
                feedback.classList.add('show');
                setTimeout(() => {
                    feedback.classList.remove('show');
                    setTimeout(() => feedback.remove(), 300);
                }, 2000);
            }, 10);
        }
    }
    
    // Inicializar carrito
    const cart = new ShoppingCart();
});



// Scripsts de contacto

function validateForm(){
    let Name = document.getElementById('name').value;
    let LastName = document.getElementById('last-name').value;
    let Phone = document.getElementById('phone').value;
    let Email = document.getElementById('email').value;
    let Message = document.getElementById('message').value;
    let Terms = document.getElementById('terms').checked;

    if(Name === "" || LastName === "" || Phone === "" || Email === "" || Message === "" || Terms === false){
        return false;
    }else{
        return true;

    }
}

let Form = document.getElementById('form');

Form.addEventListener('submit', function(e){
    e.preventDefault();

    if(validateForm()){
        alert('Mensaje enviado correctamente');
        Form.reset();
    }else{
        alert('Todos los campos son obligatorios');
    }

});

