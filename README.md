# Sigue Tu Envio #

Follow automatic shipments from OCA courier.

Visit the running website at [Sigue Tu Envío](http://www.siguetuenvio.com)

# Run it #

- Clone the repo.
- Download Node stable (5.4.1) release. I recommend using NVM for Node version management.
- Run `gulp dev` in the project folder.
- To send emails you must create a file in app/config/mandrill.js exporting the Mandrill object with your own API key.
- Remember to change encryption key in config.json

If you want, you can run with Docker,

# How to run with Docker #

Remember to use other passwords, at the db.

In the console run:
`docker run --name mysql-trackerguias -e MYSQL_RANDOM_ROOT_PASSWORD=yes -e MYSQL_ONETIME_PASSWORD=yes -d mysql/mysql-server:latest`
Check root password on the console:
`docker logs mysql-trackerguias`

Access MySQL server and change root password,
`docker exec -it mysql-trackerguias bash`
`mysql -u root -p`
`ALTER USER root IDENTIFIED BY 'my-secret-pw';`
Create db:
`CREATE DATABASE trackerguias CHARACTER SET utf8;`
Create user in Mysql to interact with the app:
`CREATE USER 'trackerguias'@'%' IDENTIFIED BY 'mypass';`
`GRANT ALL ON trackerguias.* TO 'trackerguias'@'%';`

At trackerguias folder, run:
`docker build -t trackerguias/trackerguias:v0.1 ./`
Link mysql docker instance with trackerguias docker image:
`docker run --name node-trackerguias -p 3000:3000 --link mysql-trackerguias:mysql -d trackerguias/trackerguias:v0.1`

(This part has not been tested...)
For schema creation you can try doing:
1. Access node-trackerguias bash with:
`docker exec -it node-trackerguias bash`
2. Run `gulp migrate` inside the project.

Now you can access at the host with (http://localhost:3000)

#Licence#

[The MIT License](http://opensource.org/licenses/mit-license.php)
