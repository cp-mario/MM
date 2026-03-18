# 📚 Documentación Completa - Ejemplo de Uso

:::note
Esta es una nota importante al inicio del documento. Las notas se usan para destacar información clave, advertencias o tips que el lector no debe pasar por alto.
:::

# Introducción al Proyecto

Bienvenido a la **documentación oficial** del proyecto. Este archivo `.mm` demuestra *todas las funcionalidades* del parser, incluyendo:

- **Formato de texto**: negritas, *cursivas*, [enlaces](https://ejemplo.com)
- **Imágenes**: ![Logo](./assetsInternos/img/logo.png)
- **Encabezados**: desde `# H1` hasta `###### H6`
- **Notas**: bloques `:::note` con contenido anidado
- **Saltos de línea**: usando `#b` para control preciso

#b

## Estructura del Contenido

El parser procesa el contenido en **tres fases**:

1. **Fase 1 - Monolínea**: Headers y marcadores especiales
2. **Fase 2 - Multilínea**: Bloques como `:::note` con soporte para anidamiento
3. **Fase 3 - Inline**: Formato dentro de párrafos (**negrita**, *cursiva*)

:::note
El orden de procesamiento es crítico. Los bloques multilínea se procesan antes que el formato inline para evitar conflictos con sintaxis anidada.
:::

### Subsección: Ejemplo de Código Falso

Aunque este parser no tiene soporte nativo para bloques de código, puedes simularlos usando notas:

:::note
```javascript
// Esto es texto plano dentro de una nota
const ejemplo = "Hola mundo";
console.log(ejemplo); // Salida: Hola mundo
```
:::

## Características Detalladas

### 🔹 Encabezados Jerárquicos

# Nivel 1 - Título Principal
## Nivel 2 - Sección Importante
### Nivel 3 - Subsección
#### Nivel 4 - Detalle Técnico
##### Nivel 5 - Nota al Pie
###### Nivel 6 - Referencia Mínima

Cada nivel de encabezado genera una etiqueta HTML semántica (`<h1>` a `<h6>`), lo que mejora la **accesibilidad** y el **SEO** del documento final.

### 🔹 Formato de Texto Inline

Puedes combinar **negritas** con *cursivas* para ***énfasis máximo***. También es posible incluir [enlaces externos](https://github.com).

:::note
**Tip profesional**: Usa enlaces internos para crear una tabla de contenidos manual o para referenciar secciones largas sin que el lector pierda el contexto.
:::

### 🔹 Imágenes y Multimedia

Para insertar imágenes, usa la sintaxis de Markdown estándar:

![Diagrama de arquitectura](./assetsInternos/img/arquitectura.png)

La imagen se renderizará con el atributo `alt` para accesibilidad. Si la imagen no carga, el texto alternativo se mostrará en su lugar.

#b

## Sección de Notas Avanzadas

Las notas pueden contener **cualquier contenido**, incluyendo otros formatos:

:::note
### Título dentro de una nota

Esto es un párrafo con **negrita**, *cursiva* y un [enlace](#).

- Lista con guiones
- Otro elemento
- **Elemento importante**

1. Lista numerada
2. Segundo paso
3. *Paso opcional*

![Icono](./assetsInternos/img/icono-note.png)
:::

### Anidamiento de Notas (Experimental)

:::note
Esta es la nota exterior.

:::note
Esta es una nota **interior**. El parser usa un stack para manejar el anidamiento correctamente.
:::

Fin de la nota exterior.
:::

#b

## Control de Saltos de Línea

Por defecto, el parser agrupa líneas consecutivas en un mismo párrafo `<p>`, convirtiendo los saltos de línea en `<br>`.

Línea 1 del párrafo.
Línea 2 del mismo párrafo.
Línea 3 que también se une.

#b

Pero si necesitas un salto forzado entre bloques, usa `#b`:

Este párrafo termina aquí.

#b

Y este nuevo párrafo comienza separado visualmente, sin margen extra de párrafo HTML.

## Enlaces y Navegación

### Enlaces Externos

- [Documentación Oficial](https://ejemplo.com/docs)
- [Repositorio GitHub](https://github.com/usuario/proyecto)
- [Comunidad de Soporte](https://foro.ejemplo.com)

### Enlaces Internos (Anclas)

Los encabezados generan IDs automáticos que puedes usar como anclas:

- [Ir a Introducción](#introducción-al-proyecto)
- [Ver Características](#características-detalladas)
- [Saltar a Notas](#sección-de-notas-avanzadas)

:::note
**Importante**: Los IDs se generan a partir del texto del encabezado. Evita caracteres especiales o usa enlaces explícitos si necesitas control total.
:::

## Listas y Estructura

### Lista No Ordenada

- Elemento principal
  - Subelemento con sangría
  - Otro subelemento
- Segundo elemento principal
  * Elemento con asterisco (también funciona)

### Lista Ordenada

1. Primer paso del proceso
2. Segundo paso, más detallado
3. Tercer paso con **énfasis**

:::note
Las listas se procesan como texto plano dentro de párrafos. Para listas HTML nativas (`<ul>`, `<ol>`), el parser necesitaría una extensión futura.
:::

#b

## Combinación de Características

Aquí demostramos cómo combinar **múltiples características** en un solo bloque:

:::note
### 🚀 Ejemplo Integrado

Comenzamos con un encabezado dentro de la nota.

Luego, texto con **negritas**, *cursivas* y ***ambos***.

Agregamos una imagen: ![Icono](./assetsInternos/img/check.png)

Y un enlace útil: [Más información](#características-detalladas)

#b

Finalmente, un salto forzado dentro de la nota para separar conceptos.

Este es el contenido posterior al salto.
:::

# Consideraciones Finales

Este documento de ejemplo ha cubierto:

✅ **Encabezados** de todos los niveles (`#` a `######`)  
✅ **Formato inline**: **negrita**, *cursiva*, [enlaces](#), ![imágenes](#)  
✅ **Notas multilínea** con `:::note` y soporte para anidamiento  
✅ **Control de párrafos** con agrupación automática y `#b` para saltos forzados  
✅ **Estructura jerárquica** para documentación extensa  

:::note
**Próximas mejoras previstas**:
- Soporte para bloques de código con resaltado de sintaxis
- Tablas con sintaxis Markdown
- Definición de IDs personalizados para encabezados
- Variables de plantilla adicionales (`{{author}}`, `{{date}}`, etc.)
:::

#b

## Recursos Adicionales

- 📁 Carpeta `assetsInternos/`: Contiene CSS, JS e imágenes compartidas
- ⚙️ Archivo `config.json`: Configuración del proyecto y menú de navegación
- 📄 Carpeta `pages/`: Todos los archivos `.mm` que se convertirán a HTML
- 🔄 Script `parser.js`: Motor de conversión `.mm` → HTML

![Flujo de trabajo](./assetsInternos/img/flujo-workflow.png)

#b

***

*Documento generado con el parser `.mm` → HTML. Última actualización: 2026.*

[⬆️ Volver al inicio](#-documentación-completa---ejemplo-de-uso)
```

💡 **Para usarlo**:
1. Crea un archivo `ejemplo-completo.mm` en tu carpeta `pages/`
2. Copia y pega todo el contenido de arriba (sin las comillas del bloque de código)
3. Ejecuta tu parser: `node parser.js`
4. Revisa el resultado en `output/.../pages/ejemplo-completo.html`

✅ **Tips extra**:
- Asegúrate de que las rutas de las imágenes (`./assetsInternos/img/...`) coincidan con tu estructura real
- Si usas enlaces internos (`#sección`), verifica que los encabezados tengan el texto exacto
- Las notas anidadas funcionan, pero úsalas con moderación para no complicar la lectura