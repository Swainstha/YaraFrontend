# Installing in Ubuntu


### Using NPM



* First install nvm in your ubuntu machine

        sudo apt install curl
        curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
        source ~/.bashrc

* Install node using nvm

        nvm install node
        nvm install 14.21.1
        nvm use 14.21.1

* Clone this repository

        git clone https://github.com/Swainstha/YaraFrontend

* In the project directory install the node modules

        npm install

* Run the React app

        npm start

    * Runs the app in the development mode.

    * Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
        




### Using Docker



* Install Docker in your ubuntu system

* Clone this repository

                git clone https://github.com/Swainstha/YaraFrontend

* From the project directory, run the below command in the terminal to build the docker image

                sudo docker build . -t dockerized-app

* After building the docker image, run

                sudo docker run -p 3000:80 dockerized-app

    * Runs the app in the production mode.

    * Open [http://localhost:3000](http://localhost:3000) to view it in the browser.



