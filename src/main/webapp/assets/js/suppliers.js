// Developed by Bisognin Luca - May 2026

// GESTIONE FORNITORI //
// Questo file contiene la logica per gestire i fornitori con i metodi CRUD: 
// - Create (saveSupplier),
// - Read (loadSuppliers),
// - Update (fillForm e saveSupplier), 
// - Delete (deleteSupplier),
// Esiste anche un metodo per filtrare i fornitori caricati => Search (renderTable)
// Tramite richieste XMLHttpRequest alla servlet Java e la manipolazione del DOM, la pagina viene aggiornata in modo dinamico


// URL della servlet Java
var API_URL = "api/suppliers";

// array per memorizzare i fornitori caricati dal server
var suppliers = [];

// elementi DOM
var form = document.getElementById("supplierForm");
var tableBody = document.getElementById("suppliersTableBody");
var searchInput = document.getElementById("searchInput");
var submitButton = document.getElementById("submitButton");
var cancelButton = document.getElementById("cancelButton");
var message = document.getElementById("message");

// caricamento contenuto dopo il caricamento della pagina
document.addEventListener("DOMContentLoaded", function () {

    // fornitori
    loadSuppliers();

    // Listener ai pulsanti e input //
    form.addEventListener("submit", saveSupplier); // invio form
    searchInput.addEventListener("input", renderTable); // ricerca
    cancelButton.addEventListener("click", resetForm); // pulsante per annullare
    tableBody.addEventListener("click", tableActions); // click sui bottoni della tabella
});

// METODI CRUD //

// READ: carica i fornitori dal server e aggiorna la tabella
function loadSuppliers() {

    // Creazione richiesta AJAX
    var xhr = new XMLHttpRequest();

    // Configura richiesta GET
    xhr.open("GET", API_URL, true);

    // Tipo risposta
    xhr.setRequestHeader("Accept", "application/json");

    // Controllo cambiamento stato
    xhr.onreadystatechange = function () {

        // Se richiesta completata
        if (xhr.readyState === 4) {

            // Se tutto ok
            if (xhr.status === 200) {

                // Converte JSON in array JavaScript
                suppliers = JSON.parse(xhr.responseText);

                // Aggiorna tabella
                renderTable();

            } else {

                showMessage("Errore caricamento fornitori", true);
            }
        }
    };

    // Invio richiesta
    xhr.send();
}

// CREATE: SALVATAGGIO FORNITORE
function saveSupplier(event) {
    event.preventDefault(); // refresh disabilitato

    // corpo della richiesta con i dati del fornitore
    var supplier = {

        supplierID: Number(document.getElementById("supplierID").value || 0),
        companyName: document.getElementById("companyName").value,
        contactName: document.getElementById("contactName").value,
        city: document.getElementById("city").value,
        country: document.getElementById("country").value,
        phone: document.getElementById("phone").value
    };

    // se ID esiste => modifica
    var isEdit = supplier.supplierID > 0;

    // metodo HTTP della richiesta
    var method; 
    if (isEdit) method == "PUT";
    else method = "POST";

    // XMLHttpRequest per salvare un fornitore
    var xhr = new XMLHttpRequest();

    // apertura richiesta (metodo definito prima)
    xhr.open(method, API_URL, true); 
    
    // tipologia dati => JSON
    xhr.setRequestHeader("Content-Type", "application/json");

    // risposta in JSON
    xhr.setRequestHeader("Accept", "application/json");

    // check della risposta
    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 201) { // success

                var response = JSON.parse(xhr.responseText);

                if (response.success) {

                    // messaggio da mostrare all'utente
                    if (isEdit) showMessage("Fornitore aggiornato");
                    else showMessage("Fornitore inserito");

                    // clean del form
                    resetForm();

                    // ricarica i fornitori per aggiornare la tabella
                    loadSuppliers();

                } 
                else showMessage("Errore salvataggio", true);

            } 
            else showMessage("Errore server", true);
        }
    };

    // invio dati in JSON
    xhr.send(JSON.stringify(supplier));
}

// UPDATE: riempie i campi del form con i dati del fornitore da modificare
function fillForm(supplier) {

    document.getElementById("supplierID").value = supplier.supplierID;
    document.getElementById("companyName").value = supplier.companyName;
    document.getElementById("contactName").value = supplier.contactName;
    document.getElementById("city").value = supplier.city;
    document.getElementById("country").value = supplier.country;
    document.getElementById("phone").value = supplier.phone;

    submitButton.textContent = "Aggiorna";
}

// DELETE: elimina fornitore
function deleteSupplier(id) {

    // conferma come fallback
    if (!confirm("Vuoi eliminare il fornitore?")) return;

    // XMLHttpsRequest per eliminare un fornitore
    var xhr = new XMLHttpRequest();

    // richiesta DELETE
    xhr.open("DELETE", API_URL + "?id=" + id, true);

    // check dello stato della richiesta
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) { // success
                var response = JSON.parse(xhr.responseText);

                if (response.success) {
                    showMessage("Fornitore eliminato");
                    loadSuppliers();
                } 
                else showMessage("Errore eliminazione", true);

            } 
            else showMessage("Errore server", true);
        }
    };

    // invio richiesta
    xhr.send();
}

// SEARCH: filtra e mostra i dati nella tabella in base alla ricerca
function renderTable() {
    var search = searchInput.value.toLowerCase(); // testo ricerca
    tableBody.innerHTML = ""; // pulisce tabella

    // filtra i fornitori in base alla ricerca (companyName, contactName, country)
    var filtered = suppliers.filter(function (supplier) {

        return (
            supplier.companyName.toLowerCase().includes(search) ||
            supplier.contactName.toLowerCase().includes(search) ||
            supplier.country.toLowerCase().includes(search)
        );
    });

    // nessun risultato => tabella vuota
    if (filtered.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Nessun fornitore trovato
                </td>
            </tr>
        `;

        return;
    }

    // righe
    filtered.forEach(function (supplier) {
        var row = document.createElement("tr");

        row.innerHTML = `

            <td>${supplier.supplierID}</td>
            <td>${supplier.companyName}</td>
            <td>${supplier.contactName}</td>
            <td>${supplier.city}</td>
            <td>${supplier.country}</td>
            <td>${supplier.phone}</td>

            <td>
                <button 
                    data-action="edit"
                    data-id="${supplier.supplierID}">
                    Modifica
                </button>

                <button 
                    data-action="delete"
                    data-id="${supplier.supplierID}">
                    Elimina
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// GESTIONE EVENTI //

// gestisce i pulsanti di modifica ed eliminazione nella tabella
function tableActions(event) {

    var button = event.target; // recupera bottone cliccato
    var action = button.dataset.action; // recupera azione (edit o delete)
    var id = Number(button.dataset.id); // id fornitore

    // cerca fornitore per ID
    var supplier = suppliers.find(function (s) {
        return s.supplierID === id;
    });

    if (!supplier) return; // fornitore non trovato

    // modifica fornitore
    if (action === "edit") fillForm(supplier);

    // eliminazione fornitore
    if (action === "delete") deleteSupplier(id);
}

// reset form dei dati e stato pagina
function resetForm() {
    // pulisce i campi
    form.reset();

    // svuota id
    document.getElementById("supplierID").value = "";

    // reset bottone
    submitButton.textContent = "Salva";
}

// mostra i messaggi (errori, ecc.) all'utente
function showMessage(text, isError) {
    message.textContent = text;

    if (isError) message.style.color = "red";
    else message.style.color = "green";
}