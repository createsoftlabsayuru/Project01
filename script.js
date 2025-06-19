let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

//item count for one page
const itemsPerPage = 5;
let currentPage = 1;

// render vendorss
function renderVendors() {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVendors = vendors.slice(startIndex, endIndex);

  paginatedVendors.forEach((vendor, index) => {
    const realIndex = startIndex + index;
    const row = `
      <tr>
        <td>
          <img src="${vendor.image}" class="rounded-circle me-2" style="width: 40px; height: 40px;" alt="Profile" />
          ${vendor.name}
        </td>
        <td>${vendor.mobile}</td>
        <td>${vendor.email}</td>
        <td>${vendor.address}</td>
        <td>Rs. ${vendor.toBePaid}/=</td>
        <td>${vendor.loyalty}</td>
        <td>
          <button class="btn btn-sm btn-outline-secondary" onclick="editVendor(${realIndex})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteVendor(${realIndex})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
    tableBody.innerHTML += row;
  });

  renderPagination();
}

// pagination setup methord
function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(vendors.length / itemsPerPage);

  // « Prev Arrow
  const prevBtn = document.createElement("li");
  prevBtn.className = `page-item prev-next ${currentPage === 1 ? "disabled" : ""}`;
  prevBtn.innerHTML = `<a class="page-link" href="#" title="Previous">&laquo;</a>`;
  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderVendors();
    }
  });
  pagination.appendChild(prevBtn);

  // Dots
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#"></a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      renderVendors();
    });
    pagination.appendChild(li);
  }

  // » Next Arrow
  const nextBtn = document.createElement("li");
  nextBtn.className = `page-item prev-next ${currentPage === totalPages ? "disabled" : ""}`;
  nextBtn.innerHTML = `<a class="page-link" href="#" title="Next">&raquo;</a>`;
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderVendors();
    }
  });
  pagination.appendChild(nextBtn);
}

// add new Vendor
document.getElementById("vendorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const editIndex = document.getElementById("editIndex").value;
  const fileInput = document.getElementById("vendorImage");
  const file = fileInput.files[0];

  const handleFormSubmission = (base64Image) => {
  const newVendor = {
    name: document.getElementById("vendorName").value.trim(),
    mobile: document.getElementById("mobile").value.trim(),
    email: document.getElementById("email").value.trim(),
    address: document.getElementById("address").value.trim(),
    toBePaid: document.getElementById("toBePaid").value.trim(),
    loyalty: document.getElementById("loyalty").value.trim(),
    image: base64Image
  };

  // Basic required field check
  if (!newVendor.name || !newVendor.mobile || !newVendor.email) {
    alert("Please fill all required fields.");
    return;
  }

  // Mobile number validation (digits only and length check)
  const mobileRegex = /^\d{10}$/; // Adjust 10 to your needed length
  if (!mobileRegex.test(newVendor.mobile)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  if (editIndex !== "") {
    vendors[editIndex] = newVendor;
  } else {
    vendors.push(newVendor);
  }

  localStorage.setItem("vendors", JSON.stringify(vendors));
  renderVendors();

  document.getElementById("vendorForm").reset();
  document.getElementById("editIndex").value = "";

  const modalElement = document.getElementById("addVendorModal");
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) {
    modalInstance.hide();
  }
};


  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      handleFormSubmission(reader.result);
    };
    reader.readAsDataURL(file);
  } else {
    const existingImage = vendors[editIndex]?.image || "";
    handleFormSubmission(existingImage);
  }
});

// convert model form text and cler user ennater data
document.getElementById("addVendorBtn").addEventListener("click", function () {
  document.getElementById("vendorForm").reset();
  document.getElementById("editIndex").value = "";
  document.getElementById("addVendorModalLabel").textContent = "Add New Vendor";
  document.getElementById("vendorSubmitBtn").textContent = "Add Vendor";
});

// delete option
function deleteVendor(index) {
  if (confirm("Are you sure you want to delete this vendor?")) {
    vendors.splice(index, 1);
    localStorage.setItem("vendors", JSON.stringify(vendors));
    renderVendors();
  }
}

// edit text
function editVendor(index) {
  const vendor = vendors[index];
  document.getElementById("vendorName").value = vendor.name;
  document.getElementById("mobile").value = vendor.mobile;
  document.getElementById("email").value = vendor.email;
  document.getElementById("address").value = vendor.address;
  document.getElementById("toBePaid").value = vendor.toBePaid;
  document.getElementById("loyalty").value = vendor.loyalty;
  document.getElementById("editIndex").value = index;

  document.getElementById("addVendorModalLabel").textContent = "Edit Vendor";
  document.getElementById("vendorSubmitBtn").textContent = "Update Vendor";

  const modal = new bootstrap.Modal(document.getElementById("addVendorModal"));
  modal.show();
}


window.onload = renderVendors;
