// ============================================================
// NaviMoov — Démo 3D embarquée dans le site
// ============================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('scene3d');
if (!canvas) {
  console.warn('Canvas #scene3d introuvable');
}

const container = canvas.parentElement;
let w = container.clientWidth;
let h = container.clientHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe8e8ea);
scene.fog = new THREE.Fog(0xe8e8ea, 14, 35);

const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
camera.position.set(4, 5, 9);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 2, -1);
controls.maxPolarAngle = Math.PI / 2.05;
controls.minDistance = 5;
controls.maxDistance = 20;

// Resize : la démo suit la taille du conteneur, pas de la fenêtre
const ro = new ResizeObserver(() => {
  w = container.clientWidth;
  h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});
ro.observe(container);

// ============================================================
// LIGHTING
// ============================================================
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const key = new THREE.DirectionalLight(0xffffff, 1.0);
key.position.set(6, 12, 6);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = -14; key.shadow.camera.right = 14;
key.shadow.camera.top = 14; key.shadow.camera.bottom = -14;
key.shadow.bias = -0.0005;
scene.add(key);
const fill = new THREE.DirectionalLight(0xb8d4ff, 0.35);
fill.position.set(-5, 8, -3);
scene.add(fill);

// ============================================================
// MATERIALS
// ============================================================
const M = {
  tile: new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.5 }),
  floor: new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.85 }),
  stair: new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.7 }),
  stairEdge: new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.5, metalness: 0.3 }),
  rail: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.7 }),
  metal: new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.25, metalness: 0.85 }),
  platformTop: new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.95 }),
  wheelchair: new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6, metalness: 0.4 }),
  skin: new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 0.7 }),
  jacket: new THREE.MeshStandardMaterial({ color: 0x2a3140, roughness: 0.8 }),
  jeans: new THREE.MeshStandardMaterial({ color: 0x1a2230, roughness: 0.8 }),
  btnUp: new THREE.MeshStandardMaterial({ color: 0x1a5d2c, emissive: 0x0a3015, emissiveIntensity: 0.4 }),
  btnDown: new THREE.MeshStandardMaterial({ color: 0x1a3d5d, emissive: 0x0a1f30, emissiveIntensity: 0.4 }),
  btnStop: new THREE.MeshStandardMaterial({ color: 0x5d1a1a, emissive: 0x300a0a, emissiveIntensity: 0.4 }),
  bornCall: new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x553300, emissiveIntensity: 0.5 }),
  ledStrip: new THREE.MeshStandardMaterial({ color: 0x4d9fff, emissive: 0x1a5fff, emissiveIntensity: 0.6 })
};

// ============================================================
// DECOR (escalier metro)
// ============================================================
const stepCount = 8;
const stepHeight = 0.5;
const stepDepth = 0.5;
const stepWidth = 10.0;
const STAIR_TOP_Y = stepCount * stepHeight;
const STAIR_TOP_Z = -stepCount * stepDepth;
const STAIR_CENTER_X = 0;

scene.add(makeMesh(new THREE.BoxGeometry(12, 0.2, 10), M.floor, [0, -0.1, 3], { receive: true }));
scene.add(makeMesh(new THREE.BoxGeometry(12, 0.2, 4), M.floor, [0, STAIR_TOP_Y - 0.1, STAIR_TOP_Z - 2], { receive: true }));
scene.add(makeMesh(new THREE.BoxGeometry(0.2, 7, 16), M.tile, [-5, 3.4, -1]));
scene.add(makeMesh(new THREE.BoxGeometry(0.2, 7, 16), M.tile, [5, 3.4, -1]));
scene.add(makeMesh(new THREE.BoxGeometry(12, 0.2, 16), M.tile, [0, 6.9, -1]));
scene.add(makeMesh(new THREE.BoxGeometry(12, 4, 0.2), M.tile, [0, 1.95, -7]));

for (let i = 0; i < stepCount; i++) {
  scene.add(makeMesh(
    new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth),
    M.stair,
    [STAIR_CENTER_X, stepHeight / 2 + i * stepHeight, -i * stepDepth],
    { cast: true, receive: true }
  ));
  scene.add(makeMesh(
    new THREE.BoxGeometry(stepWidth, 0.04, 0.08),
    M.stairEdge,
    [STAIR_CENTER_X, stepHeight + i * stepHeight + 0.02, -i * stepDepth + stepDepth / 2 - 0.04]
  ));
}

