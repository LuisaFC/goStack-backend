const express = require('express');
const {uuid, isUuid} = require('uuidv4')
const cors = require('cors')

const app = express(); 

app.use(cors())
app.use(express.json());

const projects = [];

//Mostrar qual rota está sendo chamada
function logRequest(request, response, next){
    const {method, url} = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    
    console.time(logLabel);
    
    next();

    console.timeEnd(logLabel)
}

//Verificar se id é válido - 
function validateProjectId(request, response, next){
    const {id} = request.params;

    // Se entrar no if, tudo que vier depois não será executado
    if(!isUuid(id)){
        return response.status(400).json({error: 'Invalid project ID'})
    }

    //Se entrar no if, não vai ocorrer o next. A aplicação vai parar dentro do if
    return next();
}

app.use(logRequest);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
    const {title} = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

    return response.json(results);
})

app.post('/projects', (request, response) => {
    const {title, owner} = request.body;

    const project = {id: uuid(), title, owner}
    
    projects.push(project)

    //Nunca se exibe a lista, apenas o objeto recém criado
    return response.json(project);
})

app.put('/projects/:id', (request, response) => {
    const {id} = request.params;
    const {title, owner} = request.body;

    //Percorre array e se encontrar o id passado então vai salvar a posição na variavel project
    const projectIndex = projects.findIndex(item => item.id === id);

    if(projectIndex < 0){
        return response.status(400).json({error: 'Project not found'})
    }
    
    const project = {
        id, 
        title,
        owner
    }

    projects[projectIndex] = project;

    return response.json(project);
})

app.delete('/projects/:id', (request, response) => {
    const {id} = request.params;

    const projectIndex = projects.findIndex(item => item.id === id);

    if(projectIndex < 0){
        return response.status(400).json({error: 'Project not found'})
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
})

app.listen(3333, () => {
    console.log('🚀️ Back-end Started!');
    
});