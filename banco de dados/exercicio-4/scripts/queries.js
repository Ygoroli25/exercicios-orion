// Rodar com mongosh
// Atualiza um post, adicionando array de comentários
use("orion");
db.posts.updateOne(
  { titulo: "Primeiro post no Mongo" },
  {
    $set: {
      comentarios: [
        { autor: "Carol", texto: "Muito bom!", data: new Date() },
        { autor: "Leo",   texto: "Curti a ideia", data: new Date() }
      ]
    }
  }
);

// Consultas: tags inclui "nosql"
print("=== Posts com tag 'nosql' ===");
printjson(db.posts.find({ tags: "nosql" }).toArray());

// Consultas: autor específico
print("=== Posts do autor 'Ygor' ===");
printjson(db.posts.find({ autor: "Ygor" }).toArray());

// Conferir comentários do primeiro post
print("=== Comentários do 'Primeiro post no Mongo' ===");
printjson(
  db.posts.find(
    { titulo: "Primeiro post no Mongo" },
    { _id:0, titulo:1, comentarios:1 }
  ).toArray()
);
