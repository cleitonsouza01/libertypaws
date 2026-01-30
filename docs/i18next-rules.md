# 🌍 Internationalization (i18n) Standards - SunoBot

## 📋 CRITICAL RULES - ZERO TOLERANCE

### 🔒 **RULE #1: ENGLISH AS SINGLE SOURCE OF TRUTH**
- **`/frontend/src/messages/en.json`** is the MASTER file
- **ALL translations originate from English keys**
- **NEVER create keys directly in PT/ES files**
- **English file dictates the complete key structure**

### 🚨 **RULE #2: MANDATORY KEY DUPLICATION PREVENTION**
**BEFORE creating ANY key, you MUST:**
1. **Search existing keys**: `grep -r "yourKeyName" frontend/src/messages/`
2. **Check variations**: Search for similar concepts, synonyms, partial matches
3. **Verify hierarchy**: Check if parent/child keys already exist
4. **Get approval**: Show me the proposed key structure before implementation

### 🛡️ **RULE #3: FILE CORRUPTION PREVENTION**
**EVERY translation change MUST:**
1. **Validate JSON syntax** before saving
2. **Maintain identical key structure** across all language files
3. **Preserve key count** - all files must have same number of keys
4. **Use proper UTF-8 encoding** for special characters
5. **Test JSON parsing** after every modification

---

## 🎯 **MANDATORY WORKFLOW - NO EXCEPTIONS**

### **Phase 1: English Key Creation (REQUIRED FIRST)**
```bash
# 1. SEARCH for existing keys (MANDATORY)
grep -r -i "button\|save\|submit" frontend/src/messages/en.json
grep -r -i "error\|fail\|invalid" frontend/src/messages/en.json

# 2. CHECK hierarchical structure
cat frontend/src/messages/en.json | jq '.dashboard.bot.functions'

# 3. VALIDATE before creating - ASK FOR APPROVAL
```

### **Phase 2: Translation Propagation (AUTOMATED)**
```bash
# 4. After English key approved, propagate to other languages
# MAINTAIN identical structure in pt.json and es.json
```

### **Phase 3: Validation (MANDATORY)**
```bash
# 5. VERIFY key count matches across files
jq 'keys | length' frontend/src/messages/en.json
jq 'keys | length' frontend/src/messages/pt.json  
jq 'keys | length' frontend/src/messages/es.json

# 6. VALIDATE JSON syntax
cat frontend/src/messages/en.json | jq empty  # Must return empty, no errors
cat frontend/src/messages/pt.json | jq empty
cat frontend/src/messages/es.json | jq empty
```

---

## 🔍 **KEY CREATION PROTOCOL**

### **FORBIDDEN PATTERNS**
❌ **NEVER create keys without searching first**
❌ **NEVER assume a concept doesn't have a key**  
❌ **NEVER create similar keys with different names**
❌ **NEVER modify files without JSON validation**
❌ **NEVER skip the approval step**

### **MANDATORY VERIFICATION STEPS**
1. **Semantic Search**: Look for existing keys with same meaning
2. **Structural Search**: Check if parent/child hierarchy exists
3. **Variation Search**: Check plurals, tenses, synonyms
4. **Component Search**: Look in relevant component namespace

### **SEARCH COMMANDS (MANDATORY)**
```bash
# Search for exact matches
grep -r "exactKeyName" frontend/src/messages/

# Search for semantic matches  
grep -r -i "save\|submit\|confirm" frontend/src/messages/
grep -r -i "error\|fail\|invalid\|wrong" frontend/src/messages/
grep -r -i "button\|action\|click" frontend/src/messages/

# Search in specific sections
cat frontend/src/messages/en.json | jq '.dashboard'
cat frontend/src/messages/en.json | jq '.common'
```

---

## 📁 **PROJECT STRUCTURE STANDARDS**

### **File Organization**
```
frontend/src/messages/
├── en.json     ← MASTER FILE (source of truth)
├── pt.json     ← Brazilian Portuguese  
└── es.json     ← Latin American Spanish
```

### **Key Naming Convention**
```json
{
  "namespace": {           // Page or component name
    "section": {           // UI section
      "element": {         // Specific element
        "property": "text"  // Final translation value
      }
    }
  }
}
```