// Panneau Sortie
{
  const c = document.createElement('canvas');
  c.width = 600; c.height = 100;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#002878'; ctx.fillRect(0, 0, 600, 100);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 56px sans-serif'; ctx.textBaseline = 'middle';
  ctx.fillText('↑ Sortie', 30, 50);
  ctx.fillStyle = '#FFCD00';
  ctx.beginPath(); ctx.arc(330, 50, 26, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000'; ctx.font = 'bold 30px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('1', 330, 52);
  ctx.fillStyle = '#A0006D';
  ctx.beginPath(); ctx.arc(395, 50, 26, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillText('4', 395, 52);
  const tex = new THREE.CanvasTexture(c);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.5), new THREE.MeshBasicMaterial({ map: tex }));
  sign.position.set(STAIR_CENTER_X, 5.5, -6.85);
  scene.add(sign);
}

// ============================================================
// NAVIMOOV
// ============================================================
const PLATFORM_DECK_THICKNESS = 0.08;
const PLATFORM_SURFACE_LOCAL_Y = PLATFORM_DECK_THICKNESS / 2;
const RAIL_VISUAL_OFFSET_Y = 0.6;
const CARRIAGE_BOTTOM_Y = -PLATFORM_SURFACE_LOCAL_Y;
const CARRIAGE_TOP_Y = STAIR_TOP_Y - PLATFORM_SURFACE_LOCAL_Y;
const CARRIAGE_X = -3.5;

const CARRIAGE_CLIMB_LIFT = 1.0;
const CARRIAGE_PATH = [
  new THREE.Vector3(CARRIAGE_X, CARRIAGE_BOTTOM_Y, 1.5),
  new THREE.Vector3(CARRIAGE_X, CARRIAGE_BOTTOM_Y, 1.2),
  new THREE.Vector3(CARRIAGE_X, CARRIAGE_TOP_Y + CARRIAGE_CLIMB_LIFT, STAIR_TOP_Z + 0.3),
  new THREE.Vector3(CARRIAGE_X, CARRIAGE_TOP_Y, STAIR_TOP_Z - 1.0)
];

const segLen = [];
let totalLen = 0;
for (let i = 0; i < CARRIAGE_PATH.length - 1; i++) {
  const d = CARRIAGE_PATH[i].distanceTo(CARRIAGE_PATH[i + 1]);
  segLen.push(d);
  totalLen += d;
}

function carriagePosition(t) {
  const targetDist = t * totalLen;
  let acc = 0;
  for (let i = 0; i < segLen.length; i++) {
    if (acc + segLen[i] >= targetDist) {
      const localP = (targetDist - acc) / segLen[i];
      return new THREE.Vector3().lerpVectors(CARRIAGE_PATH[i], CARRIAGE_PATH[i + 1], localP);
    }
    acc += segLen[i];
  }
  return CARRIAGE_PATH[CARRIAGE_PATH.length - 1].clone();
}

const RAIL_VISUAL_X = -4.75;
const RAIL_PATH = CARRIAGE_PATH.map(p => new THREE.Vector3(RAIL_VISUAL_X, p.y + RAIL_VISUAL_OFFSET_Y, p.z));

function makeRailSegment(start, end, thickness = 0.08, mat = M.rail) {
  const dir = new THREE.Vector3().subVectors(end, start);
  const len = dir.length();
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const geo = new THREE.BoxGeometry(thickness, len, thickness * 1.5);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(mid);
  const upAxis = new THREE.Vector3(0, 1, 0);
  const quat = new THREE.Quaternion().setFromUnitVectors(upAxis, dir.clone().normalize());
  mesh.quaternion.copy(quat);
  return mesh;
}

