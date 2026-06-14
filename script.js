// ================= ENGINE CONFIGURATION & SOUNDS ================= */
const bgMusic = document.getElementById('bgMusic');
const musicToggleBtn = document.getElementById('musicToggleBtn');
let musicStarted = false;

document.body.addEventListener('click', () => {
    ensureMusicPlays();
});

function ensureMusicPlays() {
    if (!musicStarted) {
        bgMusic.play().then(() => {
            musicStarted = true;
            musicToggleBtn.innerHTML = "🎵";
        }).catch(err => console.log("Audio waiting for user affirmation: ", err));
    }
}

musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggleBtn.innerHTML = "🎵";
    } else {
        bgMusic.pause();
        musicToggleBtn.innerHTML = "🔇";
    }
});

// ================= AMBIENT EFFECTS ENGINE ================= */
function generateParticles() {
    const container = document.getElementById('particlesContainer');
    const items = ['❤️', '✨', '🌸', '💖', '✨'];
    
    setInterval(() => {
        if (document.hidden) return; 
        if (container.children.length > 25) return; 

        const particle = document.createElement('div');
        particle.classList.add('floating-particle');
        particle.innerText = items[Math.floor(Math.random() * items.length)];
        
        particle.style.left = Math.random() * 95 + 'vw';
        particle.style.top = '100vh';
        const size = Math.random() * 15 + 15;
        particle.style.fontSize = size + 'px';
        
        const duration = Math.random() * 5 + 6;
        particle.style.animationDuration = duration + 's';
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }, 700);
}
generateParticles();

function burstParticles(emoji, count = 10) {
    const container = document.getElementById('particlesContainer');
    for(let i=0; i<count; i++) {
        const p = document.createElement('div');
        p.classList.add('floating-particle');
        p.innerText = emoji;
        p.style.left = Math.random() * 95 + 'vw';
        p.style.top = Math.random() * 60 + 30 + 'vh'; 
        p.style.fontSize = (Math.random() * 20 + 20) + 'px';
        p.style.animationDuration = (Math.random() * 2.5 + 2) + 's';
        container.appendChild(p);
        setTimeout(() => p.remove(), 3000);
    }
}

// ================= QUEST STATE ROUTER ================= */
function nextStage(currentStageNum, achievementToUnlock) {
    const currentStage = document.getElementById(`stage${currentStageNum}`);
    const nextStage = document.getElementById(`stage${currentStageNum + 1}`);
    
    if (currentStage && nextStage) {
        currentStage.classList.remove('active');
        setTimeout(() => {
            nextStage.classList.add('active');
            if(currentStageNum + 1 === 3) startHeartGame(); 
            if(currentStageNum + 1 === 6) initMemoryGame();
            if(currentStageNum + 1 === 8) runTypewriter();
        }, 400);

        if (achievementToUnlock) {
            triggerAchievement(achievementToUnlock);
        }
    }
}

function triggerAchievement(name) {
    const toast = document.getElementById('achievementToast');
    document.getElementById('achievementName').innerText = name;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ================= STAGE 0: ENTRY ACCESS LOGIC ================= */
function checkInitialPassword() {
    const userInput = document.getElementById('initialPasswordInput').value.trim().toLowerCase();
    const errorEl = document.getElementById('stage0Error');
    if (userInput === "gaddhe") {
        errorEl.style.display = "none";
        nextStage(0, null);
    } else {
        errorEl.style.display = "block";
        errorEl.classList.add('animate-pulse');
    }
}

// ================= STAGE 2: GUESS WHO LOGIC ================= */
function wrongAnswer(buttonElement) {
    buttonElement.classList.add('wrong');
    buttonElement.disabled = true;
}

function correctGuessWho(buttonElement) {
    buttonElement.classList.add('correct');
    document.getElementById('guessImg').classList.remove('blurred');
    document.getElementById('stage2Next').classList.remove('hidden');
    burstParticles('❤️', 12);
}

// ================= STAGE 3: HEART COLLECTION ENGINE ================= */
let heartScore = 0;
let gameInterval;

function startHeartGame() {
    clearInterval(gameInterval);
    heartScore = 0;
    document.getElementById('heartCount').innerText = heartScore;
    
    const canvas = document.getElementById('heartGameCanvas');
    canvas.innerHTML = ''; 
    
    gameInterval = setInterval(() => {
        if(heartScore >= 10) {
            clearInterval(gameInterval);
            document.getElementById('stage3Next').classList.remove('hidden');
            return;
        }
        
        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        heart.innerHTML = '❤️';
        
        heart.style.left = (Math.random() * 85 + 5) + '%'; 
        heart.style.top = '-50px';
        
        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            heartScore++;
            document.getElementById('heartCount').innerText = heartScore;
            heart.remove();
            
            if(heartScore === 10) {
                clearInterval(gameInterval);
                document.getElementById('stage3Next').classList.remove('hidden');
                burstParticles('💖', 12);
            }
        });
        
        canvas.appendChild(heart);
        setTimeout(() => { if(heart.parentNode === canvas) heart.remove(); }, 3500);
    }, 700);
}

