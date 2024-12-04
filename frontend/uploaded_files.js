document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

window.onload = async () => {
    try {
        const response = await fetch('http://localhost:3000/metadata');
        const files = await response.json();
        const fileContainer = document.getElementById('fileContainer');
        fileContainer.innerHTML = '';

        for (const file of files) {
            const fileElement = document.createElement('div');
            fileElement.classList.add('file-item');
            fileElement.innerHTML = `
                <div>
                    <p><strong>Name:</strong> ${file.name}</p>
                    <p><strong>Size:</strong> ${file.size} bytes</p>
                </div>
                <button onclick="downloadFile('${file.name}')">Download</button>`;
            fileContainer.appendChild(fileElement);
        }
    } catch (error) {
        console.error('Error fetching files:', error);
    }
};

async function downloadFile(fileName) {
    try {
        const response = await fetch(`http://localhost:3000/download?fileName=${fileName}`);
        const result = await response.json();
        const a = document.createElement('a');
        a.href = result.url;
        a.download = fileName;
        a.click();
    } catch (error) {
        console.error('Error generating download link:', error);
    }
}