for (let i = 0; i < RAIL_PATH.length - 1; i++) {
  scene.add(makeRailSegment(RAIL_PATH[i], RAIL_PATH[i + 1], 0.08, M.rail));
  scene.add(makeRailSegment(
    new THREE.Vector3(RAIL_PATH[i].x, RAIL_PATH[i].y - 0.18, RAIL_PATH[i].z),
    new THREE.Vector3(RAIL_PATH[i + 1].x, RAIL_PATH[i + 1].y - 0.18, RAIL_PATH[i + 1].z),
    0.08, M.rail
  ));
  scene.add(makeRailSegment(
    new THREE.Vector3(RAIL_PATH[i].x + 0.06, RAIL_PATH[i].y - 0.09, RAIL_PATH[i].z),
    new THREE.Vector3(RAIL_PATH[i + 1].x + 0.06, RAIL_PATH[i + 1].y - 0.09, RAIL_PATH[i + 1].z),
    0.04, M.ledStrip
  ));
}

// Supports
for (let i = 0; i < RAIL_PATH.length; i++) {
  scene.add(makeMesh(new THREE.BoxGeometry(0.2, 0.06, 0.06), M.metal, [RAIL_PATH[i].x - 0.05, RAIL_PATH[i].y - 0.09, RAIL_PATH[i].z]));
}
for (let t = 0.15; t < 0.85; t += 0.15) {
  const p = carriagePosition(t);
  scene.add(makeMesh(new THREE.BoxGeometry(0.2, 0.06, 0.06), M.metal, [RAIL_VISUAL_X - 0.05, p.y + RAIL_VISUAL_OFFSET_Y - 0.09, p.z]));
}

// Bornes d'appel
function makeCallStation() {
  const g = new THREE.Group();
  g.add(makeMesh(new THREE.BoxGeometry(0.15, 1.1, 0.15), M.rail, [0, 0.55, 0]));
  g.add(makeMesh(new THREE.BoxGeometry(0.25, 0.35, 0.2), M.rail, [0, 1.25, 0]));
  const btnCall = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 20), M.bornCall);
  btnCall.rotation.z = Math.PI / 2;
  btnCall.position.set(0.135, 1.25, 0);
  g.add(btnCall);
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.06), new THREE.MeshBasicMaterial({ color: 0x0a4f1c }));
  lcd.position.set(0.131, 1.35, 0);
  lcd.rotation.y = Math.PI / 2;
  g.add(lcd);
  return g;
}

const bornBottom = makeCallStation();
bornBottom.position.set(-1.5, 0, 3.6);
bornBottom.rotation.y = -Math.PI / 3;
scene.add(bornBottom);

const bornTop = makeCallStation();
bornTop.position.set(-1.5, STAIR_TOP_Y, STAIR_TOP_Z - 2.0);
bornTop.rotation.y = -Math.PI / 3;
scene.add(bornTop);

// CARRIAGE + PLATEFORME
const carriage = new THREE.Group();
scene.add(carriage);
carriage.position.copy(CARRIAGE_PATH[0]);

carriage.add(makeMesh(new THREE.BoxGeometry(1.25, 0.1, 0.15), M.metal, [-0.625, RAIL_VISUAL_OFFSET_Y - 0.1, 0]));
carriage.add(makeMesh(new THREE.BoxGeometry(0.15, RAIL_VISUAL_OFFSET_Y, 0.15), M.metal, [-1.25, RAIL_VISUAL_OFFSET_Y / 2, 0]));

const platform = new THREE.Group();
carriage.add(platform);
const deckGroup = new THREE.Group();
platform.add(deckGroup);

deckGroup.add(makeMesh(new THREE.BoxGeometry(1.3, PLATFORM_DECK_THICKNESS, 1.4), M.platformTop, [0, 0, 0], { cast: true, receive: true }));
deckGroup.add(makeMesh(
  new THREE.BoxGeometry(1.2, 0.02, 1.3),
  new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 1 }),
  [0, PLATFORM_SURFACE_LOCAL_Y + 0.01, 0]
));

// Logo sur le plateau
{
  const c = document.createElement('canvas');
  c.width = 256; c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#1a3a8c'; ctx.font = 'bold 42px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Navi', 90, 75);
  ctx.fillStyle = '#2ecc71'; ctx.fillText('Moov', 180, 75);
  const tex = new THREE.CanvasTexture(c);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.25), new THREE.MeshBasicMaterial({ map: tex }));
  plate.rotation.x = -Math.PI / 2;
  plate.position.set(0.35, PLATFORM_SURFACE_LOCAL_Y + 0.02, -0.5);
  deckGroup.add(plate);
}

