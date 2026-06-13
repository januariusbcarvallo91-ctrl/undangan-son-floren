
        // Firebase Configuration (Replace with your actual keys from Firebase Console)
        const firebaseConfig = {
            apiKey: "AIzaSyABGbatlyHjGDe8UddPCTNvMnYCWkLTZEA",
            authDomain: "wedding-invitation-arto-ovin.firebaseapp.com",
            projectId: "wedding-invitation-arto-ovin",
            storageBucket: "wedding-invitation-arto-ovin.firebasestorage.app",
            messagingSenderId: "745858757433",
            appId: "1:745858757433:web:5eadc2b99cc0fcb33caee8",
            measurementId: "G-YJNLMSGX21"
        };

        // Initialize Firebase if credentials are provided
        let db;
        try {
            if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
                firebase.initializeApp(firebaseConfig);
                db = firebase.firestore();
            } else {
                console.warn("Firebase config has placeholders. App is running in demo/offline mode.");
            }
        } catch (e) {
            console.error("Failed to initialize Firebase:", e);
        }

        // Get unique wedding ID based on URL subdomain or query param
        function getWeddingId() {
            const urlParams = new URLSearchParams(window.location.search);
            const queryId = urlParams.get('wedding');
            if (queryId) return queryId;

            const hostname = window.location.hostname;
            const parts = hostname.split('.');
            if (parts.length <= 1 || hostname === 'localhost' || hostname === '127.0.0.1') {
                return 'default-wedding'; // Fallback ID for testing
            }
            return parts[0]; // First subdomain part (e.g. romeo-juliet)
        }

        const weddingId = getWeddingId();

        // Slideshow Logic
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        setInterval(nextSlide, 5000); // Change slide every 5 seconds

        // Scroll to specific section smoothly
        function scrollToSection(id) {
            document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
        }

        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }

        window.addEventListener('DOMContentLoaded', () => {
            // Disable default browser scroll restoration on refresh
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
            window.scrollTo(0, 0);

            const guest = getQueryParam('to');
            const guestElement = document.getElementById('guest-name');
            if (guest) {
                guestElement.innerText = decodeURIComponent(guest.replace(/[\+_]/g, ' '));
            } else {
                guestElement.innerText = "Tamu Undangan Terhormat";
            }
            
            // Load wishes from the server
            loadWishes();
        });

        // 2. OPEN INVITATION FLOW (Removes Cover, Plays Music, Re-enables Scrolling)
        function openInvitation() {
            const cover = document.getElementById('cover');
            const audioToggle = document.getElementById('audio-toggle');
            const bgm = document.getElementById('bgm');

            // Trigger Fullscreen Mode
            try {
                const docEl = document.documentElement;
                if (docEl.requestFullscreen) {
                    docEl.requestFullscreen();
                } else if (docEl.mozRequestFullScreen) { // Firefox
                    docEl.mozRequestFullScreen();
                } else if (docEl.webkitRequestFullscreen) { // Chrome, Safari, Opera
                    docEl.webkitRequestFullscreen();
                } else if (docEl.msRequestFullscreen) { // IE/Edge
                    docEl.msRequestFullscreen();
                }
            } catch (err) {
                console.warn("Fullscreen request was blocked or not supported:", err);
            }

            // Fade and move cover up out of viewport
            cover.style.opacity = '0';
            
            // Allow user to scroll content
            document.body.classList.remove('no-scroll');
            
            // Show floating audio control
            audioToggle.style.opacity = '1';
            audioToggle.style.pointerEvents = 'auto';

            // Set background music start time to 4 seconds
            try {
                bgm.currentTime = 4;
            } catch (e) {
                console.warn("Could not set audio currentTime immediately:", e);
                bgm.addEventListener('loadedmetadata', () => {
                    bgm.currentTime = 4;
                }, { once: true });
            }

            // Attempt to autoplay audio safely
            bgm.play().catch(error => {
                console.log("Autoplay blocked or audio loading failed:", error);
            });
            
            // Instantly ensure page is scrolled to top and hide cover
            setTimeout(() => {
                window.scrollTo(0, 0);
                cover.classList.add('hidden'); // Fully remove after transition

                // Initialize Intersection Observer for Scroll Reveals after cover is hidden and page layout is stable
                const revealElements = document.querySelectorAll('.reveal, .reveal-cascade, .reveal-left, .reveal-right, .reveal-image');
                const revealObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('revealed');
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.08,
                    rootMargin: "0px 0px -40px 0px"
                });
                revealElements.forEach(el => revealObserver.observe(el));
            }, 1000);
        }

        // 3. BACKGROUND MUSIC TOGGLE INTERACTION
        function toggleAudio() {
            const bgm = document.getElementById('bgm');
            const icon = document.getElementById('audio-toggle');

            if (bgm.paused) {
                bgm.play();
                icon.innerText = 'music_note';
                icon.classList.remove('text-gray-400');
                icon.classList.add('text-primary');
            } else {
                bgm.pause();
                icon.innerText = 'music_off';
                icon.classList.remove('text-primary');
                icon.classList.add('text-gray-400');
            }
        }

        // 4. COUNTDOWN TIMER ALGORITHM (Set Event Date target)
        const targetWeddingDate = new Date("Jun 19, 2026 16:00:00").getTime();

        const countdownInterval = setInterval(function() {
            const now = new Date().getTime();
            const difference = targetWeddingDate - now;

            // Math computations for days, hours, minutes, seconds
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Update DOM Elements
            document.getElementById("days").innerText = days < 10 ? "0" + days : days;
            document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
            document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
            document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

            // If countdown expires
            if (difference < 0) {
                clearInterval(countdownInterval);
                document.getElementById("countdown").innerHTML = "<div class='col-span-4 text-center font-serif text-amber-200 py-2 font-semibold text-shadow-sm'>Hari Bahagia Telah Tiba!</div>";
            }
        }, 1000);

        // 5. FETCH WISHES FROM FIREBASE (OR LOCAL STORAGE FALLBACK)
        function loadWishes() {
            const wishesBox = document.getElementById('wishes-box');
            
            if (db) {
                db.collection('wishes')
                    .where('weddingId', '==', weddingId)
                    .orderBy('timestamp', 'desc')
                    .get()
                    .then(querySnapshot => {
                        wishesBox.innerHTML = ''; // Clear spinner
                        if (querySnapshot.empty) {
                            wishesBox.innerHTML = '<p class="text-xs text-gray-300 text-center py-4">Belum ada ucapan. Jadilah yang pertama memberikan ucapan!</p>';
                            return;
                        }
                        querySnapshot.forEach(doc => {
                            renderWishCard(doc.data(), false); // append
                        });
                    })
                    .catch(error => {
                        console.error('Error loading wishes:', error);
                        wishesBox.innerHTML = '<p class="text-xs text-red-300 text-center py-4">Gagal memuat ucapan. Silakan segarkan halaman.</p>';
                    });
            } else {
                // LocalStorage Fallback for testing / offline demo mode
                wishesBox.innerHTML = '';
                const wishes = JSON.parse(localStorage.getItem(`wishes_${weddingId}`) || '[]');
                if (wishes.length === 0) {
                    // Seed some default items for demo
                    const demoWishes = [
                        { name: "Andi & Susi", status: "Hadir", wish: "Selamat menempuh hidup baru untuk kedua mempelai! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Amin ya rabbal alamin.", timestamp: new Date(Date.now() - 3600000).toISOString() },
                        { name: "Budi Santoso", status: "Tidak Hadir", wish: "Happy wedding ya! Mohon maaf sekali belum bisa hadir karena sedang dinas di luar kota. Semoga dilancarkan seluruh prosesinya sampai hari H.", timestamp: new Date(Date.now() - 7200000).toISOString() }
                    ];
                    localStorage.setItem(`wishes_${weddingId}`, JSON.stringify(demoWishes));
                    demoWishes.forEach(w => renderWishCard(w, false));
                } else {
                    wishes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                          .forEach(w => renderWishCard(w, false));
                }
            }
        }

        // Render a wish card into the DOM
        function renderWishCard(wishData, prepend = false) {
            const wishesBox = document.getElementById('wishes-box');
            
            // Check if "no wishes" placeholder is present and remove it
            if (wishesBox.querySelector('p') && !wishesBox.querySelector('.glass-card')) {
                wishesBox.innerHTML = '';
            }

            const card = document.createElement('div');
            card.className = 'glass-card p-4 !rounded-xl animate-fade-in';
            
            const badgeClass = wishData.status === "Hadir" 
                ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/30" 
                : "bg-white/10 text-gray-300 border-white/20";
            const iconBadge = wishData.status === "Hadir" 
                ? "<i class='fa-solid fa-check text-[8px] mr-0.5'></i>" 
                : "";

            // Format timestamp nicely
            const date = new Date(wishData.timestamp);
            const dateString = date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            card.innerHTML = `
                <div class="flex items-center justify-between mb-1">
                    <div>
                        <h5 class="text-xs font-bold text-white text-shadow-sm">${escapeHTML(wishData.name)}</h5>
                        <span class="text-[8px] text-gray-300 block">${dateString}</span>
                    </div>
                    <span class="inline-block text-[9px] font-semibold ${badgeClass} border px-2 py-0.5 rounded-full">${iconBadge} ${wishData.status}</span>
                </div>
                <p class="text-xs text-gray-200 leading-relaxed italic text-shadow-sm mt-1">"${escapeHTML(wishData.wish)}"</p>
            `;

            if (prepend) {
                wishesBox.insertBefore(card, wishesBox.firstChild);
                wishesBox.scrollTop = 0;
            } else {
                wishesBox.appendChild(card);
            }
        }

        // Escape HTML to prevent XSS
        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, 
                tag => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;'
                }[tag] || tag)
            );
        }

        // 6. FORM SUBMISSION AND POSTING TO FIREBASE (OR LOCAL STORAGE)
        function handleFormSubmit(event) {
            event.preventDefault(); // Stop page reload

            const nameInput = document.getElementById('form-name').value;
            const statusInput = document.getElementById('form-status').value;
            const wishInput = document.getElementById('form-wish').value;

            const newWish = {
                weddingId: weddingId,
                name: nameInput.trim(),
                status: statusInput.trim(),
                wish: wishInput.trim(),
                timestamp: new Date().toISOString()
            };

            if (db) {
                db.collection('wishes').add(newWish)
                .then(() => {
                    renderWishCard(newWish, true); // prepend to wishes box
                    
                    // Reset form fields
                    document.getElementById('rsvpForm').reset();
                    
                    alert("Terima kasih! Ucapan Anda telah berhasil dikirim.");
                })
                .catch(error => {
                    console.error('Error submitting wish:', error);
                    alert("Maaf, terjadi kesalahan saat mengirim ucapan Anda. Silakan coba lagi.");
                });
            } else {
                // LocalStorage Fallback for testing / offline demo mode
                const wishes = JSON.parse(localStorage.getItem(`wishes_${weddingId}`) || '[]');
                wishes.push(newWish);
                localStorage.setItem(`wishes_${weddingId}`, JSON.stringify(wishes));
                
                renderWishCard(newWish, true); // prepend to wishes box
                
                // Reset form fields
                document.getElementById('rsvpForm').reset();
                
                alert("Terima kasih! Ucapan Anda telah disimpan secara lokal (Offline Demo Mode).");
            }
        }

        // Lightbox Modal functions
        const galleryImages = [
            '/foto-1.jpg',
            '/foto-2.jpg',
            '/foto-3.jpg',
            '/foto-4.jpg',
            '/foto-5.jpg',
            '/foto-6.jpg',
            '/foto-7.jpg',
            '/foto-8.jpg',
            '/foto-9.jpg',
            '/foto-10.jpg',
            '/foto-11.jpg',
            '/foto-12.jpg',
            '/foto-13.jpg',
            '/foto-14.jpg',
            '/foto-15.jpg',
            '/foto-16.jpg',
            '/foto-17.jpg',
            '/foto-18.jpg'
        ];
        let currentLightboxIndex = 0;

        function openLightbox(index) {
            currentLightboxIndex = index;
            const modal = document.getElementById('lightbox-modal');
            const img = document.getElementById('lightbox-img');
            
            img.src = galleryImages[currentLightboxIndex];
            modal.classList.remove('hidden');
            
            // Trigger reflow for transition
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                img.classList.remove('scale-95');
                img.classList.add('scale-100');
            }, 10);
            
            // Prevent scrolling on body when lightbox is open
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            const modal = document.getElementById('lightbox-modal');
            const img = document.getElementById('lightbox-img');
            
            modal.classList.add('opacity-0');
            img.classList.remove('scale-100');
            img.classList.add('scale-95');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                img.src = '';
                // Restore body scrolling only if invitation is opened
                if (!document.body.classList.contains('no-scroll')) {
                    document.body.style.overflow = '';
                }
            }, 300);
        }

        function updateLightboxImage(index) {
            currentLightboxIndex = (index + galleryImages.length) % galleryImages.length;
            const img = document.getElementById('lightbox-img');
            
            // Apply fade out effect before switching source for smooth transition
            img.style.opacity = '0';
            img.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                img.src = galleryImages[currentLightboxIndex];
                img.onload = () => {
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                };
            }, 150);
        }

        function nextLightbox() {
            updateLightboxImage(currentLightboxIndex + 1);
        }

        function prevLightbox() {
            updateLightboxImage(currentLightboxIndex - 1);
        }

        // Keyboard navigation for Lightbox
        document.addEventListener('keydown', function(event) {
            const modal = document.getElementById('lightbox-modal');
            if (modal && !modal.classList.contains('hidden')) {
                if (event.key === 'ArrowRight') {
                    nextLightbox();
                } else if (event.key === 'ArrowLeft') {
                    prevLightbox();
                } else if (event.key === 'Escape') {
                    closeLightbox();
                }
            }
        });
    