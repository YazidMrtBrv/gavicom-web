import * as THREE from "three";

/*
 * The home page scene: a seagull glides over a landscape in the brand blues,
 * comes down onto a railway and lands on a rail joint; the track then comes
 * apart into the parts GAVICOM supplies. Everything is built from code (no
 * models to download), in metres, with the joint at the world origin and the
 * track running along -z there.
 */

export type IdPieza = "riel" | "eclisa" | "perno" | "placa" | "almohadilla" | "clip" | "tirafondo";

export interface Ancla {
  id: IdPieza;
  x: number;
  y: number;
  visible: boolean;
}

export interface Motor {
  redimensionar(ancho: number, alto: number): void;
  cuadro(progreso: number, puntero: { x: number; y: number }, tiempo: number): void;
  anclas(): Ancla[];
  elegir(x: number, y: number): IdPieza | null;
  resaltar(id: IdPieza | null): void;
  destruir(): void;
}

const AZUL = new THREE.Color("#0c2642");
const HORIZONTE = new THREE.Color("#c9d6e4");

// ---------- small math helpers ----------
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const tramo = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const suave = (t: number) => t * t * (3 - 2 * t);
const suave2 = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

function ruido2(x: number, z: number) {
  // Cheap value noise; plenty for low hills seen from far away.
  const xi = Math.floor(x), zi = Math.floor(z);
  const xf = x - xi, zf = z - zi;
  const h = (a: number, b: number) => {
    const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  const a = h(xi, zi), b = h(xi + 1, zi), c = h(xi, zi + 1), d = h(xi + 1, zi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const fbm = (x: number, z: number) => {
  let v = 0, amp = 0.5, f = 1;
  for (let i = 0; i < 4; i++) {
    v += amp * ruido2(x * f, z * f);
    f *= 2.03;
    amp *= 0.5;
  }
  return v;
};

// ---------- sweep a closed 2D profile along a list of frames ----------
interface Marco {
  p: THREE.Vector3;
  derecha: THREE.Vector3;
  arriba: THREE.Vector3;
  s: number;
}

function barrido(perfil: [number, number][], marcos: Marco[], desplazamiento = 0, escalaU = 1): THREE.BufferGeometry {
  const pos: number[] = [];
  const uv: number[] = [];
  const n = perfil.length;
  const punto = (m: Marco, [u, v]: [number, number]) =>
    m.p.clone().addScaledVector(m.derecha, u + desplazamiento).addScaledVector(m.arriba, v);
  for (let i = 0; i < marcos.length - 1; i++) {
    const a = marcos[i], b = marcos[i + 1];
    for (let k = 0; k < n; k++) {
      const p0 = perfil[k], p1 = perfil[(k + 1) % n];
      const a0 = punto(a, p0), a1 = punto(a, p1), b0 = punto(b, p0), b1 = punto(b, p1);
      for (const q of [a0, b0, b1, a0, b1, a1]) pos.push(q.x, q.y, q.z);
      const ua = a.s * escalaU, ub = b.s * escalaU;
      uv.push(ua, k / n, ub, k / n, ub, (k + 1) / n, ua, k / n, ub, (k + 1) / n, ua, (k + 1) / n);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}

// 115 lb rail, simplified section (metres): base 140 mm, height 168 mm.
const PERFIL_RIEL: [number, number][] = [
  [-0.07, 0], [0.07, 0], [0.07, 0.012], [0.02, 0.03], [0.009, 0.045], [0.009, 0.12], [0.034, 0.13],
  [0.034, 0.168], [-0.034, 0.168], [-0.034, 0.13], [-0.009, 0.12], [-0.009, 0.045], [-0.02, 0.03], [-0.07, 0.012],
];
const PERFIL_BALASTO: [number, number][] = [[-2.3, -0.5], [2.3, -0.5], [1.65, 0.02], [-1.65, 0.02]];

const TROCHA = 0.752; // rail centre to track centre (1435 mm gauge + half head)
const BASE_RIEL = 0.2; // top of sleeper + plate + pad
const ALTO_RIEL = 0.168;
const MEDIO_HUECO = 3.1; // half length of the detailed section around the joint
const TRAVIESAS_DETALLE = [-2.79, -2.17, -1.55, -0.93, -0.31, 0.31, 0.93, 1.55, 2.17, 2.79];

// ---------- the seagull ----------
function crearGaviota() {
  // A little self-light keeps the white gull bright against the blue scene
  // even when the sun is behind it.
  const blanco = new THREE.MeshStandardMaterial({ color: "#f4f6f8", roughness: 0.55, metalness: 0, emissive: "#ffffff", emissiveIntensity: 0.28 });
  // Pale grey upper wing like a real gull; lit enough to read on the blue sky.
  const gris = new THREE.MeshStandardMaterial({ color: "#d3dbe4", roughness: 0.6, side: THREE.DoubleSide, emissive: "#e8eef5", emissiveIntensity: 0.32 });
  const punta = new THREE.MeshStandardMaterial({ color: "#16202b", roughness: 0.6, side: THREE.DoubleSide });
  const pico = new THREE.MeshStandardMaterial({ color: "#d9a441", roughness: 0.4 });

  const ave = new THREE.Group();
  const cuerpo = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), blanco);
  cuerpo.scale.set(0.17, 0.15, 0.55);
  ave.add(cuerpo);
  const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 12), blanco);
  cabeza.position.set(0, 0.08, 0.5);
  ave.add(cabeza);
  const picoM = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.15, 10), pico);
  picoM.rotation.x = Math.PI / 2;
  picoM.position.set(0, 0.065, 0.66);
  ave.add(picoM);
  const colaForma = new THREE.Shape();
  colaForma.moveTo(-0.13, 0);
  colaForma.lineTo(0.13, 0);
  colaForma.lineTo(0.09, -0.26);
  colaForma.lineTo(-0.09, -0.26);
  colaForma.closePath();
  const cola = new THREE.Mesh(new THREE.ShapeGeometry(colaForma), blanco);
  cola.rotation.x = -Math.PI / 2;
  cola.position.set(0, 0.02, -0.45);
  ave.add(cola);

  // Wings in two parts (arm and hand) so the flap bends like a real gull's.
  const ala = (lado: 1 | -1) => {
    const hombro = new THREE.Group();
    hombro.position.set(0.12 * lado, 0.05, 0.08);
    const brazo = new THREE.Shape();
    brazo.moveTo(0, 0.2);
    brazo.bezierCurveTo(0.3, 0.24, 0.55, 0.2, 0.72, 0.14);
    brazo.lineTo(0.72, -0.12);
    brazo.bezierCurveTo(0.45, -0.18, 0.2, -0.2, 0, -0.16);
    brazo.closePath();
    const mBrazo = new THREE.Mesh(new THREE.ShapeGeometry(brazo, 8), gris);
    mBrazo.rotation.x = -Math.PI / 2;
    mBrazo.scale.x = lado;
    hombro.add(mBrazo);

    const codo = new THREE.Group();
    codo.position.set(0.72 * lado, 0, 0);
    const mano = new THREE.Shape();
    mano.moveTo(0, 0.14);
    mano.bezierCurveTo(0.3, 0.12, 0.6, 0.02, 0.86, -0.12);
    mano.bezierCurveTo(0.55, -0.12, 0.25, -0.12, 0, -0.12);
    mano.closePath();
    const mMano = new THREE.Mesh(new THREE.ShapeGeometry(mano, 8), gris);
    mMano.rotation.x = -Math.PI / 2;
    mMano.scale.x = lado;
    codo.add(mMano);
    const extremo = new THREE.Shape();
    extremo.moveTo(0.55, 0.03);
    extremo.bezierCurveTo(0.7, -0.03, 0.8, -0.08, 0.87, -0.125);
    extremo.lineTo(0.5, -0.12);
    extremo.closePath();
    const mExtremo = new THREE.Mesh(new THREE.ShapeGeometry(extremo, 6), punta);
    mExtremo.rotation.x = -Math.PI / 2;
    mExtremo.position.y = 0.002;
    mExtremo.scale.x = lado;
    codo.add(mExtremo);
    hombro.add(codo);
    ave.add(hombro);
    return { hombro, codo };
  };
  const izq = ala(-1);
  const der = ala(1);
  ave.scale.setScalar(0.42); // ~1.4 m wingspan
  ave.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = true;
  });

  // flap: 0 glide .. 1 full flap; plegado: 0 open .. 1 folded on a rail
  const animar = (t: number, aleteo: number, plegado: number) => {
    const golpe = Math.sin(t * 7.5);
    for (const [lado, a] of [[1, der], [-1, izq]] as const) {
      const abierto = 1 - plegado;
      // Folded, the arm sweeps back along the body and the hand lies over it.
      a.hombro.rotation.z = lado * (golpe * 0.55 * aleteo * abierto + 0.08 * abierto - 0.12 * plegado);
      a.hombro.rotation.y = lado * 1.42 * plegado;
      a.codo.rotation.z = lado * (Math.sin(t * 7.5 - 0.9) * 0.45 * aleteo * abierto - 0.06 * abierto);
      a.codo.rotation.y = lado * 0.12 * plegado;
      a.hombro.position.y = 0.05 + 0.06 * plegado;
    }
  };
  return { ave, animar };
}