deckGroup.add(makeMesh(new THREE.BoxGeometry(0.06, 1.0, 1.4), M.metal, [-0.57, 0.55, 0]));
deckGroup.add(makeMesh(new THREE.BoxGeometry(0.06, 0.35, 0.4), M.rail, [-0.53, 0.7, 0]));

const btnGeoSmall = new THREE.CylinderGeometry(0.035, 0.035, 0.015, 16);
const onbBtnUp = new THREE.Mesh(btnGeoSmall, M.btnUp);
onbBtnUp.rotation.z = Math.PI / 2;
onbBtnUp.position.set(-0.49, 0.82, -0.1);
deckGroup.add(onbBtnUp);
const onbBtnStop = new THREE.Mesh(btnGeoSmall, M.btnStop);
onbBtnStop.rotation.z = Math.PI / 2;
onbBtnStop.position.set(-0.49, 0.70, 0);
deckGroup.add(onbBtnStop);
const onbBtnDown = new THREE.Mesh(btnGeoSmall, M.btnDown);
onbBtnDown.rotation.z = Math.PI / 2;
onbBtnDown.position.set(-0.49, 0.58, 0.1);
deckGroup.add(onbBtnDown);

const barrierLeftPivot = new THREE.Group();
barrierLeftPivot.position.set(-0.6, PLATFORM_SURFACE_LOCAL_Y, -0.6);
deckGroup.add(barrierLeftPivot);
barrierLeftPivot.add(makeMesh(new THREE.BoxGeometry(1.2, 0.5, 0.04), M.metal, [0.65, 0.3, 0]));

const barrierRightPivot = new THREE.Group();
barrierRightPivot.position.set(-0.6, PLATFORM_SURFACE_LOCAL_Y, 0.6);
deckGroup.add(barrierRightPivot);
barrierRightPivot.add(makeMesh(new THREE.BoxGeometry(1.2, 0.5, 0.04), M.metal, [0.65, 0.3, 0]));

const accessRampPivot = new THREE.Group();
accessRampPivot.position.set(0.65, PLATFORM_SURFACE_LOCAL_Y, 0);
deckGroup.add(accessRampPivot);
accessRampPivot.add(makeMesh(new THREE.BoxGeometry(0.25, 0.04, 1.3), M.platformTop, [0.12, 0, 0]));

const passengerSlot = new THREE.Group();
passengerSlot.position.set(0, PLATFORM_SURFACE_LOCAL_Y, 0);
deckGroup.add(passengerSlot);

// FAUTEUIL ROULANT
const wheelchair = new THREE.Group();
scene.add(wheelchair);

const wheelGeo = new THREE.TorusGeometry(0.32, 0.04, 8, 24);
const wheelL = new THREE.Mesh(wheelGeo, M.wheelchair);
wheelL.rotation.y = Math.PI / 2;
wheelL.position.set(0, 0.32, 0.32);
wheelchair.add(wheelL);
const wheelR = wheelL.clone();
wheelR.position.set(0, 0.32, -0.32);
wheelchair.add(wheelR);

const smallWheelGeo = new THREE.TorusGeometry(0.1, 0.025, 8, 16);
const smallWheelL = new THREE.Mesh(smallWheelGeo, M.wheelchair);
smallWheelL.rotation.y = Math.PI / 2;
smallWheelL.position.set(0.5, 0.1, 0.25);
wheelchair.add(smallWheelL);
const smallWheelR = smallWheelL.clone();
smallWheelR.position.set(0.5, 0.1, -0.25);
wheelchair.add(smallWheelR);

