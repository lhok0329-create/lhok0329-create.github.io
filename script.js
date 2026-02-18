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

// Load words from LocalStorage on startup
let vocabList = JSON.parse(localStorage.getItem('myVocab')) || [];
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
