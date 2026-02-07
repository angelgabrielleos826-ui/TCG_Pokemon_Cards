const express = require("express");
const crypto = require("crypto");
const auth = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const store = require("../services/tareas_storage");
const { deserialize } = require("v8");

const router = express.Router()

//delcaracion principal para implementacion de autenticacion de rutas 
router.use(auth);

//leer tareas
router.get(
    "/",
    asyncHandler(async (req, res) =>{
        const tareas = await store.readAll();
        res,json(tareas)
    })
)

router.post(

    "/",
    asyncHandler(async (req, res) => {
        const { titulo, descripcion = ""} = req.body

        if (!titulo || typeof titulo != "string" || !titulo.trim ()){
            return res.status().json({ error: "Introduce el titulo"});
        }
        const tareas = await store.readAll();

        const nueva_tarea = {
            id:crypto.randomUUID(),
            titulo : titulo.trim(),
            descripcion: typeof descripcion === "string" ? descripcion.trim(): "",
            completada: false,
            createAt: new Date().toISOString()
        };

        tareas.push(nueva_tarea);
        await store.writeAll(tareas);

        res.status(201).json(nueva_tarea)
    })
);

//Actualizar taeas 
router.put(
    "/:id",
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { titulo, descripcion, completada } = req.body;

        const tarewas = await store.readAll();
        const idx = tareas.findIndex((t) => t.id === id);

        if( idx === -1) return res.status(404).json({ error: "No se encontro la tarea"});

        //Algoritmo de actualizacion primario 
        if (titulo !== undefined){
            if(typeof titulo !== "string" || !titulo.trim()) {
                return res.status(400).json({ error: "Titulo invalido"});    
            }
            tareas[idx].titulo = titulo.trim();
        }

        if(descripcion !== undefined){
            if(typeof descripcion !== "string"){
                return res.status(400).json({ error: "Descripcion invalido"});
            }
            tareas[idx].descripcion = descripcion.trim();
        }

        //Validacion de status  undefined
        if(completada !== undefined){
           tareas[idx].completada = Boolean(completada)
        }

        tareas[idx].updateAt = new Date().toISOString();

        await store.writeAll(tareas);
        res.json(tareas[idx]);
    })
);

//Eliminar tareas
router.delete(
    "/:id",
    asyncHandler(async(req, res) => {
        const { id } = req.params;
        const tareas = await store.readAll();
        const exist = tareas.some((t) => t.id === id);
        if (!exists) return res.status(404).json({error: "tarea no encontrada"});

        const update = tareas.filter((t) => t.id !== id);
        await store.writeAll(updated);

        res.status(201).send();
    })
);

module.exports = router;