# MMX

This utility allows you to create documentation or a single‑page site using a custom format similar to Markdown.

To make the documentation work, your project must contain the following structure:

⚠️This is still under development

## **Required files and folders**

### `config.json` (required)  
Placed in the root of your project.  
It must contain:

```json
{
    "project": {
        "title": "Your project name",
        "version": "1.0"
    }
}
```

### `assets/` (optional)  
A folder for images, videos, or any other resources.  
To reference a resource inside it, use:

```
assets/path/to/resource
```

### `pages/` (required)  
This folder contains all your `.mmx` files.  
You can also create subfolders to organize your documentation into categories.  
Subfolders can contain more subfolders recursively.

### `index.mmx` (required)  
This is the main entry page of your documentation website.

## Creating your documentation

Inside the `pages/` folder you can:

- Create as many `.mmx` files as you want  
- Create folders to act as categories  
- Nest categories inside categories (recursively)

## Configuring the generator

At the beginning of your `main.js`, you must specify:

- The input folder  
- The output folder  
- Whether you want to generate the entire documentation or only a single page  


It will be something similar to this:

```
your-project/
├── config.json
├── index.mmx
├── assets/ ← optional
│   └──logo.png 
└── pages/
    ├── introduction.mmx
    ├── getting-started.mmx
    ├── guides/ ← category
    │   ├── install.mmx
    │   ├── usage.mmx
    │   └── advanced/ ← another category inside the category
    │       └── api.mmx
    └── export/ ← another category
        ├── html.mmx
        └── mobile.mmx
```

You can see how it is in https://cp-mario.github.io/MMX/ that is made with MMX