// ---------- detailed track parts (around the joint) ----------
function crearPiezas(mats: Record<string, THREE.Material>, sombras: boolean) {
  const grupos: Record<IdPieza, THREE.Group> = {
    riel: new THREE.Group(), eclisa: new THREE.Group(), perno: new THREE.Group(), placa: new THREE.Group(),
    almohadilla: new THREE.Group(), clip: new THREE.Group(), tirafondo: new THREE.Group(),
  };
  const add = (id: IdPieza, geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, ry = 0, rx = 0, rz = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, rz);
    m.castShadow = sombras;
    m.receiveShadow = sombras;
    m.userData.pieza = id;
    grupos[id].add(m);
    return m;
  };

  // Rails: two lengths per side with an 8 mm gap at the joint.
  const recto = (z0: number, z1: number): Marco[] =>
    [z0, z1].map((z) => ({ p: new THREE.Vector3(0, BASE_RIEL, z), derecha: new THREE.Vector3(1, 0, 0), arriba: new THREE.Vector3(0, 1, 0), s: z }));
  for (const lado of [-1, 1]) {
    add("riel", barrido(PERFIL_RIEL, recto(MEDIO_HUECO, 0.004), lado * TROCHA), mats.acero, 0, 0, 0);
    add("riel", barrido(PERFIL_RIEL, recto(-0.004, -MEDIO_HUECO), lado * TROCHA), mats.acero, 0, 0, 0);
  }

  // Joint bars (eclisas) both sides of each rail web, with 4 bolts each.
  const geoEclisa = new THREE.BoxGeometry(0.022, 0.085, 0.9);
  const geoPerno = new THREE.CylinderGeometry(0.011, 0.011, 0.11, 10);
  const geoTuerca = new THREE.CylinderGeometry(0.022, 0.022, 0.02, 6);
  for (const lado of [-1, 1]) {
    for (const cara of [-1, 1]) {
      add("eclisa", geoEclisa, mats.oscuro, lado * TROCHA + cara * 0.021, BASE_RIEL + 0.085, 0);
    }
    for (const z of [-0.33, -0.11, 0.11, 0.33]) {
      add("perno", geoPerno, mats.oscuro, lado * TROCHA, BASE_RIEL + 0.085, z, 0, 0, Math.PI / 2);
      add("perno", geoTuerca, mats.oscuro, lado * TROCHA + 0.045, BASE_RIEL + 0.085, z, 0, 0, Math.PI / 2);
      add("perno", geoTuerca, mats.oscuro, lado * TROCHA - 0.045, BASE_RIEL + 0.085, z, 0, 0, Math.PI / 2);
    }
  }

  // Per sleeper and rail: tie plate, rail pad, two elastic clips, two screws.
  const geoPlaca = new THREE.BoxGeometry(0.38, 0.02, 0.19);
  const geoAlmohadilla = new THREE.BoxGeometry(0.15, 0.009, 0.17);
  const geoTirafondo = new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8);
  const geoCabeza = new THREE.CylinderGeometry(0.026, 0.026, 0.022, 6);
  // SKL-style clip: an omega bent in the vertical plane across the rail foot.
  const curvaClip = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.0, 0.0, -0.05), new THREE.Vector3(0.05, 0.035, -0.06), new THREE.Vector3(0.1, 0.03, -0.03),
    new THREE.Vector3(0.06, 0.012, 0.0), new THREE.Vector3(0.1, 0.03, 0.03), new THREE.Vector3(0.05, 0.035, 0.06),
    new THREE.Vector3(0.0, 0.0, 0.05),
  ]);
  const geoClip = new THREE.TubeGeometry(curvaClip, 40, 0.009, 8, false);
  for (const z of TRAVIESAS_DETALLE) {
    for (const lado of [-1, 1]) {
      const x = lado * TROCHA;
      add("placa", geoPlaca, mats.oscuro, x, 0.18, z);
      add("almohadilla", geoAlmohadilla, mats.caucho, x, 0.195, z);
      for (const cara of [-1, 1]) {
        // clip: its toe rests on the rail foot, the loop sits outboard on the plate
        add("clip", geoClip, mats.clip, x + cara * 0.075, BASE_RIEL + 0.004, z, cara > 0 ? 0 : Math.PI);
        add("tirafondo", geoTirafondo, mats.oscuro, x + cara * 0.15, 0.13, z);
        add("tirafondo", geoCabeza, mats.oscuro, x + cara * 0.15, 0.215, z);
      }
    }
  }
  return grupos;
}

