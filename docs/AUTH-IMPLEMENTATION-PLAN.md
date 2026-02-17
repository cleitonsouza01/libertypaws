# Liberty Paws - Supabase Authentication Implementation Plan

> **Version**: 1.0
> **Date**: February 2026
> **Strategy**: UI-first with mock API, then swap to real Supabase backend
> **Status**: Awaiting Approval

---

## Table of Contents

1. [Strategy Overview](#1-strategy-overview)
2. [Current State](#2-current-state)
3. [Auth Pages & Routes](#3-auth-pages--routes)
4. [UI Components to Build](#4-ui-components-to-build)
5. [Auth Context & Mock Provider](#5-auth-context--mock-provider)
6. [Header & Navigation Changes](#6-header--navigation-changes)
7. [Protected Routes](#7-protected-routes)
8. [Translation Keys (i18n)](#8-translation-keys-i18n)
9. [File Structure](#9-file-structure)
10. [Implementation Phases](#10-implementation-phases)
11. [Phase B: Real Supabase Swap](#11-phase-b-real-supabase-swap)

---

## 1. Strategy Overview

### Two-Phase Approach

| Phase | Goal | Backend |
|-------|------|---------|
| **Phase A** (now) | Build all auth UI, show to client for approval | Mock/fake API with `setTimeout` delays |
| **Phase B** (after approval) | Swap mock for real Supabase Auth | `@supabase/ssr` + `@supabase/supabase-js` |

### Why Mock First?

- Client sees the full UX before any backend cost
- UI can be iterated quickly without touching Supabase config
- Auth context interface stays the same — only the provider implementation changes
- Zero risk of breaking existing pages during UI development

---

## 2. Current State

| Item | Status | Notes |
|------|--------|-------|
| `@supabase/supabase-js` | Installed (v2.93) | Not used anywhere |
| `@supabase/ssr` | **Not installed** | Needed for Phase B |
| Supabase env vars | Configured in `.env` | URL + anon key + service role key |
| Auth pages | None | No login, register, or profile pages |
| Auth context/provider | None | No session state management |
| Auth middleware | None | Only next-intl middleware exists |
| Auth UI in header | None | No user menu, avatar, or login button |
| Auth translation keys | None | No auth-related i18n strings |
| Protected routes | None | All pages are public |

---

## 3. Auth Pages & Routes

### New Pages (under `[locale]/`)

| Page | Path | Purpose |
|------|------|---------|
| Login | `/[locale]/auth/login` | Email/password + Google OAuth login |
| Register | `/[locale]/auth/register` | New account creation |
| Forgot Password | `/[locale]/auth/forgot-password` | Request password reset email |
| Reset Password | `/[locale]/auth/reset-password` | Set new password (from email link) |
| Profile / Account | `/[locale]/account` | User profile, order history, registrations |

### Non-Locale Routes (Phase B only)

| Route | Path | Purpose |
|-------|------|---------|
| Auth Callback | `/auth/callback` | OAuth code exchange (outside `[locale]/`) |

### Page Descriptions

**Login Page**
- Email + password fields
- "Remember me" checkbox
- "Forgot password?" link
- Google OAuth button ("Continue with Google")
- Link to register page
- Redirect to `/account` on success (or to original protected page)

**Register Page**
- Full name, email, password, confirm password fields
- Terms & privacy checkbox
- Google OAuth button
- Link to login page
- Success: show "Check your email" confirmation message

**Forgot Password Page**
- Email field only
- Submit sends reset link
- Success: show "Check your email" message
- Link back to login

**Reset Password Page**
- New password + confirm password fields
- Arrived via email link with token
- Success: redirect to login with "Password updated" toast

**Account/Profile Page** (protected)
- User info display (name, email, locale)
- Edit profile form
- Order history list (empty state for now, links to future orders)
- Pet registrations list (empty state for now)
- Change password section
- Logout button

---

## 4. UI Components to Build

All using DaisyUI classes per project conventions.

### New Components

| Component | Path | Description |
|-----------|------|-------------|
| `AuthForm` | `components/sections/auth-form.tsx` | Reusable form wrapper (login/register/forgot) with card styling |
| `OAuthButton` | `components/ui/oauth-button.tsx` | Google OAuth button (DaisyUI `btn btn-outline`) |
| `PasswordInput` | `components/ui/password-input.tsx` | Password field with show/hide toggle |
| `UserMenu` | `components/layout/user-menu.tsx` | Header dropdown: avatar, name, links, logout |
| `AuthGuard` | `components/layout/auth-guard.tsx` | Wrapper that redirects to login if not authenticated |
| `AccountLayout` | `components/layout/account-layout.tsx` | Sidebar layout for account pages |

### Existing Components to Modify

| Component | Change |
|-----------|--------|
| `header.tsx` | Add `UserMenu` (logged in) or "Login" button (logged out) |
| `mobile-nav.tsx` | Add login/register links or user info + logout |
| `[locale]/layout.tsx` | Wrap with `AuthProvider` |

---

## 5. Auth Context & Mock Provider

### Interface (stays the same for mock and real)

```
AuthContext provides:
  - user: { id, email, fullName, avatarUrl, locale } | null
  - isLoading: boolean
  - isAuthenticated: boolean
  - signIn(email, password) → { success, error }
  - signUp(email, password, fullName) → { success, error }
  - signInWithGoogle() → void (redirect)
  - signOut() → void
  - resetPassword(email) → { success, error }
  - updatePassword(password) → { success, error }
  - updateProfile(data) → { success, error }
```

### Mock Implementation (Phase A)

- Stores user state in `useState` + `localStorage` for persistence across refreshes
- `signIn` → 1s delay → always succeeds with fake user data
- `signUp` → 1s delay → returns "check your email" message
- `signOut` → clears state immediately
- `signInWithGoogle` → 1s delay → logs in with fake Google user
- All actions return simulated success/error responses
- A special "test" email (e.g., `error@test.com`) triggers error states for UI testing

### File Location

```
src/contexts/auth-context.tsx       ← Interface + MockAuthProvider (Phase A)
src/lib/supabase/client.ts          ← Created empty/placeholder (Phase A)
```

---

## 6. Header & Navigation Changes

### Desktop Header (logged out)

```
Logo | Home | Products | Contact | [LanguageSwitcher] | [Login Button]
```

- "Login" → `btn btn-primary btn-sm` linking to `/auth/login`

### Desktop Header (logged in)

```
Logo | Home | Products | Contact | [LanguageSwitcher] | [UserMenu dropdown]
```

- UserMenu dropdown (DaisyUI `dropdown dropdown-end`):
  - Avatar circle with initials (or photo)
  - User name + email
  - Divider
  - "My Account" link → `/account`
  - "My Orders" link → `/account/orders` (or empty state)
  - Divider
  - "Logout" button

### Mobile Nav (logged out)

- Add "Login" and "Register" links to the mobile menu

### Mobile Nav (logged in)

- Show user name/email at top
- Add "My Account" and "Logout" to menu items

---

## 7. Protected Routes

### Route Classification

| Category | Paths | Auth Required |
|----------|-------|---------------|
| Public | `/`, `/products`, `/products/[slug]`, `/contact` | No |
| Auth pages | `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password` | No (redirect to `/account` if already logged in) |
| Protected | `/account`, `/account/*` | Yes (redirect to `/auth/login` if not logged in) |

### Mock Implementation (Phase A)

- `AuthGuard` component wraps protected pages
- Checks `isAuthenticated` from context
- If not authenticated: redirect to `/auth/login?next={currentPath}`
- After login: redirect back to `next` param
- No middleware changes needed for Phase A (all client-side)

### Real Implementation (Phase B)

- Middleware checks session for protected routes
- Strips locale prefix before comparing against protected paths
- Server-side redirect (faster, no flash of protected content)

---

## 8. Translation Keys (i18n)

New section `"auth"` to add to all 3 locale files (`en.json`, `es.json`, `pt.json`).

### Key Structure

```
auth.login.title            → "Welcome Back"
auth.login.subtitle         → "Sign in to your account"
auth.login.emailLabel       → "Email Address"
auth.login.passwordLabel    → "Password"
auth.login.rememberMe       → "Remember me"
auth.login.forgotPassword   → "Forgot password?"
auth.login.submitButton     → "Sign In"
auth.login.noAccount        → "Don't have an account?"
auth.login.registerLink     → "Create Account"
auth.login.orContinueWith   → "Or continue with"
auth.login.googleButton     → "Continue with Google"
auth.login.error.invalid    → "Invalid email or password"
auth.login.error.generic    → "Something went wrong. Please try again."

auth.register.title         → "Create Account"
auth.register.subtitle      → "Join Liberty Paws today"
auth.register.nameLabel     → "Full Name"
auth.register.emailLabel    → "Email Address"
auth.register.passwordLabel → "Password"
auth.register.confirmLabel  → "Confirm Password"
auth.register.termsText     → "I agree to the {terms} and {privacy}"
auth.register.termsLink     → "Terms of Service"
auth.register.privacyLink   → "Privacy Policy"
auth.register.submitButton  → "Create Account"
auth.register.hasAccount    → "Already have an account?"
auth.register.loginLink     → "Sign In"
auth.register.success       → "Account created! Check your email to confirm."
auth.register.error.exists  → "An account with this email already exists"
auth.register.error.password→ "Passwords do not match"

auth.forgot.title           → "Forgot Password"
auth.forgot.subtitle        → "Enter your email and we'll send a reset link"
auth.forgot.emailLabel      → "Email Address"
auth.forgot.submitButton    → "Send Reset Link"
auth.forgot.backToLogin     → "Back to Sign In"
auth.forgot.success         → "Check your email for a password reset link"

auth.reset.title            → "Reset Password"
auth.reset.subtitle         → "Enter your new password"
auth.reset.passwordLabel    → "New Password"
auth.reset.confirmLabel     → "Confirm New Password"
auth.reset.submitButton     → "Update Password"
auth.reset.success          → "Password updated successfully"

auth.account.title          → "My Account"
auth.account.profile        → "Profile"
auth.account.orders         → "My Orders"
auth.account.registrations  → "Pet Registrations"
auth.account.changePassword → "Change Password"
auth.account.logout         → "Sign Out"
auth.account.editProfile    → "Edit Profile"
auth.account.saveChanges    → "Save Changes"
auth.account.noOrders       → "No orders yet"
auth.account.noRegistrations→ "No pet registrations yet"

auth.userMenu.account       → "My Account"
auth.userMenu.orders        → "My Orders"
auth.userMenu.logout        → "Sign Out"
```

---

## 9. File Structure

### New Files (Phase A — Mock)

```
src/
├── contexts/
│   └── auth-context.tsx              ← AuthProvider (mock) + useAuth hook
├── components/
│   ├── ui/
│   │   ├── oauth-button.tsx          ← Google OAuth button
│   │   └── password-input.tsx        ← Password with visibility toggle
│   ├── sections/
│   │   └── auth-form.tsx             ← Shared auth form card wrapper
│   └── layout/
│       ├── user-menu.tsx             ← Header user dropdown
│       ├── auth-guard.tsx            ← Route protection wrapper
│       └── account-layout.tsx        ← Account page sidebar layout
├── app/
│   └── [locale]/
│       ├── auth/
│       │   ├── login/page.tsx        ← Login page
│       │   ├── register/page.tsx     ← Register page
│       │   ├── forgot-password/page.tsx
│       │   └── reset-password/page.tsx
│       └── account/
│           └── page.tsx              ← Profile / dashboard page
└── messages/
    ├── en.json                       ← Add "auth" section
    ├── es.json                       ← Add "auth" section
    └── pt.json                       ← Add "auth" section
```

### Files to Modify (Phase A)

```
src/
├── components/layout/
│   ├── header.tsx                    ← Add Login btn / UserMenu
│   └── mobile-nav.tsx               ← Add auth links
├── app/[locale]/layout.tsx           ← Wrap with AuthProvider
└── messages/*.json                   ← Add auth translation keys
```

### Additional Files (Phase B — Real Supabase)

```
src/
├── lib/supabase/
│   ├── client.ts                     ← Browser client (createBrowserClient)
│   ├── server.ts                     ← Server client (createServerClient)
│   └── middleware.ts                 ← updateSession helper
├── app/
│   └── auth/
│       └── callback/route.ts         ← OAuth callback (outside [locale])
├── contexts/
│   └── auth-context.tsx              ← Swap MockProvider → SupabaseProvider
└── middleware.ts                     ← Add Supabase session refresh + route protection
```

---

## 10. Implementation Phases

### Phase A: UI with Mock API (For Client Presentation)

**Step 1 — Foundation (auth context + translations)**
1. Create `src/contexts/auth-context.tsx` with mock provider
2. Add `auth` section to `en.json`, `es.json`, `pt.json`
3. Wrap `[locale]/layout.tsx` with `AuthProvider`

**Step 2 — Auth pages**
4. Create login page (`/auth/login`)
5. Create register page (`/auth/register`)
6. Create forgot password page (`/auth/forgot-password`)
7. Create reset password page (`/auth/reset-password`)

**Step 3 — Account area**
8. Create account page (`/account`)
9. Create `AuthGuard` component
10. Create `AccountLayout` with sidebar navigation

**Step 4 — Header integration**
11. Create `UserMenu` dropdown component
12. Update `header.tsx` — show Login button or UserMenu based on auth state
13. Update `mobile-nav.tsx` — add auth links

**Step 5 — Polish**
14. Test all auth flows (login, register, forgot, reset, logout)
15. Test logged-in vs logged-out header states
16. Test protected route redirect
17. Test all 3 locales
18. Test mobile responsiveness

### Total New Files: ~12
### Total Modified Files: ~6 (header, mobile-nav, locale layout, 3 message files)

---

## 11. Phase B: Real Supabase Swap

> Only after client approves the UI from Phase A.

### Package Installation

```
@supabase/ssr (add)
```

### Supabase Dashboard Config

- Enable Email/Password provider
- Enable Google OAuth provider (requires Google Cloud Console setup)
- Add redirect URLs:
  - `http://localhost:3050/auth/callback`
  - `https://libertypawsinternational.com/auth/callback`
- Configure email templates (confirmation, password reset)
- Create `profiles` table with trigger on `auth.users`

### Code Changes

| File | Change |
|------|--------|
| `lib/supabase/client.ts` | Implement `createBrowserClient` |
| `lib/supabase/server.ts` | Implement `createServerClient` with async cookies |
| `lib/supabase/middleware.ts` | Implement `updateSession` helper |
| `contexts/auth-context.tsx` | Replace `MockAuthProvider` with `SupabaseAuthProvider` |
| `middleware.ts` | Compose next-intl + Supabase session refresh + route protection |
| `app/auth/callback/route.ts` | Create OAuth code exchange handler |

### Key Technical Details for Phase B

- **Cookie API**: Only `getAll()` / `setAll()` — never individual `get`/`set`/`remove`
- **Auth verification**: Use `getClaims()` in middleware (local JWT validation, no network call)
- **Middleware order**: i18n routing → Supabase token refresh → route protection
- **Auth callback**: Outside `[locale]/` — OAuth providers redirect to a fixed URL
- **Locale in OAuth flow**: Pass locale via `next` query param through the callback

### Swap Effort Estimate

The context interface stays identical. The swap involves:
- 3 new Supabase utility files
- 1 callback route
- Replacing the mock provider implementation
- Adding session refresh to middleware

Since the UI is already built and tested, the swap is isolated to the auth layer.

---

**Document End**

*This plan covers the full authentication UI (Phase A) and the Supabase backend integration (Phase B). Phase A can be built independently and presented to the client. Phase B is a backend-only swap with no UI changes required.*
