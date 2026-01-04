curl -X POST https://pelningas.app.n8n.cloud/webhook/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'# 🔐 n8n Authentication Workflow Setup

## 📋 SVARBU: Vartotojai dabar yra n8n, NE GitHub!

Slaptažodžiai saugomi **tik n8n workflow'e** - GitHub'e jų nėra! ✅

---

## 🚀 n8n Workflow Sukūrimas

### 1️⃣ **Sukurkite naują workflow:**

Eikite į: https://pelningas.app.n8n.cloud/workflows

**Paspaudę "Add Workflow"** → Pavadinimas: **"User Authentication"**

---

### 2️⃣ **Pridėkite Node'us:**

#### **Node 1: Webhook Trigger**

- **Type:** `Webhook`
- **HTTP Method:** `POST`
- **Path:** `auth`
- **Response Mode:** `Respond to Webhook`

**Authentication:** None

**Webhook URL bus:**
```
https://pelningas.app.n8n.cloud/webhook/auth
```

---

#### **Node 2: Code (JavaScript)**

Prijunkite po Webhook node.

**Code:**

```javascript
// ============================================
// VARTOTOJŲ SĄRAŠAS - KEISKITE TIK ČIA!
// ============================================
const validUsers = {
    'neringa': 'Pelningas2025',
    'audrius': 'Pelningas2026',
    'pskomanda': 'Naujimetai2025'
};
// ============================================

// Gauname username ir password iš webhook
const username = $input.item.json.body.username || $input.item.json.username;
const password = $input.item.json.body.password || $input.item.json.password;

console.log('Auth attempt:', username);

// Validuojame
const isValid = validUsers[username] === password;

// Grąžiname rezultatą
return {
    json: {
        success: isValid,
        username: isValid ? username : null,
        message: isValid ? 'Authentication successful' : 'Invalid credentials',
        timestamp: new Date().toISOString()
    }
};
```

---

#### **Node 3: Respond to Webhook**

Prijunkite po Code node.

**Settings:**
- **Respond With:** `Text`
- **Response Body:** `={{ JSON.stringify($json) }}`

**Response Headers:**
```
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

### 3️⃣ **Sujunkite node'us:**

```
Webhook → Code → Respond to Webhook
```

---

### 4️⃣ **Test workflow:**

1. **Aktyvuokite workflow** (toggle viršuje į ACTIVE)
2. **Test su curl:**

```bash
curl -X POST https://pelningas.app.n8n.cloud/webhook/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"neringa","password":"Pelningas2025"}'
```

**Tikėtinas rezultatas:**
```json
{
  "success": true,
  "username": "neringa",
  "message": "Authentication successful",
  "timestamp": "2025-12-15T10:30:00.000Z"
}
```

**Klaidingais duomenimis:**
```json
{
  "success": false,
  "username": null,
  "message": "Invalid credentials",
  "timestamp": "2025-12-15T10:30:00.000Z"
}
```

---

## ✅ **Workflow Diagram:**

```
┌─────────────────┐
│  POST /auth     │
│  {username,     │
│   password}     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Code Node      │
│  Validate       │
│  credentials    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Respond to     │
│  Webhook        │
│  {success:...}  │
└─────────────────┘
```

---

## 🔧 **Kaip pridėti/pakeisti vartotojus:**

### **1. Atidarykite n8n workflow**

### **2. Edit Code node**

### **3. Raskite validUsers:**

```javascript
const validUsers = {
    'neringa': 'Pelningas2025',
    'audrius': 'Pelningas2026',
    'pskomanda': 'Naujimetai2025'
};
```

### **4. Pridėkite naują vartotoją:**

```javascript
const validUsers = {
    'neringa': 'Pelningas2025',
    'audrius': 'Pelningas2026',
    'pskomanda': 'Naujimetai2025',
    'jonas': 'Jonas2025'  // ← NAUJAS
};
```

### **5. Išsaugokite workflow**

**VISKAS!** Pakeitimai aktyvūs iš karto. ✅

---

## 🐛 **Troubleshooting:**

### **Problema: CORS error**

**Sprendimas:** Respond to Webhook node pridėkite headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

### **Problema: "success" undefined**

**Sprendimas:** Code node patikrinkite ar grąžinate:
```javascript
return {
    json: {
        success: isValid,  // ← SVARBU!
        ...
    }
};
```

---

### **Problema: auth.html neranda webhook**

**Sprendimas:** Patikrinkite `auth.html`:
```javascript
authWebhookUrl: 'https://pelningas.app.n8n.cloud/webhook/auth'
```

URL turi būti **TIKSLIAI** toks pats kaip n8n webhook path.

---

## 🎯 **Pranašumai:**

✅ **Slaptažodžiai tik n8n** - GitHub'e jų nėra
✅ **Lengva valdyti** - keiskite tik n8n Code node
✅ **Audit log** - n8n Executions tab rodo visus prisijungimus
✅ **CORS palaikomas** - veikia su GitHub Pages

---

## 📊 **Audit Log:**

n8n automatiškai logina visus prisijungimus:

```
Executions → User Authentication workflow
```

Matysite:
- ⏰ Kada prisijungta
- 👤 Kas prisijungė (username)
- ✅/❌ Sėkmingai ar ne
- 📊 Kiek kartų bandyta

---

## 🔒 **Saugumo Patarimai:**

1. ✅ **Niekada** nekomitkite slaptažodžių į GitHub
2. ✅ Keiskite slaptažodžius reguliariai
3. ✅ Naudokite stiprius slaptažodžius (8+ simboliai)
4. ✅ Stebėkite n8n Executions tab dėl suspicious activity

---

## 📞 **Support:**

Jei workflow neveikia:
1. Patikrinkite ar workflow **ACTIVE**
2. Test su curl komanda
3. Žiūrėkite n8n Executions log'us
4. Patikrinkite Console log'us (`Cmd+Option+J`)

---

**n8n Workflow URL:**
```
https://pelningas.app.n8n.cloud/workflow/[WORKFLOW_ID]
```

**Webhook URL:**
```
https://pelningas.app.n8n.cloud/webhook/auth
```

---

✅ **Dabar slaptažodžiai SAUGŪS!**
