// Configuration
const CONFIG = {
    uploadWebhookUrl: 'https://pelningas.app.n8n.cloud/webhook/invoice-upload',
    csvWebhookUrl: 'https://pelningas.app.n8n.cloud/webhook/generate-csv',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxFiles: 20,
    testMode: false // PRODUCTION webhook URL
};

// State
let selectedFiles = [];
let processedData = null;

// DOM Elements
const elements = {
    uploadZone: document.getElementById('upload-zone'),
    fileInput: document.getElementById('file-input'),
    browseBtn: document.getElementById('browse-btn'),
    filePreview: document.getElementById('file-preview'),
    fileList: document.getElementById('file-list'),
    submitBtn: document.getElementById('submit-btn'),
    employeeInput: document.getElementById('employee'),
    saleCorAccInput: document.getElementById('saleCorAcc'),
    
    uploadSection: document.getElementById('upload-section'),
    processingSection: document.getElementById('processing-section'),
    resultsSection: document.getElementById('results-section'),
    errorSection: document.getElementById('error-section'),
    
    processingStatus: document.getElementById('processing-status'),
    progress: document.getElementById('progress'),
    
    totalCount: document.getElementById('total-count'),
    totalAmount: document.getElementById('total-amount'),
    resultsBody: document.getElementById('results-body'),
    
    sheetLink: document.getElementById('sheet-link'),
    csvBtn: document.getElementById('csv-btn'),
    clientsBtn: document.getElementById('clients-btn'),
    resetBtn: document.getElementById('reset-btn'),
    retryBtn: document.getElementById('retry-btn'),
    errorMessage: document.getElementById('error-message')
};

// Initialize
function init() {
    setupEventListeners();
    setupDragAndDrop();
    displayUsername();
}

// Display username in header
function displayUsername() {
    const authData = localStorage.getItem('invoice_auth') || sessionStorage.getItem('invoice_auth');
    if (authData) {
        try {
            const parsed = JSON.parse(authData);
            const usernameDisplay = document.getElementById('username-display');
            if (usernameDisplay) {
                usernameDisplay.textContent = parsed.username;
            }
        } catch (e) {
            console.error('Error parsing auth data:', e);
        }
    }
}

// Logout function
function handleLogout() {
    localStorage.removeItem('invoice_auth');
    sessionStorage.removeItem('invoice_auth');
    window.location.href = 'auth.html';
}

// Event Listeners
function setupEventListeners() {
    elements.browseBtn.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileSelect);
    elements.submitBtn.addEventListener('click', handleSubmit);
    elements.csvBtn.addEventListener('click', handleCsvDownload);
    elements.resetBtn.addEventListener('click', resetForm);
    elements.retryBtn.addEventListener('click', resetForm);
    
    // Clients export button
    if (elements.clientsBtn) {
        elements.clientsBtn.addEventListener('click', handleClientsDownload);
        console.log('✅ Clients button listener attached');
    } else {
        console.warn('⚠️ Clients button not found!');
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Drag & Drop
function setupDragAndDrop() {
    const zone = elements.uploadZone;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
        zone.addEventListener(event, preventDefaults);
    });
    
    ['dragenter', 'dragover'].forEach(event => {
        zone.addEventListener(event, () => zone.classList.add('drag-over'));
    });
    
    ['dragleave', 'drop'].forEach(event => {
        zone.addEventListener(event, () => zone.classList.remove('drag-over'));
    });
    
    zone.addEventListener('drop', handleDrop);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// File Handling
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    addFiles(files);
}

function handleDrop(e) {
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
}

function addFiles(files) {
    const validFiles = files.filter(file => validateFile(file));
    
    if (selectedFiles.length + validFiles.length > CONFIG.maxFiles) {
        showError(`Maksimalus failų skaičius: ${CONFIG.maxFiles}`);
        return;
    }
    
    selectedFiles = [...selectedFiles, ...validFiles];
    updateFilePreview();
    updateSubmitButton();
}

