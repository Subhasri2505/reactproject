// Basic stub for fake image detection
// In a real app, this would use metadata analysis or an AI model

async function checkFakeImage(filePath) {
    // Conceptual logic:
    // 1. Check EXIF data (if GPS missing, flag it?)
    // 2. Check for "downloaded from web" markers
    // 3. AI visual similarity to stock photos

    // For this prototype, we'll implement a simple random check or specific trigger
    // For demo: if filename contains "fake", return true

    if (filePath.includes('fake')) {
        return true;
    }

    return false;
}

module.exports = { checkFakeImage };
