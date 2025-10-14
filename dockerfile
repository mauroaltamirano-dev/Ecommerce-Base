# indicamos la imagen base del project
FROM node

# establecemos el nombre la app/ directorio de tarbajo
WORKDIR /ecommerce-server

# copiamos los archivos de la app al contenedor
COPY package.json ./
RUN npm install
COPY . .

# exponer el puerto de la app
EXPOSE 9090

# definimos el comando para ejecutar la app
CMD ["npm", "start"]