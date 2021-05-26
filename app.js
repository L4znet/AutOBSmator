const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
obs.connect({
    address: 'localhost:4444',
    password: '********'
})
    .then(() => {
        console.log(`Vous êtes connecté !`);
        return obs.send('GetSceneList');
    })
    .then(data => {
        const changeScene = (number) => {
            let name = ""
            if(data.scenes[number] === undefined){
                name = ""; // Ici on défini la scène que l'on veut afficher dans le cas où une scène serait undefined
            } else {
                // Dans le cas où la scène n'est pas undefined, on affiche la scène choisi.
                 name = data.scenes[number].name
            }
            // La scène choisi est affiché grâce à son nom.
            obs.send('SetCurrentScene', {
                'scene-name': name
            });
        }
        setInterval(function(){
            // Ici on défini le numéro de la scène que l'on veut afficher, ce numéro change toutes les 2 secondes.
            // Dans ce cas de figure on a défini l'interval de scène entre 0 et 5.
           let sceneNumber = Math.round(Math.random() * (5 - 0) + 0);
            changeScene(sceneNumber)
        }, 2000);

    })
    .catch(err => { // Gestion des erreurs
        console.log(err);
    });

// On affiche dans la console la scène actuel.
obs.on('SwitchScenes', data => {
    console.log(`New Active Scene: ${data.sceneName}`);
});

obs.on('error', err => {
    console.error('socket error:', err);
});