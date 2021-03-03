const dotenv = require("dotenv");
const express =  require('express')

const { uuid } = require('uuidv4');

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080


const app = express();
//converte os dados circulantes na aplicação em JSON
app.use(express.json());

/** 
 * PARAMETROS 
 * 
 * Query params -> parametro que vem na url -> filtros e paginação;
 * Route params -> parametros via rota
 * Request body -> vem via corpo da requisição (JSON)
 * 
*/

const projects = [];


// listar
app.get('/project', (req, res) => {

  const { name } = req.query;

  const results = name
    ? projects.filter(projects => projects.name.includes(name))
    : projects;

  //salvando as informações recebidas através do parametro da url

  return res.json(results);
});

app.put('/project/:id', (req, res) => {
  
  //dados salvos que vieram através da rota
  const {id} = req.params;
  
  const { name, tag} = req.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if(projectIndex < 0) return res.status(400).json({ error: "fail motherfucker"});

  const project = {
    id,
    name,
    tag
  };

  projects[projectIndex] = project; 

  return res.status(200).json(project);

});

app.post('/project', (req, res) => {
  
  //captura nome e tag do corpo da requisição
  const { name, tag} = req.body;

  //aloca em um array
  const project = { id: uuid(), name, tag};
  
  //faz um push dentro de um array
  projects.push(project);

  return res.json(project);

})

app.delete('/project/:id', (req, res) => {

  const {id} = req.params;
  const projectIndex = projects.findIndex(project => project.id === id);

  if(projectIndex < 0) return res.status(400).json({ error: "fail motherfucker"});

  projects.splice(projectIndex, 1);

  return res.status(204).send();
  
});




app.listen(PORT, () => {console.log(`Server running in http://localhost:${PORT}`)});