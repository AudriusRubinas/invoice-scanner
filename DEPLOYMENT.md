# 🚀 Deployment Guide - Kaip atnaujinti projektą

## 📋 Quick Start

```
1. Pakeičiate kodą lokaliai (VS Code) → Cmd+S
2. GitHub Desktop → Commit message → Commit to main
3. GitHub Desktop → Push origin
4. Palaukite 1-2 min → Puslapis atnaujintas! ✅
```

---

## 🔄 Pilnas Workflow

### 1️⃣ **Redaguokite lokaliai**

```bash
cd "/Users/psaudrius/Desktop/DI mokymai/Galutinis-atsiskaitymas"
# Atidarykite VS Code
code .
```

Redaguokite:
- `index.html` - HTML struktūra
- `css/styles.css` - Stiliai
- `js/app.js` - JavaScript logika

### 2️⃣ **Išsaugokite pakeitimus**

- `Cmd+S` (macOS)
- `Ctrl+S` (Windows/Linux)

### 3️⃣ **Test lokaliai (optional)**

```bash
# Paleiskite lokalų serverį
python3 -m http.server 8000

# Atidarykite naršyklėje
open http://localhost:8000
```

### 4️⃣ **Commit per GitHub Desktop**

#### a) Atidarykite GitHub Desktop

#### b) Matysite pakeistus failus "Changes" tab'e

#### c) Apačioje įrašykite commit message:
```
Pridėta nauja funkcija
```
arba
```
Pataisytas bug su Excel eksportu
```
arba
```
Atnaujintas dizainas
```

#### d) Spauskite **"Commit to main"**

### 5️⃣ **Push į GitHub**

- Viršuje spauskite **"Push origin"** ⬆️
- Arba `Cmd+P` (keyboard shortcut)

### 6️⃣ **Palaukite deployment**

- **1-2 minutės** - GitHub Pages atnaujins puslapį
- Galite stebėti: https://github.com/AudriusRubinas/invoice-scanner/actions

### 7️⃣ **Patikrinkite**

```
https://audriusrubinas.github.io/invoice-scanner/
```

Jei nematote pakeitimų:
- Hard refresh: `Cmd+Shift+R` (Chrome/Firefox)
- Clear cache: `Cmd+Shift+Delete`

---

## 🔧 n8n Workflow pakeitimai

### **Scenario 1: Paprastas n8n workflow pakeitimas**

**Jei keičiate tik n8n workflow'ą (be kodo pakeitimų):**

1. Eikite į https://pelningas.app.n8n.cloud
2. Redaguokite workflow'ą
3. Išsaugokite (`Cmd+S`)
4. Įsitikinkite, kad workflow **ACTIVE** ✅
5. **NIEKO DAUGIAU NEREIKIA!**

---

### **Scenario 2: Keičiate webhook URL**

**Jei pakeitėte n8n webhook URL:**

1. Atnaujinkite `js/app.js`:
```javascript
const CONFIG = {
    uploadWebhookUrl: 'https://pelningas.app.n8n.cloud/webhook/NEW-URL',
    ...
};
```

2. Išsaugokite (`Cmd+S`)
3. GitHub Desktop → Commit: `"Updated webhook URL"`
4. Push origin
5. Palaukite 1-2 min ✅

---

### **Scenario 3: n8n grąžina naujus laukelius**

**Pvz. pridėjote naują skenavimo funkciją, kuri grąžina `scanType`:**

1. Atnaujinkite `js/app.js` → `generateCsvLocally()`:
```javascript
const headers = [
    'saleDate*',
    'series*',
    // ... existing headers ...
    'scanType',  // ← NAUJAS STULPELIS
    'saleCorAcc'
];

const row = [
    inv.saleDate || '',
    inv.series || '',
    // ... existing fields ...
    inv.scanType || 'manual',  // ← NAUJAS LAUKELIS
    inv.saleCorAcc || '500101'
];
```

2. Atnaujinkite stulpelių plotį:
```javascript
ws['!cols'] = [
    { wch: 12 },  // saleDate*
    // ... existing widths ...
    { wch: 15 },  // scanType ← NAUJAS
    { wch: 12 }   // saleCorAcc
];
```

3. Išsaugokite, Commit, Push ✅

---

## 🧪 Test režimas (Development)

