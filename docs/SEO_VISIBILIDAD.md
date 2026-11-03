# Visibilidad en buscadores y asistentes de IA

Objetivo: que GAVICOM aparezca en Google y que ChatGPT, Gemini, Claude y Perplexity la citen cuando alguien pregunte, por ejemplo, «¿quién vende eclisas para riel de 115 lb en Colombia?», «proveedor de tirafondos ferroviarios», «clips elásticos para traviesa» o «cofres fotovoltaicos en Barranquilla».

Regla de todo el trabajo: solo se publicó lo que el sitio ya decía. No se inventaron clientes, cifras, certificaciones, años, reseñas, precios ni existencias.

## 1. Lo que se hizo en el sitio

### Páginas nuevas

| Ruta | Para qué búsqueda |
| --- | --- |
| `/catalogo/linea/fijaciones-pesadas` | eclisas para riel 115 / 90 / 75 lb, pernos de vía, placas de asiento, anclas de riel. Incluye la tabla de perfiles y normas para los que se producen eclisas. |
| `/catalogo/linea/sistemas-elasticos` | clips elásticos para traviesa, SKL-14, tirafondos para durmiente, almohadillas bajo riel |
| `/catalogo/linea/herramientas-de-via` | herramientas de mantenimiento de vía, saca clips, troleys, carpas de soldadura |
| `/catalogo/linea/suministros` | discos de corte para riel, brocas para durmiente, impacto, hidráulica, EPP |
| `/catalogo/linea/senalizacion` | señalización ferroviaria y vial, cuñas de rueda con bandera |
| `/preguntas-frecuentes` | 12 preguntas con respuesta que el sitio ya respalda |
| `/llms.txt` y `/llms-full.txt` | resumen y catálogo completo en texto para asistentes de IA |

Cada página de línea tiene título y descripción propios, un H1 con las palabras que usa el comprador, texto explicativo por grupo de piezas, enlace a cada referencia, cómo cotizar y enlaces a las otras líneas. El texto sale de `src/constants/lineasGuia.ts`; las preguntas, de `src/constants/preguntas.ts`. Si se agrega una referencia nueva a `productos.ts`, aparece sola en su línea (grupo «Otras referencias») hasta que se le escriba texto.

`llms.txt` y `llms-full.txt` se generan al compilar desde los mismos datos del catálogo, así que no se desactualizan.

### Datos estructurados (JSON-LD)

- Organización: se agregaron teléfono, correo, la marca GAVICOM Energy y el catálogo por líneas (sin precios). No se agregó dirección de calle, coordenadas, horario ni redes sociales porque el sitio no los tiene (ver preguntas al final).
- Fichas de producto: `@id`, todas las fotos visibles, migas con «Inicio». La marca GAVICOM solo va en lo que el sitio documenta como fabricación propia (hoy la eclisa angular de 75 lb). Sin `offers`: no hay precios publicados y el marcado no puede decir más que la página.
- Páginas de línea: `CollectionPage` con `ItemList` de sus referencias y `BreadcrumbList`.
- Preguntas frecuentes: `FAQPage` con el mismo texto que se ve en pantalla.

### Técnico

- `robots.txt` permite explícitamente a Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot y Applebot-Extended.
- `sitemap.xml` con las páginas nuevas, fecha de última modificación fija por sección y `hreflang` es-CO.
- Canonical y `hreflang` es-CO / x-default en todas las páginas (falta `/energy`, que se está rediseñando aparte).
- Títulos de máximo 60 caracteres y descripciones de máximo 155 en todas las páginas revisadas. Las fichas con nombre largo se acortan solas; las de descripción de una línea completan el resumen con el código y cómo cotizar.
- Se corrigió que las fichas de producto salían sin « | GAVICOM SAS» en el título.
- Enlaces internos a las páginas de línea desde el inicio, el catálogo, cada ficha y el pie; las preguntas frecuentes, enlazadas desde el pie, el catálogo, las líneas y las fichas. Ninguna página del sitemap queda sin enlace.
- Todo el texto sale en el HTML del servidor (comprobado con `curl`), que es lo que leen los rastreadores de IA.

### Cuando cambie el contenido

- Actualizar la fecha de la sección en `src/app/sitemap.ts`.
- Una pregunta nueva solo si el sitio ya respalda la respuesta: se agrega en `src/constants/preguntas.ts`.

