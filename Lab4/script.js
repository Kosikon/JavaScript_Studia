document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const noteForm = document.getElementById('noteForm');
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const noteTags = document.getElementById('noteTags');
    const noteColor = document.getElementById('noteColor');
    const notePinned = document.getElementById('notePinned');
    const searchInput = document.getElementById('searchInput');
    let editIndex = null;

    const saveNotes = (notes) => localStorage.setItem('notes', JSON.stringify(notes));
    const loadNotes = () => JSON.parse(localStorage.getItem('notes')) || [];

    const displayNotes = (notes) => {
        notesContainer.innerHTML = '';
        notes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.className = `note${note.pinned ? ' pinned' : ''}`;
            noteElement.style.backgroundColor = note.color;
            noteElement.innerHTML = `
                <h2 class="note-title">${note.title}</h2>
                <p class="note-content">${note.content}</p>
                <p class="note-tags">Tagi: ${note.tags.join(', ')}</p>
                <div class="note-footer">
                    <button class="edit-btn" data-index="${index}">Edytuj</button>
                    <button class="delete-btn" data-index="${index}">Usuń</button>
                </div>
            `;
            notesContainer.appendChild(noteElement);
        });
    };

    const addOrUpdateNote = () => {
        const notes = loadNotes();
        const newNote = {
            title: noteTitle.value,
            content: noteContent.value,
            tags: noteTags.value.split(',').map(tag => tag.trim()),
            color: noteColor.value,
            pinned: notePinned.checked,
            created: new Date().toISOString()
        };

        if (editIndex !== null) {
            notes[editIndex] = newNote;
            editIndex = null;
        } else {
            notes.unshift(newNote);
        }

        saveNotes(notes);
        displayNotes(notes);
        noteForm.reset();
    };

    const deleteNote = (index) => {
        const notes = loadNotes();
        notes.splice(index, 1);
        saveNotes(notes);
        displayNotes(notes);
    };

    const editNote = (index) => {
        const notes = loadNotes();
        const note = notes[index];
        noteTitle.value = note.title;
        noteContent.value = note.content;
        noteTags.value = note.tags.join(', ');
        noteColor.value = note.color;
        notePinned.checked = note.pinned;
        editIndex = index;
    };

    const searchNotes = () => {
        const searchText = searchInput.value.toLowerCase();
        const notes = loadNotes();
        const filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(searchText) ||
            note.content.toLowerCase().includes(searchText) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchText))
        );
        displayNotes(filteredNotes);
    };

    noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addOrUpdateNote();
    });

    notesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            editNote(parseInt(e.target.dataset.index));
        }
        if (e.target.classList.contains('delete-btn')) {
            deleteNote(parseInt(e.target.dataset.index));
        }
    });

    searchInput.addEventListener('input', searchNotes);

    displayNotes(loadNotes());
});
