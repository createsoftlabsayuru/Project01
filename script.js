let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

// item count for one page
const itemsPerPage = 5;
let currentPage = 1;
// This array will hold the vendors after search and filter are applied.
// renderVendors will then paginate this array.
let displayedVendors = [];

// render vendors
function renderVendors() {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  // Use displayedVendors for pagination instead of the original vendors array
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVendors = displayedVendors.slice(startIndex, endIndex);

  paginatedVendors.forEach((vendor, index) => {
    // We need to find the real index in the original 'vendors' array
    // for edit and delete operations, as 'paginatedVendors' is a slice.
    // This is crucial because editVendor and deleteVendor modify the 'vendors' array.
    const realIndex = vendors.findIndex(v => v.email === vendor.email && v.mobile === vendor.mobile); // Assuming email and mobile are unique identifiers. Adjust if needed.

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

// pagination setup method
function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  // Calculate total pages based on displayedVendors length
  const totalPages = Math.ceil(displayedVendors.length / itemsPerPage);

  // If there are no pages (no vendors or no filtered vendors), hide pagination
  if (totalPages <= 1 && displayedVendors.length <= itemsPerPage) {
    pagination.style.display = 'none';
    return;
  } else {
    pagination.style.display = 'flex'; // Or 'block', depending on your CSS
  }

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

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#"></a>`; // Display page numbers
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

    if (editIndex !== "") {
      vendors[editIndex] = newVendor;
    } else {
      vendors.push(newVendor);
    }

    localStorage.setItem("vendors", JSON.stringify(vendors));
    // After adding/editing, re-apply search/filter to ensure pagination is correct
    applySearchAndFilter();

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

// convert model form text and clear user entered data
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
    // After deletion, re-apply search/filter to ensure pagination is correct
    applySearchAndFilter();
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

// search and filter
function applySearchAndFilter() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
  const selectedStatus = document.getElementById("filterSelect").value.toLowerCase().trim();

  // Filter the original 'vendors' array
  let tempFilteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm) ||
      vendor.mobile.toLowerCase().includes(searchTerm) ||
      vendor.email.toLowerCase().includes(searchTerm) ||
      vendor.address.toLowerCase().includes(searchTerm) ||
      vendor.toBePaid.toLowerCase().includes(searchTerm);

    const matchesLoyalty =
      selectedStatus === "" || vendor.loyalty.toLowerCase().trim() === selectedStatus;

    return matchesSearch && matchesLoyalty;
  });

  // Update displayedVendors with the filtered results
  displayedVendors = tempFilteredVendors;

  // Reset currentPage to 1 when a new search/filter is applied
  currentPage = 1;

  // Re-render vendors (which will now use displayedVendors for pagination)
  renderVendors();
}

document.getElementById("searchInput").addEventListener("input", applySearchAndFilter);
document.getElementById("filterSelect").addEventListener("change", applySearchAndFilter);

// Initialize the displayedVendors and render on load
window.onload = () => {
  displayedVendors = [...vendors]; // Initially, all vendors are displayed
  renderVendors();
};

function exportToCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Name,Mobile,Email,Address,To Be Paid,Loyalty\n";
  displayedVendors.forEach(vendor => {
    const row = `${vendor.name},${vendor.mobile},${vendor.email},${vendor.address},${vendor.toBePaid},${vendor.loyalty}`;
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "vendors.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportToExcel() {
  let table = `<table border='1'><tr>
    <th>Name</th><th>Mobile</th><th>Email</th><th>Address</th><th>To Be Paid</th><th>Loyalty</th>
  </tr>`;

  displayedVendors.forEach(v => {
    table += `<tr>
      <td>${v.name}</td><td>${v.mobile}</td><td>${v.email}</td><td>${v.address}</td><td>${v.toBePaid}</td><td>${v.loyalty}</td>
    </tr>`;
  });

  table += `</table>`;

  const blob = new Blob([table], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "vendors.xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportToPDF() {
  const doc = new window.jspdf.jsPDF(); // Ensure jsPDF is included in your HTML
  let y = 20;

  doc.setFontSize(14);
  doc.text("Vendor List", 14, y);
  y += 10;

  displayedVendors.forEach((v, i) => {
    doc.setFontSize(10);
    doc.text(`${i + 1}. ${v.name}, ${v.mobile}, ${v.email}, ${v.address}, Rs.${v.toBePaid}, ${v.loyalty}`, 10, y);
    y += 7;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("vendors.pdf");
}

function printTable() {
  let content = `<h3>Vendor List</h3><table border="1" style="width:100%;border-collapse:collapse">
    <tr>
      <th>Name</th><th>Mobile</th><th>Email</th><th>Address</th><th>To Be Paid</th><th>Loyalty</th>
    </tr>`;

  displayedVendors.forEach(v => {
    content += `<tr>
      <td>${v.name}</td><td>${v.mobile}</td><td>${v.email}</td><td>${v.address}</td><td>${v.toBePaid}</td><td>${v.loyalty}</td>
    </tr>`;
  });

  content += "</table>";

  const printWindow = window.open("", "", "height=600,width=800");
  printWindow.document.write("<html><head><title>Print Vendors</title></head><body>");
  printWindow.document.write(content);
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.print();
}
