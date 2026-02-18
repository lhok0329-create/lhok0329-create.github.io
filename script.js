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

// Load words from LocalStorage on startup
let vocabList = JSON.parse(localStorage.getItem('myVocab'));

// Initialize with basic words if empty
if (!vocabList || vocabList.length === 0) {
    vocabList = basicWords.map((item, index) => ({
        id: Date.now() + index, // Unique ID generation
        word: item.word,
        meaning: item.meaning
    }));
    localStorage.setItem('myVocab', JSON.stringify(vocabList));
}

renderVocab();

// Add new word
vocabForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newWord = {
        id: Date.now(),
        word: wordInput.value.trim(),
        meaning: meaningInput.value.trim()
    };

    if (newWord.word && newWord.meaning) {
        vocabList.push(newWord);
        saveAndRender();
        vocabForm.reset();
        wordInput.focus();
    }
});

// Render the vocabulary grid
function renderVocab() {
    vocabGrid.innerHTML = '';

    // Add instruction card if empty
    if (vocabList.length === 0) {
        vocabGrid.innerHTML = `
            <div class="vocab-card" style="grid-column: 1/-1; cursor: default;">
                <p style="color: var(--text-muted);">단어를 추가해보세요!<br>카드를 클릭하면 뜻이 보입니다.</p>
            </div>
        `;
        return;
    }

    // Sort by newest first
    const sortedList = [...vocabList].reverse();

    sortedList.forEach(item => {
        const card = document.createElement('div');
        card.className = 'vocab-card glass';
        card.innerHTML = `
            <button class="delete-btn" onclick="deleteWord(${item.id})">&times;</button>
            <div class="vocab-word">${item.word}</div>
            <div class="vocab-meaning">${item.meaning}</div>
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
