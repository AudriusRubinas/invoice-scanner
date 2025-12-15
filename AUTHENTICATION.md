# 🔐 Authentication Setup - Autentifikacijos Konfigūracija

## 📋 Kas Padaryta

Pridėtas paprastas, bet saugus autentifikacijos mechanizmas:

✅ Prisijungimo puslapis (`auth.html`)
✅ Sesijų valdymas (localStorage / sessionStorage)
✅ Automatinis redirect'as jei neprisijungęs
✅ "Atsijungti" mygtukas
✅ Vartotojo vardo rodymas header'yje
✅ 30 dienų sesijos galiojimas

---

## 🔧 Kaip pridėti/pakeisti vartotojus

### 1️⃣ **Atidarykite `auth.html`**

### 2️⃣ **Raskite AUTH_CONFIG sekciją (~line 112):**

```javascript
const AUTH_CONFIG = {
    // Vartotojai: username → password
    users: {
        'neringa': 'pelningas2025',
        'admin': 'admin123',
        'audrius': 'secure123'
    },
    
    // Sesijos galiojimo laikas (dienomis)
    sessionDays: 30
};
```

### 3️⃣ **Pridėkite naują vartotoją:**

```javascript
users: {
    'neringa': 'pelningas2025',
    'admin': 'admin123',
    'audrius': 'secure123',
    'jonas': 'slaptazodis123'  // ← NAUJAS USER
}
```

### 4️⃣ **Ištrinkite vartotoją:**

Tiesiog ištrinkite eilutę:

```javascript
users: {
    'neringa': 'pelningas2025',
    // 'admin': 'admin123',  ← IŠTRINTAS
    'audrius': 'secure123'
}
```

### 5️⃣ **Pakeiskite slaptažodį:**

```javascript
users: {
    'neringa': 'NAUJAS_SLAPTAZODIS_2025',  // ← PAKEISTAS
    'admin': 'admin123',
    'audrius': 'secure123'
}
```

### 6️⃣ **Pakeiskite sesijos laiką:**

```javascript
sessionDays: 7  // 7 dienos vietoj 30
```

---

## 🚀 Deployment

### **Po pakeitimų:**

1. **Išsaugokite failą** (`Cmd+S`)
2. **GitHub Desktop:**
   - Commit message: `Updated authentication users`
   - Commit to main
   - Push origin
3. **Palaukite 1-2 min**
4. **Atnaujinkite puslapį** (Hard refresh: `Cmd+Shift+R`)

---

## 🧪 Testavimas

### **Lokaliai:**

```bash
cd "/Users/psaudrius/Desktop/DI mokymai/Galutinis-atsiskaitymas"
python3 -m http.server 8000
open http://localhost:8000/auth.html
```

### **Live:**

```
https://audriusrubinas.github.io/invoice-scanner/auth.html
```

---

## 🔒 Saugumas

### **✅ Kas saugo:**

- ✅ Sesijos token'ai localStorage/sessionStorage
- ✅ Automatinis redirect'as jei neprisijungęs
- ✅ Sesijos galiojimo laikas
- ✅ "Prisiminti mane" funkcija

### **⚠️ Apribojimai:**

- ⚠️ Slaptažodžiai matomi `auth.html` kode (frontend)
- ⚠️ Nėra backend validacijos
- ⚠️ Nesaugo nuo techninių vartotojų (dev tools)

### **🎯 Rekomenduojama:**

Ši sistema tinkama:
- ✅ Vidiniam įmonės naudojimui
- ✅ Kai vartotojų nedaug (iki 10)
- ✅ Kai nėra labai jautrių duomenų

**Jei reikia stipresnio saugumo:**
- Naudokite n8n authentication (Variantas 2)
- Arba backend'ą (Node.js + JWT tokens)

---

## 📊 Kaip veikia

### **1. Prisijungimas (`auth.html`):**

```
User įveda username + password
  ↓
Validuojama prieš AUTH_CONFIG.users
  ↓
Jei teisinga:
  ↓
Session išsaugomas localStorage/sessionStorage
  ↓
Redirect į index.html
```

### **2. Puslapis (`index.html`):**

```
Puslapis užsikrauna
  ↓
Patikrina ar yra session
  ↓
Jei nėra:
  ↓
Redirect į auth.html
  ↓
Jei yra:
  ↓
Rodo puslapį + username header'yje
```

### **3. Logout:**

```
User spaudo "Atsijungti"
  ↓
Ištrinama session iš storage
  ↓
Redirect į auth.html
```

---

## 🐛 Troubleshooting

### **Problema: Neprisijungia su teisingais duomenimis**

**Sprendimas:**
1. Patikrinkite `auth.html` → `AUTH_CONFIG.users`
2. Username ir password **case-sensitive** (didžiosios/mažosios raidės skiriasi)
3. Nėra tarpų (pvz. `'neringa '` ≠ `'neringa'`)

---

### **Problema: Automatiškai atsijungia**

**Sprendimas:**
1. Patikrinkite `sessionDays` konfigūraciją
2. Pažymėkite "Prisiminti mane" checkbox'ą
3. Nepaiškinkite browser history/cookies

---

### **Problema: Logout mygtukas nematomas**

**Sprendimas:**
1. Patikrinkite ar `index.html` turi `<button id="logout-btn">`
2. Patikrinkite ar `css/styles.css` turi `.btn-logout` stilius
3. Hard refresh: `Cmd+Shift+R`

---

## 🔄 Upgrade į n8n Authentication (Variantas 2)

Jei norite saugesnio sprendimo:

### **1. Sukurkite n8n workflow:**

```
Webhook Trigger (POST /auth)
  ↓
Code Node (validate credentials)
  ↓
Respond to Webhook (JWT token)
```

### **2. Pakeiskite `auth.html`:**

```javascript
// Vietoj local validation
const response = await fetch('n8n-webhook-url', {
    method: 'POST',
    body: JSON.stringify({username, password})
});

const data = await response.json();

if (data.success) {
    saveSession(data.token);
}
```

### **3. Pranašumai:**

- ✅ Slaptažodžiai backend'e (n8n)
- ✅ Galite valdyti users iš vieno puslapio
- ✅ JWT tokens
- ✅ Audit log (n8n executions)

---

## 📞 Support

Jei kyla problemų su authentication:

1. **Console log'ai:** `Cmd+Option+J`
2. **Patikrinkite localStorage:** 
   ```javascript
   localStorage.getItem('invoice_auth')
   ```
3. **Clear session manually:**
   ```javascript
   localStorage.removeItem('invoice_auth')
   sessionStorage.removeItem('invoice_auth')
   ```

---

## ✅ Success Checklist

- [ ] `auth.html` sukurtas
- [ ] `index.html` turi authentication check
- [ ] `js/app.js` turi logout funkciją
- [ ] `css/styles.css` turi logout stilius
- [ ] Vartotojai sukonfigūruoti `AUTH_CONFIG`
- [ ] Išbandyta lokaliai
- [ ] Deploy'inta į GitHub Pages
- [ ] Veikia! ✅

---

**Happy authenticating! 🔐**
