# Fitness App Mobile

A fitness mobile app built with JavaScript and React Native that tracks steps, calories, and more, powered by an Express.js backend with MongoDB.

## Requirements

- <a href="https://nodejs.org/en" target="_blank">Node.js</a> installed on your computer.

## Setup
1. Clone the repository:
 	```bash
 	git clone https://github.com/Benonki/Fitness-app-mobile.git
 	```
2. Enter into project:
   ```bash
   cd Fitness-app-mobile
    ```
3. Install dependencies:
   ```bash
   npm i
   ```
4. Enter into backend:
	```bash
	cd backend
	 ```
5. Install Server dependencies:
	```bash
	npm i
	```
6. Select one of the following database usage versions:
### - MongoDB Version
1. Install <a href="https://www.mongodb.com/try/download/community" target="_blank"> MongoDB </a>on your PC.
2. After installation you need to add /bin path to environment PATH variables, default path to /bin should be:
   ```bash
    C:\Program Files\MongoDB\Server\<wersja>\bin
    ```

### - Docker Version
1. Install  [Docker](https://www.docker.com/get-started/) on your PC.
2. Open console and type:
   ```bash
    docker run --name fitness-mongo -d -p 27017:27017 -v mongo_data:/data/db mongo:latest
    ```
   - To stop docker type:
   ```bash
   docker stop fitness-mongo
   ```
   - To start docker again type:
   ```bash
   docker start fitness-mongo
   ```
## Running the App
1. Change the IP in src/api/axiosInstance.js to your computer's local IPv4 (You have to be in the same network on your phone and computer for this to work).
2. Change the IP in backend/app.js to your computer's local IPv4 but only first 3 octets.
3. You can change default key and expiration date in .env file in /backend
4. Open console nr 1 and get into /backend:
	```bash
	cd backend
    ```
5. Start Server (in console nr 1):
	```bash
	node server.js
    ```
6. Open console nr 2 and start Expo (in console nr 2):
	```bash
	npx expo start
    ```
7. You can either open http://localhost:8081/ on your PC, use the phone emulator, or scan the QR code (Recommended!!!) with Expo Go app on your phone (it needs to be SDK 51).

## Showcase

<div align="center">
  <img src="https://github.com/Benonki/Portfolio/blob/main/StronaGlowna/sc/FitApp.png" alt="Preview of My Project">
</div>

