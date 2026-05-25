// Screens
const screenPin = document.getElementById('screen-pin');
const screenFlower = document.getElementById('screen-flower');
const screenEnvelope = document.getElementById('screen-envelope');

// Typewriter Logic
const letterContent = document.querySelector('.letter-content');
const elementsToType = Array.from(letterContent.children).filter(el => el.tagName !== 'BUTTON');
const textsToType = elementsToType.map(el => el.textContent.trim().replace(/\s+/g, ' '));

// Empty out the text initially
elementsToType.forEach(el => {
    el.innerHTML = '';
});

let isTypingStarted = false;
function startTypewriter() {
    if(isTypingStarted) return;
    isTypingStarted = true;
    
    function typeWriter(elementIndex, charIndex) {
        if (elementIndex < elementsToType.length) {
            const el = elementsToType[elementIndex];
            const text = textsToType[elementIndex];
            
            el.classList.add('typing-cursor');
            
            if (charIndex < text.length) {
                el.innerHTML = text.substring(0, charIndex + 1);
                const speed = Math.random() * 40 + 30; // Random typing speed
                setTimeout(() => typeWriter(elementIndex, charIndex + 1), speed);
            } else {
                el.classList.remove('typing-cursor');
                if (elementIndex + 1 < elementsToType.length) {
                    setTimeout(() => typeWriter(elementIndex + 1, 0), 400); // Pause between paragraphs
                } else {
                    // Finished typing all paragraphs, show the make a wish button!
                    setTimeout(() => {
                        const btn = document.getElementById('make-wish-btn');
                        btn.style.display = 'block';
                        setTimeout(() => btn.style.opacity = '1', 50);
                    }, 500);
                }
            }
        }
    }
    
    typeWriter(0, 0);
}

// Balloon & Confetti Logic
function startBalloons() {
    const container = document.getElementById('balloon-container');
    const colors = ['#ff6b8b', '#ffb7c5', '#8c3846', '#ffffff', '#ffd1dc'];
    
    function createBalloon(isLeft) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        
        // Ensure even distribution strictly on far edges: left side (2%-15%), right side (85%-98%)
        const baseLeft = isLeft ? 2 : 85;
        balloon.style.left = Math.random() * 13 + baseLeft + '%'; 
        
        balloon.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
        balloon.style.setProperty('--duration', (Math.random() * 6 + 7) + 's'); // Faster floating (7s to 13s)
        balloon.style.setProperty('--rot1', (Math.random() * 30 - 15) + 'deg');
        balloon.style.setProperty('--rot2', (Math.random() * 30 - 15) + 'deg');
        
        balloon.addEventListener('click', (e) => {
            popBalloon(balloon, e.clientX, e.clientY);
        });
        
        container.appendChild(balloon);
        
        setTimeout(() => {
            if(balloon.parentNode) balloon.remove();
        }, 15000); 
    }

    setInterval(() => {
        // Spawn 2 balloons at once (one left, one right) every 1.2 seconds for maximum festivity
        createBalloon(true);
        createBalloon(false);
    }, 1200); 
}

function popBalloon(balloon, x, y) {
    const color = balloon.style.getPropertyValue('--color');
    balloon.remove();
    createConfetti(x, y, color);
}

function createConfetti(x, y, color) {
    const container = document.getElementById('balloon-container');
    for(let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-particle');
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        
        const colors = [color, '#fff', '#ffd700', '#ffb7c5'];
        confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 80 + 40; 
        const tx = Math.cos(angle) * velocity + 'px';
        const ty = Math.sin(angle) * velocity + 150 + 'px'; // Falls downwards
        
        confetti.style.setProperty('--tx', tx);
        confetti.style.setProperty('--ty', ty);
        
        container.appendChild(confetti);
        
        setTimeout(() => {
            if(confetti.parentNode) confetti.remove();
        }, 1500);
    }
}