## 2. Lista de tareas fuera del sitio (para el dueño)

Orden sugerido: 1 a 4 esta semana; el resto en el mes.

### 1. Google Search Console

1. Entrar a https://search.google.com/search-console con la cuenta de Google de la empresa. La propiedad ya está verificada (archivo `google131f6e5481f11b83.html` y meta de verificación).
2. Mejor aún, agregar también la propiedad de **dominio** `gavicomferroviario.com` (verificación por registro DNS TXT) para cubrir www y http.
3. Sitemaps → enviar `https://gavicomferroviario.com/sitemap.xml`.
4. Inspección de URLs → pedir indexación de: `/`, `/catalogo`, las cinco `/catalogo/linea/...`, `/preguntas-frecuentes`, `/fabricacion`, `/energy`.
5. Revisar cada 2 semanas «Páginas» (qué no está indexado y por qué) y «Rendimiento» (con qué búsquedas aparecen).

### 2. Bing Webmaster Tools (alimenta a ChatGPT y Copilot)

1. Entrar a https://www.bing.com/webmasters y elegir «Importar desde Google Search Console»: trae el sitio y el sitemap en un paso.
2. Activar **IndexNow** si se ofrece en el panel (Bing y otros reciben los cambios al instante).
3. Enviar las mismas URL de la lista anterior.

### 3. Perfil de Empresa en Google (Google Business Profile)

1. https://business.google.com → «Agregar empresa» → nombre exacto: **GAVICOM SAS** (igual que en el sitio).
2. Categoría principal: escribir «ferroviario» en el selector y elegir la más cercana a proveedor de equipos o materiales ferroviarios. Si no hay ninguna, «Proveedor de equipos industriales». La lista de categorías de Google cambia; usar solo las que el selector ofrezca.
3. Categorías secundarias (las que existan en el buscador de categorías): «Fabricante de piezas metálicas», «Fundición», «Proveedor de equipos de energía solar», «Empresa de energía solar», «Proveedor de herramientas», «Servicio de topografía».
4. Si no se atiende público en una oficina: marcar **empresa de servicio a domicilio**, ocultar la dirección y poner como zona de servicio «Colombia» y las ciudades principales donde se entrega.
5. Teléfono `+57 315 050 9803`, sitio `https://gavicomferroviario.com`, horario real.
6. Descripción (750 caracteres): usar el párrafo de `/llms.txt` sin cambiarle cifras.
7. Productos: crear uno por línea con su foto y el enlace a `/catalogo/linea/...`. Servicios: los de `/servicios` y los cuatro de Energy.
8. Fotos: logo, portada, y 10 a 20 fotos reales (piezas, fundición, tirafondos, cofres). Nada de fotos de banco.
9. Publicar una novedad al mes (pieza entregada, nueva referencia) con enlace a la ficha.
10. Verificación: Google pedirá video o código postal; hacerla de inmediato.

### 4. Reseñas

- Pedir reseña en Google a cada cliente después de una entrega conforme. Enlace directo: en el Perfil de Empresa → «Pedir reseñas» → copiar el enlace corto y enviarlo por WhatsApp con un mensaje como: «Gracias por su pedido. Si quedó conforme con las piezas, nos ayuda mucho una reseña corta aquí: [enlace]».
- Pedir que mencionen la pieza y la ciudad («eclisas de 75 lb, entrega en …»): eso es lo que luego aparece en búsquedas.
- Responder todas las reseñas en menos de una semana.
- No comprar ni inventar reseñas, ni ofrecer descuentos a cambio; Google las elimina y penaliza el perfil.
- El sitio no muestra reseñas ni estrellas; si en el futuro se quieren mostrar, que sean las reales del perfil de Google.

### 5. LinkedIn

1. Crear o completar la página de empresa **GAVICOM SAS**: logo, portada, sitio web, sector «Fabricación de equipos de transporte ferroviario» o «Fabricación de maquinaria», sede Barranquilla, especialidades: eclisas, tirafondos, clips elásticos, herramientas de vía, fabricación en hierro nodular, energía solar fotovoltaica.
2. Que el gerente y la directora pongan la empresa como empleo actual (enlaza los perfiles a la página).
3. Publicar cada 2 a 4 semanas casos reales con foto y enlace a la ficha o a la página de línea. Ejemplo: el proceso de la eclisa de 75 lb con enlace a `/fabricacion`.
4. Avisar el enlace de LinkedIn para agregarlo al sitio (`sameAs` del JSON-LD y el pie).

