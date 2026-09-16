# AquaAura Mineral Water - Node.js + Express + Firebase

[![Firebase Hosting](https://img.shields.io/badge/Live_Demo-Firebase_Hosting-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://agua-79799.firebaseapp.com/)

🌐 **Sitio Web desplegado y en vivo en Firebase Hosting:**
👉 **[https://agua-79799.firebaseapp.com/](https://agua-79799.firebaseapp.com/)**

---

## 🌊 Descripción del Proyecto

Plataforma web completa para **AquaAura**, emprendimiento premium de agua mineral natural de manantial volcánico. La aplicación incluye:
- Backend desarrollado en **Node.js, Express y TypeScript**.
- Base de datos relacional y documentos integrados con **Firebase Firestore**.
- Despliegue y CDN global en **Firebase Hosting**.
- **Frontend y Animaciones 1:1**:
  - Motor Canvas de física de ondas marinas a 60 FPS con partículas de burbujas flotantes.
  - Tarjetas de productos con efecto 3D Tilt y modales de perfil fisicoquímico (pH 7.8, Ca, Mg, Sílice, TDS).
  - Calculadora interactiva de hidratación diaria según peso, actividad y clima.
  - Carrito de compras, sistema de descuentos (`MANANTIAL10`), checkout y animación de seguimiento de estado del pedido en vivo.

---

## 🛠️ Estructura del Repositorio

```
.
├── public/                  # Archivos estáticos servidos por Firebase CDN (HTML, CSS, JS, imágenes)
│   ├── css/styles.css       # Hoja de estilos Glassmorphism y animaciones
│   ├── js/main.js           # Motor de ondas Canvas 60 FPS, sliders e interacciones
│   └── index.html           # HTML compilado para producción
├── src/                     # Código fuente del backend en TypeScript
│   ├── server.ts            # Servidor Express principal
│   ├── config/firebase.ts   # Conexión a Firebase Admin SDK y Firestore
│   ├── controllers/         # Lógica de controladores (hidratación, pedidos, contacto)
│   ├── routes/              # Ruteo de endpoints API
│   ├── models/types.ts      # Interfaces TypeScript
│   └── seed/seedData.ts     # Carga de catálogo de productos
├── views/index.ejs          # Plantilla principal EJS
├── firebase.json            # Configuración de Firebase Hosting
├── .firebaserc              # ID del proyecto Firebase (agua-79799)
├── package.json             # Dependencias del proyecto
└── tsconfig.json            # Configuración de compilación TypeScript
```

---

## 🚀 Instrucciones para Ejecución Local

1. **Clonar e instalar dependencias:**
   ```bash
   git clone <URL_DE_TU_REPOSISTORIO>
   cd django
   npm install
   ```

2. **Ejecutar servidor de desarrollo con TypeScript y recarga en vivo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

3. **Compilar e iniciar en producción:**
   ```bash
   npm run build
   npm start
   ```

---

## ☁️ Instrucciones para Despliegue en Firebase

1. **Compilar estáticos y desplegar:**
   ```bash
   node scripts/buildStatic.js
   firebase deploy --only hosting
   ```

2. **Ver sitio web en vivo:**
   👉 **[https://agua-79799.firebaseapp.com/](https://agua-79799.firebaseapp.com/)**
