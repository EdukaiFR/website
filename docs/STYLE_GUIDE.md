# Charte Graphique Edukai

Ce document définit la charte graphique complète du projet Edukai pour assurer une cohérence visuelle sur toutes les plateformes (web, mobile, emails).

## 📋 Table des matières

1. [Couleurs](#couleurs)
2. [Typographie](#typographie)
3. [Espacements](#espacements)
4. [Composants](#composants)
5. [Effets Visuels](#effets-visuels)
6. [Animations](#animations)
7. [Implémentation Mobile](#implémentation-mobile-react-native)
8. [Templates Email](#templates-email)
9. [Bonnes Pratiques](#bonnes-pratiques)

---

## Couleurs

### Palette Principale

#### Mode Clair (Light Theme)

| Nom | HSL | HEX | Utilisation |
|-----|-----|-----|-------------|
| **Background** | `hsl(220, 20%, 97%)` | `#F5F7F9` | Fond principal de l'application |
| **Foreground** | `hsl(240, 10%, 3.9%)` | `#090A0D` | Texte principal |
| **Primary** | `hsl(240, 5.9%, 10%)` | `#18181B` | Actions principales, boutons primaires |
| **Primary Brand** | - | `#2D6BCF` | Couleur de marque principale |
| **Primary Accent** | - | `#3678FF` | Accent bleu vif |
| **Secondary** | `hsl(240, 4.8%, 95.9%)` | `#F4F4F5` | Fonds secondaires |
| **Accent** | `hsl(240, 4.8%, 95.9%)` | `#F4F4F5` | Éléments d'accent |
| **Muted** | `hsl(240, 4.8%, 95.9%)` | `#F4F4F5` | Texte désactivé/secondaire |
| **Destructive** | `hsl(0, 84.2%, 60.2%)` | `#EF4444` | Actions destructives, erreurs |
| **Border** | `hsl(240, 5.9%, 90%)` | `#E4E4E7` | Bordures et séparateurs |

#### Mode Sombre (Dark Theme)

| Nom | HSL | HEX | Utilisation |
|-----|-----|-----|-------------|
| **Background** | `hsl(240, 5.9%, 7.5%)` | `#121214` | Fond principal |
| **Foreground** | `hsl(0, 0%, 98%)` | `#FAFAFA` | Texte principal |
| **Primary** | `hsl(0, 0%, 98%)` | `#FAFAFA` | Actions principales |
| **Secondary** | `hsl(240, 3.7%, 15.9%)` | `#262629` | Fonds secondaires |
| **Accent** | `hsl(240, 3.7%, 15.9%)` | `#262629` | Éléments d'accent |
| **Destructive** | `hsl(0, 62.8%, 30.6%)` | `#7F1D1D` | Actions destructives |
| **Border** | `hsl(240, 3.7%, 15.9%)` | `#262629` | Bordures |

### Couleurs de Statut

| Statut | Background | Text | HEX Background | HEX Text |
|--------|------------|------|----------------|----------|
| **Succès** | `bg-green-50` | `text-green-600` | `#F0FDF4` | `#16A34A` |
| **Info** | `bg-blue-50` | `text-blue-600` | `#EFF6FF` | `#2563EB` |
| **Warning** | `bg-yellow-50` | `text-yellow-600` | `#FEFCE8` | `#CA8A04` |
| **Erreur** | `bg-red-50` | `text-red-600` | `#FEF2F2` | `#DC2626` |

### Dégradés

```css
/* Dégradé principal */
.gradient-primary {
  background: linear-gradient(135deg, #3678FF 0%, #2D6BCF 100%);
}

/* Dégradé bleu-indigo */
.gradient-blue-indigo {
  background: linear-gradient(135deg, #2563EB 0%, #6366F1 100%);
}

/* Dégradé succès */
.gradient-success {
  background: linear-gradient(135deg, #10B981 0%, #14B8A6 100%);
}

/* Dégradé violet-rose */
.gradient-purple-pink {
  background: linear-gradient(135deg, #A855F7 0%, #EC4899 100%);
}
```

---

## Typographie

### Familles de Polices

#### Satoshi (Police Principale)

**Installation:** Police personnalisée, fichiers dans `/app/satoshi.css`

| Variante | Poids | Classe CSS | Utilisation |
|----------|-------|------------|-------------|
| Light | 300 | `.satoshi-light` | Texte secondaire léger |
| Regular | 400 | `font-sans` (défaut) | Corps de texte |
| Medium | 500 | `.satoshi-medium` | Titres secondaires |
| Bold | 700 | `.satoshi-bold` | Titres principaux |
| Black | 900 | `.satoshi-black` | Titres d'impact |

#### Outfit (Police Secondaire)

**Installation:** Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
```

| Variante | Poids | Classe CSS | Utilisation |
|----------|-------|------------|-------------|
| Light | 300 | `.outfit-light` | Texte décoratif léger |
| Regular | 500 | `.outfit-regular` | Texte alternatif |
| Bold | 700 | `.outfit-bold` | Emphase |

### Échelle Typographique

| Taille | Classe | Pixels | Utilisation |
|--------|--------|--------|-------------|
| XS | `text-xs` | 12px | Labels, meta-texte |
| SM | `text-sm` | 14px | Texte secondaire, boutons |
| Base | `text-base` | 16px | Corps de texte principal |
| LG | `text-lg` | 18px | Sous-titres |
| XL | `text-xl` | 20px | Titres de section |
| 2XL | `text-2xl` | 24px | Titres de page |
| 3XL | `text-3xl` | 30px | Titres principaux |
| 4XL | `text-4xl` | 36px | Héros, landing |

### Classes Utilitaires Personnalisées

```css
.text-medium {
  font-family: 'Satoshi-Medium', sans-serif;
  color: #3678FF;
}

.text-medium-white {
  font-family: 'Satoshi-Medium', sans-serif;
  color: white;
}

.text-medium-black {
  font-family: 'Satoshi-Medium', sans-serif;
  color: rgba(26, 32, 44, 0.75);
}

.text-primary {
  color: #2D6BCF;
}
```

---

## Espacements

### Système de Grille

- **Base Unit:** 4px
- **Spacing Scale:** 0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64

### Espacements Standards

| Nom | Classe | Pixels | Utilisation |
|-----|--------|--------|-------------|
| XXS | `p-1` | 4px | Espacement minimal |
| XS | `p-2` | 8px | Espacement compact |
| SM | `p-3` | 12px | Espacement réduit |
| Base | `p-4` | 16px | Espacement standard |
| MD | `p-6` | 24px | Cards, sections |
| LG | `p-8` | 32px | Grandes sections |
| XL | `p-12` | 48px | Hero sections |

### Gaps Standards

- **Boutons/Icônes:** `gap-2` (8px)
- **Listes:** `gap-3` (12px) ou `gap-4` (16px)
- **Sections:** `gap-6` (24px) ou `gap-8` (32px)
- **Grilles:** `gap-4` (16px) mobile, `gap-6` (24px) desktop

### Border Radius

| Nom | Classe | Pixels | Utilisation |
|-----|--------|--------|-------------|
| None | `rounded-none` | 0px | Éléments plats |
| SM | `rounded-sm` | 4px | Badges, chips |
| Base | `rounded` | 6px | Inputs |
| MD | `rounded-md` | 6px | Boutons |
| LG | `rounded-lg` | 8px | Cards secondaires |
| XL | `rounded-xl` | 12px | Cards principales |
| 2XL | `rounded-2xl` | 16px | Modales, sections |
| Full | `rounded-full` | 9999px | Avatars, pills |

---

## Composants

### Boutons

#### Variantes

```tsx
// Primary
className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md"

// Secondary
className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2 rounded-md"

// Outline
className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-md"

// Ghost
className="hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-md"

// Destructive
className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-4 py-2 rounded-md"
```

#### Tailles

- **Small:** `h-8 px-3 text-sm`
- **Default:** `h-9 px-4`
- **Large:** `h-10 px-8`
- **Icon:** `h-9 w-9`

### Cards

```tsx
// Structure standard
<div className="rounded-xl border bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200">
  <div className="p-6 space-y-1.5">
    {/* Header */}
  </div>
  <div className="p-6 pt-0">
    {/* Content */}
  </div>
  <div className="flex items-center p-6 pt-0">
    {/* Footer */}
  </div>
</div>
```

### Inputs

```tsx
// Input standard
className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
```

---

## Effets Visuels

### Glass Morphism

```css
.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-effect-strong {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

### Ombres

```css
/* Petite ombre */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* Ombre standard */
.shadow {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

/* Ombre moyenne */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Grande ombre */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Très grande ombre */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

---

## Animations

### Transitions Standard

```css
/* Rapide */
.transition-fast {
  transition: all 200ms ease;
}

/* Normal */
.transition-normal {
  transition: all 300ms ease;
}

/* Lente */
.transition-slow {
  transition: all 500ms ease;
}
```

### Hover Effects

```css
/* Scale */
.hover-scale {
  transition: transform 200ms ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}

/* Shadow */
.hover-shadow {
  transition: box-shadow 200ms ease;
}
.hover-shadow:hover {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.15);
}
```

### Animation Personnalisée

```css
@keyframes rotate-gentle {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  75% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}

.animate-rotate-gentle {
  animation: rotate-gentle 2s ease-in-out infinite;
}
```

---

## Implémentation Mobile (React Native)

### Configuration des Couleurs

```javascript
// colors.js
export const colors = {
  light: {
    background: '#F5F7F9',
    foreground: '#090A0D',
    primary: '#2D6BCF',
    primaryAccent: '#3678FF',
    secondary: '#F4F4F5',
    destructive: '#EF4444',
    border: '#E4E4E7',
    muted: '#71717A',
    success: '#16A34A',
    warning: '#CA8A04',
    info: '#2563EB',
  },
  dark: {
    background: '#121214',
    foreground: '#FAFAFA',
    primary: '#3678FF',
    secondary: '#262629',
    destructive: '#7F1D1D',
    border: '#262629',
    muted: '#A1A1AA',
  }
};
```

### Typographie React Native

```javascript
// typography.js
export const typography = {
  fontFamily: {
    light: 'Satoshi-Light',
    regular: 'Satoshi-Regular',
    medium: 'Satoshi-Medium',
    bold: 'Satoshi-Bold',
    black: 'Satoshi-Black',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
  }
};
```

### Composant Bouton React Native

```jsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography } from './theme';

const Button = ({ variant = 'primary', size = 'default', children, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.base, styles[variant], styles[size]]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: colors.light.primary,
  },
  secondary: {
    backgroundColor: colors.light.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  default: {
    height: 36,
  },
  small: {
    height: 32,
    paddingHorizontal: 12,
  },
  large: {
    height: 40,
    paddingHorizontal: 32,
  },
  text: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: colors.light.foreground,
  },
  outlineText: {
    color: colors.light.foreground,
  },
});
```

---

## Templates Email

### Structure HTML de Base

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    
    /* Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700&display=swap');
    
    /* Base Styles */
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #F5F7F9 !important;
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #3678FF 0%, #2D6BCF 100%);
      padding: 32px;
      text-align: center;
    }
    
    .content {
      padding: 32px;
    }
    
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2D6BCF;
      color: #FFFFFF;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
    }
    
    .footer {
      background-color: #F4F4F5;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #71717A;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 700;">
        Edukai
      </h1>
    </div>
    
    <div class="content">
      <h2 style="color: #090A0D; font-size: 20px; margin-bottom: 16px;">
        Titre du Message
      </h2>
      
      <p style="color: #3F3F46; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
        Contenu du message...
      </p>
      
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <a href="#" class="button">Action Principale</a>
          </td>
        </tr>
      </table>
    </div>
    
    <div class="footer">
      <p style="margin: 0;">
        © 2024 Edukai. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>
```

### Composants Email Réutilisables

#### Carte de Notification

```html
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
  <tr>
    <td style="background-color: #EFF6FF; border-left: 4px solid #2563EB; padding: 16px; border-radius: 6px;">
      <p style="margin: 0; color: #1E40AF; font-weight: 500; font-size: 14px;">
        Information
      </p>
      <p style="margin: 8px 0 0 0; color: #3730A3; font-size: 14px;">
        Message d'information...
      </p>
    </td>
  </tr>
</table>
```

#### Bouton Secondaire

```html
<table cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding: 10px 20px; border: 1px solid #E4E4E7; border-radius: 6px;">
      <a href="#" style="color: #090A0D; text-decoration: none; font-weight: 500; font-size: 14px;">
        Action Secondaire
      </a>
    </td>
  </tr>
</table>
```

---

## Bonnes Pratiques

### Cohérence Visuelle

1. **Hiérarchie Visuelle**
   - Utiliser la taille et le poids des polices pour créer une hiérarchie claire
   - Maintenir des contrastes suffisants (minimum WCAG AA)
   - Espacer les éléments de manière cohérente

2. **Couleurs**
   - Toujours utiliser les couleurs de la palette définie
   - Privilégier les variables CSS pour faciliter la maintenance
   - Tester les contrastes pour l'accessibilité

3. **Typographie**
   - Maximum 2 familles de polices par page
   - Utiliser les classes utilitaires définies
   - Respecter l'échelle typographique

### Responsive Design

1. **Breakpoints Standards**
   - Mobile: < 640px
   - Tablet: 640px - 1024px
   - Desktop: > 1024px

2. **Mobile First**
   - Concevoir d'abord pour mobile
   - Ajouter des styles pour les écrans plus grands
   - Tester sur de vrais appareils

### Performance

1. **Optimisation des Assets**
   - Utiliser des formats d'image modernes (WebP, AVIF)
   - Lazy loading pour les images non critiques
   - Minifier CSS et JavaScript

2. **Animations**
   - Privilégier `transform` et `opacity` pour les animations
   - Utiliser `will-change` avec parcimonie
   - Limiter les animations sur mobile

### Accessibilité

1. **Contrastes**
   - Minimum 4.5:1 pour le texte normal
   - Minimum 3:1 pour le texte large
   - Tester avec des outils de vérification

2. **Navigation**
   - Focus visible sur tous les éléments interactifs
   - Ordre de tabulation logique
   - Labels descriptifs pour les formulaires

### Maintenance

1. **Documentation**
   - Commenter les styles complexes
   - Maintenir ce guide à jour
   - Créer des exemples visuels

2. **Versioning**
   - Versionner les changements majeurs
   - Communiquer les changements à l'équipe
   - Maintenir la rétrocompatibilité

---

## Ressources

- **Figma:** [Lien vers le design system] (à ajouter)
- **Storybook:** [Lien vers les composants] (à configurer)
- **Documentation Tailwind:** https://tailwindcss.com/docs
- **ShadCN UI:** https://ui.shadcn.com/
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

*Document maintenu par l'équipe Edukai - Dernière mise à jour: Décembre 2024*