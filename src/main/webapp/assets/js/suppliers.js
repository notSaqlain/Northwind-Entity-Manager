(function () {
    "use strict";

    var API_URL = "api/suppliers";
    var suppliers = [];
    var form = document.getElementById("supplierForm");
    var formTitle = document.getElementById("formTitle");
    var formMode = document.getElementById("formMode");
    var submitButton = document.getElementById("submitButton");
    var cancelButton = document.getElementById("cancelButton");
    var refreshButton = document.getElementById("refreshButton");
    var searchInput = document.getElementById("searchInput");
    var tableBody = document.getElementById("suppliersTableBody");
    var recordCount = document.getElementById("recordCount");
    var message = document.getElementById("message");

    var fields = [
        "supplierID",
        "companyName",
        "contactName",
        "contactTitle",
        "address",
        "city",
        "region",
        "postalCode",
        "country",
        "phone",
        "fax",
        "homePage"
    ];

    document.addEventListener("DOMContentLoaded", function () {
        form.addEventListener("submit", onFormSubmit);
        cancelButton.addEventListener("click", resetForm);
        refreshButton.addEventListener("click", loadSuppliers);
        searchInput.addEventListener("input", renderTable);
        tableBody.addEventListener("click", onTableAction);

        loadSuppliers();
    });

    function request(method, url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("Accept", "application/json");

        if (data) {
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }

            var response = parseJson(xhr.responseText);

            if (xhr.status >= 200 && xhr.status < 300) {
                callback(null, response);
                return;
            }

            callback(new Error("Errore HTTP " + xhr.status));
        };

        xhr.onerror = function () {
            callback(new Error("Impossibile contattare la servlet."));
        };

        xhr.send(data ? JSON.stringify(data) : null);
    }

    function loadSuppliers() {
        setLoading(true);
        showMessage("");

        request("GET", API_URL, null, function (error, data) {
            setLoading(false);

            if (error) {
                showMessage(error.message, true);
                renderEmptyState("Impossibile caricare i fornitori.");
                return;
            }

            suppliers = Array.isArray(data) ? data : [];
            renderTable();
        });
    }

    function onFormSubmit(event) {
        event.preventDefault();

        var supplier = readForm();
        var isEdit = supplier.supplierID > 0;
        var method = isEdit ? "PUT" : "POST";

        submitButton.disabled = true;
        showMessage("");

        request(method, API_URL, supplier, function (error, data) {
            submitButton.disabled = false;

            if (error || !data || data.success !== true) {
                showMessage("Salvataggio non riuscito.", true);
                return;
            }

            resetForm();
            showMessage(isEdit ? "Fornitore aggiornato." : "Fornitore inserito.");
            loadSuppliers();
        });
    }

    function onTableAction(event) {
        var button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        var id = Number(button.getAttribute("data-id"));
        var action = button.getAttribute("data-action");
        var supplier = findSupplier(id);

        if (!supplier) {
            showMessage("Fornitore non trovato.", true);
            return;
        }

        if (action === "edit") {
            fillForm(supplier);
            return;
        }

        if (action === "delete") {
            deleteSupplier(supplier);
        }
    }

    function deleteSupplier(supplier) {
        var name = supplier.companyName || ("ID " + supplier.supplierID);

        if (!window.confirm("Eliminare il fornitore " + name + "?")) {
            return;
        }

        request("DELETE", API_URL + "?id=" + encodeURIComponent(supplier.supplierID), null, function (error, data) {
            if (error || !data || data.success !== true) {
                showMessage("Eliminazione non riuscita.", true);
                return;
            }

            showMessage("Fornitore eliminato.");
            if (Number(document.getElementById("supplierID").value) === supplier.supplierID) {
                resetForm();
            }
            loadSuppliers();
        });
    }

    function renderTable() {
        var query = searchInput.value.trim().toLowerCase();
        var rows = suppliers.filter(function (supplier) {
            if (!query) {
                return true;
            }

            return [
                supplier.companyName,
                supplier.contactName,
                supplier.city,
                supplier.country,
                supplier.phone
            ].join(" ").toLowerCase().indexOf(query) !== -1;
        });

        tableBody.textContent = "";

        if (!rows.length) {
            renderEmptyState(query ? "Nessun fornitore corrisponde alla ricerca." : "Nessun fornitore disponibile.");
            updateCount(0);
            return;
        }

        rows.forEach(function (supplier) {
            var row = document.createElement("tr");

            appendCell(row, supplier.supplierID);
            appendCell(row, supplier.companyName);
            appendCell(row, supplier.contactName);
            appendCell(row, supplier.city);
            appendCell(row, supplier.country);
            appendCell(row, supplier.phone);
            appendActions(row, supplier.supplierID);

            tableBody.appendChild(row);
        });

        updateCount(rows.length);
    }

    function appendCell(row, value) {
        var cell = document.createElement("td");
        cell.textContent = value || "-";
        row.appendChild(cell);
    }

    function appendActions(row, id) {
        var cell = document.createElement("td");
        var editButton = document.createElement("button");
        var deleteButton = document.createElement("button");

        cell.className = "actions-cell";

        editButton.type = "button";
        editButton.className = "secondary-button";
        editButton.textContent = "Modifica";
        editButton.setAttribute("data-action", "edit");
        editButton.setAttribute("data-id", id);

        deleteButton.type = "button";
        deleteButton.className = "danger-button";
        deleteButton.textContent = "Elimina";
        deleteButton.setAttribute("data-action", "delete");
        deleteButton.setAttribute("data-id", id);

        cell.appendChild(editButton);
        cell.appendChild(deleteButton);
        row.appendChild(cell);
    }

    function renderEmptyState(text) {
        tableBody.textContent = "";

        var row = document.createElement("tr");
        var cell = document.createElement("td");
        cell.className = "empty-state";
        cell.colSpan = 7;
        cell.textContent = text;
        row.appendChild(cell);
        tableBody.appendChild(row);
    }

    function readForm() {
        var supplier = {};

        fields.forEach(function (field) {
            var element = document.getElementById(field);
            var value = element.value.trim();
            supplier[field] = field === "supplierID" ? Number(value || 0) : value;
        });

        return supplier;
    }

    function fillForm(supplier) {
        fields.forEach(function (field) {
            document.getElementById(field).value = supplier[field] || "";
        });

        formTitle.textContent = "Modifica fornitore";
        formMode.textContent = "Modifica ID " + supplier.supplierID;
        submitButton.textContent = "Aggiorna";
        document.getElementById("companyName").focus();
    }

    function resetForm() {
        form.reset();
        document.getElementById("supplierID").value = "";
        formTitle.textContent = "Nuovo fornitore";
        formMode.textContent = "Inserimento";
        submitButton.textContent = "Salva";
        submitButton.disabled = false;
    }

    function findSupplier(id) {
        return suppliers.find(function (supplier) {
            return Number(supplier.supplierID) === id;
        });
    }

    function updateCount(count) {
        var total = suppliers.length;
        var suffix = total === 1 ? "fornitore" : "fornitori";
        recordCount.textContent = count + " di " + total + " " + suffix;
    }

    function setLoading(isLoading) {
        refreshButton.disabled = isLoading;
        refreshButton.textContent = isLoading ? "Caricamento..." : "Aggiorna";
    }

    function showMessage(text, isError) {
        message.textContent = text;
        message.className = "message";

        if (!text) {
            return;
        }

        message.classList.add("is-visible");
        if (isError) {
            message.classList.add("is-error");
        }
    }

    function parseJson(text) {
        if (!text) {
            return null;
        }

        try {
            return JSON.parse(text);
        } catch (error) {
            return null;
        }
    }
})();
