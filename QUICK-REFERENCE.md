# 📝 Quick Reference - Greita Instrukcija

## 🔄 Kaip atnaujinti puslapį

### 1. Pakeisti kodą
```bash
# Atidarykite VS Code
code /Users/psaudrius/Desktop/DI\ mokymai/Galutinis-atsiskaitymas

# Redaguokite failus:
# - index.html (HTML)
# - css/styles.css (CSS)
# - js/app.js (JavaScript)

# Išsaugokite: Cmd+S
```

### 2. Deploy per GitHub Desktop
```
1. Atidarykite GitHub Desktop
2. Matysite pakeistus failus
3. Apačioje įrašykite commit message
4. Spauskite "Commit to main"
5. Spauskite "Push origin"
6. Palaukite 1-2 min ✅
```

### 3. Patikrinti
```
https://audriusrubinas.github.io/invoice-scanner/
Hard refresh: Cmd+Shift+R
```

---

## 🔧 Svarbūs failai

| Failas | Paskirtis |
|--------|-----------|
| `index.html` | HTML struktūra |
| `css/styles.css` | Visi stiliai |
| `js/app.js` | Visa logika + CONFIG |
| `README.md` | Pilna dokumentacija |
| `DEPLOYMENT.md` | Deployment instrukcijos |

---

## ⚙️ CONFIG (js/app.js)

```javascript
const CONFIG = {
    // n8n webhook URL
    uploadWebhookUrl: 'https://pelningas.app.n8n.cloud/webhook/invoice-upload',
    
    // Test režimas (true = mock data, false = real API)
    testMode: false
};
```

---

## 📊 Excel stulpeliai (15)

Funkcija: `generateCsvLocally()` (js/app.js ~412 eilutė)

```javascript
const row = [
    inv.saleDate || '',              // 1. saleDate*
    inv.series || '',                // 2. series*
    inv.number || '',                // 3. number*
    'Pardavimai',                    // 4. operationTypeName*
    'EUR',                           // 5. currencyId*
    inv.employee || '',              // 6. employee*
    inv.clientName || '',            // 7. clientName*
    inv.clientCode || '',            // 8. clientCode
    'Pagrindinis',                   // 9. warehouseName*
    'Prekės pardavimui',             // 10. items*
    1,                               // 11. quantity*
    inv.priceExclVat || 0,           // 12. priceExclVat*
    21,                              // 13. vatRate
    'PVM',                           // 14. vatClassifier
    inv.saleCorAcc || '500101'       // 15. saleCorAcc
];
```

---

## 🔗 Svarbūs linkai

| Pavadinimas | URL |
|-------------|-----|
| **Live puslapis** | https://audriusrubinas.github.io/invoice-scanner/ |
| **GitHub repo** | https://github.com/AudriusRubinas/invoice-scanner |
| **GitHub Actions** | https://github.com/AudriusRubinas/invoice-scanner/actions |
| **n8n workflow** | https://pelningas.app.n8n.cloud/workflows |
| **Google Sheets template** | https://docs.google.com/spreadsheets/d/14HOchUc9YURdvoyYMMvCRf_M1_uf5L8U28pUr5wX3cc/edit |

---

## 🧪 Test lokaliai

```bash
cd "/Users/psaudrius/Desktop/DI mokymai/Galutinis-atsiskaitymas"
python3 -m http.server 8000
open http://localhost:8000
```

---

## 🐛 Debug

### Console log'ai:
```
Chrome/Edge: Cmd+Option+J (Mac)
Firefox: Cmd+Option+K (Mac)
```

### Patikrinkite:
1. ✅ Failai išsaugoti (`Cmd+S`)
2. ✅ Committed per GitHub Desktop
3. ✅ Push'inta (`Push origin`)
4. ✅ Palaukta 1-2 min
5. ✅ Hard refresh (`Cmd+Shift+R`)

---

## 📞 Jei kyla problemų

1. **Console log'ai** - žiūrėkite klaidas
2. **GitHub Actions** - deployment status
3. **n8n Executions** - workflow log'ai
4. **Hard refresh** - `Cmd+Shift+R`

---

## ✅ Checklist

- [ ] Kodas pakeistas
- [ ] Išsaugota (`Cmd+S`)
- [ ] Committed (GitHub Desktop)
- [ ] Push'inta
- [ ] Palaukta 1-2 min
- [ ] Puslapis veikia ✅
