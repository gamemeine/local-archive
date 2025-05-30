# Local Archive

## Project Goal
The main goal of the project is to collect, securely store, and share valuable materials
such as photographs and descriptions that document the development and transformation of the local environment.
Additionally, the project addresses the need for privacy protection by allowing users to mark uploaded content as either public or private.
It also introduces an on-demand sharing mechanism that preserves the anonymity of the data owner.

## Running the Project

### 1. Developer mode (manual component startup):

```bash
git clone https://github.com/gamemeine/local-archive
cd local-archive/src
```

- DB + elasticsearch (ports 5432 and 9200):

```bash
docker compose -f docker-compose.deps.yml up
```

- Backend (port 8000):

```bash
cd local-archive/src/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
make run
```

- Frontend (port 4200):

```bash
cd local-archive/src/web/
npm run start
```

### 2. Production mode / running the entire system in Docker

```bash
git clone https://github.com/gamemeine/local-archive
cd local-archive/src
docker compose up --build
```

#### Ports
- **DB**: 5432
- **Elasticsearch**: 9200
- **Backend**: 5002
- **Frontend**: 5001
