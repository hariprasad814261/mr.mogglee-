// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                block: ['Anton', 'sans-serif'],
                script: ['"Dancing Script"', 'cursive'],
                western: ['Rye', 'serif'],
            },
            colors: {
                brand: {
                    50: '#fff4eb',
                    100: '#ffe5cc',
                    200: '#ffc999',
                    300: '#ffa766',
                    400: '#ff8633',
                    500: '#ff6600', /* Core orange */
                    600: '#e65c00',
                    700: '#cc5200',
                    800: '#993d00',
                    900: '#662900',
                },
                surface: {
                    900: '#0a0a0a',
                    800: '#141414',
                    700: '#1f1f1f',
                    600: '#2a2a2a'
                }
            },
            boxShadow: {
                'brand-glow': '0 0 20px rgba(255, 102, 0, 0.4)',
                'dark-elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.8)',
            },
            letterSpacing: {
                wider: '0.05em',
            }
        }
    }
}

// Flying Fire Sparks Particle System
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fireSparksCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const colors = ['#ffcc00', '#ff6600', '#ff3300', '#ff1100']; // Fire spectrum

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + Math.random() * 50;
            this.size = Math.random() * 2.5 + 1; // Small embers
            this.speedY = -(Math.random() * 2 + 0.5); // Rise up
            this.speedX = (Math.random() - 0.5) * 1; // Drift sideways
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = initial ? Math.random() * 0.8 : 0;
            this.maxOpacity = Math.random() * 0.6 + 0.4;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.05 + 0.01;
        }

        update() {
            this.y += this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 0.8 + this.speedX; // Smooth floating motion
            
            // Fade in at the bottom, fade out at the top
            if (this.opacity < this.maxOpacity && this.y > height * 0.2) {
                this.opacity += 0.01;
            } else if (this.y < height * 0.4) {
                this.opacity -= 0.015;
            }
            
            // Reset if out of bounds or invisible
            if (this.y < -10 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.shadowBlur = this.size * 2;
            ctx.shadowColor = this.color;
            ctx.fill();
            
            // Reset alpha and shadow for next drawing
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }
    }

    // Initialize 80 particles
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
});

