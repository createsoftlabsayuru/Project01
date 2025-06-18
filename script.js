// script.js

let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

function renderVendors() {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  vendors.forEach((vendor, index) => {
    const row = `
      <tr>
        <td><img src="src/image${index + 2}.jpg" class="rounded-circle me-2" style="width: 40px; height: 40px;" alt="Profile" />${vendor.name}</td>
        <td>${vendor.mobile}</td>
        <td>${vendor.email}</td>
        <td>${vendor.address}</td>
        <td>Rs. ${vendor.toBePaid}/=</td>
        <td>${vendor.loyalty}</td>
        <td>
          <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteVendor(${index})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
    tableBody.innerHTML += row;
  });
}

document.getElementById("vendorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const newVendor = {
    name: document.getElementById("vendorName").value,
    mobile: document.getElementById("mobile").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
    toBePaid: document.getElementById("toBePaid").value,
    loyalty: document.getElementById("loyalty").value,
  };

  // Simple validation more try 
  if (!newVendor.name || !newVendor.mobile || !newVendor.email) {
    alert("Please fill all fields.");
    return;
  }

  vendors.push(newVendor);
  localStorage.setItem("vendors", JSON.stringify(vendors));
  renderVendors();

  document.getElementById("vendorForm").reset();
  const modal = bootstrap.Modal.getInstance(document.getElementById("addVendorModal"));
  modal.hide();
});

function deleteVendor(index) {
  vendors.splice(index, 1);
  localStorage.setItem("vendors", JSON.stringify(vendors));
  renderVendors();
}

window.onload = renderVendors;
