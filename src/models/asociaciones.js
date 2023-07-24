import Usuarios from "./Usuario.models.js";
import Noticias from "./Noticias.models.js";
import Comentarios from "./Comentarios.models.js";
import Reacciones from "./Reacciones.models.js";

//relacion uno a uno de Usuario a Noticias
Usuarios.hasMany(Noticias, {
    foreignKey: 'usuarioId'
});
Noticias.belongsTo(Usuarios, {
    foreignKey: 'usuarioId'
});

//relacion uno a uno de Usuario a Reacciones
Usuarios.hasMany(Reacciones, {
    as: 'reacciones',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey:'usuarioId',
});
Reacciones.belongsTo(Usuarios, {
    foreignKey: 'usuarioId'
})

//relacion uno a uno de Usuario a Comentarios
Usuarios.hasMany(Comentarios, {
    foreignKey: 'usuarioId'
});
Comentarios.belongsTo(Usuarios, {
    foreignKey: 'usuarioId'
});

//relacion uno a muchos de Noticias a Comentarios
Noticias.hasMany(Comentarios,{
    as: 'comentarios',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey:'noticiaId',
});
Comentarios.belongsTo(Noticias, {
    foreignKey: 'noticiaId'
});

//relacion uno a muchos de Noticias a Reacciones
Noticias.hasMany(Reacciones,{
    as: 'reacciones',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey:'noticiaId',
});
Reacciones.belongsTo(Noticias, {
    foreignKey:'noticiaId',
});