wheelchair.add(makeMesh(new THREE.BoxGeometry(0.45, 0.06, 0.5), M.jacket, [0.15, 0.5, 0]));
wheelchair.add(makeMesh(new THREE.BoxGeometry(0.05, 0.55, 0.5), M.wheelchair, [-0.05, 0.75, 0]));
wheelchair.add(makeMesh(new THREE.BoxGeometry(0.35, 0.5, 0.4), M.jacket, [0.15, 0.78, 0]));
wheelchair.add(makeMesh(new THREE.SphereGeometry(0.13, 16, 16), M.skin, [0.15, 1.15, 0]));
wheelchair.add(makeMesh(
  new THREE.SphereGeometry(0.135, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.2),
  new THREE.MeshStandardMaterial({ color: 0x3a2818, roughness: 0.9 }),
  [0.15, 1.18, 0]
));
wheelchair.add(makeMesh(new THREE.BoxGeometry(0.5, 0.12, 0.35), M.jeans, [0.4, 0.45, 0]));
wheelchair.traverse(c => { c.castShadow = true; });

// POSITIONS
const POS_START = { x: 1.5, z: 4.0, ry: Math.PI };
const POS_AT_BORN_BOTTOM = { x: -1.4, z: 3.0, ry: Math.PI };
const POS_BEFORE_RAMP = { x: -2.5, z: 1.5, ry: Math.PI };
const POS_ON_PLATFORM_WORLD = new THREE.Vector3(CARRIAGE_X, 0, 1.5);
const POS_EXIT_END = { x: -1.0, y: STAIR_TOP_Y, z: STAIR_TOP_Z - 3.0, ry: Math.PI };

wheelchair.position.set(POS_START.x, 0, POS_START.z);
wheelchair.rotation.y = POS_START.ry;

// ============================================================
// EASING
// ============================================================
const ease = {
  outCubic: t => 1 - Math.pow(1 - t, 3),
  inOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  inOutQuad: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
};

const PLATFORM_FOLDED = Math.PI / 2;
const PLATFORM_DEPLOYED = 0;
const BARRIER_OPEN = -Math.PI / 2;
const BARRIER_CLOSED = 0;
const RAMP_FOLDED = 0;
const RAMP_DEPLOYED = -Math.PI / 2.5;

platform.rotation.z = PLATFORM_FOLDED;
barrierLeftPivot.rotation.x = BARRIER_OPEN;
barrierRightPivot.rotation.x = -BARRIER_OPEN;
accessRampPivot.rotation.z = RAMP_FOLDED;

function reparentWheelchair(newParent) {
  const worldPos = new THREE.Vector3();
  const worldQuat = new THREE.Quaternion();
  wheelchair.getWorldPosition(worldPos);
  wheelchair.getWorldQuaternion(worldQuat);
  wheelchair.parent.remove(wheelchair);
  newParent.add(wheelchair);
  newParent.worldToLocal(worldPos);
  wheelchair.position.copy(worldPos);
  const parentWorldQuat = new THREE.Quaternion();
  newParent.getWorldQuaternion(parentWorldQuat);
  wheelchair.quaternion.copy(parentWorldQuat.invert().multiply(worldQuat));
}

function rollWheels(rate) {
  wheelL.rotation.x += rate;
  wheelR.rotation.x += rate;
  smallWheelL.rotation.x += rate * 3;
  smallWheelR.rotation.x += rate * 3;
}

function lerpPos(from, to, p, fixedY = 0) {
  wheelchair.position.x = from.x + (to.x - from.x) * p;
  wheelchair.position.z = from.z + (to.z - from.z) * p;
  wheelchair.position.y = fixedY;
}

// ============================================================
// STATE MACHINE
// ============================================================
const state = { phase: 'idle', t: 0, duration: 0, paused: false };
const stats = { cycles: 0 };

const phaseLabels = {
  idle:         { title: 'NaviMoov · Position repliée',  subtitle: 'Passage piéton libre' },
  arrival:      { title: 'Approche de la borne',         subtitle: 'L\'usager se dirige vers la borne d\'appel' },
  callRequest:  { title: 'Appui sur la borne',           subtitle: 'Appel de la plateforme' },
  deploy:       { title: 'Déploiement automatique',      subtitle: 'La plateforme se met au sol' },
  approachRamp: { title: 'Accès à la plateforme',        subtitle: 'Mise en place devant la rampe' },
  boarding:     { title: 'Embarquement',                 subtitle: 'L\'usager monte sur la plateforme' },
  closing:      { title: 'Sécurisation',                 subtitle: 'Barrières et rampe se ferment' },
  climbing:     { title: 'Montée le long du rail',       subtitle: 'Transport sécurisé' },
  opening:      { title: 'Arrivée au palier haut',       subtitle: 'Barrières s\'ouvrent' },
  exit:         { title: 'Sortie',                       subtitle: 'L\'usager rejoint le palier' },
  folding:      { title: 'Repli automatique',            subtitle: 'Plateforme contre le mur' },
  returning:    { title: 'Retour vers le bas',           subtitle: 'Chariot redescend le rail' },
  reset:        { title: 'NaviMoov · Prêt',              subtitle: 'Prochain usager' }
};

