##### Hasura with dockers

>**Disclaimer** - Please avoid using WSL, as Docker runs very slowly on it
##### Prerequisites
- **docker**
	=> [Install docker for Linux](https://docs.docker.com/engine/install/)
	=> [Install docker for Mac](https://docs.docker.com/desktop/install/mac-install/)
- **node.js** => [Install node.js](https://nodejs.org/en/download/package-manager)

##### Install Hasura with Docker
- **cURL**
```bash
curl https://raw.githubusercontent.com/hasura/graphql-engine/stable/install-manifests/docker-compose/docker-compose.yaml -o docker-compose.yml
```
- **wGET**
```bash
wget https://raw.githubusercontent.com/hasura/graphql-engine/stable/install-manifests/docker-compose/docker-compose.yaml
```
- Run the following command to start Hasura GraphQL Engine and Postgres database
```bash
docker compose up -d
```
- After installation is done. Run the following command, and make sure that, **hasura engine and postgres** are up and running
```bash
docker ps
```
> **Open the Hasura Console by navigating to `http://localhost:8080/console`.**

- Click on the DATA tab on the Navigation Bar
![Screenshot from 2024-08-28 19-38-03](https://github.com/user-attachments/assets/efad1df5-de7f-4a19-a88d-14edbb9ddb1d)
- Click on Postgres, and then Connect Existing Database
![Screenshot from 2024-08-28 19-45-50](https://github.com/user-attachments/assets/0e24ca71-21cf-42f3-bf55-9852ff3017b1)
- Open the `docker-compose.yml` in your Editor
- Copy the Environment Variable name `PG_DATABASE_URL`
![Screenshot from 2024-08-28 20-11-16](https://github.com/user-attachments/assets/dc357d74-87c6-4319-bbd3-4ee10ab39cc7)
- Paste the Environment Variable name, and add Database name, then Connect Database
![Screenshot from 2024-08-28 20-13-22](https://github.com/user-attachments/assets/c51ef426-c33f-4685-864c-c2365a1ea58b)
- Click on your Created database (in my case its `test`), then `public` and Create table
![Screenshot from 2024-08-28 23-07-02](https://github.com/user-attachments/assets/ff4694aa-ce9f-4139-a7c2-ce8226e3ef06)
- Create a table `accounts` with following columns and its respective types, and default values, as illustrated below. Add primary key to `userid` column
![Screenshot from 2024-08-28 23-11-41](https://github.com/user-attachments/assets/c853bd2f-5d72-4abe-92ac-9860442a01a4)
- Click on the `accounts` table, then Insert Row, and add only username, and balance, the rest are default.
![Screenshot from 2024-08-28 23-21-28](https://github.com/user-attachments/assets/066e700c-e707-4baf-b1b3-2d0b4caad98f)
---
##### Node.js GraphQL setup with GitHub
- Open you terminal
```bash
git clone https://github.com/LeonMendonca/HasurawithNodejs.git
cd HasurawithNodejs/
```
- Package Manager `npm` `pnpm` `yarn`. Depends on your choice
	=>`npm install` or `pnpm intall` or `yarn install`
- Run `docker ps` in you terminal, and check the `CONTAINER ID` of postgres container.
![Screenshot from 2024-08-29 10-27-29](https://github.com/user-attachments/assets/f260f5d1-8af0-4a75-aaad-2ca87e783d06)
- Run this command below, to get the postgres container IP address.
```bash
docker inspect \
  -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_name_or_id>
```
- Enter the IP address to the HOST Environment variable
- create a `.env` file.
```
PGUSER=postgres
PASSWORD=postgrespassword
DATABASE=postgres
HOST=172.18.0.X
PORT=5432
```
> **Note** : The contents of the `.env` remains the same unless there's some changes made to the `docker-compose.yml` file, on your side.
---
##### Connect Hasura with Node.js
- type `ip addr | grep docker` in your terminal
![Screenshot from 2024-08-29 12-08-10](https://github.com/user-attachments/assets/23de53a9-cf8a-40cb-97f3-d611ab564819)
> Note the IP address (in my case, its `inet 172.17.0.1`)
- Now, navigate to `http://localhost:8080/console`
	=> Click on remote schemas, then Add
	=> Now, Enter **Name** and **GraphQL URL** as shown below 
	=> URL : `http://<docker-ip-address>:4000`
![Screenshot from 2024-08-29 12-28-37](https://github.com/user-attachments/assets/b649eab9-abf4-45a8-8381-8f80757f6589)
  => Then Click Add Remote Schema
> **This should add Node.js Schema to the Hasura**

##### Setting up Client-side
> Base URL : `http://locahost:3000`
- Client-side is basically just an express server, serving static contents
```bash
cd client
node lib/server.js
```
- This will start the express server

| Endpoints    | Description                           |
| ------------ | ------------------------------------- |
| /            | Get all accounts (requires admin key) |
| /user        | Get specific user's account           |
| /withdraw    | Withdraw amount to wallet             |
| /transaction | Transfer amount to another user       |
| /deposit     | Deposit amount to your account        |

