const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  
  repositories.push(repository);
  return response.json(repository)
});

app.use("/repositories/:id", (request, response, next) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id == id)

  if (repositoryIndex < 0) {
    return response.status(400).json({error: "ID not found"})
  }

  request.repoI = repositoryIndex

  return next()
})

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;

  repositories[request.repoI] = { ...repositories[request.repoI], title, url, techs }

  return response.json(repositories[request.repoI])
});

app.delete("/repositories/:id", (request, response) => {
  repositories.splice(request.repoI,1)
  return response.status(204).json({message: "Repo deleted."})
});

app.post("/repositories/:id/like", (request, response) => {
  let {likes} = repositories[request.repoI]
  likes = ++likes

  repositories[request.repoI] = {...repositories[request.repoI], likes}

  return response.json(repositories[request.repoI])
});

module.exports = app;