// Cake Logic
document.getElementById('make-wish-btn').addEventListener('click', () => {
    document.getElementById('screen-cake').classList.add('active');
});

document.getElementById('flame').addEventListener('click', function() {
    this.classList.add('blown-out');
    document.getElementById('wish-text').innerHTML = "Yeay! Happy Birthday! 🎉";
    document.getElementById('cake-banner').classList.add('show');
    
    // Spawn massive confetti bursts
    for(let i=0; i<4; i++) {
        setTimeout(() => {
            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2;
            createConfetti(x, y, '#ffb7c5');
            createConfetti(x, y, '#ffd700'); // Double burst!
        }, i * 300);
    }
});

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

window.openLightbox = function(element) {
    if (event) event.stopPropagation(); // Prevent envelope from catching the click
    const imgDiv = element.querySelector('.polaroid-img');
    if (imgDiv) {
        const bgImg = imgDiv.style.backgroundImage;
        if (bgImg && bgImg !== 'none') {
            const urlMatch = bgImg.match(/url\(["']?(.*?)["']?\)/);
            if (urlMatch && urlMatch[1]) {
                lightboxImg.src = urlMatch[1];
                lightbox.classList.add('active');
            }
        }
    }
};

// Close lightbox on click
lightbox.addEventListener('click', (e) => {
    // Close if clicked anywhere except the image itself
    if (e.target !== lightboxImg) {
        lightbox.classList.remove('active');
    }
});

// PIN Logic
const CORRECT_PIN = "1234";
let currentPin = "";

const dots = document.querySelectorAll('.dot');
const numBtns = document.querySelectorAll('.num-btn:not(.dummy)');
const deleteBtn = document.querySelector('.delete-btn');

function updateDots() {
    dots.forEach((dot, index) => {
        if (index < currentPin.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled', 'error');
        }
    });
}

function checkPin() {
    if (currentPin === CORRECT_PIN) {
        // Success!
        setTimeout(() => {
            // Transition to Flower Screen
            screenPin.classList.remove('active');
            
            setTimeout(() => {
                screenFlower.classList.add('active');
                
                // Wait for flower animation to finish (takes about 5-6s)
                setTimeout(() => {
                    screenFlower.classList.remove('active');
                    
                    setTimeout(() => {
                        screenEnvelope.classList.add('active');
                    }, 1000);
                }, 6000);
                
            }, 1000);
            
        }, 500);
    } else {
        // Error
        dots.forEach(dot => dot.classList.add('error'));
        setTimeout(() => {
            currentPin = "";
            updateDots();
        }, 500);
    }
}

numBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Play music on first interaction to simulate autoplay
        if (bgm && bgm.paused) {
            bgm.play().catch(error => console.log("Waiting for user interaction to play audio."));
        }
        
        if(e.target.classList.contains('delete-btn')) {
            currentPin = currentPin.slice(0, -1);
        } else {
            if (currentPin.length < 4) {
                currentPin += e.target.innerText;
            }
        }
        
        updateDots();
        
        if (currentPin.length === 4) {
            checkPin();
        }
    });
});

// Envelope Logic
const envelopeWrapper = document.querySelector('.envelope-wrapper');
const envelope = document.getElementById('envelope');
const hint = document.querySelector('.envelope-hint');
const bgm = document.getElementById('bgm');

envelopeWrapper.addEventListener('click', () => {
    if (!envelope.classList.contains('is-open')) {
        envelope.classList.add('is-open');
        hint.style.opacity = '0';
        
        // Trigger side sakuras
        setTimeout(() => {
            document.querySelectorAll('.side-sakura').forEach(el => el.classList.add('show'));
        }, 3500);
        
        // Trigger typewriter effect
        setTimeout(() => {
            startTypewriter();
        }, 3000);
        
        // Trigger balloons
        setTimeout(() => {
            startBalloons();
        }, 5000); // 5 seconds after envelope click
    }
});
