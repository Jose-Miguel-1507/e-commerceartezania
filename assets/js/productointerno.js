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
            let buttonAdd = document.getElementById('add-to-cart');
            let imageProduct = document.getElementById('hero_img');
            let descriptionProduct = document.getElementById('description_product');
            console.log(imageProduct)
            buttonAdd.addEventListener('click', (e) =>{
                console.log("activo");
                const productCard = e.target.closest('.hero_info');
                console.log(productCard.querySelector('#number').textContent)
                    const product = {
                        id: productCard.querySelector('h1').textContent.trim(),
                        name: productCard.querySelector('h1').textContent,
                        price: parseFloat(productCard.querySelector('#price').textContent),
                        description: descriptionProduct.textContent,
                        image: imageProduct.querySelector('img').src,
                        quantity: parseInt(productCard.querySelector('#number').textContent),
                    };
                    this.addItem(product);

            })
            
            

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
            
            
            this.cart.push({...product, quantity: product.quantity});
            
            
            this.saveCart();
            this.renderCart();
            this.showAddedFeedback(product.name);
        }
        
        updateQuantity(index, change) {
            
            
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
            return this.cart.reduce((total, item) => total + (item.price), 0);
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
                        <p class="cart-item-price">$${(item.price).toLocaleString()}</p>
                        <div class="cart-item-actions">
                            
                            <span class="quantity-value">${item.quantity}</span>
                            
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



// Scripts de productos Internos

let Price = document.getElementById('price').textContent;
let Plus = document.getElementById('plus');
let Reduce = document.getElementById('reduce');
let NumberPlus = document.getElementById('number').textContent;

Plus.addEventListener('click', function(){
    NumberPlus = parseInt(NumberPlus) + 1;
    document.getElementById('number').textContent = NumberPlus;
    let sum = parseFloat(Price) * NumberPlus;
    document.getElementById('price').textContent = sum.toFixed(2);
});

Reduce.addEventListener('click', function(){
    if(NumberPlus > 1){
        NumberPlus = parseInt(NumberPlus) - 1;
        document.getElementById('number').textContent = NumberPlus;
        let sum = parseFloat(Price) * NumberPlus;
        document.getElementById('price').textContent = sum.toFixed(2);
    }else{
        alert('No puedes reducir más la cantidad');
    }

});

const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');
        document.getElementById(target).classList.add('active');
    });
});


var swiper = new Swiper(".mySwiper", {
    spaceBetween: 10,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true,
  });
  var swiper2 = new Swiper(".mySwiper2", {
    spaceBetween: 10,
    
    thumbs: {
      swiper: swiper,
    },
  });