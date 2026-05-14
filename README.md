# Northwind Entity Manager 🚀

Un'applicazione web completa per la gestione CRUD (Create, Read, Update, Delete) di una tabella del database **Northwind**. Il progetto dimostra l'integrazione tra un backend robusto in Java e un frontend dinamico in JavaScript.

---

## 🏗️ Architettura del Sistema

Il progetto segue un'architettura a livelli (Layered Architecture) per garantire la separazione delle responsabilità:

*   **Livello di Persistenza (Hibernate):** Mappatura delle classi Java (POJO) sulle tabelle del database tramite annotazioni JPA.
*   **Livello di Logica (Servlet):** Il Controller dell'applicazione gestisce le richieste HTTP, comunica con il DAO e restituisce risposte in formato JSON.
*   **Livello di Presentazione (HTML/JS):** Una Single Page Application (SPA) che interagisce con le API in modo asincrono.

---

## 🛠️ Requisiti Tecnici

### Backend (Java)
- **Hibernate:** Utilizzo di annotazioni JPA (`@Entity`, `@Table`, `@Id`) per la mappatura ORM.
- **Servlet:** Esposizione di endpoint API su `/api/data` per gestire i verbi HTTP:
  - `GET`: Recupero di tutti i record.
  - `POST`: Inserimento di un nuovo record.
  - `PUT`: Aggiornamento di un record esistente tramite ID.
  - `DELETE`: Rimozione di un record tramite ID.
- **Maven:** Gestione delle dipendenze e build del progetto.

### Frontend (Web)
- **Interfaccia:** Tabella HTML dinamica e form di input.
- **JavaScript:** 
  - Comunicazione tramite `XMLHttpRequest`.
  - Manipolazione del DOM per aggiornamenti in tempo reale (senza refresh della pagina).
  - Gestione eventi per i tasti "Modifica" ed "Elimina".

---

## 🚀 Guida all'Avvio

### 1. Prerequisiti
*   **Java JDK 8** o superiore.
*   **Apache Tomcat 9** (o versioni compatibili).
*   **Maven** installato.
*   **SQLite** (per il database Northwind).

### 2. Configurazione Database
1. Scaricare il database Northwind da [questo repository](https://github.com/jpwhite3/northwind-SQLite3).
2. Configurare il file `hibernate.cfg.xml` inserendo il percorso corretto al file del database:
   ```xml
   <property name="connection.url">jdbc:sqlite:/percorso/verso/northwind.db</property>
   ```

### 3. Clonare il Repository
```bash
git clone https://github.com/notSaqlain/Northwind-Entity-Manager.git
cd Northwind-Entity-Manager
```

### 4. Build con Maven
Maven scaricherà automaticamente tutte le dipendenze e compilerà il progetto:
```bash
mvn clean package
```
Il file `.war` verrà generato in `target/northwind_entity_manager.war`.

### 5. Deploy su Tomcat
1. Copiare il file `.war` nella cartella `webapps/` di Tomcat:
   ```bash
   cp target/northwind_entity_manager.war /path/to/tomcat/webapps/
   ```
2. Avviare (o riavviare) Tomcat:
   ```bash
   # Linux / macOS
   /path/to/tomcat/bin/startup.sh

   # Windows
   /path/to/tomcat/bin/startup.bat
   ```
3. Aprire il browser e navigare su:
   ```
   http://localhost:8080/northwind_entity_manager
   ```

> **Nota:** La cartella `target/` **non è inclusa nel repository** perché è generata automaticamente da Maven ad ogni build. Non è necessario aggiungerla manualmente.
