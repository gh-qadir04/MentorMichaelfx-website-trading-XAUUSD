document.addEventListener('DOMContentLoaded', function () {

// const preloader = document.getElementById('preloader');
    
//     if (preloader) {
//     window.addEventListener('load', function() {
//         // Wait 500ms so the user actually sees the loader
//         setTimeout(function() {
//             preloader.style.opacity = '0';
//             // Wait 1000ms (1s) for the fade transition to finish before hiding display
//             setTimeout(function() {
//                 preloader.style.display = 'none';
//             }, 3); 
//         }, 1);
//     });
// }


// ==================== MOBILE MENU ====================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ==================== NAVBAR SCROLL ====================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==================== ACTIVE NAV LINK ====================
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (sectionId && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNav);

// ==================== SCROLL TO TOP ====================
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
});

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==================== COUNTER ANIMATION ====================
const counters = document.querySelectorAll('.counter, .stat-number, .result-value');

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    if (isNaN(target)) return;
    
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ==================== SCROLL REVEAL ====================
const revealElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .service-card, .review-card, .pricing-card, .stat-box, .result-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// ==================== FAQ ACCORDION ====================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (question) {
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const answer = otherItem.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = null;
                }
            });

            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    }
});


// ==================== LIVE CHART FETCH ====================
// const goldPriceElement = document.getElementById('goldPrice');

// if (goldPriceElement) {
//     async function fetchGoldPrice() {
//         try {
//             // Replace 'YOUR_API_KEY' with a free key from a provider like metalpriceapi.com
//             const response = await fetch('https://api.metalpriceapi.com/v1/latest?api_key=YOUR_API_KEY&base=USD&currencies=XAU');
//             const data = await response.json();
            
//             if (data.rates && data.rates.XAU) {
//                 // Metal APIs usually return ounces per dollar, so we divide 1 by the rate
//                 const price = (1 / data.rates.XAU).toFixed(2);
//                 goldPriceElement.textContent = '$' + price.toLocaleString();
//             }
//         } catch (error) {
//             console.log('API fetch failed, using fallback price');
//             goldPriceElement.textContent = '$2,045.30'; // Fallback
//         }
//     }
    
//     fetchGoldPrice();
//     setInterval(fetchGoldPrice, 60000); // Updates every 60 seconds
// }

// ==================== LIVE GOLD SIGNAL GENERATOR ====================
async function updateLiveGoldSignal() {
    try {
        // We use PAXG (Paxos Gold) as it perfectly mirrors physical Gold (XAU/USD) 
        // 24/7 without requiring any paid API keys!
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT');
        const data = await response.json();
        
        if (data.price) {
            // Get the live price
            const currentPrice = parseFloat(data.price);
            
            // Calculate dynamic trading levels based on current price
            const entryPrice = currentPrice.toFixed(2);
            const stopLossPrice = (currentPrice - 10).toFixed(2); // $10 risk below entry
            const targetPrice = (currentPrice + 30).toFixed(2);   // $30 reward above entry (1:3 RR)
            
            // Update the HTML elements
            const entryEl = document.getElementById('live-entry');
            const slEl = document.getElementById('live-sl');
            const tpEl = document.getElementById('live-tp');
            
            if (entryEl) entryEl.textContent = entryPrice;
            if (slEl) slEl.textContent = stopLossPrice;
            if (tpEl) tpEl.textContent = targetPrice;
        }
    } catch (error) {
        console.error('Failed to fetch live gold price:', error);
        // Fallback static numbers just in case offline
        document.getElementById('live-entry').textContent = '2045.50';
        document.getElementById('live-sl').textContent = '2035.00';
        document.getElementById('live-tp').textContent = '2065.00';
    }
}

// Run immediately when page loads
updateLiveGoldSignal();
// Update automatically every 5 seconds
setInterval(updateLiveGoldSignal, 3000);


// ==================== MOBILE MENU CLOSE ON RESIZE ====================
window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('active');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
});

// ==================== TESTIMONIALS AUTO SLIDE ====================
const reviewsTrack = document.querySelector('.reviews-track');

if (reviewsTrack) {
    const reviews = reviewsTrack.querySelectorAll('.review-card');
    reviews.forEach(review => {
        const clone = review.cloneNode(true);
        reviewsTrack.appendChild(clone);
    });
}

// ==================== YEAR UPDATE ====================
const yearElements = document.querySelectorAll('.year');
yearElements.forEach(el => {
    el.textContent = new Date().getFullYear();
});

console.log("Mentor Michael - Website Loaded Successfully");   });
// Social Proof Notifications
const names = ['Alex from UK', 'Sarah from Canada', 'David from Australia', 'Elena from Spain', 'James from USA'];
const actions = ['just joined VIP Signals', 'just hit a Take Profit', 'upgraded to Gold Plan'];

function showToast() {
    const toast = document.getElementById('toast-notification');
    const nameEl = document.getElementById('toast-name');
    
    if(toast && nameEl) {
        // Pick random name and action
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        nameEl.innerHTML = `${randomName} <br><span style="font-weight:normal; color: var(--text-muted);">${randomAction}</span>`;
        
        // Slide in
        toast.style.left = '20px';
        toast.style.opacity = '1';
        
        // Slide out after 4 seconds
        setTimeout(() => {
            toast.style.left = '-300px';
            toast.style.opacity = '0';
        }, 4000);
    }
}
// Run every 15 seconds
setInterval(showToast, 12000);