const phases = {
  idle: { duration: 2.5, next: 'arrival', update: () => { M.ledStrip.emissiveIntensity = 0.3; } },
  arrival: { duration: 3.0, next: 'callRequest', update: (r) => { lerpPos(POS_START, POS_AT_BORN_BOTTOM, ease.inOutQuad(r)); rollWheels(0.15); } },
  callRequest: { duration: 1.5, next: 'deploy', update: (r) => { const pu = Math.sin(r * Math.PI); M.bornCall.emissiveIntensity = 0.5 + pu * 1.8; M.ledStrip.emissiveIntensity = 0.3 + pu * 0.5; } },
  deploy: { duration: 2.5, next: 'approachRamp', update: (r) => {
    const p = ease.outCubic(r);
    platform.rotation.z = PLATFORM_FOLDED * (1 - p);
    if (r > 0.6) { const rp = ease.outCubic((r - 0.6) / 0.4); accessRampPivot.rotation.z = RAMP_FOLDED + (RAMP_DEPLOYED - RAMP_FOLDED) * rp; }
    M.ledStrip.emissiveIntensity = 0.6; M.bornCall.emissiveIntensity = 0.5;
  } },
  approachRamp: { duration: 2.0, next: 'boarding', update: (r) => { lerpPos(POS_AT_BORN_BOTTOM, POS_BEFORE_RAMP, ease.inOutQuad(r)); rollWheels(0.12); } },
  boarding: { duration: 2.0, next: 'closing',
    onEnter: () => { wheelchair.userData.boardStart = wheelchair.position.clone(); },
    update: (r) => {
      const p = ease.inOutCubic(r);
      const s = wheelchair.userData.boardStart, e = POS_ON_PLATFORM_WORLD;
      wheelchair.position.x = s.x + (e.x - s.x) * p;
      wheelchair.position.y = s.y + (e.y - s.y) * p;
      wheelchair.position.z = s.z + (e.z - s.z) * p;
      rollWheels(0.1);
    },
    onExit: () => { reparentWheelchair(passengerSlot); wheelchair.position.set(0, 0, 0); }
  },
  closing: { duration: 1.3, next: 'climbing', update: (r) => {
    const p = ease.inOutQuad(r);
    barrierLeftPivot.rotation.x = BARRIER_OPEN + (BARRIER_CLOSED - BARRIER_OPEN) * p;
    barrierRightPivot.rotation.x = -BARRIER_OPEN + (-BARRIER_CLOSED - (-BARRIER_OPEN)) * p;
    accessRampPivot.rotation.z = RAMP_DEPLOYED + (RAMP_FOLDED - RAMP_DEPLOYED) * p;
  } },
  climbing: { duration: 7.0, next: 'opening', update: (r) => {
    const p = ease.inOutCubic(r);
    const pu = Math.sin(r * Math.PI * 4);
    M.btnUp.emissiveIntensity = 0.5 + Math.max(0, pu) * 0.8;
    carriage.position.copy(carriagePosition(p));
    M.ledStrip.emissiveIntensity = 0.6 + Math.sin(r * Math.PI * 6) * 0.3;
  }, onExit: () => { M.btnUp.emissiveIntensity = 0.4; } },
  opening: { duration: 1.3, next: 'exit', update: (r) => {
    const p = ease.inOutQuad(r);
    barrierLeftPivot.rotation.x = BARRIER_CLOSED + (BARRIER_OPEN - BARRIER_CLOSED) * p;
    barrierRightPivot.rotation.x = -BARRIER_CLOSED + (-BARRIER_OPEN - (-BARRIER_CLOSED)) * p;
    accessRampPivot.rotation.z = RAMP_FOLDED + (RAMP_DEPLOYED - RAMP_FOLDED) * p;
    M.ledStrip.emissiveIntensity = 0.5;
  } },
  exit: { duration: 2.8, next: 'folding',
    onEnter: () => { reparentWheelchair(scene); wheelchair.userData.exitStart = wheelchair.position.clone(); },
    update: (r) => {
      const p = ease.inOutCubic(r);
      const s = wheelchair.userData.exitStart, e = POS_EXIT_END;
      wheelchair.position.x = s.x + (e.x - s.x) * p;
      wheelchair.position.y = s.y + (e.y - s.y) * p;
      wheelchair.position.z = s.z + (e.z - s.z) * p;
      rollWheels(0.12);
    },
    onExit: () => { stats.cycles++; updateCounter(); }
  },
  folding: { duration: 2.0, next: 'returning', update: (r) => {
    const p = ease.inOutCubic(r);
    accessRampPivot.rotation.z = RAMP_DEPLOYED + (RAMP_FOLDED - RAMP_DEPLOYED) * p;
    platform.rotation.z = PLATFORM_DEPLOYED + (PLATFORM_FOLDED - PLATFORM_DEPLOYED) * p;
    M.ledStrip.emissiveIntensity = 0.6 - 0.3 * p;
  } },
  returning: { duration: 4.5, next: 'reset', update: (r) => {
    carriage.position.copy(carriagePosition(1 - ease.inOutCubic(r)));
    M.ledStrip.emissiveIntensity = 0.3;
  } },
  reset: { duration: 0.1, next: 'idle', update: () => {
    wheelchair.position.set(POS_START.x, 0, POS_START.z);
    wheelchair.rotation.y = POS_START.ry;
    delete wheelchair.userData.boardStart;
    delete wheelchair.userData.exitStart;
    M.bornCall.emissiveIntensity = 0.5;
  } }
};

