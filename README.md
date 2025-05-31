# Local Archive

## Project Goal
The main goal of the project is to collect, securely store, and share valuable materials
such as photographs and descriptions that document the development and transformation of the local environment.
Additionally, the project addresses the need for privacy protection by allowing users to mark uploaded content as either public or private.
It also introduces an on-demand sharing mechanism that preserves the anonymity of the data owner.

## Requirements
- Python 3.10+
- Node.js 16+
- Docker (for running the project in production mode)
- Docker Compose (for running the project in production mode)


## Project Structure

The project is organized into several directories, each serving a specific purpose:

```
.
├── .github             # GitHub workflows and actions
├── .vscode             # Visual Studio Code settings
├── docs                # Documentation files
├── minutes             # Meeting minutes and notes
├── src
│   ├── api                # Backend API
│   ├── web                # Frontend application
│   ├── mobile             # Mobile application
│   ├── docker-compose.deps.yml  # Dependencies for DB and Elasticsearch
│   └── docker-compose.yml  # Main Docker Compose file for the project
├── terraform           # Terraform scripts for infrastructure management
├── .gitignore
└── README.md
```

## Setup

1. Clone the repository:

```bash
git clone https://github.com/gamemeine/local-archive
cd local-archive/
```

2. Setup api project:

```bash
# in src/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Setup web project:

```bash
# in src/web
npm install
```
4. Setup mobile project:

```bash
# TODO: Add mobile setup instructions
```

## Running the Project

### Run in developer mode (manual component startup):


1. Setup dependencies (PostgreSQL and Elasticsearch):

```bash
# in src/
docker compose -f docker-compose.deps.yml up
```

2. Run api
```bash
# in src/api
make run
```
3. Run web frontend
```bash
# in src/web
npm run start
```

4. Visit the web application, open your web browser and navigate to `http://localhost:4200`.

5. Check the API documentation at `http://localhost:8000/docs`.


### Run in production mode / running the entire system in Docker

1. Run the Docker Compose setup:
```bash
# in src/
docker compose up --build
```

2. Visit the web application, open your web browser and navigate to `http://localhost:5001`.

3. Check the API documentation at `http://localhost:5002/docs`.


## Testing

### Unit Tests

To run unit tests for the API, navigate to the `src/api` directory and run:

```bash
# in src/api
make test
```

The coverage should be displayed in the terminal.

To run unit tests for the web application, navigate to the `src/web` directory and run:

```bash
# in src/web
npm run test
```
The coverage report will be generated in the `coverage` directory.
