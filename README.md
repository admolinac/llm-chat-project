# 🤖 Chat Assistant con React + TanStack Query

Este proyecto implementa una interfaz de chat con un modelo de lenguaje (LLM).  
Permite enviar mensajes al backend y configurar parámetros avanzados de inferencia como **temperature, top-k, top-p y reasoning effort**.

## 🚀 Tecnologías
- [React](https://react.dev/) – interfaz de usuario
- [TypeScript](https://www.typescriptlang.org/) – tipado estático
- [TanStack Query](https://tanstack.com/query/latest) – manejo de mutaciones y peticiones
- [Tailwind CSS](https://tailwindcss.com/) – estilos rápidos y responsivos

---

## 📂 Estructura básica
```

src/
├─ components/
│   └─ ChatInterface.tsx   # UI principal del chat
├─ index.tsx               # punto de entrada
└─ ...

```

---

## ⚙️ Parámetros configurables

El formulario en la parte inferior del chat permite definir los siguientes valores antes de enviar un mensaje:

| Parámetro           | Rango       | Descripción |
|---------------------|------------|-------------|
| `temperature`       | 0 – 2      | Controla la aleatoriedad. Valores bajos hacen la salida más determinista. |
| `top-k`             | 0 – 20     | Limita el muestreo a los *k* tokens más probables. |
| `top-p`             | 0 – 1      | Usa *nucleus sampling*, limitando al conjunto acumulativo de probabilidad *p*. |
| `reasoning_effort`  | 1 – 4      | Nivel de esfuerzo de razonamiento. **Se envía como número**:<br> `1 = minimal`, `2 = low`, `3 = medium`, `4 = high`. |

⚠️ **Importante:**  
Solo puede usarse `top-k` **o** `top-p`, nunca ambos.  
Si se define uno, el otro se desactiva automáticamente.

---

## 📡 Comunicación con el API

Las peticiones al backend se envían vía `fetch` a la ruta:

```

POST [https://llm-bootcamp.cardor.dev/api/completion](https://llm-bootcamp.cardor.dev/api/completion)

````

### Ejemplo de body:
```json
{
  "input": "¿Cuál es la capital de Ecuador?",
  "params": {
    "temperature": 1,
    "top_k": 10,
    "reasoning_effort": 2
  }
}
````

---

## ▶️ Ejecución local

1. Clona el repositorio:

   ```bash
   git clone https://github.com/admolinac/llm-chat-project
   cd llm-chat-project
   ```

2. Instala dependencias:

   ```bash
   npm install
   ```

3. Corre en modo desarrollo:

   ```bash
   npm run dev
   ```

4. Abre en tu navegador:

   ```
   http://localhost:3000
   ```


👉 ¿Quieres que en el `README` también deje un **mapa de correspondencia de parámetros (ejemplo de UI → valor numérico final en el request)** para que quede clarísimo cómo pasa de select a número?
```
