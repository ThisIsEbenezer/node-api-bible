const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to your JSON files directory
const dataPath = path.join(__dirname, '../data');

// Helper function to read JSON files
const readJSON = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Route to get the full Bible
router.get('/bible', (req, res) => {
    try {
        const booksFile = path.join(dataPath, 'Books.json');
        const booksData = readJSON(booksFile);

        const fullBible = booksData.map((bookEntry) => {
            const bookFilePath = path.join(dataPath, `${bookEntry.book.english}.json`);
            return readJSON(bookFilePath);
        });

        res.json(fullBible);
    } catch (error) {
        console.error('Error fetching the Bible:', error);
        res.status(500).json({ error: 'Error fetching the Bible' });
    }
});

// Route to get a specific book
router.get('/bible/:book', (req, res) => {
    const { book } = req.params;
    try {
        const bookFilePath = path.join(dataPath, `${book}.json`);
        const bookData = readJSON(bookFilePath);
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
        const bookFilePath = path.join(dataPath, `${book}.json`);
        const bookData = readJSON(bookFilePath);
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
        const bookFilePath = path.join(dataPath, `${book}.json`);
        const bookData = readJSON(bookFilePath);
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
        const booksFile = path.join(dataPath, 'Books.json');
        const booksData = readJSON(booksFile);

        const booksWithChapters = booksData.map((bookEntry) => {
            const bookEnglish = bookEntry.book.english;
            const bookFilePath = path.join(dataPath, `${bookEnglish}.json`);
            const bookContent = readJSON(bookFilePath);
            const chapters = bookContent.chapters.map((chapter) => chapter.chapter);

            return {
                name: bookEnglish,
                chapters,
            };
        });

        res.json(booksWithChapters);
    } catch (error) {
        console.error('Error fetching books with chapters:', error);
        res.status(500).json({ error: 'Error fetching books with chapters' });
    }
});

module.exports = router;