// ================= STAGE 4: MEMORY VAULT LOGIC ================= */
let openedGiftsCount = 0;
function openGift(giftElement, textMessage) {
    if(!giftElement.classList.contains('opened')) {
        giftElement.classList.add('opened');
        giftElement.innerHTML = "🔓";
        
        const msgContainer = document.createElement('div');
        msgContainer.classList.add('gift-message');
        msgContainer.innerText = textMessage;
        giftElement.appendChild(msgContainer);
        
        openedGiftsCount++;
        if(openedGiftsCount === 3) {
            document.getElementById('stage4Next').classList.remove('hidden');
        }
    }
}

// ================= STAGE 5: LIGHTBOX CONTROL ================= */
function openLightbox(src, caption) {
    const lightbox = document.getElementById('galleryLightbox');
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightboxCaption').innerText = caption;
    lightbox.style.display = 'flex';
}

// Fixed background click trigger constraint
function closeLightbox() {
    document.getElementById('galleryLightbox').style.display = 'none';
}

// ================= STAGE 6: CARD MATCH GAME ENGINE ================= */
const cardValues = ['💖', '🌸', '✨', '👑', '💎', '❤️', '💖', '🌸', '✨', '👑', '💎', '❤️'];
let flippedCards = [];
let matchedPairs = 0;

function initMemoryGame() {
    const grid = document.getElementById('memoryGrid');
    cardValues.sort(() => 0.5 - Math.random());
    grid.innerHTML = '';
    
    cardValues.forEach((val, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.value = val;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-back">✨</div>
            <div class="card-front">${val}</div>
        `;
        card.addEventListener('click', () => flipCard(card));
        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            setTimeout(checkCardMatch, 700);
        }
    }
}

// Fixed matching array clear states
function checkCardMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        matchedPairs++;
        if (matchedPairs === 6) {
            document.getElementById('stage6Next').classList.remove('hidden');
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    flippedCards = [];
}

// ================= STAGE 7: TEXT DIALOGUE VALIDATION ================= */
function checkSecretPassword() {
    const userInput = document.getElementById('secretPasswordInput').value.trim().toLowerCase();
    const errorEl = document.getElementById('stage7Error');
    if (userInput === "malkin") {
        errorEl.style.display = "none";
        document.getElementById('stage7Next').classList.remove('hidden');
    } else {
        errorEl.style.display = "block";
    }
}

// ================= STAGE 8: TYPEWRITER PIPELINE ================= */
const letterText = `Dear Malkin ❤️\n\nThank you for every laugh,\nevery memory,\nevery smile,\nand every moment.\n\nYou are one of the most important people in my life.\n\nYou are not just my Bua,\nyou are my best friend,\nmy BFF,\nand my favorite partner in crime.\n\nThank you for always being there.\n\nHappy Birthday ❤️`;

function runTypewriter() {
    const target = document.getElementById('typewriterText');
    target.innerHTML = '';
    let index = 0;
    
    function type() {
        if (index < letterText.length) {
            if(letterText.charAt(index) === '\n') {
                target.innerHTML += '<br>';
            } else {
                target.innerHTML += letterText.charAt(index);
            }
            index++;
            setTimeout(type, 45);
        } else {
            document.getElementById('stage8Next').classList.remove('hidden');
        }
    }
    type();
}

// ================= STAGE 9 & 10: CELEBRATION CLIMAX ================= */
function triggerGrandCelebrationEffects() {
    burstParticles('✨', 12);
    burstParticles('❤️', 12);
    burstParticles('🎂', 8);
}

// ================= AUTOMATED LINE-BY-LINE FINAL CLIMAX ================= */
function triggerFinalClimax() {
    const currentStage = document.getElementById('stage9');
    const nextStage = document.getElementById('stage10');
    
    currentStage.classList.remove('active');
    setTimeout(() => {
        nextStage.classList.add('active');
        
        const lines = document.querySelectorAll('#finalLinesContainer .hidden-line');
        let delay = 500; 
        
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('reveal');
                
                if (index < lines.length - 2) {
                    burstParticles('❤️', 3);
                }
                
                if (index === lines.length - 2) {
                    bgMusic.volume = 1.0;
                    
                    let fireworksCount = 0;
                    const fireworksInterval = setInterval(() => {
                        burstParticles('💖', 10);
                        burstParticles('✨', 10);
                        burstParticles('🎂', 4);
                        fireworksCount++;
                        if(fireworksCount > 6) {
                            clearInterval(fireworksInterval);
                            triggerAchievement("🏆 Absolute Best Surprise Ever!");
                        }
                    }, 400);
                }
            }, delay);
            
            delay += 2200; 
        });
    }, 400);
}

// ================= GLOBAL EASTER EGG INJECTOR ================= */
window.addEventListener('keydown', (e) => {
    if (e.key === 'j' || e.key === 'J') {
        const popup = document.getElementById('easterEggPopup');
        popup.classList.add('show');
        burstParticles('💖', 15);
        triggerAchievement("🏆 Secret Jiya Mode");
        
        setTimeout(() => {
            popup.classList.remove('show');
        }, 4000);
    }
});