function validateFile(file) {
    if (!CONFIG.allowedTypes.includes(file.type)) {
        showError(`Netinkamas failo tipas: ${file.name}`);
        return false;
    }
    if (file.size > CONFIG.maxFileSize) {
        showError(`Failas per didelis: ${file.name} (max 10MB)`);
        return false;
    }
    return true;
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateFilePreview();
    updateSubmitButton();
}

function updateFilePreview() {
    if (selectedFiles.length === 0) {
        elements.filePreview.classList.add('hidden');
        return;
    }
    
    elements.filePreview.classList.remove('hidden');
    elements.fileList.innerHTML = selectedFiles.map((file, index) => `
        <li>
            <span class="file-name">${file.name}</span>
            <span class="file-size">${formatFileSize(file.size)}</span>
            <button class="remove-file" onclick="removeFile(${index})">×</button>
        </li>
    `).join('');
}

function updateSubmitButton() {
    elements.submitBtn.disabled = selectedFiles.length === 0;
}

// Form Submission
async function handleSubmit() {
    console.log('=== HANDLE SUBMIT ===');
    console.log('TEST MODE:', CONFIG.testMode);
    console.log('WEBHOOK URL:', CONFIG.uploadWebhookUrl);
    
    showSection('processing');
    
    // TEST MODE - Mock data
    if (CONFIG.testMode) {
        console.log('⚠️ USING TEST MODE - MOCK DATA');
        updateProgress(20, 'Siunčiami failai (TEST MODE)...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        updateProgress(60, 'Apdorojami duomenys...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        updateProgress(100, 'Baigta!');
        
        const mockData = {
            success: true,
            message: '⚠️ DĖMESIO: TEST MODE - Tai mock duomenys, ne tikri rezultatai!',
            data: {
                invoices: [
                    {
                        saleDate: '2025-10-01',
                        series: 'TB',
                        number: '18983',
                        clientName: 'UAB Testas',
                        clientCode: '123456789',
                        employee: elements.employeeInput.value || 'Test User',
                        priceExclVat: 468.20,
                        vatRate: 21
                    },
                    {
                        saleDate: '2025-10-02',
                        series: 'AB',
                        number: '18984',
                        clientName: 'UAB Pavyzdys',
                        clientCode: '987654321',
                        employee: elements.employeeInput.value || 'Test User',
                        priceExclVat: 250.50,
                        vatRate: 21
                    }
                ],
                summary: {
                    totalCount: selectedFiles.length,
                    totalAmount: 718.70
                }
            },
            googleSheetUrl: 'https://docs.google.com/spreadsheets/d/14HOchUc9YURdvoyYMMvCRf_M1_uf5L8U28pUr5wX3cc/edit',
            csvWebhookUrl: CONFIG.csvWebhookUrl
        };
        
        processedData = mockData;
        setTimeout(() => showResults(mockData), 500);
        return;
    }
    
    // REAL MODE - API Call
    const formData = new FormData();
    
    // Get form values
    const employeeValue = elements.employeeInput.value.trim();
    const saleCorAccValue = elements.saleCorAccInput.value.trim() || '500101';
    
    console.log('📝 Form values:', {
        employee: employeeValue,
        saleCorAcc: saleCorAccValue
    });
    
    // Add form fields FIRST (before files)
    formData.append('employee', employeeValue);
    formData.append('saleCorAcc', saleCorAccValue);
    
    // Add files
    selectedFiles.forEach((file, index) => {
        formData.append('files', file);
        console.log(`📎 File ${index + 1}:`, file.name);
    });
    
    try {
        updateProgress(20, 'Siunčiami failai...');
        
        // Add employee and saleCorAcc to URL as query parameters too
        const url = new URL(CONFIG.uploadWebhookUrl);
        url.searchParams.append('employee', employeeValue);
        url.searchParams.append('saleCorAcc', saleCorAccValue);
        
        console.log('🚀 Siunčiama į:', url.toString());
        console.log('📁 Failų skaičius:', selectedFiles.length);
        console.log('📋 FormData contents:');
        for (let pair of formData.entries()) {
            if (pair[1] instanceof File) {
                console.log('  ', pair[0], ':', pair[1].name, `(${formatFileSize(pair[1].size)})`);
            } else {
                console.log('  ', pair[0], ':', pair[1]);
            }
        }
        
        console.log('⏳ Siųsiu fetch užklausą...');
        const response = await fetch(url.toString(), {
            method: 'POST',
            body: formData,
            // mode: 'no-cors' // Uncomment jei CORS problemos
        });
        
        console.log('✅ Response gautas!');
        console.log('📊 Response status:', response.status);
        console.log('📊 Response statusText:', response.statusText);
        console.log('📊 Response ok:', response.ok);
        
        updateProgress(60, 'Apdorojami duomenys...');
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP klaida! Statusas: ${response.status} ${response.statusText}`);
        }
        
        // Get response text first
        const responseText = await response.text();
        console.log('Response text:', responseText);
        
        // Try to parse as JSON
        let data;
        try {
            data = JSON.parse(responseText);
            
            // n8n grąžina array, paimame pirmą elementą
            if (Array.isArray(data) && data.length > 0) {
                console.log('⚠️ Response yra array, paimame pirmą elementą');
                data = data[0];
            }
        } catch (jsonError) {
            console.error('JSON parse error:', jsonError);
            console.error('Response text:', responseText);
            throw new Error(`Neteisingas serverio atsakymas. Gautas tekstas: ${responseText.substring(0, 200)}`);
        }
        
        updateProgress(100, 'Baigta!');
        
        console.log('📦 Parsed data:', data);
        console.log('✅ data.success:', data.success);
        
        if (data.success === true || data.success === 'true') {
            processedData = data;
            setTimeout(() => showResults(data), 500);
        } else {
            console.error('❌ Success flag is not true:', data);
            showError(data.message || `Įvyko klaida. Server response: ${JSON.stringify(data).substring(0, 200)}`);
        }
    } catch (error) {
        console.error('Full error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        let errorMsg = error.message;
        if (error.message === 'Failed to fetch') {
            errorMsg = `Failed to fetch - Galimos priežastys:
            
1. CORS problema - n8n webhook neturi CORS headers
2. Webhook URL neteisingas arba workflow neaktyvus
3. Network/firewall blokuoja užklausą

Patikrinkite n8n Respond to Webhook node headers:
- Access-Control-Allow-Origin: *
- Access-Control-Allow-Methods: POST, OPTIONS
- Access-Control-Allow-Headers: Content-Type

Webhook URL: ${CONFIG.uploadWebhookUrl}`;
        }
        
        showError(errorMsg);
    }
}

// Progress
function updateProgress(percent, status) {
    elements.progress.style.width = percent + '%';
    elements.processingStatus.textContent = status;
}

// Results
function showResults(data) {
    showSection('results');
    
    // Update stats
    elements.totalCount.textContent = data.data.summary.totalCount;
    elements.totalAmount.textContent = data.data.summary.totalAmount.toFixed(2) + ' €';
    
    // Update table
    elements.resultsBody.innerHTML = data.data.invoices.map(invoice => `
        <tr>
            <td>${invoice.saleDate}</td>
            <td>${invoice.series}</td>
            <td>${invoice.number}</td>
            <td>${invoice.clientName}</td>
            <td>${invoice.clientCode}</td>
            <td>${invoice.employee}</td>
            <td class="amount">${invoice.priceExclVat.toFixed(2)} €</td>
            <td>${invoice.vatRate}%</td>
        </tr>
    `).join('');
    
    // Update links
    elements.sheetLink.href = data.googleSheetUrl;
}

// Excel Download
async function handleCsvDownload() {
    console.log('🔍 Excel Download pradėtas');
    console.log('📦 processedData:', processedData);
    
    // Jei turime duomenis, iš karto generuojame lokaliai
    if (processedData && processedData.data && processedData.data.invoices) {
        console.log('✅ Turime duomenis, generuojame Excel lokaliai');
        console.log('💡 Excel generuojamas naršyklėje (ne n8n)');
        generateCsvLocally(processedData.data.invoices);
        return;
    }
    
    try {
        // Bandome gauti iš n8n
        console.log('📥 Kreipiamės į CSV webhook:', CONFIG.csvWebhookUrl);
        
        const response = await fetch(CONFIG.csvWebhookUrl, {
            method: 'GET',
            headers: {
                'Accept': 'text/csv'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `saskaitos_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('✅ CSV atsisiųstas!');
    } catch (error) {
        console.error('CSV download error:', error);
        
        // Fallback - generuojame CSV iš turimų duomenų
        if (processedData && processedData.data && processedData.data.invoices) {
            console.log('⚠️ n8n nepasiekiamas, generuojame CSV lokaliai');
            generateCsvLocally(processedData.data.invoices);
        } else {
            showError('Nepavyko sugeneruoti CSV: ' + error.message);
        }
    }
}

// Generate Excel from local data - NAUJAS KODAS pagal Google Sheets struktūrą
function generateCsvLocally(invoices) {
    console.log('📊 ═══════════════════════════════════════');
    console.log('📊 EXCEL EKSPORTAS PRADĖTAS');
    console.log('📊 ═══════════════════════════════════════');
    console.log('📦 Gautas sąskaitų skaičius:', invoices.length);
    console.log('📦 Pilni duomenys:', JSON.stringify(invoices, null, 2));
    
    // TIKSLIAI PAGAL GOOGLE SHEETS SCREENSHOT'Ą
    // 15 stulpelių tvarka:
    const headers = [
        'saleDate*',           // A
        'series*',             // B
        'number*',             // C
        'operationTypeName*',  // D
        'currencyId*',         // E
        'employee*',           // F
        'clientName*',         // G (be kabučių!)
        'clientCode',          // H
        'warehouseName*',      // I
        'items*',              // J
        'quantity*',           // K
        'priceExclVat*',       // L
        'vatRate',             // M
        'vatClassifier',       // N
        'saleCorAcc'           // O
    ];
    
    console.log('\n📋 Excel stulpeliai:', headers);
    
    // Konvertuojame kiekvieną sąskaitą į Excel eilutę
    const rows = invoices.map((inv, index) => {
        console.log(`\n─────────────────────────────────────`);
        console.log(`📄 SĄSKAITA #${index + 1}/${invoices.length}`);
        console.log(`─────────────────────────────────────`);
        console.log('🔍 Originalūs duomenys iš n8n:', inv);
        console.log('🔍 Visi turimi laukeliai:', Object.keys(inv));
        
        // Kuriame eilutę TIKSLIAI pagal Google Sheets struktūrą
        const row = [
            inv.saleDate || '',              // A: saleDate* (YYYY-MM-DD)
            inv.series || '',                // B: series* (pvz. "TB")
            inv.number || '',                // C: number* (pvz. "20001")
            'Pardavimai',                    // D: operationTypeName* (fiksuotas)
            'EUR',                           // E: currencyId* (fiksuotas)
            inv.employee || '',              // F: employee* (iš formos)
            inv.clientName || '',            // G: clientName* (SVARBU: BE kabučių)
            inv.clientCode || '',            // H: clientCode (pvz. "169882159")
            'Pagrindinis',                   // I: warehouseName* (fiksuotas)
            'Prekės pardavimui',             // J: items* (fiksuotas)
            1,                               // K: quantity* (visada 1)
            inv.priceExclVat || 0,           // L: priceExclVat* (skaičius)
            21,                              // M: vatRate (fiksuotas 21)
            'PVM',                           // N: vatClassifier (fiksuotas)
            inv.saleCorAcc || '500101'       // O: saleCorAcc (iš formos arba default)
        ];
        
        console.log('✅ Sukurta Excel eilutė:');
        headers.forEach((header, i) => {
            console.log(`   ${header.padEnd(20)} = ${row[i]}`);
        });
        
        return row;
    });
    
    console.log('\n═══════════════════════════════════════');
    console.log('📊 Excel duomenys paruošti');
    console.log('📊 Eilučių skaičius:', rows.length);
    console.log('═══════════════════════════════════════\n');
    
    // Sujungiame header + duomenys
    const data = [headers, ...rows];
    
    // Sukuriame Excel workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Nustatome stulpelių plotį
    ws['!cols'] = [
        { wch: 12 },  // A: saleDate*
        { wch: 8 },   // B: series*
        { wch: 10 },  // C: number*
        { wch: 18 },  // D: operationTypeName*
        { wch: 10 },  // E: currencyId*
        { wch: 25 },  // F: employee*
        { wch: 40 },  // G: clientName*
        { wch: 15 },  // H: clientCode
        { wch: 15 },  // I: warehouseName*
        { wch: 20 },  // J: items*
        { wch: 10 },  // K: quantity*
        { wch: 15 },  // L: priceExclVat*
        { wch: 10 },  // M: vatRate
        { wch: 15 },  // N: vatClassifier
        { wch: 12 }   // O: saleCorAcc
    ];
    
    // Pridedame worksheet į workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sąskaitos');
    
    // Generuojame failą
    const fileName = `saskaitos_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    console.log('✅ Excel failas sėkmingai sugeneruotas:', fileName);
    console.log('✅ Failas atsisiųstas į Downloads katalogą');
}

// ============================================
// KLIENTŲ EKSPORTAS
// ============================================

// Determine location based on company code format
function determineLocation(clientCode) {
    if (!clientCode) {
        return 'LT'; // default
    }
    
    // Konvertuojame į string jei reikia
    const code = String(clientCode).trim();
    
    // Lietuvos įmonių kodas: 9 skaitmenys
    // Pvz: 123456789
    if (/^\d{9}$/.test(code)) {
        return 'LT';
    }
    
    // Kitu atveju - EU (užsienio įmonė)
    return 'EU';
}

// Extract unique clients from invoices
function extractUniqueClients(invoices) {
    console.log('📊 ═══════════════════════════════════════');
    console.log('📊 KLIENTŲ EKSTRAKTAVIMAS');
    console.log('📊 ═══════════════════════════════════════');
    console.log('📦 Gautas sąskaitų skaičius:', invoices.length);
    
    const clientsMap = new Map();
    
    invoices.forEach((invoice, index) => {
        // Konvertuojame į string, nes gali būti number
        const clientCode = invoice.clientCode ? String(invoice.clientCode).trim() : '';
        const clientName = invoice.clientName ? String(invoice.clientName).trim() : '';
        
        console.log(`\n📄 Sąskaita #${index + 1}:`, {
            clientName,
            clientCode,
            originalType: typeof invoice.clientCode
        });
        
        // Skip jei nėra kliento kodo arba pavadinimo
        if (!clientCode && !clientName) {
            console.log('⚠️ Praleista - nėra kliento duomenų');
            return;
        }
        
        // Unikalumo raktas - clientCode (jei yra), kitaip clientName
        const uniqueKey = clientCode || clientName;
        
        // Jei jau turime šį klientą - praleisti
        if (clientsMap.has(uniqueKey)) {
            console.log('🔄 Dublikatas - praleista (jau turime)');
            return;
        }
        
        // Pridedame naują klientą
        const client = {
            name: clientName,
            isjuridical: 1,
            location: determineLocation(clientCode),
            code: clientCode,
            vatCode: '' // Tuščias - duomenų nėra
        };
        
        clientsMap.set(uniqueKey, client);
        console.log('✅ Pridėtas naujas klientas:', client);
    });
    
    const uniqueClients = Array.from(clientsMap.values());
    
    console.log('\n═══════════════════════════════════════');
    console.log('📊 Rezultatas:');
    console.log('   Iš viso sąskaitų:', invoices.length);
    console.log('   Unikalių klientų:', uniqueClients.length);
    console.log('═══════════════════════════════════════\n');
    
    return uniqueClients;
}

