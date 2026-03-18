# MM

Esta utilidad te permite utilizando un formato propio similar al md crear una documentación o una pagina unica.


Para que funcione la documentación necesitas en tu proyecto tener dentro de la carpeta de tu proyecto:
config.json con :

{
    "project": {
        "title": "Your proyect name",
        "version": "1.0"
    }
}

assets (carpeta opcional y aun no disponible)
pages (carpeta obligatoria con todos los .mm y con subcarpetas para hacer categorias)
index.mm la pagina inicial de la web

tambien tienes que especificar el input, output y si es la documentacion entera o solo una pagina en el inicio del main.js