### **Hierarchical Structure (ENFORCE CONSISTENCY)**
```json
{
  "dashboard": {
    "bot": {
      "functions": {
        "systemFunctions": {
          "title": "System Functions",
          "enable": "Enable",
          "disable": "Disable",
          "configure": "Configure"
        }
      }
    }
  }
}
```

---

## ⚡ **IMPLEMENTATION WORKFLOW**

### **Step 1: Pre-Creation Verification**
```bash
# MANDATORY search before any key creation
grep -r -i "your_concept" frontend/src/messages/
cat frontend/src/messages/en.json | jq '.relevant.namespace'
```

### **Step 2: English Key Approval** 
**Present proposed structure to user:**
```
PROPOSED KEY: dashboard.bot.functions.systemFunctions.newAction
SEARCHED FOR: "action", "button", "system", "function"  
EXISTING SIMILAR: dashboard.bot.functions.enable, dashboard.bot.functions.configure
JUSTIFICATION: New key needed for specific system function action
```

### **Step 3: Multi-Language Implementation**
```json
// en.json (MASTER)
{
  "dashboard": {
    "bot": {
      "functions": {
        "newAction": "New Action"
      }
    }
  }
}

// pt.json (IDENTICAL STRUCTURE)
{
  "dashboard": {
    "bot": {
      "functions": {
        "newAction": "Nova Ação"
      }
    }
  }
}

// es.json (IDENTICAL STRUCTURE) 
{
  "dashboard": {
    "bot": {
      "functions": {
        "newAction": "Nueva Acción"
      }
    }
  }
}
```

### **Step 4: Post-Creation Validation**
```bash
# Verify JSON syntax
jq empty frontend/src/messages/en.json
jq empty frontend/src/messages/pt.json  
jq empty frontend/src/messages/es.json

# Verify key counts match
echo "EN keys: $(jq -r 'paths(scalars) as $p | $p | join(".")' frontend/src/messages/en.json | wc -l)"
echo "PT keys: $(jq -r 'paths(scalars) as $p | $p | join(".")' frontend/src/messages/pt.json | wc -l)"
echo "ES keys: $(jq -r 'paths(scalars) as $p | $p | join(".")' frontend/src/messages/es.json | wc -l)"
```

---

## 🛠️ **COMPONENT INTEGRATION STANDARDS**

### **Server Components** (Layout Level)
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('dashboard.bot.functions');
  return <h1>{t('title')}</h1>;
}
```

### **Client Components** (Hook Pattern)
```typescript
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations('dashboard.bot.functions');
  return <button>{t('enable')}</button>;
}
```

---

## ✅ **QUALITY ASSURANCE CHECKLIST**

### **Before ANY Translation Work:**
- [ ] Search for existing keys with same meaning
- [ ] Verify English file is source of truth
- [ ] Check JSON syntax validation
- [ ] Confirm key structure consistency

### **During Translation:**
- [ ] Start with English key creation
- [ ] Get explicit approval for new keys
- [ ] Maintain identical structure across files
- [ ] Use professional business language tone

### **After Translation:**
- [ ] Validate JSON syntax in all files
- [ ] Verify identical key counts
- [ ] Test key loading in components
- [ ] Confirm no hard-coded strings remain

---

## 🚨 **EMERGENCY PROCEDURES**

### **If JSON Corruption Detected:**
1. **STOP all changes immediately**
2. **Check git history**: `git log --oneline frontend/src/messages/`
3. **Restore from last good commit**: `git checkout HEAD~1 frontend/src/messages/`
4. **Re-validate**: Run JSON syntax checks
5. **Re-implement carefully**: Follow mandatory workflow

### **If Key Duplication Found:**
1. **Identify all duplicate instances**
2. **Choose canonical key** (prefer existing, well-used keys)
3. **Update all component references**
4. **Remove duplicate keys**
5. **Validate consistency across languages**

---

## 🎯 **SUCCESS METRICS**
- **Zero duplicate keys** across all message files
- **100% JSON validity** at all times
- **Identical key counts** across en/pt/es files
- **English-first workflow** consistently followed
- **Zero hard-coded strings** in components

**Remember: English file is the single source of truth. Everything else is a translation of English keys.**