state.duration = phases.idle.duration;

function nextPhase() {
  const c = phases[state.phase];
  if (c.onExit) c.onExit();
  state.phase = c.next;
  state.t = 0;
  state.duration = phases[state.phase].duration;
  if (phases[state.phase].onEnter) phases[state.phase].onEnter();
  updateNarration();
}

// ============================================================
// UI BINDING
// ============================================================
const narrationTitle = document.getElementById('narration-title');
const narrationSubtitle = document.getElementById('narration-subtitle');
const counterValue = document.getElementById('counter-value');

function updateNarration() {
  const label = phaseLabels[state.phase];
  if (label && narrationTitle && narrationSubtitle) {
    narrationTitle.textContent = label.title;
    narrationSubtitle.textContent = label.subtitle;
  }
}

function updateCounter() {
  if (counterValue) counterValue.textContent = 127 + stats.cycles;
}

// Pause
const btnPause = document.getElementById('btn-pause');
if (btnPause) {
  btnPause.addEventListener('click', () => {
    state.paused = !state.paused;
    btnPause.textContent = state.paused ? '▶ Lecture' : '⏸ Pause';
  });
}

// Caméras
const cameraPresets = {
  overview: { pos: [4, 5, 9], target: [0, 2, -1] },
  platform: { pos: [-1, 2.5, 4], target: [-3.5, 1, 0] },
  passenger: { pos: [2, 3, 5], target: [-2, 1, 1] }
};

document.querySelectorAll('[data-camera]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-camera]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const p = cameraPresets[btn.dataset.camera];
    if (p) {
      camera.position.set(...p.pos);
      controls.target.set(...p.target);
      controls.update();
    }
  });
});

// ============================================================
// HELPERS + BOUCLE
// ============================================================
function makeMesh(geo, mat, pos, opts = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  if (opts.cast) m.castShadow = true;
  if (opts.receive) m.receiveShadow = true;
  return m;
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (!state.paused) {
    state.t += dt;
    const p = Math.min(state.t / state.duration, 1);
    const phase = phases[state.phase];
    if (phase.update) phase.update(p);
    if (p >= 1) nextPhase();
  }
  controls.update();
  renderer.render(scene, camera);
}

updateNarration();
animate();
