let uploadedFiles = [];

function uploadFiles() {
    const files = document.getElementById('fileInput').files;

    for (let i = 0; i < files.length; i++) {
        uploadedFiles.push(files[i]);
    }

    alert("Files uploaded successfully!");
}

function viewFiles() {
    const fileListContainer = document.getElementById('fileList');
    fileListContainer.innerHTML = '';

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Sr No.</th>
            <th>File Name</th>
            <th>File Size (KB)</th>
            <th>Date of Upload</th>
            <th>Select</th>
            <th>Actions</th>
        </tr>
    `;

    for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const row = table.insertRow();
        const srNoCell = row.insertCell(0);
        const fileNameCell = row.insertCell(1);
        const fileSizeCell = row.insertCell(2);
        const uploadDateCell = row.insertCell(3);
        const selectCell = row.insertCell(4);
        const actionsCell = row.insertCell(5);

        srNoCell.textContent = i + 1;
        fileNameCell.textContent = file.name;
        fileSizeCell.textContent = (file.size / 1024).toFixed(2);
        uploadDateCell.textContent = new Date().toLocaleDateString();

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        selectCell.appendChild(checkbox);

        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.onclick = function() {
            viewFile(file);
        };
        actionsCell.appendChild(viewButton);
    }

    fileListContainer.appendChild(table);
}

function deleteSelected() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const filesToDelete = [];

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            filesToDelete.push(index);
        }
    });

    filesToDelete.sort((a, b) => b - a); // Sorting in reverse order to prevent index shifting

    filesToDelete.forEach(index => {
        uploadedFiles.splice(index, 1);
    });

    viewFiles(); // Refresh the file list after deletion
}

function selectAll() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

function searchFiles() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const fileList = document.getElementById('fileList');
    const files = fileList.getElementsByTagName('tr');

    for (let i = 0; i < files.length; i++) {
        const fileName = files[i].getElementsByTagName('td')[1];
        if (fileName) {
            const textValue = fileName.textContent || fileName.innerText;
            if (textValue.toLowerCase().indexOf(filter) > -1) {
                files[i].style.display = "";
            } else {
                files[i].style.display = "none";
            }
        }
    }
}

function viewFile(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const popup = window.open("", "_blank");
        const fileContent = event.target.result;
        if (file.type.startsWith('image/')) {
            popup.document.write("<img src='" + fileContent + "' alt=''>");
        } else if (file.type.startsWith('text/')) {
            popup.document.write("<pre>" + fileContent + "</pre>");
        } else {
            popup.document.write("<p>Unsupported file type. Cannot view.</p>");
        }
    };
    reader.readAsDataURL(file);
}
