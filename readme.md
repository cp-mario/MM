# MMX

Esta utilidad te permite utilizando un formato propio similar al md crear una documentación o una pagina unica.


Para que funcione la documentación necesitas en tu proyecto tener dentro de la carpeta de tu proyecto:
config.json con :
```json
{
    "project": {
        "title": "Your proyect name",
        "version": "1.0"
    }
}
```

assets (carpeta opcional, para hacer referencia en algun recurso poner "assets/rutadelrecursoenassets")
pages (carpeta obligatoria con todos los .mmx y con subcarpetas para hacer categorias)
index.mmx la pagina inicial de la web

dentro de la carpeta pages puedes crear los .mmx que quieras y carpetas que se convertiran en categorias, tambien puedes poner categorias dentro de categorias recursivamente
tambien tienes que especificar el input, output y si es la documentacion entera o solo una pagina en el inicio del main.js
