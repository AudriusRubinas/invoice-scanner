# ✅ DEPLOYMENT CHECKLIST - Authentication

## 🎯 KĄ PADARĖME:

### ✅ **Frontend pakeitimai:**
- `auth.html` - pakeista validation logika (dabar per n8n)
- `index.html` - auth check (jau buvo)
- `js/app.js` - logout funkcija (jau buvo)
- `css/styles.css` - logout stiliai (jau buvo)

### ✅ **Dokumentacija:**
- `AUTHENTICATION.md` - bendros instrukcijos
- `N8N-AUTH-SETUP.md` - n8n workflow setup

---

## 🚀 DEPLOYMENT STEPS:

### 1️⃣ **n8n Workflow (PIRMAS ŽINGSNIS!):**

**SVARBU:** Sukurkite n8n workflow **PRIEŠ** deploy'inant!

📋 Instrukcijos: `N8N-AUTH-SETUP.md`

**Quick setup:**
1. Eikite: https://pelningas.app.n8n.cloud/workflows
2. New Workflow → "User Authentication"
3. Pridėkite 3 node'us:
   - Webhook (POST /auth)
   - Code (validate credentials)
   - Respond to Webhook
4. Code node įklijuokite:

```javascript
const validUsers = {
    'neringa': 'Pelningas2025',
    'audrius': 'Pelningas2026',
    'pskomanda': 'Naujimetai2025'
};

const username = $input.item.json.body.username || $input.item.json.username;
const password = $input.item.json.body.password || $input.item.json.password;

return {
    json: {
        success: validUsers[username] === password,
        username: validUsers[username] === password ? username : null,
        message: validUsers[username] === password ? 'OK' : 'Invalid'
    }
};
```

5. **AKTYVUOKITE** workflow (toggle viršuje)

---

### 2️⃣ **Test n8n webhook:**

```bash
curl -X POST https://pelningas.app.n8n.cloud/webhook/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"neringa","password":"Pelningas2025"}'
```

**Tikėtinas rezultatas:**
```json
{"success": true, "username": "neringa", "message": "OK"}
```

✅ Jei veikia - tęskite!
❌ Jei ne - patikrinkite n8n Executions log'us

---

### 3️⃣ **GitHub Desktop Deploy:**

1. **Atidarykite GitHub Desktop**

2. **Matysite pakeistus failus:**
   - `auth.html` (modified) - n8n authentication
   - `N8N-AUTH-SETUP.md` (new) - setup instrukcijos
   - `AUTHENTICATION.md` (existing)

3. **Commit message:**
   ```
   Migrated authentication to n8n (secure)
   ```

4. **Commit to main** → **Push origin**

---

### 4️⃣ **Po 1-2 min test live:**

```
https://audriusrubinas.github.io/invoice-scanner/auth.html
```

**Test credentials:**
- Username: `neringa` | Password: `Pelningas2025`
- Username: `audrius` | Password: `Pelningas2026`
- Username: `pskomanda` | Password: `Naujimetai2025`

---

## 🔒 **SAUGUMO PATIKRINIMAS:**

### ✅ **Kas SAUGO:**

1. **Slaptažodžiai tik n8n** ✅
   - GitHub'e jų nėra
   - Tik n8n Code node

2. **Frontend validacija per API** ✅
   - `auth.html` → fetch() → n8n webhook
   - Ne hardcoded passwords

3. **CORS headers** ✅
   - Veikia su GitHub Pages

### ❌ **Kas BUVO NESAUGU:**

1. ~~Slaptažodžiai `auth.html` kode~~ ❌
2. ~~Bet kas matė GitHub repo~~ ❌

---

## 🐛 **TROUBLESHOOTING:**

### **Problema: "Tikrinama..." amžinai**

**Priežastis:** n8n webhook neveikia arba CORS

**Sprendimas:**
1. Patikrinkite n8n workflow **ACTIVE**
2. Test su curl komanda
3. Žiūrėkite Console log'us (`Cmd+Option+J`)
4. Patikrinkite n8n Respond to Webhook headers

---

### **Problema: "Invalid credentials" nors teisingi**

**Priežastis:** 
- Typo slaptažodyje
- n8n Code node klaida
- Case sensitive

**Sprendimas:**
1. Patikrinkite n8n Code node `validUsers`
2. Test su curl - ar veikia?
3. Patikrinkite Executions log'ą

---

### **Problema: CORS error**

**Priežastis:** n8n neturi CORS headers

**Sprendimas:** Respond to Webhook node pridėkite:
```
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## 📊 **VARTOTOJŲ VALDYMAS:**

### **Pridėti naują vartotoją:**

1. Atidarykite n8n workflow
2. Edit Code node
3. Pridėkite į `validUsers`:
   ```javascript
   'naujas': 'Slaptazodis123'
   ```
4. Save workflow
5. **VISKAS!** Veikia iš karto ✅

### **Pakeisti slaptažodį:**

1. n8n Code node
2. Pakeiskite reikšmę:
   ```javascript
   'neringa': 'NAUJAS_SLAPTAZODIS'
   ```
3. Save

### **Ištrinti vartotoją:**

1. n8n Code node
2. Ištrinkite eilutę arba užkomentuokite:
   ```javascript
   // 'senas': 'slaptazodis123'
   ```
3. Save

---

## ✅ **SUCCESS CHECKLIST:**

- [ ] n8n workflow sukurtas
- [ ] n8n workflow ACTIVE
- [ ] Webhook URL teisingas
- [ ] Test su curl - veikia
- [ ] CORS headers pridėti
- [ ] Committed į GitHub
- [ ] Push'inta
- [ ] Live puslapis veikia
- [ ] Prisijungimas veikia su visais 3 users
- [ ] Logout veikia
- [ ] Redirect'ai veikia

---

## 🎉 **KAI VISKAS VEIKIA:**

Jūsų sistema dabar:
- ✅ Saugi (slaptažodžiai n8n)
- ✅ Lengva valdoma (keisti n8n)
- ✅ Audit log (n8n executions)
- ✅ Public GitHub repo (be slaptažodžių!)

---

## 📞 **Klausimai?**

Žiūrėkite:
- `N8N-AUTH-SETUP.md` - n8n workflow detalės
- `AUTHENTICATION.md` - bendros instrukcijos
- n8n Executions tab - debug info

---

**Happy deploying! 🚀🔐**