// Delivery Modal System
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create and inject the modal HTML
    const modalHTML = `
    <div id="orderModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300">
        <div id="orderModalContent" class="bg-[#111111] border-2 border-brand-500 rounded-xl p-8 max-w-sm w-full mx-4 shadow-[0_0_30px_rgba(255,102,0,0.3)] transform scale-95 transition-transform duration-300 flex flex-col items-center text-center relative">
            <h3 id="modalTitle" class="font-block text-white text-3xl tracking-wider mb-6 uppercase">Select Branch</h3>
            
            <!-- Branch Selection -->
            <div id="branchSelection" class="w-full flex flex-col gap-4">
                <button class="branch-btn w-full bg-surface-800 text-white font-block tracking-widest text-xl px-6 py-4 rounded hover:bg-brand-500 transition-colors uppercase shadow-lg" data-branch="iyyappanthangal">
                    Iyyappanthangal
                </button>
                <button class="branch-btn w-full bg-surface-800 text-white font-block tracking-widest text-xl px-6 py-4 rounded hover:bg-brand-500 transition-colors uppercase shadow-lg" data-branch="kumananchavadi">
                    Kumananchavadi
                </button>
                <button class="branch-btn w-full bg-surface-800 text-white font-block tracking-widest text-xl px-6 py-4 rounded hover:bg-brand-500 transition-colors uppercase shadow-lg" data-branch="chandapura">
                    Chandapura
                </button>
            </div>

            <!-- Delivery Options (Hidden initially) -->
            <div id="deliveryOptions" class="w-full hidden flex-col">
                <a id="zomatoLink" href="#" target="_blank" class="w-full bg-[#e23744] text-white font-block tracking-widest text-xl px-6 py-4 rounded mb-4 hover:bg-[#c92e3a] transition-colors uppercase flex items-center justify-center shadow-lg">
                    Zomato
                </a>
                
                <a id="swiggyLink" href="#" target="_blank" class="w-full bg-[#fc8019] text-white font-block tracking-widest text-xl px-6 py-4 rounded mb-6 hover:bg-[#e06d10] transition-colors uppercase flex items-center justify-center shadow-lg">
                    Swiggy
                </a>
                
                <button id="backToBranches" class="text-gray-400 hover:text-white font-sans text-sm underline transition-colors cursor-pointer mb-2">
                    &larr; Back to Branches
                </button>
            </div>
            
            <button id="closeOrderModal" class="text-gray-400 hover:text-white font-sans text-sm underline transition-colors cursor-pointer mt-4">
                Cancel
            </button>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('orderModal');
    const modalContent = document.getElementById('orderModalContent');
    const closeBtn = document.getElementById('closeOrderModal');
    const branchSelection = document.getElementById('branchSelection');
    const deliveryOptions = document.getElementById('deliveryOptions');
    const modalTitle = document.getElementById('modalTitle');
    const backToBranches = document.getElementById('backToBranches');
    
    const zomatoLink = document.getElementById('zomatoLink');
    const swiggyLink = document.getElementById('swiggyLink');

    const branchLinks = {
        iyyappanthangal: {
            zomato: "https://www.zomato.com/chennai/moglees-kitchen-porur",
            swiggy: "https://www.swiggy.com/city/chennai/moglees-kitchen-vanniyar-mettu-stree-iyyapanthangal-rest443670"
        },
        kumananchavadi: {
            zomato: "https://www.zomato.com/chennai/mr-moglee-poonamalle",
            swiggy: "https://www.swiggy.com/city/chennai/mr-moglee-poonamallee-rest1309427"
        },
        chandapura: {
            zomato: "#",
            swiggy: "#"
        }
    };

    // Handle branch selection
    const branchBtns = document.querySelectorAll('.branch-btn');
    branchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const branch = btn.getAttribute('data-branch');
            const links = branchLinks[branch];
            zomatoLink.href = links.zomato;
            swiggyLink.href = links.swiggy;
            
            modalTitle.textContent = "Order Delivery";
            branchSelection.classList.add('hidden');
            deliveryOptions.classList.remove('hidden');
            deliveryOptions.classList.add('flex');
        });
    });

    backToBranches.addEventListener('click', () => {
        modalTitle.textContent = "Select Branch";
        branchSelection.classList.remove('hidden');
        deliveryOptions.classList.add('hidden');
        deliveryOptions.classList.remove('flex');
    });

    // Function to open modal
    function openModal(e) {
        if(e) e.preventDefault();
        // Reset to initial state
        modalTitle.textContent = "Select Branch";
        branchSelection.classList.remove('hidden');
        deliveryOptions.classList.add('hidden');
        deliveryOptions.classList.remove('flex');

        modal.classList.remove('opacity-0', 'pointer-events-none');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }
    
    // Function to close modal
    function closeModal() {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-95');
    }
    
    // 2. Attach click events to all "Order" buttons
    const orderButtons = document.querySelectorAll('a[href*="#order"], button');
    orderButtons.forEach(btn => {
        const text = (btn.textContent || '').toLowerCase();
        const href = btn.getAttribute('href') || '';
        if (href.includes('#order') || text.includes('order now') || text.includes('order online') || text.includes('branches')) {
            btn.addEventListener('click', openModal);
        }
    });
    
    // 3. Close events
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});

// Mobile Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
    }
});

// Location Tabs Logic
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.location-tab');
    if (tabs.length === 0) return;

    const mapIframe = document.getElementById('location-map');
    const locationAddress = document.getElementById('location-address');
    const locationDirectionsBtn = document.getElementById('location-directions-btn');

    const locations = [
        {
            name: "Iyyappanthangal",
            mapSrc: "https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Moglee's%20kitchen,%2027,%20Vanniyar%20Mettu%20St,%20Ramachandra%20Nagar,%20Iyyappanthangal,%20Chennai+(Moglee's%20Kitchen)&t=&z=15&ie=UTF8&iwloc=B&output=embed",
            addressLines: [
                '<span class="text-white font-bold">Moglee\'s Kitchen, 27, Vanniyar Mettu St</span>',
                '<span>Ramachandra Nagar, Iyyappanthangal</span>',
                '<span>Chennai, Tamil Nadu 600056</span>'
            ],
            directionsUrl: "https://www.google.com/maps/dir/Kattupakkam,+Chennai,+Tamil+Nadu/Moglee's+kitchen,+27,+Vanniyar+Mettu+St,+Ramachandra+Nagar,+Iyyappanthangal,+Chennai,+Ayyappanthangal,+Tamil+Nadu+600056/@13.0397049,80.1245739,16z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x3a5261ba19a176f1:0x1e5ce1e2c0ff67e4!2m2!1d80.1267136!2d13.0413894!1m5!1m1!1s0x3a526194f2bddfc1:0xfa052397f8c22491!2m2!1d80.135326!2d13.0368422?entry=ttu&g_ep=EgoyMDI2MDcwNy4wIKXMDSoASAFQAw%3D%3D"
        },
        {
            name: "Kumananchavadi",
            mapSrc: "https://maps.google.com/maps?width=100%25&height=600&hl=en&q=13.0441103,80.1156596+(MR.Moglee)&t=&z=15&ie=UTF8&iwloc=B&output=embed",
            addressLines: [
                '<span class="text-white font-bold">MR. Moglee, Kumananchavadi</span>',
                '<span>1/B, Ground Floor, Murugapillai St</span>',
                '<span>Chennai, Tamil Nadu 600056</span>'
            ],
            directionsUrl: "https://www.google.com/maps/place/MR.Moglee/@13.0427306,80.1215175,15z/data=!4m6!3m5!1s0x3a5261002abf8c8b:0x51187f3f32b73b39!8m2!3d13.0441103!4d80.1156596!16s%2Fg%2F11mm036twr?entry=ttu&g_ep=EgoyMDI2MDcxNC4wIKXMDSoASAFQAw%3D%3D"
        },
        {
            name: "Chandapura",
            mapSrc: "https://maps.google.com/maps?width=100%25&height=600&hl=en&q=12.796507835388184,77.70680236816406+(MR.Moglee)&t=&z=17&ie=UTF8&iwloc=B&output=embed",
            addressLines: [
                '<span class="text-white font-bold">MR. Moglee, Chandapura</span>',
                '<span>Near optical express, Anekal main road</span>',
                '<span>Chandapura Bangalore-560081</span>'
            ],
            directionsUrl: "https://www.google.com/maps?q=12.796507835388184,77.70680236816406&z=17&hl=en"
        }
    ];

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state of tabs
            tabs.forEach(t => {
                t.classList.remove('bg-[#d31111]', 'text-white');
                t.classList.add('bg-surface-800', 'text-gray-400');
            });
            tab.classList.remove('bg-surface-800', 'text-gray-400');
            tab.classList.add('bg-[#d31111]', 'text-white');

            // Get selected location data
            const index = parseInt(tab.getAttribute('data-index'));
            const loc = locations[index];

            // Update DOM
            mapIframe.src = loc.mapSrc;
            locationAddress.innerHTML = loc.addressLines.join('');
            locationDirectionsBtn.href = loc.directionsUrl;
        });
    });
});
