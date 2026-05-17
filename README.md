# NaviMoov — Site de présentation

Site one-page complet pour présenter le projet NaviMoov au **Festival EPA Île-de-France**, mardi 19 mai 2026.

Ce site est conçu pour deux usages :

1. **Stand du festival** : affiché sur un laptop (mode plein écran), les visiteurs scrollent et interagissent avec la démo 3D
2. **QR code** : sur les flyers et affiches, les visiteurs scannent et consultent le site sur leur téléphone

## Lancer le site

**Option 1 : double-clic** (le plus simple)
Double-clic sur `index.html`. Ça ouvre dans ton navigateur. La 3D peut ne pas charger à cause des modules ES6, dans ce cas passe à l'option 2.

**Option 2 : serveur local Python** (recommandé)
```bash
cd navimoov-site
python3 -m http.server 8000
```
Puis ouvre `http://localhost:8000` dans Chrome.

**Option 3 : Node.js**
```bash
cd navimoov-site
npx serve
```

## Structure des fichiers

```
navimoov-site/
├── index.html         Page complète (toutes les sections)
├── styles.css         Design system NaviMoov (charte bleu/vert)
├── script.js          Interactions UI (navbar, scroll, burger)
├── navimoov-3d.js     Scène 3D Three.js (section démo)
├── assets/
│   └── README.md      Où placer tes images uploadées
└── README.md          Ce fichier
```

## Les 8 sections du site

1. **Hero** — accroche "La mobilité pour tous" + 3 chiffres clés
2. **Le problème** — histoire de Charlotte Billot + statistiques alarmantes
3. **La solution** — 4 étapes de fonctionnement (repliée → déployée → montée → repliée)
4. **Démo 3D** — scène Three.js interactive avec contrôles caméra
5. **Pour qui** — 4 cards usagers (fauteuils / poussettes / âgées / voyageurs)
6. **Caractéristiques** — 6 features techniques
7. **L'équipe** — 5 départements de la mini-entreprise
8. **Festival** — bannière 19 mai 2026 + accroche finale

## Personnalisation rapide

### Couleurs (dans `styles.css`)
```css
:root {
  --navy: #14213d;     /* bleu marine principal */
  --green: #2ecc71;    /* vert accent NaviMoov */
  --red: #ff6b6b;      /* rouge pour chiffres alarmants */
}
```

### Logo
Place ton logo `logo.png` dans `assets/`. Voir `assets/README.md`.

### Équipe
Édite la section `equipe-grid` dans `index.html` pour ajuster les noms.

### Festival (date, lieu)
Édite la section `section-festival` dans `index.html`.

## Plan d'attaque suggéré avec Claude Code

Une fois le dossier ouvert dans Claude Code, commande type pour démarrer :

```
1. Lance le site en serveur local (python3 -m http.server 8000)
2. Liste mes images dans assets/ et propose-moi des intégrations
3. Aide-moi à ajuster les détails géométriques de la scène 3D (la plateforme et l'escalier dans navimoov-3d.js)
```

Ensuite tu peux itérer en direct :
- "Augmente la taille de la plateforme dans la 3D"
- "Mets l'image affiche.jpg en fond du hero"
- "Ajoute une section témoignages avant le festival"
- "Change le slogan du hero"

## Améliorations possibles (priorité décroissante)

### Priorité 1 — Tes images
Le site est neutre côté visuel. **Tes affiches IA et le logo amélioreront radicalement le rendu**. Voir `assets/README.md`.

### Priorité 2 — Rendu 3D
Les modèles 3D sont des primitives Three.js (look "Lego"). Pour aller plus loin :
- Importer des modèles GLB générés via Meshy.ai
- Ou embarquer une scène Spline (spline.design)
- Ou simplement ajouter des textures aux meshes existants

### Priorité 3 — Contenu enrichi
- Ajouter une vidéo de présentation dans la section démo
- Témoignages utilisateurs simulés
- Galerie photos du prototype physique
- FAQ interactive

### Priorité 4 — Le jour J
- Activer le mode plein écran sur la démo (touche F)
- Désactiver la mise en veille de l'écran du laptop
- Charger 100%, mode avion après chargement initial
- Tester sans réseau (la 3D devrait marcher, hors chargement Three.js CDN initial qui doit être en cache)

## Plan B (pour le 19 mai)

Capture vidéo MP4 de 30 secondes de la démo 3D en lecture automatique, à garder sur le bureau du laptop. Si problème technique le jour du festival : lecture vidéo plein écran. La maquette physique reste l'objet manipulable principal sur le stand.

---

**L'accessibilité n'est pas un confort. C'est un droit.**
**NaviMoov — La mobilité pour tous.**