// ==================== INTERACTIVE PROFIT CALCULATOR ====================
const capitalSlider = document.getElementById('capital-slider');
const capitalDisplay = document.getElementById('capital-display');
const profitDisplay = document.getElementById('profit-display');
const yearDisplay = document.getElementById('year-display');

if (capitalSlider && capitalDisplay && profitDisplay && yearDisplay) {
    function updateCalculator() {
        const capital = parseInt(capitalSlider.value);
        
        // Currency Formatter
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });

        // 1. Update Starting Capital display
        capitalDisplay.textContent = formatter.format(capital);

        // 2. Calculate Monthly Profit (Conservative 20% average)
        const monthlyProfit = capital * 0.20;
        profitDisplay.textContent = '+' + formatter.format(monthlyProfit);

        // 3. Calculate 1 Year Projected Balance (Compounding at 20% per month)
        // Formula: P * (1 + r)^t
        const yearlyBalance = capital * Math.pow(1.20, 12);
        yearDisplay.textContent = formatter.format(yearlyBalance);
    }

    // Run on input change
    capitalSlider.addEventListener('input', updateCalculator);
    
    // Run once on page load to set initial values
    updateCalculator();
}


// ==================== TRADINGVIEW ECONOMIC CALENDAR ====================
// document.addEventListener('DOMContentLoaded', function() {
//     const calendarContainer = document.getElementById('tv-calendar-container');
    
//     if (calendarContainer) {
//         // Create the script element
//         const tvScript = document.createElement('script');
//         tvScript.type = 'text/javascript';
//         tvScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
//         tvScript.async = true;
        
//         // Add the configuration JSON inside the script tag
//         tvScript.innerHTML = JSON.stringify({
//             "colorTheme": "dark",
//             "isTransparent": true,
            
//             "width": "100%",
//             "height": "400",
//             "locale": "en",
//             "importanceFilter": "-1,0,1",
//             "currencyFilter": "USD,EUR,GBP,JPY,AUD,CAD,CHF,NZD"
//         });
        
//         // Inject the script into the container
//         calendarContainer.appendChild(tvScript);
//     }
// });



// ==================== LOAD ECONOMIC CALENDAR (FIXED) ====================
    document.addEventListener('DOMContentLoaded', function() {
    const calendarContainer = document.getElementById('tv-calendar-container');
    
    if (calendarContainer) {
        // Create the script element
        const tvScript = document.createElement('script');
        tvScript.type = 'text/javascript';
        tvScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
        tvScript.async = true;
        
        // Add the configuration JSON inside the script tag
        tvScript.innerHTML = JSON.stringify({
            "colorTheme": "dark",
            "isTransparent": true,
            
            "width": "100%",
            "height": "500",
            "locale": "en",
            "importanceFilter": "-1,0,1",
            "currencyFilter": "USD,EUR,GBP,JPY,AUD,CAD,CHF,NZD"
        });
        
        // Inject the script into the container
        calendarContainer.appendChild(tvScript);
    }
});

//     console.log("Mentor Michael - Website Loaded Successfully");

// });

// ==================== HORIZONTAL DRAG TO SCROLL (RESULTS PAGE) ====================
const sliders = document.querySelectorAll('.performance-cards-wrapper');
let isDown = false;
let startX;
let scrollLeft;

sliders.forEach(slider => {
    // Make the cursor look like a grab hand on desktop
    slider.style.cursor = 'grab';

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Multiply by 2 to make scrolling faster
        slider.scrollLeft = scrollLeft - walk;
    });
});

// ==================== "SHOW MORE" BUTTONS ====================
const perfButtons = document.querySelectorAll('.perf-btn');
perfButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Automatically redirects the user to your VIP Telegram when they try to see more details!
        window.open('https://t.me/+z7y8oqqYs9ZhNjBk', '_blank');
    });
});


// ==================== CONTACT FORM ====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevents the page from reloading

        const formSuccess = document.querySelector('.form-success');
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Change button to show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Send data to your email via FormSubmit API
        fetch("https://formsubmit.co/ajax/mentormichael03@gmail.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                Name: name,
                Email: email,
                Subject: subject,
                Message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            // Show success message
            if (formSuccess) {
                formSuccess.classList.add('show');
            }
            contactForm.reset(); // Clear the form
            
            // Restore button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            // Hide success message after 5 seconds
            setTimeout(() => {
                if (formSuccess) {
                    formSuccess.classList.remove('show');
                }
            }, 5000);
        })
        .catch(error => {
            console.log(error);
            alert("Oops! Something went wrong. Please try again.");
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
    });

    // Real-time validation styling
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function () {
            if (this.value.trim() === '') {
                this.style.borderColor = 'var(--accent-red)';
            } else {
                this.style.borderColor = 'var(--border-color)';
            }
        });
        
        input.addEventListener('input', function () {
            this.style.borderColor = 'var(--border-color)';
        });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Update active button styling
            filterButtons.forEach(button => {
                button.style.background = 'transparent';
                button.style.color = 'var(--text-primary)';
                button.style.border = '1px solid var(--border-color)';
            });
            btn.style.background = 'var(--accent-primary)';
            btn.style.color = 'white';
            btn.style.border = 'none';

            // 2. Filter the cards
            const filterValue = btn.getAttribute('data-filter');

            blogCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    // Re-trigger animation
                    card.classList.add('visible');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