// Generate clients Excel file
function generateClientsExcel(clients) {
    console.log('📊 ═══════════════════════════════════════');
    console.log('📊 KLIENTŲ EXCEL EKSPORTAS');
    console.log('📊 ═══════════════════════════════════════');
    console.log('📦 Klientų skaičius:', clients.length);
    console.log('📦 Pilni duomenys:', JSON.stringify(clients, null, 2));
    
    // Stulpeliai pagal jūsų specifikaciją
    const headers = [
        'name*',         // Kliento pavadinimas (privalomas)
        'isjuridical*',  // Visada 1 (privalomas)
        'location*',     // LT arba EU (privalomas)
        'code',          // Įmonės kodas (neprivalomas)
        'vatCode'        // PVM kodas (neprivalomas, tuščias)
    ];
    
    console.log('\n📋 Excel stulpeliai:', headers);
    
    // Konvertuojame klientus į Excel eilutes
    const rows = clients.map((client, index) => {
        console.log(`\n─────────────────────────────────────`);
        console.log(`👤 KLIENTAS #${index + 1}/${clients.length}`);
        console.log(`─────────────────────────────────────`);
        console.log('🔍 Kliento duomenys:', client);
        
        const row = [
            client.name || '',           // name*
            client.isjuridical || 1,     // isjuridical* (visada 1)
            client.location || 'LT',     // location* (LT/EU)
            client.code || '',           // code
            client.vatCode || ''         // vatCode (tuščias)
        ];
        
        console.log('✅ Sukurta Excel eilutė:');
        headers.forEach((header, i) => {
            console.log(`   ${header.padEnd(15)} = ${row[i]}`);
        });
        
        return row;
    });
    
    console.log('\n═══════════════════════════════════════');
    console.log('📊 Excel duomenys paruošti');
    console.log('📊 Eilučių skaičius:', rows.length);
    console.log('═══════════════════════════════════════\n');
    
    // Sujungiame header + duomenys
    const data = [headers, ...rows];
    
    // Sukuriame Excel workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Nustatome stulpelių plotį
    ws['!cols'] = [
        { wch: 40 },  // name*
        { wch: 12 },  // isjuridical*
        { wch: 10 },  // location*
        { wch: 15 },  // code
        { wch: 15 }   // vatCode
    ];
    
    // Pridedame worksheet į workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Klientai');
    
    // Generuojame failą
    const fileName = `klientai_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    console.log('✅ Klientų Excel failas sėkmingai sugeneruotas:', fileName);
    console.log('✅ Failas atsisiųstas į Downloads katalogą');
}

// Handle clients download button click
function handleClientsDownload() {
    console.log('👥 ═══════════════════════════════════════');
    console.log('👥 KLIENTŲ EKSPORTAS PRADĖTAS');
    console.log('👥 ═══════════════════════════════════════');
    console.log('📦 processedData:', processedData);
    
    // Patikrinkite ar turime duomenis
    if (processedData && processedData.data && processedData.data.invoices) {
        const invoices = processedData.data.invoices;
        console.log('✅ Turime', invoices.length, 'sąskaitas');
        
        // 1. Ištraukiame unikalius klientus
        const uniqueClients = extractUniqueClients(invoices);
        
        if (uniqueClients.length === 0) {
            console.warn('⚠️ Nerasta jokių klientų');
            showError('Nerasta jokių klientų duomenų');
            return;
        }
        
        // 2. Generuojame Excel
        generateClientsExcel(uniqueClients);
        
        console.log('✅ Klientų eksportas baigtas!');
    } else {
        console.error('❌ Nėra apdorotų duomenų');
        showError('Nėra duomenų eksportui. Pirmiausia apdorokite sąskaitas.');
    }
}

// Section Management
function showSection(section) {
    ['upload', 'processing', 'results', 'error'].forEach(s => {
        elements[s + 'Section'].classList.add('hidden');
    });
    elements[section + 'Section'].classList.remove('hidden');
}

// Error Handling
function showError(message) {
    showSection('error');
    elements.errorMessage.textContent = message;
}

// Reset
function resetForm() {
    selectedFiles = [];
    processedData = null;
    elements.fileInput.value = '';
    elements.employeeInput.value = '';
    elements.saleCorAccInput.value = '500101';
    updateFilePreview();
    updateSubmitButton();
    updateProgress(0, '');
    showSection('upload');
}

// Utilities
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Make removeFile global for onclick
window.removeFile = removeFile;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