### 6. Directorios y gremios en Colombia

Registrarse con el mismo nombre, teléfono, correo y web en todos (la coherencia pesa):

- **iNNpulsa Colombia / En-Cadena**: pedir que el listado de proveedores seleccionados enlace a `gavicomferroviario.com`.
- **Cámara de Comercio de Barranquilla**: directorio empresarial y ruedas de negocio.
- **SECOP II** (Colombia Compra Eficiente): registro como proveedor para procesos públicos de infraestructura férrea.
- **Agencia Nacional de Infraestructura (ANI)** e **INVÍAS**: estar atentos a convocatorias y registros de proveedores de proyectos férreos.
- **ProColombia**: directorio de exportadores, si se proyecta vender fuera.
- **ANDI** (Cámara de Infraestructura o seccional Atlántico) y **Cámara Colombiana de la Infraestructura (CCI)**.
- **Sector minero**: directorios de proveedores de la **Asociación Colombiana de Minería (ACM)** y ferias como la **Feria Minera** de Medellín.
- **Energía**: **SER Colombia** (Asociación de Energías Renovables) y el registro de proveedores de **UPME** cuando aplique.
- **Directorios generales**: Páginas Amarillas, Cylex Colombia, Hotfrog, Kompass, Europages.
- **Bing Places** (https://www.bingplaces.com): se importa desde el Perfil de Google.
- **Apple Business Connect** (https://businessconnect.apple.com): para Mapas de Apple y Siri.

### 7. Lograr que los asistentes de IA citen a GAVICOM

Los asistentes citan páginas que (a) pueden leer, (b) responden la pregunta exacta y (c) otros sitios mencionan.

- (a) y (b) ya están: robots abierto, `llms.txt`, páginas de línea y preguntas frecuentes en texto plano.
- (c) depende de menciones externas: cada directorio, nota de prensa, perfil de gremio o publicación de LinkedIn que diga «GAVICOM SAS, proveedor de eclisas y fijaciones ferroviarias en Barranquilla» con enlace al sitio suma.
- Pedir a aliados, clientes y gremios que, si publican algo sobre un trabajo, enlacen la ficha o la página de línea (sin necesidad de que el sitio nombre al cliente).
- Una vez al mes, preguntar en ChatGPT, Perplexity, Gemini y Claude las cuatro búsquedas del objetivo y anotar si aparece GAVICOM y qué fuente citan. Si citan a otro proveedor, mirar qué tiene esa página que la nuestra no.
- Mantener en Wikidata (opcional) una ficha de la empresa con nombre, sitio, sede y sector: varios asistentes la usan para reconocer entidades.

### 8. Datos que faltan en el sitio (y que suben la visibilidad cuando se publiquen)

Ver la lista de preguntas abajo: dirección, horario, redes y plazos permiten marcar la empresa como negocio local (`LocalBusiness`) con coordenadas y responder más preguntas frecuentes.

## 3. Preguntas para el dueño

No se respondieron en el sitio porque nada en el código las respalda:

1. ¿Plazos de entrega típicos (por línea o para piezas fabricadas)?
2. ¿Cómo se envía a otras ciudades, quién paga el flete y hay ciudades donde no se entrega?
3. ¿Facturación electrónica, medios de pago y condiciones de crédito?
4. ¿Pedido mínimo por referencia?
5. ¿Garantía de las piezas y qué certificados o informes de ensayo se entregan con cada lote?
6. ¿Dirección física (para mapa y Perfil de Empresa), horario de atención y si se atiende público?
7. ¿Enlaces de LinkedIn, Instagram, Facebook o YouTube de la empresa?
8. ¿Año de fundación?
9. Los tirafondos dicen «los fabricamos» en su ficha, pero solo la eclisa angular de 75 lb está marcada como fabricación propia. ¿Se marcan también los tirafondos (y alguna otra pieza) como fabricación GAVICOM?
10. ¿Se puede decir que hay existencias en Barranquilla de alguna referencia?
11. ¿Las cifras de importación de `/fabricacion` (+3.200 t al mes y 1.660.000 clips) son capacidad de GAVICOM o de un aliado?
