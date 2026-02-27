const Community = require("../models/Community");

async function create(req, res, next){
    try {
        const {nombre, description, precio, cantidad, contacto} = req.body;
        const image = req.file.path;
        
        const publication = await Community.create({
            user: req.user.sub,
            nombre,
            description,
            precio,
            cantidad,
            contacto,
            image
        });

        res.status(201).json(publication);
    }catch (error){
        next(error);
    }
}

async function getAll(req,res,next){
    try{
        const publications = await Community.find({})
        .populate("user", "email");
        res.json(publications);
    } catch(error) {
        next(error);
    }
}

async function getOne(req, res, next){
    try{
        const{id} = req.params;
        const publication = await Community.findById(id)
        .populate("user", "email");
        if(!publication){
            return res.status(404).json({error: "Publicacion no encontrada"});

        }
        res.json(publication);

    }catch (error){
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const { id } = req.params;
        const publication = await Community.findById(id);

        if (!publication) {
            return res.status(404).json({ error: "Publicación no encontrada" });
        }

        if (publication.user.toString() !== req.user.sub) {
            return res.status(403).json({ error: "No tienes permiso para editar esta publicación" });
        }

        const updated = await Community.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.json(updated);

    } catch (error) {
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const publication = await Community.findById(id);

        if (!publication) {
            return res.status(404).json({ error: "Publicación no encontrada" });
        }

        if (publication.user.toString() !== req.user.sub) {
            return res.status(403).json({ error: "No tienes permiso para eliminar esta publicación" });
        }

        await Community.findByIdAndDelete(id);

        res.json({ message: "Publicación eliminada correctamente" });

    } catch (error) {
        next(error);
    }
}

module.exports ={create, getAll, getOne, update, remove};
