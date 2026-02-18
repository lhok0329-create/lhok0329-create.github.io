// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
});

// Add CSS for hidden/visible states via JS or CSS
const style = document.createElement('style');
style.textContent = `
    .hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Vocabulary Feature
const vocabForm = document.getElementById('vocab-form');
const wordInput = document.getElementById('word-input');
const meaningInput = document.getElementById('meaning-input');
const vocabGrid = document.getElementById('vocab-grid');

// 50 Basic Words Data
const basicWords = [
    { word: "Ability", meaning: "능력" }, { word: "Access", meaning: "접근" },
    { word: "Account", meaning: "계좌, 설명" }, { word: "Action", meaning: "행동" },
    { word: "Activity", meaning: "활동" }, { word: "Actually", meaning: "사실은" },
    { word: "Address", meaning: "주소, 연설하다" }, { word: "Advice", meaning: "조언" },
    { word: "Afraid", meaning: "두려워하는" }, { word: "Again", meaning: "다시" },
    { word: "Agree", meaning: "동의하다" }, { word: "Ahead", meaning: "앞으로" },
    { word: "Allow", meaning: "허락하다" }, { word: "Almost", meaning: "거의" },
    { word: "Alone", meaning: "혼자" }, { word: "Already", meaning: "이미" },
    { word: "Always", meaning: "항상" }, { word: "Amount", meaning: "양" },
    { word: "Angry", meaning: "화난" }, { word: "Answer", meaning: "대답" },
    { word: "Appeal", meaning: "호소하다, 매력" }, { word: "Appear", meaning: "나타나다" },
    { word: "Area", meaning: "지역" }, { word: "Argue", meaning: "논쟁하다" },
    { word: "Around", meaning: "주변에" }, { word: "Arrive", meaning: "도착하다" },
    { word: "Article", meaning: "기사, 조항" }, { word: "Artist", meaning: "예술가" },
    { word: "Ask", meaning: "묻다" }, { word: "Attack", meaning: "공격하다" },
    { word: "Attention", meaning: "주의, 주목" }, { word: "Available", meaning: "이용 가능한" },
    { word: "Average", meaning: "평균" }, { word: "Avoid", meaning: "피하다" },
    { word: "Away", meaning: "멀리" }, { word: "Baby", meaning: "아기" },
    { word: "Back", meaning: "뒤로" }, { word: "Bad", meaning: "나쁜" },
    { word: "Bag", meaning: "가방" }, { word: "Ball", meaning: "공" },
    { word: "Bank", meaning: "은행" }, { word: "Bar", meaning: "막대기, 술집" },
    { word: "Base", meaning: "기초" }, { word: "Be", meaning: "이다, 있다" },
    { word: "Bear", meaning: "곰, 참다" }, { word: "Beat", meaning: "이기다, 때리다" },
    { word: "Beautiful", meaning: "아름다운" }, { word: "Become", meaning: "되다" },
    { word: "Bed", meaning: "침대" }, { word: "Before", meaning: "전에" }
];

// Airplane Conversation Data
const airplaneWords = [
    { word: "Boarding Pass", meaning: "탑승권" },
    { word: "Passport", meaning: "여권" },
    { word: "Aisle Seat", meaning: "통로 쪽 좌석" },
    { word: "Window Seat", meaning: "창가 쪽 좌석" },
    { word: "Overhead Bin", meaning: "머리 위 짐칸" },
    { word: "Fasten Seatbelt", meaning: "안전벨트 착용" },
    { word: "Take off", meaning: "이륙하다" },
    { word: "Land", meaning: "착륙하다" },
    { word: "Turbulence", meaning: "난기류 (흔들림)" },
    { word: "In-flight Meal", meaning: "기내식" },
    { word: "Chicken or Beef?", meaning: "치킨과 소고기 중 어떤 걸로?" },
    { word: "Blanket", meaning: "담요" },
    { word: "Pillow", meaning: "베개" },
    { word: "Headphones", meaning: "헤드폰" },
    { word: "Water, please.", meaning: "물 좀 주세요." },
    { word: "Restroom / Lavatory", meaning: "화장실" },
    { word: "Customs Declaration", meaning: "세관 신고서" },
    { word: "Baggage Claim", meaning: "수하물 찾는 곳" },
    { word: "Transfer", meaning: "환승" },
    { word: "Flight Attendant", meaning: "승무원" },
    // Dialogues
    { word: "Excuse me, can I get a blanket?", meaning: "저기요, 담요 좀 주시겠어요?" },
    { word: "How long until we land?", meaning: "도착까지 얼마나 남았나요?" },
    { word: "I have a connecting flight.", meaning: "저는 환승 비행기가 있습니다." },
    { word: "Can I have some water?", meaning: "물 좀 주시겠어요?" },
    { word: "My screen is not working.", meaning: "제 화면이 작동하지 않습니다." },
    { word: "Where is the baggage claim?", meaning: "수하물 찾는 곳이 어디인가요?" },
    { word: "Do you have an arrival card?", meaning: "입국 신고서 있나요?" },
    { word: "Putting my seat back ok?", meaning: "의자를 뒤로 젖혀도 될까요?" },
    { word: "I feel airsick.", meaning: "비행기 멀미가 나요." },
    { word: "Thank you for your service.", meaning: "서비스 감사합니다." }
];

// Load words from LocalStorage on startup
let vocabList = JSON.parse(localStorage.getItem('myVocab'));
let currentFilter = 'all';

// Initialize or Migrate Data
if (!vocabList || vocabList.length === 0) {
    // Initial Fresh Load
    vocabList = [
        ...basicWords.map((item, i) => ({ id: Date.now() + i, word: item.word, meaning: item.meaning, category: 'basic' })),
        ...airplaneWords.map((item, i) => ({ id: Date.now() + 1000 + i, word: item.word, meaning: item.meaning, category: 'airplane' }))
    ];
    saveAndRender();
} else {
    // Data Migration: Assign categories to existing data if missing
    let hasChanges = false;

    // Check if we need to add airplane words (if safe to assume they are missing)
    // Simple check: does any item have category 'airplane'?
    const hasAirplane = vocabList.some(item => item.category === 'airplane');

    vocabList = vocabList.map(item => {
        if (!item.category) {
            hasChanges = true;
            // Guess category logic simple: default to basic or user
            // For simplicity in this upgrade, let's mark all untagged as 'user' usually, 
            // BUT since we just added basic words, they likely have no tag.
            // Let's matching against basicWords to recover 'basic' tag
            const isBasic = basicWords.some(bw => bw.word === item.word);
            return { ...item, category: isBasic ? 'basic' : 'user' };
        }
        return item;
    });

    if (!hasAirplane) {
        const newAirplane = airplaneWords.map((item, i) => ({
            id: Date.now() + 2000 + i,
            word: item.word,
            meaning: item.meaning,
            category: 'airplane'
        }));
        vocabList = [...vocabList, ...newAirplane];
        hasChanges = true;
    }

    if (hasChanges) saveAndRender();
}

renderVocab();

// Add new word
vocabForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newWord = {
        id: Date.now(),
        word: wordInput.value.trim(),
        meaning: meaningInput.value.trim(),
        category: 'user'
    };

    if (newWord.word && newWord.meaning) {
        vocabList.push(newWord);
        saveAndRender();
        vocabForm.reset();
        wordInput.focus();
        // Switch to 'My Words' or 'All' to see the new word
        filterVocab('user');
    }
});

// Filter Function
window.filterVocab = function (category) {
    currentFilter = category;

    // Update buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderVocab();
}

// Render the vocabulary grid
function renderVocab() {
    vocabGrid.innerHTML = '';

    // Filter List
    let filteredList = vocabList;
    if (currentFilter !== 'all') {
        filteredList = vocabList.filter(item => item.category === currentFilter);
    }

    // Add instruction card if empty
    if (filteredList.length === 0) {
        vocabGrid.innerHTML = `
            <div class="vocab-card" style="grid-column: 1/-1; cursor: default;">
                <p style="color: var(--text-muted);">
                    ${currentFilter === 'user' ? '직접 추가한 단어가 없습니다.' : '단어가 없습니다.'}
                </p>
            </div>
        `;
        return;
    }

    // Sort by newest first
    const sortedList = [...filteredList].reverse();

    sortedList.forEach(item => {
        const card = document.createElement('div');
        card.className = 'vocab-card glass';
        // Add category indicator class if needed, or visual tag
        card.innerHTML = `
            <button class="delete-btn" onclick="deleteWord(${item.id})">&times;</button>
            <div class="vocab-word">${item.word}</div>
            <div class="vocab-meaning">${item.meaning}</div>
            ${item.category === 'airplane' ? '<span style="position:absolute; bottom:10px; font-size:12px; opacity:0.5;">✈️</span>' : ''}
        `;

        // Toggle reveal on click
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn')) {
                card.classList.toggle('revealed');
            }
        });

        vocabGrid.appendChild(card);
    });
}

// Delete word
window.deleteWord = function (id) {
    if (confirm('이 단어를 삭제하시겠습니까?')) {
        vocabList = vocabList.filter(item => item.id !== id);
        saveAndRender();
    }
};

// Save to LocalStorage and update UI
function saveAndRender() {
    localStorage.setItem('myVocab', JSON.stringify(vocabList));
    renderVocab();
}
