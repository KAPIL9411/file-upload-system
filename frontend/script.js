    // document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    //     e.preventDefault();

    //     const fileInput = document.getElementById('fileInput');
    //     const files = fileInput.files;
    //     const statusElement = document.getElementById('status');
    //     const loader = document.getElementById('loader');
    //     statusElement.innerText = '';
    //     loader.style.display = 'block';

    //     for (const file of files) {
    //         const formData = new FormData();
    //         formData.append('file', file);

    //         try {
    //             const response = await fetch('http://localhost:3000/upload', {
    //                 method: 'POST',
    //                 body: formData,
    //             });

    //             const result = await response.text();
    //             document.getElementById('status').innerText = result;
    //             loader.style.display = 'none';
    //         } catch (error) {
    //             document.getElementById('status').innerText = 'Error uploading file';
    //             loader.style.display = 'none';
    //         }
    //     }
    // });

    // document.getElementById('chooseFiles').addEventListener('click', () => {
    //     document.getElementById('fileInput').click();
    // });

    // document.getElementById('fileInput').addEventListener('change', (e) => {
    //     const files = e.target.files;
    //     const fileList = document.getElementById('fileList');
    //     fileList.innerHTML = '';
    //     for (const file of files) {
    //         const fileItem = document.createElement('div');
    //         fileItem.classList.add('file-item');
    //         fileItem.innerText = `Name: ${file.name}, Size: ${file.size} bytes`;
    //         fileList.appendChild(fileItem);
    //     }
    // });




    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('fileInput');
        const files = fileInput.files;
        const statusElement = document.getElementById('status');
        const loader = document.getElementById('loader');
        statusElement.innerText = '';
        loader.style.display = 'block';

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('http://localhost:3000/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.text();
                document.getElementById('status').innerText = result;
                loader.style.display = 'none';
            } catch (error) {
                document.getElementById('status').innerText = 'Error uploading file';
                loader.style.display = 'none';
            }
        }
    });

    document.getElementById('chooseFiles').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', (e) => {
        const files = e.target.files;
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
        for (const file of files) {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');
            fileItem.innerText = `Name: ${file.name}, Size: ${file.size} bytes`;
            fileList.appendChild(fileItem);
        }
    });

    document.getElementById('showFiles').addEventListener('click', () => {
        window.location.href = 'uploaded_files.html';
    });
