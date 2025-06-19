let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

const itemsPerPage = 5;
let currentPage = 1;

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

function renderPagination() {
  const pagination = document.getElementById("paginationContainer");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(vendors.length / itemsPerPage);

  const prevDot = document.createElement("li");
  prevDot.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prevDot.innerHTML = `<a class="page-link" href="#" title="Previous">◀</a>`;
  prevDot.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderVendors();
    }
  });
  pagination.appendChild(prevDot);

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">•</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      renderVendors();
    });
    pagination.appendChild(li);
  }

  const nextDot = document.createElement("li");
  nextDot.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
  nextDot.innerHTML = `<a class="page-link" href="#" title="Next">▶</a>`;
  nextDot.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderVendors();
    }
  });
  pagination.appendChild(nextDot);
}

document.getElementById("vendorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const editIndex = document.getElementById("editIndex").value;
  const fileInput = document.getElementById("vendorImage");
  const file = fileInput.files[0];

  const handleFormSubmission = (base64Image) => {
    const newVendor = {
      name: document.getElementById("vendorName").value,
      mobile: document.getElementById("mobile").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      toBePaid: document.getElementById("toBePaid").value,
      loyalty: document.getElementById("loyalty").value,
      image: base64Image
    };

    if (!newVendor.name || !newVendor.mobile || !newVendor.email) {
      alert("Please fill all required fields.");
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

    // ✅ Close Modal after submit
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

document.getElementById("addVendorBtn").addEventListener("click", function () {
  document.getElementById("vendorForm").reset();
  document.getElementById("editIndex").value = "";
  document.getElementById("addVendorModalLabel").textContent = "Add New Vendor";
  document.getElementById("vendorSubmitBtn").textContent = "Add Vendor";
});


window.onload = renderVendors;
