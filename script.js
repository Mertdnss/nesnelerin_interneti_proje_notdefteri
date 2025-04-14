// DOM Elementleri
const notesContainer = document.getElementById('notes-container');
const addNoteBtn = document.getElementById('add-note-btn');
const noteModal = document.getElementById('note-modal');
const closeModal = document.querySelector('.close-modal');
const modalTitle = document.getElementById('modal-title');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const saveNoteBtn = document.getElementById('save-note-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const colorOptions = document.querySelectorAll('.color-option');

// API URL (JSON Server)
const API_URL = 'http://localhost:3000';

// Uygulama Durumu
let notes = [];
let currentNoteId = null;
let selectedColor = '#ffcccc';

// Renk seçimi işlemleri
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedColor = option.getAttribute('data-color');
    });
});

// İlk renk seçeneğini varsayılan olarak seç
colorOptions[0].classList.add('selected');

// Notları API'den Getirme
async function fetchNotes() {
    try {
        const response = await fetch(`${API_URL}/notes`);
        if (!response.ok) {
            throw new Error('Notlar yüklenirken bir hata oluştu');
        }
        notes = await response.json();
        renderNotes();
    } catch (error) {
        console.error('Notlar yüklenirken hata:', error);
        notesContainer.innerHTML = `
            <div class="no-notes error">
                <p>Notlar yüklenirken bir hata oluştu. JSON Server'ın çalıştığından emin olun.</p>
            </div>
        `;
    }
}

// Kategorileri API'den Getirme
async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) {
            throw new Error('Kategoriler yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        categories = Array.isArray(data) ? data.map(cat => typeof cat === 'object' ? cat.name : cat) : [];
        if (categories.length === 0) {
            categories = ['work', 'personal', 'ideas'];
        }
        updateCategoryOptions();
    } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
        categories = ['work', 'personal', 'ideas'];
        updateCategoryOptions();
    }
}

// Not Ekleme/Düzenleme Modalını Açma
function openNoteModal(note = null) {
    if (note) {
        // Not düzenleme modu
        modalTitle.textContent = 'Notu Düzenle';
        noteTitle.value = note.title;
        noteContent.value = note.content;
        currentNoteId = note.id;
        
        // Renk seçimi
        colorOptions.forEach(option => {
            if (option.getAttribute('data-color') === note.color) {
                option.classList.add('selected');
                selectedColor = note.color;
            } else {
                option.classList.remove('selected');
            }
        });
    } else {
        // Yeni not ekleme modu
        modalTitle.textContent = 'Yeni Not';
        noteTitle.value = '';
        noteContent.value = '';
        currentNoteId = null;
        
        // Varsayılan renk seçimi
        colorOptions.forEach((option, index) => {
            if (index === 0) {
                option.classList.add('selected');
                selectedColor = option.getAttribute('data-color');
            } else {
                option.classList.remove('selected');
            }
        });
    }
    
    noteModal.style.display = 'flex';
    noteTitle.focus();
}

// Not Ekleme/Düzenleme Modalını Kapatma
function closeNoteModal() {
    noteModal.style.display = 'none';
}

// Not Ekleme/Güncelleme
async function saveNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    
    if (!title || !content) {
        alert('Lütfen başlık ve içerik alanlarını doldurun.');
        return;
    }
    
    const date = new Date();
    const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    
    try {
        if (currentNoteId) {
            // Not güncelleme
            const updatedNote = {
                title,
                content,
                color: selectedColor,
                updatedAt: formattedDate
            };
            
            const response = await fetch(`${API_URL}/notes/${currentNoteId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedNote)
            });
            
            if (!response.ok) {
                throw new Error('Not güncellenirken bir hata oluştu');
            }
        } else {
            // Yeni not ekleme
            const newNote = {
                id: Date.now(),
                title,
                content,
                color: selectedColor,
                createdAt: formattedDate,
                updatedAt: formattedDate
            };
            
            const response = await fetch(`${API_URL}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newNote)
            });
            
            if (!response.ok) {
                throw new Error('Not eklenirken bir hata oluştu');
            }
        }
        
        // Notları yeniden yükle
        await fetchNotes();
        closeNoteModal();
    } catch (error) {
        console.error('Not kaydedilirken hata:', error);
        alert('Not kaydedilirken bir hata oluştu. JSON Server\'ın çalıştığından emin olun.');
    }
}

// Not Silme
async function deleteNote(id) {
    if (confirm('Bu notu silmek istediğinize emin misiniz?')) {
        try {
            const response = await fetch(`${API_URL}/notes/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Not silinirken bir hata oluştu');
            }
            
            // Notları yeniden yükle
            await fetchNotes();
        } catch (error) {
            console.error('Not silinirken hata:', error);
            alert('Not silinirken bir hata oluştu. JSON Server\'ın çalıştığından emin olun.');
        }
    }
}

// Notları Filtreleme
function filterNotes(searchTerm = '') {
    let filteredNotes = [...notes];
    
    // Arama filtresi
    if (searchTerm) {
        filteredNotes = filteredNotes.filter(note => 
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    return filteredNotes;
}

// Notları Görüntüleme
function renderNotes() {
    const filteredNotes = filterNotes(searchInput.value.trim());
    
    notesContainer.innerHTML = '';
    
    if (filteredNotes.length === 0) {
        notesContainer.innerHTML = `
            <div class="no-notes">
                <p>Henüz not bulunmuyor.</p>
            </div>
        `;
        return;
    }
    
    filteredNotes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.style.backgroundColor = note.color;
        
        noteCard.innerHTML = `
            <div class="note-actions">
                <button class="edit-btn" title="Düzenle"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Sil"><i class="fas fa-trash"></i></button>
            </div>
            <h3 class="note-title">${note.title}</h3>
            <p class="note-content">${note.content}</p>
            <div class="note-footer">
                <span class="note-date">${note.updatedAt}</span>
            </div>
        `;
        
        // Not düzenleme butonu
        const editBtn = noteCard.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => openNoteModal(note));
        
        // Not silme butonu
        const deleteBtn = noteCard.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteNote(note.id));
        
        notesContainer.appendChild(noteCard);
    });
}



// Olay Dinleyicileri
addNoteBtn.addEventListener('click', () => openNoteModal());
closeModal.addEventListener('click', closeNoteModal);
saveNoteBtn.addEventListener('click', saveNote);

searchBtn.addEventListener('click', () => {
    renderNotes();
});

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        renderNotes();
    }
});

// Modal dışına tıklandığında kapatma
window.addEventListener('click', (e) => {
    if (e.target === noteModal) {
        closeNoteModal();
    }
});

// Sayfa yüklendiğinde notları göster
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Notları yükle
        await fetchNotes();
        
        // İlk renk seçeneğini varsayılan olarak seç
        colorOptions[0].classList.add('selected');
    } catch (error) {
        console.error('Uygulama başlatılırken hata:', error);
    }
});