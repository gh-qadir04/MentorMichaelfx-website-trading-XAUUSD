/* ==========================================================================
   Project: Mentor Michael - Professional Forex & Gold Trading Signals
   Version: 4.0.0 (Ultimate Enterprise Edition)
   File: scripts.js
   Description: Unified logic for navigation, live market data, calculators, 
                TradingView integrations, blog filtering, and UI/UX animations.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    
    console.log("%c Mentor Michael %c System Online & Optimized ", "color: white; background: #8b5cf6; padding: 5px; border-radius: 5px 0 0 5px;", "color: white; background: #1a1a2e; padding: 5px; border-radius: 0 5px 5px 0;");

    /* ---------------------------------------------------------
       1. PRELOADER CLEANUP
       --------------------------------------------------------- */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.style.opacity = '0';
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 1000); 
            }, 500);
        });
    }

    /* ---------------------------------------------------------
       2. NAVIGATION & MOBILE MENU
       --------------------------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTop');

    // Mobile Menu Toggle
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

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Navbar Scroll Effect & Scroll To Top
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) navbar?.classList.add('scrolled');
        else navbar?.classList.remove('scrolled');

        if (window.scrollY > 500) scrollTopBtn?.classList.add('active');
        else scrollTopBtn?.classList.remove('active');
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Active Section Highlighting
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

    /* ---------------------------------------------------------
       3. LIVE MARKET DATA (BINANCE API)
       --------------------------------------------------------- */
   /* ---------------------------------------------------------
       3. LIVE MARKET DATA (COINBASE API - Bypasses Geo-blocks)
       --------------------------------------------------------- */
    async function updateLiveGoldSignal() {
        try {
            // PAXG mirrors Gold (XAU/USD). Using Coinbase to prevent Binance 451 Geographic Errors.
            const response = await fetch('https://api.coinbase.com/v2/prices/PAXG-USD/spot');
            if (!response.ok) throw new Error("API Fetch Failed");
            const json = await response.json();
            
            if (json.data && json.data.amount) {
                const currentPrice = parseFloat(json.data.amount);
                const elements = {
                    'live-entry': currentPrice.toFixed(2),
                    'live-sl': (currentPrice - 10.50).toFixed(2),
                    'live-tp': (currentPrice + 31.50).toFixed(2)
                };

                for (const [id, value] of Object.entries(elements)) {
                    const el = document.getElementById(id);
                    if (el) {
                        el.textContent = value;
                        // Brief highlight to show live data update
                        el.style.color = '#10b981'; 
                        setTimeout(() => el.style.color = '', 600);
                    }
                }
            }
        } catch (error) {
            console.error('Live Feed Error:', error);
            const entryEl = document.getElementById('live-entry');
            if(entryEl && entryEl.textContent === "Loading...") {
                entryEl.textContent = "Data Unavailable";
            }
        }
    }

    updateLiveGoldSignal();
    setInterval(updateLiveGoldSignal, 8000); // 8 seconds is perfectly safe for Coinbase

    /* ---------------------------------------------------------
   4. ROBUST TRADINGVIEW INJECTION (Error Proofing)
   --------------------------------------------------------- */
const initTradingViewWidgets = () => {
    const chartContainer = document.getElementById('tradingview_gold_pro');
    const calContainer = document.getElementById('tv-calendar-container');

    // 1. Chart Injection Logic
    // 1. Chart Injection Logic
    if (chartContainer && !chartContainer.hasAttribute('data-loaded')) {
        if (typeof TradingView !== 'undefined') {
            chartContainer.innerHTML = ""; // Clear the loading text
            new TradingView.widget({
                "autosize": true,
                "symbol": "OANDA:XAUUSD",
                "interval": "5",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "container_id": "tradingview_gold_pro"
            });
            chartContainer.setAttribute('data-loaded', 'true'); // Mark as done
        } else {
            // Automatically inject the TV script if it's missing
            if (!document.getElementById('tv-script-main')) {
                const tvScript = document.createElement('script');
                tvScript.id = 'tv-script-main';
                tvScript.src = 'https://s3.tradingview.com/tv.js';
                document.head.appendChild(tvScript);
            }
            
            // Show loading message while script downloads
            if (chartContainer.innerHTML.trim() === "") {
                chartContainer.innerHTML = `
                    <div style="color:var(--text-muted); text-align:center; padding-top:100px;">
                        <i class="fas fa-chart-line" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                        <br>Market Chart loading...<br>
                        <span style="font-size: 12px;">(If it doesn't load, please disable your ad-blocker)</span>
                    </div>`;
            }
            // Check again in 2 seconds
            setTimeout(initTradingViewWidgets, 2000);
        }
    }
    // 2. Calendar Injection Logic
    const calWidgetContainer = calContainer ? calContainer.querySelector('.tradingview-widget-container__widget') : null;

    if (calWidgetContainer && calWidgetContainer.innerHTML.trim() === "") {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "colorTheme": "dark",
            "isTransparent": true,
            "width": "100%",
            "height": "400",
            "locale": "en",
            "importanceFilter": "0,1", 
            "currencyFilter": "USD,EUR,GBP"
        });
        calWidgetContainer.appendChild(script);
    }
}; // <--- THIS WAS THE MISSING BRACKET!

