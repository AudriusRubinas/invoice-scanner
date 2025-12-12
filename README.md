# Invoice Scanner - Sąskaitų Skaitytuvas

Modernus, responsive HTML puslapis sąskaitų faktūrų nuskaitymui su n8n Webhook integracija.

## 🚀 Funkcionalumas

- **Drag & Drop** failų įkėlimas
- Palaiko **JPG, PNG, PDF** formatus
- Iki **20 failų** vienu metu (max 10MB per failą)
- Realaus laiko apdorojimo progresas
- Rezultatų rodymas lentelėje
- CSV eksportas
- Google Sheets integracija

## 📁 Projekto struktūra

```
Galutinis-atsiskaitymas/
├── index.html          # Pagrindinis HTML
├── css/
│   └── styles.css      # Visi stiliai
├── js/
│   └── app.js          # JavaScript logika
├── instructions.txt    # Projekto specifikacija
└── README.md          # Ši byla
```

## 🎨 Dizainas

- **Dark theme** su glassmorphism efektais
- Gradient spalvos (#667eea → #764ba2)
- Smooth animacijos
- **Mobile-first** responsive dizainas

## 🔧 Naudojimas

### Lokalus testavimas

**Python:**
```bash
cd "/Users/psaudrius/Desktop/DI mokymai/Galutinis-atsiskaitymas"
python -m http.server 8000
```

**Node.js:**
```bash
npx serve
```

Tada atidarykite naršyklėje: `http://localhost:8000`

### Hostinimas

**GitHub Pages:**
1. Sukurti GitHub repository
2. Įkelti failus
3. Settings → Pages → Source: main branch
4. URL: `https://username.github.io/repo-name`

**Alternatyvos:**
- Netlify (Drag & drop)
- Vercel (GitHub integration)
- Cloudflare Pages

## 🔌 API Integracija

### Upload Endpoint
```
POST https://pelningas.app.n8n.cloud/webhook/invoice-upload
Content-Type: multipart/form-data
```

**Parametrai:**
- `files` - failų masyvas
- `employee` - darbuotojo vardas (neprivalomas)
- `saleCorAcc` - DK sąskaita (default: "500101")

### CSV Export Endpoint
```
GET https://pelningas.app.n8n.cloud/webhook/invoice-csv
```

## 📊 Technologijos

- **HTML5** - semantinė struktūra
- **CSS3** - glassmorphism, gradientai, animacijos
- **Vanilla JavaScript** (ES6+)
- **Fetch API** - komunikacija su backend
- **FormData API** - failų siuntimas

## 🎯 Palaikomi failai

- **Nuotraukos:** JPG, JPEG, PNG
- **Dokumentai:** PDF
- **Dydis:** iki 10MB per failą
- **Kiekis:** iki 20 failų vienu metu

## ⚡ Savybės

- ✅ Drag & Drop interface
- ✅ Failų validacija
- ✅ Progress tracking
- ✅ Responsive design
- ✅ Error handling
- ✅ CSV export
- ✅ Google Sheets integracija

## 📱 Responsive Breakpoints

- Mobile: 480px
- Tablet: 768px
- Desktop: 1024px, 1200px

## 👨‍💻 Autorius

**Projekto savininkas:** Audrius Rubinas  
**Įmonė:** Pelningas.lt (Pelningi Sprendimai, MB)

## 📄 Licencija

© 2025 Pelningas.lt | Sąskaitų skaitytuvas
