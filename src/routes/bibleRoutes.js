const express = require('express');
const router = express.Router();
const Books = require('../data/Books'); // Adjust the path as needed
const FullBible = require('../data/FullBible'); // Adjust the path as needed

// Route to get the full Bible
router.get('/bible', (req, res) => {
    try {
        res.json(FullBible);
    } catch (error) {
        console.error('Error fetching the Bible:', error);
        res.status(500).json({ error: 'Error fetching the Bible' });
    }
});

// Route to get a specific book
router.get('/bible/:book', (req, res) => {
    const { book } = req.params;
    try {
        const bookData = FullBible.find((entry) => entry.book.english.toLowerCase() === book.toLowerCase());

        if (!bookData) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(bookData);
    } catch (error) {
        console.error(`Error fetching the book ${book}:`, error);
        res.status(500).json({ error: `Error fetching the book ${book}` });
    }
});

// Route to get a specific chapter in a book
router.get('/bible/:book/:chapter', (req, res) => {
    const { book, chapter } = req.params;
    try {
        const bookData = FullBible.find((entry) => entry.book.english.toLowerCase() === book.toLowerCase());

        if (!bookData) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const chapterData = bookData.chapters.find((ch) => ch.chapter === chapter);

        if (!chapterData) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        res.json(chapterData);
    } catch (error) {
        console.error(`Error fetching the chapter ${chapter} of book ${book}:`, error);
        res.status(500).json({ error: `Error fetching the chapter ${chapter} of book ${book}` });
    }
});

// Route to get a specific verse in a chapter of a book
router.get('/bible/:book/:chapter/:verse', (req, res) => {
    const { book, chapter, verse } = req.params;
    try {
        const bookData = FullBible.find((entry) => entry.book.english.toLowerCase() === book.toLowerCase());

        if (!bookData) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const chapterData = bookData.chapters.find((ch) => ch.chapter === chapter);

        if (!chapterData) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        const verseData = chapterData.verses.find((v) => v.verse === verse);

        if (!verseData) {
            return res.status(404).json({ error: 'Verse not found' });
        }

        res.json(verseData);
    } catch (error) {
        console.error(`Error fetching verse ${verse} of chapter ${chapter} in book ${book}:`, error);
        res.status(500).json({ error: `Error fetching verse ${verse} of chapter ${chapter} in book ${book}` });
    }
});

// Route to get books with chapter details for dropdown
router.get('/books-with-chapters', (req, res) => {
    try {
        const booksWithChapters = Books.map((bookEntry) => {
            const bookEnglish = bookEntry.book.english;
            const bookData = FullBible.find((entry) => entry.book.english === bookEnglish);

            if (bookData) {
                const chapters = bookData.chapters.map((chapter) => chapter.chapter);
                return {
                    name: bookEnglish,
                    chapters,
                };
            }
            return null; // In case the book data isn't found
        }).filter(Boolean); // Filter out any null entries

        res.json(booksWithChapters);
    } catch (error) {
        console.error('Error fetching books with chapters:', error);
        res.status(500).json({ error: 'Error fetching books with chapters' });
    }
});

module.exports = router;