window.addEventListener('load', initTradingViewWidgets);
    /* ---------------------------------------------------------
       5. INTERACTIVE PROFIT CALCULATOR
       --------------------------------------------------------- */
    const capitalSlider = document.getElementById('capital-slider');
    const capitalDisplay = document.getElementById('capital-display');
    const profitDisplay = document.getElementById('profit-display');
    const yearDisplay = document.getElementById('year-display');

    if (capitalSlider && capitalDisplay && profitDisplay && yearDisplay) {
        function updateCalculator() {
            const capital = parseInt(capitalSlider.value);
            
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
            const yearlyBalance = capital * Math.pow(1.20, 12);
            yearDisplay.textContent = formatter.format(yearlyBalance);
        }

        capitalSlider.addEventListener('input', updateCalculator);
        updateCalculator();
    }

    /* ---------------------------------------------------------
       6. SCROLL REVEAL & COUNTER ANIMATIONS
       --------------------------------------------------------- */
    // Counter Animation
    const counters = document.querySelectorAll('.counter, .stat-number, .result-value');
    const animateCounter = (element) => {
        const targetAttr = element.getAttribute('data-target');
        if (!targetAttr) return;
        const target = parseInt(targetAttr.replace(/[^0-9]/g, ''));
        if (isNaN(target)) return;
        
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                // Keep original formatting (+ or %)
                element.textContent = targetAttr;
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

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .service-card, .review-card, .pricing-card, .stat-box, .result-card, .blog-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    /* ---------------------------------------------------------
       7. UI COMPONENTS (FAQ, Sliders, Blog Filter)
       --------------------------------------------------------- */
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const answer = otherItem.querySelector('.faq-answer');
                    if (answer) answer.style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // Infinite Testimonial Cloning
    const reviewsTrack = document.querySelector('.reviews-track');
    if (reviewsTrack) {
        const reviews = reviewsTrack.querySelectorAll('.review-card');
        reviews.forEach(review => {
            const clone = review.cloneNode(true);
            reviewsTrack.appendChild(clone);
        });
    }

    // Horizontal Drag to Scroll (Results/Perf)
    const sliders = document.querySelectorAll('.performance-cards-wrapper, .horizontal-scroll-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    sliders.forEach(slider => {
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
            const walk = (x - startX) * 2; 
            slider.scrollLeft = scrollLeft - walk;
        });
    });

    // Show More Telegram Redirect Buttons
    const perfButtons = document.querySelectorAll('.perf-btn');
    perfButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://t.me/+z7y8oqqYs9ZhNjBk', '_blank');
        });
    });

    // Blog Category Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    if (filterButtons.length > 0 && blogCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active styling
                filterButtons.forEach(button => {
                    button.style.background = 'transparent';
                    button.style.color = 'var(--text-primary)';
                    button.style.border = '1px solid var(--border-color)';
                });
                btn.style.background = 'var(--accent-primary)';
                btn.style.color = 'white';
                btn.style.border = 'none';

                // Filter cards
                const filterValue = btn.getAttribute('data-filter');
                blogCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        // Small timeout to allow display:flex to apply before adding visibility
                        setTimeout(() => card.classList.add('visible'), 50);
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('visible');
                    }
                });
            });
        });
    }

    /* ---------------------------------------------------------
       8. CONTACT FORM HANDLING
       --------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); 
            const formSuccess = document.querySelector('.form-success');
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            const formData = {
                Name: document.getElementById('name')?.value || "N/A",
                Email: document.getElementById('email')?.value || "N/A",
                Subject: document.getElementById('subject')?.value || "N/A",
                Message: document.getElementById('message')?.value || "N/A"
            };

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            fetch("https://formsubmit.co/ajax/mentormichael03@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (formSuccess) formSuccess.classList.add('show');
                contactForm.reset(); 
                
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;

                setTimeout(() => {
                    if (formSuccess) formSuccess.classList.remove('show');
                }, 5000);
            })
            .catch(error => {
                console.error("Form Error:", error);
                alert("Oops! Something went wrong. Please reach out via Telegram.");
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

    /* ---------------------------------------------------------
       9. ADVANCED FEATURE: DYNAMIC MARKET STATUS
       --------------------------------------------------------- */
    const checkMarketStatus = () => {
        const statusEl = document.getElementById('market-status');
        if (!statusEl) return;

        const now = new Date();
        const day = now.getUTCDay();
        const isWeekend = (day === 6 || day === 0); 
        
        if (isWeekend) {
            statusEl.innerHTML = '<i class="fas fa-clock" style="color:var(--accent-red)"></i> Market Closed';
            statusEl.style.color = "var(--accent-red)";
        } else {
            statusEl.innerHTML = '<i class="fas fa-circle" style="color:var(--accent-green); animation: pulse 2s infinite;"></i> Market Open';
            statusEl.style.color = "var(--accent-green)";
        }
    };
    checkMarketStatus();
    setInterval(checkMarketStatus, 60000); // Check every minute

    /* ---------------------------------------------------------
       10. ADVANCED FEATURE: SIMULATED LIVE JOURNAL
       --------------------------------------------------------- */
    const updateLiveJournal = () => {
        const journalContainer = document.querySelector('.feed-scroll-wrapper');
        if (!journalContainer) return;

        const journalEntries = [
            { pair: "XAU/USD", result: "Win", pips: "+85" },
            { pair: "GBP/JPY", result: "Win", pips: "+45" },
            { pair: "EUR/USD", result: "Win", pips: "+30" },
            { pair: "BTC/USD", result: "Win", pips: "+150" }
        ];

        const entry = journalEntries[Math.floor(Math.random() * journalEntries.length)];
        const div = document.createElement('div');
        div.className = 'feed-item';
        div.style.opacity = '0';
        div.style.transform = 'translateY(15px)';
        div.innerHTML = `
            <span class="time">[Just Now]</span> 
            <span class="trd" style="color: var(--accent-secondary);">TRD:</span> 
            <span class="msg highlight">${entry.pair} ${entry.result} (${entry.pips} pips)</span>
        `;
        
        journalContainer.prepend(div);
        
        setTimeout(() => {
            div.style.transition = 'all 0.5s ease';
            div.style.opacity = '1';
            div.style.transform = 'translateY(0)';
        }, 50);

        if (journalContainer.children.length > 8) {
            journalContainer.lastElementChild.remove();
        }
    };
    setInterval(updateLiveJournal, 45000); // Update every 45s

    /* ---------------------------------------------------------
       11. AUTO YEAR UPDATE
       --------------------------------------------------------- */
    document.querySelectorAll('.year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

}); // End DOMContentLoaded

/* ==========================================================================
   12. GLOBAL TOAST NOTIFICATIONS (Runs Independent of DOM Load)
   ========================================================================== */
const names = ['Alex from UK', 'Sarah from Canada', 'David from Australia', 'Elena from Spain', 'James from USA', 'Yuki from Japan', 'Omar from UAE'];
const actions = ['just joined VIP Signals', 'just hit a Take Profit', 'upgraded to Gold Plan', 'withdrew $1,200 profits'];

function showToast() {
    const toast = document.getElementById('toast-notification');
    const nameEl = document.getElementById('toast-name');
    
    if(toast && nameEl) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        nameEl.innerHTML = `${randomName} <br><span style="font-weight:normal; color: var(--text-muted);">${randomAction}</span>`;
        
        toast.style.left = '20px';
        toast.style.opacity = '1';
        
        setTimeout(() => {
            toast.style.left = '-350px';
            toast.style.opacity = '0';
        }, 5000); // Show for 5 seconds
    }
}
// Delay first notification, then loop every 18 seconds
setTimeout(() => {
    showToast();
    setInterval(showToast, 18000); 
}, 5000);

/* ==========================================================================
   End of scripts.js 
   ========================================================================== */