// Where each part goes when the track comes apart (y up, x sideways for joint bars).
const DESARME: Record<IdPieza, [number, number]> = {
  placa: [0, 0.24],
  almohadilla: [0, 0.42],
  riel: [0, 0.64],
  eclisa: [0.26, 0.64],
  perno: [0.5, 0.64],
  clip: [0, 0.95],
  tirafondo: [0, 1.26],
};

export function crearMotor(lienzo: HTMLCanvasElement, opciones: { movil: boolean; quieto: boolean }): Motor {
  const { movil, quieto } = opciones;
  const sombras = !movil;
  const renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: !movil, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, movil ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = sombras;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const escena = new THREE.Scene();
  escena.fog = new THREE.Fog(HORIZONTE, 60, movil ? 900 : 1400);
  const camara = new THREE.PerspectiveCamera(42, 1, 0.05, 4000);

  // Sky: brand blue at the zenith fading to a pale horizon, with a low sun.
  const cielo = new THREE.Mesh(
    new THREE.SphereGeometry(2600, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { arriba: { value: AZUL }, abajo: { value: HORIZONTE }, sol: { value: new THREE.Vector3(-0.55, 0.18, -0.8).normalize() } },
      vertexShader: "varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader:
        "uniform vec3 arriba; uniform vec3 abajo; uniform vec3 sol; varying vec3 vDir; void main(){ float h = clamp(vDir.y*3.0,0.0,1.0); vec3 c = mix(abajo, arriba, pow(h,0.42)); float s = max(dot(normalize(vDir), sol),0.0); c += vec3(1.0,0.93,0.82)*pow(s,40.0)*0.55 + vec3(1.0,0.9,0.75)*pow(s,6.0)*0.12; gl_FragColor = vec4(c,1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}",
    })
  );
  escena.add(cielo);

  escena.add(new THREE.HemisphereLight("#dbe6f2", "#0e2238", 1.25));
  const sol = new THREE.DirectionalLight("#fff3e2", 2.2);
  sol.position.set(-40, 30, -50);
  sol.castShadow = sombras;
  sol.shadow.mapSize.set(2048, 2048);
  sol.shadow.camera.left = -6;
  sol.shadow.camera.right = 6;
  sol.shadow.camera.top = 6;
  sol.shadow.camera.bottom = -6;
  sol.shadow.camera.near = 1;
  sol.shadow.camera.far = 140;
  sol.shadow.bias = -0.0004;
  escena.add(sol);
  escena.add(sol.target);

  // ----- track centre line -----
  const ruta = new THREE.CatmullRomCurve3(
    [
      [-330, 820], [-180, 560], [40, 360], [70, 190], [12, 80], [0, 30], [0, 0], [0, -30], [-10, -90], [-70, -260], [-230, -480], [-420, -760],
    ].map(([x, z]) => new THREE.Vector3(x, 0, z)),
    false,
    "centripetal"
  );
  const largo = ruta.getLength();
  const pasos = Math.round(largo / 0.62);
  const marcos: Marco[] = [];
  const pts = ruta.getSpacedPoints(pasos);
  let sOrigen = 0;
  let mejor = Infinity;
  for (let i = 0; i <= pasos; i++) {
    const p = pts[i];
    const t = pts[Math.min(i + 1, pasos)].clone().sub(pts[Math.max(i - 1, 0)]).setY(0).normalize();
    const derecha = new THREE.Vector3(-t.z, 0, t.x);
    const s = (i / pasos) * largo;
    marcos.push({ p, derecha, arriba: new THREE.Vector3(0, 1, 0), s });
    if (p.lengthSq() < mejor) {
      mejor = p.lengthSq();
      sOrigen = s;
    }
  }
  const fuera = (m: Marco) => Math.abs(m.s - sOrigen) > MEDIO_HUECO;
  const antes = marcos.filter((m) => m.s < sOrigen - MEDIO_HUECO + 0.001);
  const despues = marcos.filter((m) => m.s > sOrigen + MEDIO_HUECO - 0.001);
  // The cut ends must meet the detailed rails exactly at z = ±3.1.
  antes.push({ p: new THREE.Vector3(0, 0, MEDIO_HUECO), derecha: new THREE.Vector3(1, 0, 0), arriba: new THREE.Vector3(0, 1, 0), s: sOrigen - MEDIO_HUECO });
  despues.unshift({ p: new THREE.Vector3(0, 0, -MEDIO_HUECO), derecha: new THREE.Vector3(1, 0, 0), arriba: new THREE.Vector3(0, 1, 0), s: sOrigen + MEDIO_HUECO });

  // Materials
  const texBalasto = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = "#7b8594";
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) {
      const v = 95 + Math.random() * 90;
      g.fillStyle = `rgb(${v - 8},${v},${v + 10})`;
      const r = 1 + Math.random() * 3.2;
      g.beginPath();
      g.ellipse(Math.random() * 256, Math.random() * 256, r, r * (0.6 + Math.random() * 0.5), Math.random() * 3, 0, Math.PI * 2);
      g.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  })();
  const mats = {
    acero: new THREE.MeshStandardMaterial({ color: "#aeb6bf", metalness: 0.85, roughness: 0.32 }),
    oscuro: new THREE.MeshStandardMaterial({ color: "#2b3138", metalness: 0.6, roughness: 0.5 }),
    caucho: new THREE.MeshStandardMaterial({ color: "#111418", roughness: 0.9 }),
    clip: new THREE.MeshStandardMaterial({ color: "#20262d", metalness: 0.5, roughness: 0.45 }),
    concreto: new THREE.MeshStandardMaterial({ color: "#b9bec6", roughness: 0.92 }),
    balasto: new THREE.MeshStandardMaterial({ map: texBalasto, roughness: 1 }),
  };

  // Ballast bed along the whole route
  const balasto = new THREE.Mesh(barrido(PERFIL_BALASTO, marcos, 0, 0.5), mats.balasto);
  balasto.receiveShadow = sombras;
  escena.add(balasto);

  // Rails along the route, cut where the detailed joint is
  for (const tramoRuta of [antes, despues]) {
    for (const lado of [-1, 1]) {
      const r = new THREE.Mesh(barrido(PERFIL_RIEL, tramoRuta.map((m) => ({ ...m, p: m.p.clone().setY(BASE_RIEL) })), lado * TROCHA), mats.acero);
      r.receiveShadow = sombras;
      escena.add(r);
    }
  }

  // Concrete sleepers as instances; fastenings only near the joint, where
  // the camera can see them.
  const cerca = (m: Marco) => Math.abs(m.s - sOrigen) < 70;
  const geoTraviesa = new THREE.BoxGeometry(2.6, 0.22, 0.26);
  const marcosTraviesa = marcos.filter(fuera);
  const traviesas = new THREE.InstancedMesh(geoTraviesa, mats.concreto, marcosTraviesa.length + TRAVIESAS_DETALLE.length);
  const mtx = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const uno = new THREE.Vector3(1, 1, 1);
  let k = 0;
  for (const m of marcosTraviesa) {
    q.setFromUnitVectors(new THREE.Vector3(1, 0, 0), m.derecha);
    mtx.compose(m.p.clone().setY(0.06), q, uno);
    traviesas.setMatrixAt(k++, mtx);
  }
  for (const z of TRAVIESAS_DETALLE) {
    mtx.compose(new THREE.Vector3(0, 0.06, z), new THREE.Quaternion(), uno);
    traviesas.setMatrixAt(k++, mtx);
  }
  traviesas.castShadow = sombras;
  traviesas.receiveShadow = sombras;
  escena.add(traviesas);

  const vecinos = marcosTraviesa.filter(cerca);
  const geoPlacaV = new THREE.BoxGeometry(0.38, 0.02, 0.19);
  const placasV = new THREE.InstancedMesh(geoPlacaV, mats.oscuro, vecinos.length * 2);
  let j = 0;
  for (const m of vecinos) {
    q.setFromUnitVectors(new THREE.Vector3(1, 0, 0), m.derecha);
    for (const lado of [-1, 1]) {
      mtx.compose(m.p.clone().addScaledVector(m.derecha, lado * TROCHA).setY(0.18), q, uno);
      placasV.setMatrixAt(j++, mtx);
    }
  }
  placasV.receiveShadow = sombras;
  escena.add(placasV);

  // Terrain: low hills that flatten near the track.
  const lado = 3400;
  const seg = movil ? 140 : 220;
  const geoTerreno = new THREE.PlaneGeometry(lado, lado, seg, seg);
  geoTerreno.rotateX(-Math.PI / 2);
  const muestras = ruta.getSpacedPoints(260);
  const posT = geoTerreno.attributes.position as THREE.BufferAttribute;
  const colores: number[] = [];
  const cBajo = new THREE.Color("#163a5e"), cAlto = new THREE.Color("#5f86ab"), cVia = new THREE.Color("#284a6b");
  const tmp = new THREE.Color();
  for (let i = 0; i < posT.count; i++) {
    const x = posT.getX(i), z = posT.getZ(i);
    let d = Infinity;
    for (const m of muestras) d = Math.min(d, (m.x - x) ** 2 + (m.z - z) ** 2);
    d = Math.sqrt(d);
    const lejos = suave(tramo(d, 5, 90));
    const h = (fbm(x * 0.006, z * 0.006) - 0.35) * 70 * lejos + fbm(x * 0.05, z * 0.05) * 3 * lejos - 0.55;
    posT.setY(i, h);
    tmp.copy(cVia).lerp(cBajo, lejos).lerp(cAlto, clamp01(h / 40));
    colores.push(tmp.r, tmp.g, tmp.b);
  }
  geoTerreno.setAttribute("color", new THREE.Float32BufferAttribute(colores, 3));
  geoTerreno.computeVertexNormals();
  const terreno = new THREE.Mesh(geoTerreno, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }));
  terreno.receiveShadow = sombras;
  escena.add(terreno);

  // Detailed joint
  const piezas = crearPiezas(mats, sombras);
  for (const g of Object.values(piezas)) escena.add(g);
  const mallasElegibles: THREE.Object3D[] = [];
  for (const g of Object.values(piezas)) g.traverse((o) => (o as THREE.Mesh).isMesh && mallasElegibles.push(o));

  // Seagull and its flight
  const { ave, animar } = crearGaviota();
  escena.add(ave);
  const vuelo = new THREE.CatmullRomCurve3(
    [
      [-140, 150, 420], [-70, 110, 300], [-5, 72, 190], [30, 40, 95], [14, 16, 36], [4, 4.5, 10], [0.9, 1.4, 2.6], [TROCHA, ALTO_RIEL + BASE_RIEL + 0.06, 1.05],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "centripetal"
  );
  const salida = new THREE.CatmullRomCurve3(
    [[TROCHA, ALTO_RIEL + BASE_RIEL + 0.06, 1.05], [1.6, 1.6, 0.2], [6, 7, -6], [30, 30, -60], [90, 70, -200]].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "centripetal"
  );

  // Labels anchor on the instance nearest to the camera's close-up angle.
  const anclaLocal: Record<IdPieza, THREE.Vector3> = {
    riel: new THREE.Vector3(TROCHA, BASE_RIEL + ALTO_RIEL, 1.6),
    eclisa: new THREE.Vector3(TROCHA + 0.021, BASE_RIEL + 0.13, 0.35),
    perno: new THREE.Vector3(TROCHA + 0.05, BASE_RIEL + 0.085, -0.11),
    placa: new THREE.Vector3(TROCHA + 0.19, 0.19, 0.93),
    almohadilla: new THREE.Vector3(-TROCHA, 0.2, 0.31),
    clip: new THREE.Vector3(TROCHA + 0.17, BASE_RIEL + 0.04, 0.31),
    tirafondo: new THREE.Vector3(-TROCHA - 0.15, 0.226, 0.93),
  };

  let ancho = 1, alto = 1;
  let desarme = 0;
  let resaltada: IdPieza | null = null;
  const resaltes = new Map<THREE.Mesh, THREE.Material>();
  const matResalte = new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#3b7bd1", emissiveIntensity: 0.9, metalness: 0.3, roughness: 0.4 });

  const camPos = new THREE.Vector3();
  const camMira = new THREE.Vector3();
  const v1 = new THREE.Vector3(), v2 = new THREE.Vector3();

  function ubicarAve(p: number, t: number, punt: { x: number; y: number }) {
    // 0..0.14 hero glide, 0.14..0.55 descent, 0.55..0.66 perched, 0.66..0.8 take-off
    let pos: THREE.Vector3, dir: THREE.Vector3, aleteo: number, plegado = 0;
    if (p < 0.55) {
      const u = 0.02 + 0.98 * suave2(tramo(p, 0.08, 0.55));
      pos = vuelo.getPointAt(u);
      dir = vuelo.getTangentAt(Math.min(u, 0.995));
      aleteo = p < 0.14 ? 0.55 + 0.25 * Math.sin(t * 0.7) : 0.25 + 0.5 * (1 - u);
      const aterrizar = tramo(u, 0.9, 1);
      aleteo = aleteo * (1 - aterrizar) + aterrizar * 1.1 * (1 - tramo(u, 0.985, 1));
      plegado = tramo(u, 0.985, 1);
    } else if (p < 0.66) {
      pos = vuelo.getPointAt(1);
      dir = new THREE.Vector3(0, 0, -1);
      aleteo = 0;
      plegado = 1;
    } else {
      const u = suave(tramo(p, 0.66, 0.82));
      pos = salida.getPointAt(u);
      dir = salida.getTangentAt(Math.max(u, 0.02));
      aleteo = 1.1;
      plegado = 1 - tramo(u, 0, 0.06);
    }
    ave.position.copy(pos);
    if (p < 0.14) ave.position.y += Math.sin(t * 0.9) * 0.8 + punt.y * 6;
    if (p < 0.14) ave.position.x += punt.x * 10;
    v1.copy(ave.position).add(dir);
    ave.lookAt(v1);
    const banco = p < 0.14 ? -punt.x * 0.6 + Math.sin(t * 0.5) * 0.12 : p < 0.55 ? Math.sin(p * 18) * 0.25 * (1 - tramo(p, 0.45, 0.55)) : 0;
    ave.rotateZ(banco);
    if (plegado > 0.5 && p < 0.66) ave.rotation.x = 0;
    animar(quieto ? 0.4 : t, quieto ? 0 : aleteo, plegado);
    ave.visible = p < 0.8;
  }

  function ubicarCamara(p: number, punt: { x: number; y: number }) {
    const a = ave.position;
    if (p < 0.5) {
      // Behind and beside the gull, closing in as it descends.
      const k = suave(tramo(p, 0.1, 0.5));
      const ancho2 = camara.aspect > 1;
      // Hero: close behind and below the gull so it reads large against the
      // sky; on wide screens it sits right of the headline.
      v1.set(-2.4 - 1.4 * k, -0.7 + 2.7 * k, 4.6 + 2.4 * k);
      camPos.copy(a).add(v1);
      camMira.copy(a).add(v2.set((ancho2 ? -1.6 : 2.6) * (1 - k), (ancho2 ? -0.9 : -1.6) * (1 - k) - 2 * k, -6 - 6 * k));
    } else {
      // Close-up of the joint, then pull back to frame the exploded stack.
      const k = suave(tramo(p, 0.5, 0.6));
      const e = suave(tramo(p, 0.64, 0.86));
      const ini = v1.set(a.x - 2.4, a.y + 1.0, a.z + 3.6);
      const cerca = new THREE.Vector3(2.6, 1.15, 2.6);
      const lejos = new THREE.Vector3(2.9, 1.7, 2.3);
      camPos.copy(ini).lerp(cerca, k).lerp(lejos, e);
      const miraCerca = new THREE.Vector3(TROCHA * 0.6, 0.3, 0.1);
      const miraLejos = new THREE.Vector3(0.45, 0.62, 0.2);
      camMira.copy(a).lerp(miraCerca, k).lerp(miraLejos, e);
    }
    // A touch of parallax from the pointer, less up close so labels stay put.
    const fuerza = p < 0.5 ? 1.2 : 0.18;
    camPos.x += punt.x * fuerza;
    camPos.y += -punt.y * fuerza * 0.6;
    camara.position.copy(camPos);
    camara.lookAt(camMira);
  }

  return {
    redimensionar(w, h) {
      ancho = w;
      alto = h;
      renderer.setSize(w, h, false);
      camara.aspect = w / h;
      // Narrow screens see less sideways; widen the lens a little.
      camara.fov = w / h < 0.8 ? 58 : 42;
      camara.updateProjectionMatrix();
    },
    cuadro(p, punt, t) {
      ubicarAve(p, t, punt);
      ubicarCamara(p, punt);
      desarme = suave2(tramo(p, 0.66, 0.86));
      // Only the fastenings of the four sleepers at the joint come apart; the
      // rest stay assembled, so the eye reads one opened joint in a whole track.
      for (const id of Object.keys(piezas) as IdPieza[]) {
        const dy = DESARME[id][1] * desarme;
        if (id === "riel" || id === "eclisa" || id === "perno") {
          piezas[id].position.y = dy;
          continue;
        }
        for (const m of piezas[id].children) {
          const y0 = (m.userData.y0 ??= m.position.y) as number;
          m.position.y = Math.abs(m.position.z) < 1.2 ? y0 + dy : y0;
        }
      }
      // Joint bars open outward from the rail web; the bolts slide out to one side.
      for (const m of piezas.eclisa.children) {
        const x0 = (m.userData.x0 ??= m.position.x) as number;
        const cara = Math.sign(x0 - Math.sign(x0) * TROCHA);
        m.position.x = x0 + cara * DESARME.eclisa[0] * desarme * 0.5;
      }
      piezas.perno.position.x = DESARME.perno[0] * desarme;
      // Shadow camera follows the close-up only; far away nothing casts.
      sol.target.position.set(0, 0, 0);
      sol.position.set(-40, 30, -50);
      renderer.render(escena, camara);
    },
    anclas() {
      const salidas: Ancla[] = [];
      for (const id of Object.keys(anclaLocal) as IdPieza[]) {
        const [dx, dy] = DESARME[id];
        v1.copy(anclaLocal[id]);
        v1.y += dy * desarme;
        v1.x += id === "eclisa" ? dx * desarme * 0.5 : dx * desarme;
        v2.copy(v1).project(camara);
        salidas.push({ id, x: (v2.x * 0.5 + 0.5) * ancho, y: (-v2.y * 0.5 + 0.5) * alto, visible: desarme > 0.85 && v2.z < 1 });
      }
      return salidas;
    },
    elegir(x, y) {
      if (desarme < 0.85) return null;
      const r = new THREE.Raycaster();
      r.setFromCamera(new THREE.Vector2((x / ancho) * 2 - 1, -(y / alto) * 2 + 1), camara);
      const hit = r.intersectObjects(mallasElegibles, false)[0];
      return (hit?.object.userData.pieza as IdPieza) ?? null;
    },
    resaltar(id) {
      if (id === resaltada) return;
      for (const [m, mat] of resaltes) m.material = mat;
      resaltes.clear();
      resaltada = id;
      if (!id) return;
      piezas[id].traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          resaltes.set(m, m.material as THREE.Material);
          m.material = matResalte;
        }
      });
    },
    destruir() {
      escena.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh || (o as THREE.InstancedMesh).isInstancedMesh) {
          m.geometry?.dispose();
          const mat = m.material;
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat?.dispose();
        }
      });
      texBalasto.dispose();
      renderer.dispose();
    },
  };
}