### **Įjungti test režimą:**

```javascript
// js/app.js
const CONFIG = {
    ...
    testMode: true  // ← DEVELOPMENT: mock data
};
```

**Kada naudoti:**
- Testuojate UI pakeitimus
- n8n workflow dar nepasiruošęs
- Norite greito testavimo be backend'o

### **Grąžinti production:**

```javascript
testMode: false  // ← PRODUCTION: real n8n API
```

**SVARBU:** Nepamirškite grąžinti `false` prieš deploy'inant! ⚠️

---

## 🐛 Troubleshooting

### **"Changes" tab'e nematau failų (GitHub Desktop)**

**Priežastis:** Failai neišsaugoti arba jau committed.

**Sprendimas:**
1. Patikrinkite ar išsaugojote failus (`Cmd+S`)
2. Atnaujinkite GitHub Desktop (`Cmd+R`)

---

### **"Push origin" mygtukas disabled**

**Priežastis:** Nėra uncommitted pakeitimų.

**Sprendimas:**
1. Pakeiskite bent vieną failą
2. Išsaugokite
3. Commit to main
4. Tada Push origin bus aktyvus

---

### **GitHub Pages nerodo pakeitimų**

**Priežastis:** Deployment dar vyksta arba cache'intas.

**Sprendimas:**
1. Palaukite 2-3 minutes
2. Hard refresh: `Cmd+Shift+R`
3. Patikrinkite deployment status:
   ```
   https://github.com/AudriusRubinas/invoice-scanner/actions
   ```
4. Jei matote ✅ žalią varnelę - deployment sėkmingas

---

### **n8n negauna duomenų po deployment**

**Patikrinkite:**
1. ✅ n8n workflow **ACTIVE** (ne "Listen for test event")
2. ✅ Webhook URL teisingas `js/app.js`
3. ✅ CORS headers sukonfigūruoti n8n
4. ✅ Console log'uose nėra klaidų

**Console atidarymas:**
- Chrome/Edge: `Cmd+Option+J` (Mac) / `Ctrl+Shift+J` (Windows)
- Firefox: `Cmd+Option+K` (Mac) / `Ctrl+Shift+K` (Windows)

---

## 📊 Monitoring

### **GitHub Actions (Deployment status):**
```
https://github.com/AudriusRubinas/invoice-scanner/actions
```

### **Live puslapis:**
```
https://audriusrubinas.github.io/invoice-scanner/
```

### **n8n Executions:**
```
https://pelningas.app.n8n.cloud/workflows
→ Pasirinkite workflow → "Executions" tab
```

---

## 💡 Best Practices

### ✅ **DO:**
- Rašykite aiškius commit messages
- Testuokite lokaliai prieš deploy'inant
- Commit'inkite dažnai (mažais pakeitimais)
- Naudokite test režimą development'e

### ❌ **DON'T:**
- Deploy'inti su `testMode: true`
- Commit'inti su typo klaidomis
- Push'inti be testavimo
- Trinti failus nepatikrinę

---

## 🔐 Security

### **Jautri informacija:**

**NIEKADA nekomitkite:**
- ❌ API keys
- ❌ Slaptažodžių
- ❌ Personal access tokens
- ❌ Database credentials

**n8n webhook URL yra safe:**
- ✅ Public webhook URL (skirtas public API)
- ✅ Nėra autentifikacijos tokenų
- ✅ Safe commit'inti į GitHub

---

## 📞 Support

Jei kyla problemų:
1. Patikrinkite Console log'us (`Cmd+Option+J`)
2. Patikrinkite GitHub Actions deployment status
3. Patikrinkite n8n Executions tab
4. Hard refresh puslapį (`Cmd+Shift+R`)

---

## 🎉 Success Checklist

Po kiekvieno deployment'o:

- [ ] Kodas lokaliai išsaugotas
- [ ] GitHub Desktop: Commit message įrašytas
- [ ] GitHub Desktop: "Commit to main" paspaustas
- [ ] GitHub Desktop: "Push origin" paspaustas
- [ ] Palaukta 1-2 minutės
- [ ] Puslapis atnaujintas ir veikia ✅
- [ ] n8n workflow ACTIVE ✅
- [ ] Funkcionalumas patikrintas ✅

---

**Happy coding! 🚀**
