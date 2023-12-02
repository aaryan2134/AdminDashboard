let users = []; 
let currentPage = 1;
const itemsPerPage = 10;
let totalPages;

async function fetchData() {
  const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
  users = await response.json();

  users.forEach(user => {
      user.selected = false;
      user.editing = false;
  });

  renderTable();
}

function renderTable() {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredUsers = filterUsers();

  for (let i = startIndex; i < endIndex && i < filteredUsers.length; i++) {
    const user = filteredUsers[i];
    const row = createTableRow(user);
    tableBody.appendChild(row);

    if (user.editing) {
      const editableCells = row.querySelectorAll('.editable');
      editableCells.forEach(cell => {
        cell.classList.add('editable-highlight');
      });
    }
  }

  updatePagination();
}

// Create a table row for a user
function createTableRow(user) {
  const row = document.createElement('tr');
  row.innerHTML = `
      <td><input type="checkbox" data-user-id="${user.id}" onclick="selectRow(event, ${user.id})" ${user.selected ? 'checked' : ''}></td>
      <td>${user.id}</td>
      <td contenteditable="${user.editing}" oninput="updateCellValue(${user.id}, 'name', this.innerText)" class="${user.editing ? 'editable' : ''}">${user.name}</td>
      <td contenteditable="${user.editing}" oninput="updateCellValue(${user.id}, 'email', this.innerText)" class="${user.editing ? 'editable' : ''}">${user.email}</td>
      <td contenteditable="${user.editing}" oninput="updateCellValue(${user.id}, 'role', this.innerText)" class="${user.editing ? 'editable' : ''}">${user.role}</td>
      <td>
          <button class="edit" onclick="editRow(${user.id})" ${user.editing ? 'style="display: none;"' : ''}>Edit</button>
          <button class="delete" onclick="deleteRow(${user.id})" ${user.editing ? 'style="display: none;"' : ''}>Delete</button>
          <button class="save" onclick="saveRow(${user.id})" ${user.editing ? '' : 'style="display: none;"'}>Save</button>
      </td>
  `;

  if (user.selected) {
      row.classList.add('selected-row');
  }

  return row;
}

function editRow(id) {
  const editedUser = users.find(user => user.id == id);
  editedUser.editing = true;
  renderTable();
}


function filterUsers() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  return users.filter(user =>
      user.id.includes(searchInput) ||
      user.name.toLowerCase().includes(searchInput) ||
      user.email.toLowerCase().includes(searchInput) ||
      user.role.toLowerCase().includes(searchInput)
  );
}

function search() {
  renderTable();
}

function updatePagination() {
    const totalFilteredUsers = filterUsers().length;
    totalPages = Math.ceil(totalFilteredUsers / itemsPerPage);

    document.getElementById('currentPage').innerText = `Page ${currentPage}`;

    const previousPageButton = document.querySelector('.previous-page');
    const nextPageButton = document.querySelector('.next-page');

    previousPageButton.disabled = currentPage == 1;
    nextPageButton.disabled = currentPage == totalPages;
}


function goToPage(page) {
    currentPage = page;
    renderTable();
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

function deleteSelected() {
  users = users.filter(user => !user.selected);
  renderTable();

  const selectAllCheckbox = document.querySelector('input[type="checkbox"]');
  if (selectAllCheckbox) {
      selectAllCheckbox.checked = false;
  }
}

function selectRow(event, id) {
  const selectedUser = users.find(user => user.id == id);

  if (selectedUser) {
    selectedUser.selected = event.target.checked;
    console.log(`User ${id} selected: ${selectedUser.selected}`);
    renderTable();
  } else {
    console.error(`User with ID ${id} not found`);
  }
}


function editRow(id) {
  console.log(users)
  const editedUser = users.find(user => user.id == id);
  console.log(editedUser)
  if (editedUser) {
    editedUser.editing = true;
    console.log(`Editing user ${id}`);
    renderTable();
  } else {
    console.error(`User with ID ${id} not found`);
  }
}


function saveRow(id) {
  const savedUser = users.find(user => user.id == id);
  savedUser.editing = false;
  console.log(`Saved user ${id}`);
  renderTable();
}

function deleteRow(id) {
  users = users.filter(user => user.id != id);
  console.log(`Deleted user ${id}`);
  renderTable();
}

function updateCellValue(id, property, value) {
  const editedUser = users.find(user => user.id == id);
  editedUser[property] = value;
}

function selectAllRows(event) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const isChecked = event.target.checked;

  checkboxes.forEach((checkbox, index) => {
    if (index !== 0) {
      const id = checkbox.dataset.userId;
      const user = users.find(user => user.id === id);

      if (user) {
        user.selected = isChecked;
      }
    }
  });

  renderTable();
}

fetchData();
