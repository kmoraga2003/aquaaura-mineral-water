/**
 * AquaAura - Main Application & Animation Engine
 * Handles Canvas Water Physics, Hydration Calculator API, Cart Management,
 * 3D Tilt Cards, Mineral Comparison Chart, and Order Submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. CANVAS FLUID WAVE & BUBBLE ANIMATION ENGINE
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('waterCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
        });

        // Bubble Particles
        const bubbles = [];
        const bubbleCount = 35;
        for (let i = 0; i < bubbleCount; i++) {
            bubbles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 6 + 2,
                speed: Math.random() * 1.2 + 0.4,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.03 + 0.01,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        // Mouse Ripple Interactive Effect
        let mouseX = width / 2;
        let mouseY = height / 2;
        let mouseTargetY = mouseY;
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseTargetY = e.clientY - rect.top;
        });

        let waveStep = 0;

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            // Interpolate mouse Y
            mouseY += (mouseTargetY - mouseY) * 0.05;

            // Draw Buoyant Floating Bubbles
            ctx.fillStyle = 'rgba(102, 165, 173, 0.4)';
            bubbles.forEach(b => {
                b.y -= b.speed;
                b.wobble += b.wobbleSpeed;
                const currentX = b.x + Math.sin(b.wobble) * 15;

                if (b.y < -20) {
                    b.y = height + 20;
                    b.x = Math.random() * width;
                }

                ctx.beginPath();
                ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(102, 165, 173, ${b.opacity})`;
                ctx.fill();
            });

            // Draw Sine Waves at Bottom of Hero
            waveStep += 0.025;

            drawWave(height * 0.85, 20, 0.012, waveStep, 'rgba(7, 87, 91, 0.35)');
            drawWave(height * 0.88, 15, 0.018, waveStep * 1.3 + 1, 'rgba(0, 59, 70, 0.5)');
            drawWave(height * 0.91, 10, 0.022, waveStep * 0.8 + 2, 'rgba(102, 165, 173, 0.25)');

            requestAnimationFrame(animateCanvas);
        }

        function drawWave(yOffset, amplitude, frequency, phase, color) {
            ctx.beginPath();
            ctx.moveTo(0, height);

            for (let x = 0; x <= width; x += 10) {
                // Add mouse distance influence
                const distToMouse = Math.abs(x - mouseX);
                const mouseFactor = Math.max(0, 1 - distToMouse / 300);
                const extraAmp = mouseFactor * 25 * Math.sin(waveStep * 3);

                const y = yOffset + Math.sin(x * frequency + phase) * (amplitude + extraAmp);
                ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }

        animateCanvas();
    }

    // ----------------------------------------------------------------------
    // 2. NAVBAR SCROLL EFFECT & MOBILE MENU
    // ----------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // ----------------------------------------------------------------------
    // 3. INTERSECTION OBSERVER FOR SCROLL REVEAL ANIMATIONS
    // ----------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // ----------------------------------------------------------------------
    // 4. 3D TILT EFFECT ON CARDS
    // ----------------------------------------------------------------------
    const tiltElements = document.querySelectorAll('.tilt-element');
    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 12;
            const rotateY = (centerX - x) / 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // ----------------------------------------------------------------------
    // 5. HYDRATION CALCULATOR LOGIC (DJANGO API)
    // ----------------------------------------------------------------------
    const weightInput = document.getElementById('weightInput');
    const weightDisplay = document.getElementById('weightDisplay');
    const activityGroup = document.getElementById('activityGroup');
    const climateGroup = document.getElementById('climateGroup');
    
    const resultLiters = document.getElementById('resultLiters');
    const resultGlasses = document.getElementById('resultGlasses');
    const resultReasonText = document.getElementById('resultReasonText');
    const addRecommendedBtn = document.getElementById('addRecommendedBtn');

    let currentActivity = 'medium';
    let currentClimate = 'normal';
    let lastRecommendedProduct = null;

    if (weightInput) {
        weightInput.addEventListener('input', (e) => {
            weightDisplay.textContent = `${e.target.value} kg`;
            fetchHydrationRecommendation();
        });

        if (activityGroup) {
            activityGroup.querySelectorAll('.btn-toggle').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    activityGroup.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    currentActivity = e.target.getAttribute('data-val');
                    fetchHydrationRecommendation();
                });
            });
        }

        if (climateGroup) {
            climateGroup.querySelectorAll('.btn-toggle').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    climateGroup.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    currentClimate = e.target.getAttribute('data-val');
                    fetchHydrationRecommendation();
                });
            });
        }
    }

    let debounceTimer = null;
    function fetchHydrationRecommendation() {
        clearTimeout(debounceTimer);
        const weight = weightInput.value;

        // Fast Client-Side Preview
        const baseLiters = (weight * 35 + (currentActivity === 'high' ? 1000 : currentActivity === 'medium' ? 500 : 0) + (currentClimate === 'hot' ? 800 : currentClimate === 'warm' ? 400 : 0)) / 1000;
        resultLiters.textContent = baseLiters.toFixed(2);
        resultGlasses.textContent = Math.ceil(baseLiters * 4);

        debounceTimer = setTimeout(() => {
            fetch(`/api/hydration-calc/?weight=${weight}&activity=${currentActivity}&climate=${currentClimate}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        resultLiters.textContent = data.daily_liters;
                        resultGlasses.textContent = data.glasses_count;
                        resultReasonText.textContent = data.recommendation_reason;
                        lastRecommendedProduct = data.recommended_product;
                    }
                })
                .catch(err => console.log('Hydration API Note:', err));
        }, 300);
    }

    if (addRecommendedBtn) {
        addRecommendedBtn.addEventListener('click', () => {
            if (lastRecommendedProduct) {
                addToCart({
                    id: lastRecommendedProduct.id || 1,
                    name: lastRecommendedProduct.name,
                    price: lastRecommendedProduct.price,
                    slug: lastRecommendedProduct.slug,
                    container: lastRecommendedProduct.container,
                    qty: 1
                });
                openCartDrawer();
            } else {
                // Fallback default item
                const firstCard = document.querySelector('.product-card');
                if (firstCard) {
                    addProductCardToCart(firstCard);
                    openCartDrawer();
                }
            }
        });
    }

    // ----------------------------------------------------------------------
    // 6. PRODUCT CATALOG FILTERING
    // ----------------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.opacity = '0';
                    card.style.display = 'none';
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // 7. CART SYSTEM STATE & DRAWER UI
    // ----------------------------------------------------------------------
    let cart = JSON.parse(localStorage.getItem('aquaaura_cart')) || [];
    let currentDiscount = 0;

    const cartTrigger = document.getElementById('cartTrigger');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartBadge = document.getElementById('cartBadge');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartDiscount = document.getElementById('cartDiscount');
    const discountRow = document.getElementById('discountRow');
    const cartTotal = document.getElementById('cartTotal');
    const promoInput = document.getElementById('promoInput');
    const promoBtn = document.getElementById('promoBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function openCartDrawer() {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
    }

    function closeCartDrawer() {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    if (cartTrigger) cartTrigger.addEventListener('click', openCartDrawer);
    if (cartClose) cartClose.addEventListener('click', closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

    // Add to Cart from Product Cards
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (card) {
                addProductCardToCart(card);
                openCartDrawer();
            }
        });
    });

    function addProductCardToCart(card) {
        const item = {
            id: card.getAttribute('data-id'),
            name: card.getAttribute('data-name'),
            price: parseFloat(card.getAttribute('data-price')),
            slug: card.getAttribute('data-slug'),
            qty: 1
        };
        addToCart(item);
    }

    function addToCart(item) {
        const existing = cart.find(i => i.id == item.id || i.slug == item.slug);
        if (existing) {
            existing.qty += item.qty || 1;
        } else {
            cart.push(item);
        }
        saveCart();
        renderCart();
    }

    function updateQty(id, delta) {
        const item = cart.find(i => i.id == id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id != id);
            }
            saveCart();
            renderCart();
        }
    }

    function saveCart() {
        localStorage.setItem('aquaaura_cart', JSON.stringify(cart));
    }

    function renderCart() {
        const totalCount = cart.reduce((sum, i) => sum + i.qty, 0);
        cartBadge.textContent = totalCount;

        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartItemsList.innerHTML = '';
            cartSubtotal.textContent = '$0';
            cartTotal.textContent = '$0';
            return;
        }

        cartEmpty.style.display = 'none';
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div style="flex: 1;">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${(item.price * item.qty).toLocaleString('es-CL')} CLP</div>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQtyDirect('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQtyDirect('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');

        const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const discountAmount = subtotal * currentDiscount;
        const total = subtotal - discountAmount;

        cartSubtotal.textContent = `$${subtotal.toLocaleString('es-CL')} CLP`;
        if (currentDiscount > 0) {
            discountRow.style.display = 'flex';
            cartDiscount.textContent = `-$${discountAmount.toLocaleString('es-CL')} CLP`;
        } else {
            discountRow.style.display = 'none';
        }
        cartTotal.textContent = `$${total.toLocaleString('es-CL')} CLP`;
    }

    window.updateQtyDirect = function(id, delta) {
        updateQty(id, delta);
    };

    if (promoBtn) {
        promoBtn.addEventListener('click', () => {
            const val = promoInput.value.trim().toUpperCase();
            if (val === 'MANANTIAL10' || val === 'AQUAAURA10') {
                currentDiscount = 0.10;
                alert('¡Código de 10% de descuento aplicado con éxito!');
            } else {
                alert('Código de descuento no válido.');
            }
            renderCart();
        });
    }

    renderCart();

    // ----------------------------------------------------------------------
    // 8. CHECKOUT MODAL & ORDER SUBMISSION (DJANGO BACKEND API)
    // ----------------------------------------------------------------------
    const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
    const checkoutClose = document.getElementById('checkoutClose');
    const orderForm = document.getElementById('orderForm');
    const checkoutTotalText = document.getElementById('checkoutTotalText');
    const orderSuccessView = document.getElementById('orderSuccessView');
    const closeSuccessModal = document.getElementById('closeSuccessModal');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Añade al menos un producto al carrito antes de proceder.');
                return;
            }
            closeCartDrawer();
            const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0) * (1 - currentDiscount);
            checkoutTotalText.textContent = `$${total.toLocaleString('es-CL')} CLP`;
            checkoutModalOverlay.classList.add('active');
            orderForm.style.display = 'block';
            orderSuccessView.style.display = 'none';
        });
    }

    if (checkoutClose) {
        checkoutClose.addEventListener('click', () => {
            checkoutModalOverlay.classList.remove('active');
        });
    }

    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitOrderBtn');
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Procesando con Django...';

            const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
            const total = subtotal * (1 - currentDiscount);

            const payload = {
                customer_name: document.getElementById('custName').value,
                customer_email: document.getElementById('custEmail').value,
                customer_phone: document.getElementById('custPhone').value,
                delivery_address: document.getElementById('custAddress').value,
                order_type: document.getElementById('orderType').value,
                items: cart,
                total_amount: total
            };

            fetch('/api/order/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Confirmar Pedido & Embotellar';

                if (data.success) {
                    orderForm.style.display = 'none';
                    orderSuccessView.style.display = 'block';

                    document.getElementById('successOrderNum').textContent = `#AQ-${data.order_number}`;
                    document.getElementById('successCustName').textContent = data.customer_name;
                    document.getElementById('successTotal').textContent = `$${data.total.toLocaleString('es-CL')} CLP`;

                    // Empty cart
                    cart = [];
                    saveCart();
                    renderCart();
                } else {
                    alert(data.error || 'Error al procesar el pedido.');
                }
            })
            .catch(err => {
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Confirmar Pedido & Embotellar';
                alert('No se pudo conectar con el servidor.');
            });
        });
    }

    if (closeSuccessModal) {
        closeSuccessModal.addEventListener('click', () => {
            checkoutModalOverlay.classList.remove('active');
        });
    }

    // ----------------------------------------------------------------------
    // 9. MINERAL PROFILE MODAL CHART
    // ----------------------------------------------------------------------
    const mineralModalOverlay = document.getElementById('mineralModalOverlay');
    const mineralModalClose = document.getElementById('mineralModalClose');
    const modalProductBadge = document.getElementById('modalProductBadge');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductTagline = document.getElementById('modalProductTagline');
    const modalPhVal = document.getElementById('modalPhVal');
    const modalPhMarker = document.getElementById('modalPhMarker');
    const modalBarsWrapper = document.getElementById('modalBarsWrapper');
    const modalProductDesc = document.getElementById('modalProductDesc');

    document.querySelectorAll('.view-mineral-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (card) {
                const name = card.getAttribute('data-name');
                const badge = card.getAttribute('data-badge') || 'Análisis Mineral';
                const ph = parseFloat(card.getAttribute('data-ph')) || 7.8;
                const ca = parseFloat(card.getAttribute('data-ca')) || 45;
                const mg = parseFloat(card.getAttribute('data-mg')) || 18;
                const k = parseFloat(card.getAttribute('data-k')) || 5;
                const silica = parseFloat(card.getAttribute('data-silica')) || 32;
                const tds = parseFloat(card.getAttribute('data-tds')) || 180;
                const desc = card.getAttribute('data-desc');

                modalProductName.textContent = name;
                modalProductBadge.textContent = badge;
                modalPhVal.textContent = ph;
                modalProductDesc.textContent = desc;

                // Scale pH marker (range 6.0 to 8.5)
                const phPercent = Math.min(100, Math.max(0, ((ph - 6.0) / 2.5) * 100));
                modalPhMarker.style.left = `${phPercent}%`;

                // Render mineral bars
                const minerals = [
                    { label: 'Calcio (Ca+)', val: ca, max: 70, unit: 'mg/L' },
                    { label: 'Magnesio (Mg+)', val: mg, max: 40, unit: 'mg/L' },
                    { label: 'Sílice (SiO2)', val: silica, max: 60, unit: 'mg/L' },
                    { label: 'Potasio (K+)', val: k, max: 15, unit: 'mg/L' },
                    { label: 'TDS (Residuo Seco)', val: tds, max: 300, unit: 'mg/L' }
                ];

                modalBarsWrapper.innerHTML = minerals.map(m => {
                    const pct = Math.min(100, (m.val / m.max) * 100);
                    return `
                        <div class="mineral-bar-item">
                            <div class="mineral-bar-header">
                                <span>${m.label}</span>
                                <span>${m.val} ${m.unit}</span>
                            </div>
                            <div class="mineral-bar-track">
                                <div class="mineral-bar-fill" style="width: ${pct}%;"></div>
                            </div>
                        </div>
                    `;
                }).join('');

                mineralModalOverlay.classList.add('active');
            }
        });
    });

    if (mineralModalClose) {
        mineralModalClose.addEventListener('click', () => {
            mineralModalOverlay.classList.remove('active');
        });
    }

    // ----------------------------------------------------------------------
    // 10. PLAN SELECTION & CONTACT FORM
    // ----------------------------------------------------------------------
    document.querySelectorAll('.select-plan-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const planName = btn.getAttribute('data-plan-name');
            const discount = parseFloat(btn.getAttribute('data-discount')) / 100;
            currentDiscount = discount;
            alert(`Has seleccionado la ${planName}. Se aplicará un ${btn.getAttribute('data-discount')}% de descuento en tu compra.`);
            openCartDrawer();
            renderCart();
        });
    });

    const contactForm = document.getElementById('contactForm');
    const contactAlert = document.getElementById('contactAlert');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('contactSubmitBtn');
            submitBtn.disabled = true;

            const payload = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value
            };

            fetch('/api/contact/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                submitBtn.disabled = false;
                if (data.success) {
                    contactAlert.className = 'form-alert success';
                    contactAlert.textContent = data.message;
                    contactAlert.style.display = 'block';
                    contactForm.reset();
                }
            })
            .catch(err => {
                submitBtn.disabled = false;
                alert('No se pudo enviar el mensaje.');
            });
        });
    }
});
