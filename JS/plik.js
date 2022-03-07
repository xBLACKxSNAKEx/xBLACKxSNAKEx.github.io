//Placing
let curentGate = "";
let firstLocationX = 0;
let firstLocationY = 0;
let checker = true;
let color = 'red';
let type = 'AND'
const workSpace = document.querySelector("#workSpace");
let gateID = 0;
let externalGateID = 0;

let inputCount = 0;


//MAPS
let gatesDict = new Map();
let linesDict = new Map();
let inputDict = new Map();
let outputDict = new Map();

// external gates

let externalGates = new Map();


function downloadasFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/txt;charset=utf-8,' + text);
    element.setAttribute('download', filename + ".txt");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function setState(actualX, actualY, firstX, firstY, buffer = "notExist") {
    let type = gatesDict[`${actualX}_${actualY}`][0].split('_')[0];
    let parents = [];
    let children = [];

    // Children collecting
    let childrenChecker = new RegExp(`^${actualX}_${actualY}`);
    for (let [key, value] of Object.entries(linesDict)) {
        if (childrenChecker.test(key)) {
            children.push(key);
        }
    }

    if (type == "AND") {
        let lineChecker = new RegExp(`${actualX}_${actualY}$`);
        for (let [key, value] of Object.entries(linesDict)) {
            if (lineChecker.test(key)) {
                parents.push(key);
            }
        }
        if (parents.length == 0) {
            gatesDict[`${actualX}_${actualY}`][1] = null;
        } else if (parents.length == 1) {
            gatesDict[`${actualX}_${actualY}`][1] = gatesDict[parents[0].split("-")[0]][1];
        } else {
            let protector = parents.length - 1;
            let checker = 0
            gatesDict[`${actualX}_${actualY}`][1] = "(";
            for (let i in parents) {
                gatesDict[`${actualX}_${actualY}`][1] += gatesDict[parents[i].split("-")[0]][1];
                if (checker < protector) {
                    gatesDict[`${actualX}_${actualY}`][1] += "&&";
                }
                checker += 1
            }
            gatesDict[`${actualX}_${actualY}`][1] += ")";
        }
    } else if (type == "NOT") {
        gatesDict[`${actualX}_${actualY}`][1] = `!(${gatesDict[firstX+"_"+ firstY][1]})`;
    } else {
        if (buffer != "notExist") {
            gatesDict[`${ actualX }_${ actualY }`][3][buffer] = `${gatesDict[`${firstX}_${firstY}`][1]}`;
        } else {
            if(!(/EXTERNAL/g.test(gatesDict[`${actualX}_${actualY}`][0]))){
                console.log("baka");
                gatesDict[`${actualX}_${actualY}`][1] = `${gatesDict[`${firstX}_${firstY}`][1]}`;

            }
                
        }
    }

    // Children abusing
    if(children.length > 0){
        for(i of children){
            let data= i.split('-');
            data[0] = data[0].split("_");
            data[1] = data[1].split("_");
            setState(data[1][0], data[1][1], data[0][0], data[0][1]);
        }
    }
}

function lightTurnOn() {
    for (let [key, value] of Object.entries(outputDict)){
            if(eval(gatesDict[value][1])){
                document.getElementById(key).classList.add("greenLogicGate");
                document.getElementById(key).classList.remove("redLogicGate");
                document.getElementById(key).style.strokeWidth = 30;
                document.getElementById(key).setAttribute("d", "M 503.56705,245.76 H 616.8094 M 56.33925,502.64427 136.41369,422.56984 M 447.86866,59.31251 527.9431,-20.76192 m -471.603852,-4e-6 80.074442,80.07443 M 447.86866,422.56984 527.9431,502.64427 M 314.42824,-105.09187 V 25.173481 m 0,462.857749 V 618.29658 M -6.32,176.08 c -6.297,0 -12.44,1.816 -17.69,5.284 l -25.69,17.14 c -7.875,5.25 -14.28,17.17 -14.28,26.64 v 61.67 c 0,9.438 6.401,21.36 14.28,26.61 l 25.68,17.08 c 4.438,2.938 12.37,5.348 17.7,5.348 l 39.2,0.128 v -160 z m 454.3,79.9 c -0.3203,-101.98 -82.97,-176 -175.1,-176 -44.38,0 -84.84,16.44 -115.8,43.56 -18.84,16.53 -58.23,42.34 -91.45,52.22 -0.25,0.0313 -0.5166,0.0938 -0.7823,0.125 v 160.2 c 0.2656,0.0313 0.5166,0.0938 0.7823,0.125 33.22,9.875 72.61,35.69 91.45,52.22 30.1,27.15 70.5,43.55 115.8,43.55 96.3,0 175.0961,-78.8 175.1,-176 z m -260.1,96.4 c -17.85,-15.66 -46.3,-35.04 -75.89,-49.05 v -94.61 c 29.59,-14.01 58.04,-33.39 75.88,-49.04 23.31,-20.46 54.01,-31.7 85.01,-31.7 61.8,0 126.85,48.1 127.1,127.1 0,71.5 -57.4,128.9 -127.1,128.9 -31,0 -61.7,-11.2 -85,-31.6 z m 180.1,-112.4 c 0,-44.1 -35.9,-80 -80,-80 -8.844,0 -16,7.156 -16,16 0,8.844 7.2,16 16,16 26.47,0 48,21.53 48,48 0,8.844 7.148,16 15.99,16 8.842,0 16.01,-7.2 16.01,-16 z");
            }else{
                document.getElementById(key).classList.add("redLogicGate");
                document.getElementById(key).classList.remove("greenLogicGate");
                document.getElementById(key).setAttribute("d", "m -6.32,176.08 c -6.297,0 -12.44,1.816 -17.69,5.284 l -25.69,17.14 c -7.875,5.25 -14.28,17.17 -14.28,26.64 v 61.67 c 0,9.438 6.401,21.36 14.28,26.61 l 25.68,17.08 c 4.438,2.938 12.37,5.348 17.7,5.348 l 39.2,0.128 v -160 z m 454.3,79.9 c -0.3203,-101.98 -82.97,-176 -175.1,-176 -44.38,0 -84.84,16.44 -115.8,43.56 -18.84,16.53 -58.23,42.34 -91.45,52.22 -0.25,0.0313 -0.5166,0.0938 -0.7823,0.125 v 160.2 c 0.2656,0.0313 0.5166,0.0938 0.7823,0.125 33.22,9.875 72.61,35.69 91.45,52.22 30.1,27.15 70.5,43.55 115.8,43.55 96.3,0 175.0961,-78.8 175.1,-176 z m -260.1,96.4 c -17.85,-15.66 -46.3,-35.04 -75.89,-49.05 v -94.61 c 29.59,-14.01 58.04,-33.39 75.88,-49.04 23.31,-20.46 54.01,-31.7 85.01,-31.7 61.8,0 126.85,48.1 127.1,127.1 0,71.5 -57.4,128.9 -127.1,128.9 -31,0 -61.7,-11.2 -85,-31.6 z m 180.1,-112.4 c 0,-44.1 -35.9,-80 -80,-80 -8.844,0 -16,7.156 -16,16 0,8.844 7.2,16 16,16 26.47,0 48,21.53 48,48 0,8.844 7.148,16 15.99,16 8.842,0 16.01,-7.2 16.01,-16 z");
                document.getElementById(key).style.strokeWidth = 12;
            }

    }
}


//SETTING UP BUTTONS
window.onload = () => {

    //Importing files
    document.querySelector("#inputFile").addEventListener("change", (event) => {
        let file = new FileReader();
        file.addEventListener('load', (event) => {
            let data = event.target.result.split("?");
            let button = document.createElement("div");
            button.setAttribute('id', `EXTERNAL-${externalGateID}`);
            button.setAttribute('class', "buttons");
            
            button.setAttribute('style', `background-image: url(../IMG/gates/${data[0]}/${data[1]}.svg);`);

            button.addEventListener("click", (event)=>{
                curentGate = event.target.id;
                checker = true;
            });


            let output = JSON.parse(data[6]);
            let input = JSON.parse(data[5]);
            let gates = JSON.parse(data[3]);

            
            
            let outputValues;

            for([key, value] of Object.entries(output)){
                outputValues = gates[value][1];
            }
            
            let iterator = 0
            for([key, value] of Object.entries(input)){
                console.log(key);
                let temp1 = /inputDict\[/g;
                outputValues = outputValues.replace(temp1 , ``);
                let temp2 = new RegExp('"\]', 'g');
                outputValues = outputValues.replace(temp2 , ``);
                let temp3 = new RegExp(`"${key}`, 'g');
                outputValues = outputValues.replace(temp3 , `eval(gatesDict[location][3][${iterator}])`);
                iterator++;
            }


            console.log(outputValues);

            externalGates[`EXTERNAL-${externalGateID}`] = [data[0], data[1], data[2], outputValues];
            externalGateID++; 

            document.querySelector("#boxOfGates").appendChild(button);
            
        });
        file.readAsText(event.target.files[0]);
        
        document.querySelector("#importPopUp").style.visibility = "hidden";
    })
    // save file
    document.querySelector("#save").addEventListener("click", () => {
        
        document.querySelector("#savePopUp").style.visibility = "visible";
    });
    document.querySelector("#saveTurnOff").addEventListener("click", () => {
        document.querySelector("#savePopUp").style.visibility = "hidden";
    });

    document.querySelector("#import").addEventListener("click", () => {
        
        document.querySelector("#importPopUp").style.visibility = "visible";
    });
    document.querySelector("#importTurnOff").addEventListener("click", () => {
        document.querySelector("#importPopUp").style.visibility = "hidden";
    });
    
    // decision buttons
    document.querySelector("#gateAND").addEventListener("click", () => {
        document.querySelector("#visualisationGate").setAttribute('d', "m 94.321711,77.5578 c -17.650357,-0.21727 -33.613808,0 -51.860548,0 v 69.98103 h 51.860548 c 23.214349,-1.3e-4 43.216879,-16.37151 43.217129,-34.99052 9e-5,-18.61919 -20.00254,-34.990373 -43.217129,-34.99051 z");
        document.querySelector("#visualisationGate").setAttribute('style', "transform: translate(-20px, -130px) scale(2)");
        type = 'AND';
    });
    document.querySelector("#gateNOT").addEventListener("click", () => {
        document.querySelector("#visualisationGate").setAttribute('d', "m 155.50391,13.375 0.0176,128.35742 0.0176,128.35742 171.01758,-64.18945 171.01758,-64.1875 -171.03516,-64.169921 z m 384.90625,97.73047 a 28.73626,28.736268 0 0 0 -28.67383,28.73633 28.73626,28.736268 0 0 0 28.73633,28.73632 28.73626,28.736268 0 0 0 28.73632,-28.73632 28.73626,28.736268 0 0 0 -28.73632,-28.73633 28.73626,28.736268 0 0 0 -0.0625,0 z");
        document.querySelector("#visualisationGate").setAttribute('style', "stroke-width: 16px; transform: matrix(0.26458333,0,0,0.26458333,12,75.000001) scale(2) translate(-40px, -90px)");
        type = 'NOT';
    });
    document.querySelector("#gateOR").addEventListener("click", () => {
        document.querySelector("#visualisationGate").setAttribute('d', "m 94.321711,77.5578 c -17.650357,-0.21727 -33.613808,0 -51.860548,0 14.992479,24.32651 19.897266,47.9805 0,69.98103 h 51.860548 c 23.214349,-1.3e-4 43.217129,-34.99052 43.217129,-34.99052 0,0 -20.00254,-34.990373 -43.217129,-34.99051 z");
        document.querySelector("#visualisationGate").setAttribute('style', "transform: translate(-20px, -130px) scale(2)");
        type = 'OR';
    });
    document.querySelector("#gateXOR").addEventListener("click", () => {
        document.querySelector("#visualisationGate").setAttribute('d', "m 27.132696,77.5578 c 7.978242,22.282617 10.721355,44.8271 0,69.98103 M 94.321711,77.5578 c -17.650357,-0.21727 -33.613808,0 -51.860548,0 10.248831,24.32651 11.439432,47.9805 0,69.98103 h 51.860548 c 23.214349,-1.3e-4 43.217129,-34.99052 43.217129,-34.99052 0,0 -20.00254,-34.990373 -43.217129,-34.99051 z");
        document.querySelector("#visualisationGate").setAttribute('style', "transform: translate(-20px, -130px) scale(2)");
        type = 'XOR';
    });

    document.querySelector("#red").addEventListener("click", ()=>{
        document.querySelector("#visualisationGate").classList.replace(document.querySelector("#visualisationGate").classList[1] , "redLogicGate");
        color = 'red';
    })
    document.querySelector("#green").addEventListener("click", ()=>{
        document.querySelector("#visualisationGate").classList.replace(document.querySelector("#visualisationGate").classList[1] , "greenLogicGate");
        color = 'green';
    })
    document.querySelector("#blue").addEventListener("click", ()=>{
        document.querySelector("#visualisationGate").classList.replace(document.querySelector("#visualisationGate").classList[1] , "blueLogicGate");
        color = 'blue';
    })
    document.querySelector("#yellow").addEventListener("click", ()=>{
        document.querySelector("#visualisationGate").classList.replace(document.querySelector("#visualisationGate").classList[1] , "yellowLogicGate");
        color = 'yellow';
    })
    document.querySelector("#purple").addEventListener("click", ()=>{
        document.querySelector("#visualisationGate").classList.replace(document.querySelector("#visualisationGate").classList[1] , "purpleLogicGate");
        color = 'purple';
    })
    document.querySelector("#orange").addEventListener("click", ()=>{
        document.querySelector("#visualisationGate").classList.replace(document.querySelector("#visualisationGate").classList[1] , "orangeLogicGate");
        color = 'orange';
    })

    document.querySelector("form").addEventListener("submit", () => {
        downloadasFile(document.querySelector("#name").value , color +'?' + type +  '?' + inputCount+ '?' + JSON.stringify(gatesDict) + '?' + JSON.stringify(linesDict) + '?' + JSON.stringify(inputDict) + '?' + JSON.stringify(outputDict));
    });

    // UI buttons
    document.querySelector("#AND").addEventListener("click", () => {
        curentGate = "AND";
        checker = true;
    });
    
    document.querySelector("#NOT").addEventListener("click", () => {
        curentGate = "NOT";
        checker = true;
    });
    
    document.querySelector("#addLine").addEventListener("click", () => {
        curentGate = "addLine";
        checker = true;
    });
    document.querySelector("#deleteLine").addEventListener("click", () => {
        curentGate = "deleteLine";
        checker = true;
    });
    
    document.querySelector("#trash").addEventListener("click", () => {
        curentGate = "TRASH";
        checker = true;
    });
    document.querySelector("#output").addEventListener("click", () => {
        curentGate = "OUTPUT";
        checker = true;
    });
    document.querySelector("#input").addEventListener("click", () => {
        curentGate = "INPUT";
        checker = true;
    });
};

workSpace.addEventListener("click", () => {
    
    
    //Variables
    let positionInWorkSpaceLeft = Math.floor(workSpace.getBoundingClientRect().left);
    let positionInWorkSpaceTop = Math.floor(workSpace.getBoundingClientRect().top);
    
    let actualMouseX = (event.clientX - positionInWorkSpaceLeft) - (event.clientX - positionInWorkSpaceLeft) % 200 + 115;
    let actualMouseY = (event.clientY - positionInWorkSpaceTop) - (event.clientY - positionInWorkSpaceTop) % 160 + 50;
    
    
    //Positioning
    
    //GATES
    if (gatesDict.hasOwnProperty(`${actualMouseX}_${actualMouseY}`) != true) {
        let tester = new RegExp("EXTERNAL-") 


        if (curentGate == "AND") {
            workSpace.innerHTML += `<path id="AND_${gateID}" class="logicGate grayLogicGate" d="m ${actualMouseX},${actualMouseY} c -17.65035,-0.21727 -33.613807,0 -51.860542,0 v 69.98103 h 51.860542 c 23.21435,-1.3e-4 43.21688,-16.37151 43.21713,-34.99052 9e-5,-18.61919 -20.00254,-34.99037 -43.21713,-34.99051 z"/>`;
            gatesDict[`${actualMouseX}_${actualMouseY}`] = [`AND_${gateID}`, null];
        }
        if (curentGate == "NOT") {
            workSpace.innerHTML += `<path id="NOT_${gateID}" class="logicGate grayLogicGate" style="stroke-width: 12px;" transform="scale(0.25)" d="m ${actualMouseX *4 -220},${actualMouseY*4 +10} 0.0176,128.35742 0.0176,128.35742 171.01758,-64.18945 171.01758,-64.1875 -171.03516,-64.169921 z m 384.90625,97.73047 a 28.73626,28.736268 0 0 0 -28.67383,28.73633 28.73626,28.736268 0 0 0 28.73633,28.73632 28.73626,28.736268 0 0 0 28.73632,-28.73632 28.73626,28.736268 0 0 0 -28.73632,-28.73633 28.73626,28.736268 0 0 0 -0.0625,0 z"/>`;
            gatesDict[`${actualMouseX}_${actualMouseY}`] = [`NOT_${gateID}`, null];
        }
        
        if (curentGate == "OUTPUT") {
            workSpace.innerHTML += `<path id="OUTPUT_${gateID}" transform="translate(${actualMouseX-44}, ${actualMouseY -3}) scale(.15)" class="logicGate redLogicGate" d="m -6.32,176.08 c -6.297,0 -12.44,1.816 -17.69,5.284 l -25.69,17.14 c -7.875,5.25 -14.28,17.17 -14.28,26.64 v 61.67 c 0,9.438 6.401,21.36 14.28,26.61 l 25.68,17.08 c 4.438,2.938 12.37,5.348 17.7,5.348 l 39.2,0.128 v -160 z m 454.3,79.9 c -0.3203,-101.98 -82.97,-176 -175.1,-176 -44.38,0 -84.84,16.44 -115.8,43.56 -18.84,16.53 -58.23,42.34 -91.45,52.22 -0.25,0.0313 -0.5166,0.0938 -0.7823,0.125 v 160.2 c 0.2656,0.0313 0.5166,0.0938 0.7823,0.125 33.22,9.875 72.61,35.69 91.45,52.22 30.1,27.15 70.5,43.55 115.8,43.55 96.3,0 175.0961,-78.8 175.1,-176 z m -260.1,96.4 c -17.85,-15.66 -46.3,-35.04 -75.89,-49.05 v -94.61 c 29.59,-14.01 58.04,-33.39 75.88,-49.04 23.31,-20.46 54.01,-31.7 85.01,-31.7 61.8,0 126.85,48.1 127.1,127.1 0,71.5 -57.4,128.9 -127.1,128.9 -31,0 -61.7,-11.2 -85,-31.6 z m 180.1,-112.4 c 0,-44.1 -35.9,-80 -80,-80 -8.844,0 -16,7.156 -16,16 0,8.844 7.2,16 16,16 26.47,0 48,21.53 48,48 0,8.844 7.148,16 15.99,16 8.842,0 16.01,-7.2 16.01,-16 z"/>`;
            gatesDict[`${ actualMouseX }_${ actualMouseY }`] = [`OUTPUT_${ gateID }`, null];
            outputDict[`OUTPUT_${ gateID }`] = `${ actualMouseX }_${ actualMouseY }`;
        }
        
        if (curentGate == "INPUT") {
            workSpace.innerHTML += `<path id="INPUT_${gateID}" transform="translate(${actualMouseX-59}, ${actualMouseY-3}) scale(.20)" class="logicGate redLogicGate" d="M 32,64 C 14.38,64 0,78.38 0,96 c 0,17.62 14.38,32 32,32 h 96 V 64 Z M 159.1,16 v 352 c 0,8.875 7.125,16 16,16 h 32 c 8.875,0 16,-7.125 16,-16 V 352 H 256 c 76,0 141.6,-53.5 156.8,-128 H 512 V 160 H 412.75 C 397.6,85.5 332,32 256,32 H 223.1 V 16 c 0,-8.875 -7.125,-16 -16,-16 h -32 c -8,0 -16,7.1 -16,16 z M 32,256 c -17.62,0 -32,14.38 -32,32 0,17.62 14.38,32 32,32 h 96 v -64 z"/>`;
            inputDict[`INPUT_${ gateID }`] = false;
            inputCount++;
            gatesDict[`${ actualMouseX }_${ actualMouseY }`] = [`INPUT_${ gateID }`, `inputDict["INPUT_${ gateID }"]`];
        }
        
        //external gate
        if (tester.test(curentGate)) {
            if(externalGates[curentGate][1] == "AND"){
                workSpace.innerHTML += `<path id="${curentGate}_${gateID}" class="logicGate ${externalGates[curentGate][0]}LogicGate" d="m ${actualMouseX},${actualMouseY} c -17.65035,-0.21727 -33.613807,0 -51.860542,0 v 69.98103 h 51.860542 c 23.21435,-1.3e-4 43.21688,-16.37151 43.21713,-34.99052 9e-5,-18.61919 -20.00254,-34.99037 -43.21713,-34.99051 z"/>`;
            }
            if(externalGates[curentGate][1] == "NOT"){
                workSpace.innerHTML += `<path id="${curentGate}_${gateID}" class="logicGate ${externalGates[curentGate][0]}LogicGate" style="stroke-width: 12px;" transform="scale(0.25)" d="m ${actualMouseX *4 -220},${actualMouseY*4 +10} 0.0176,128.35742 0.0176,128.35742 171.01758,-64.18945 171.01758,-64.1875 -171.03516,-64.169921 z m 384.90625,97.73047 a 28.73626,28.736268 0 0 0 -28.67383,28.73633 28.73626,28.736268 0 0 0 28.73633,28.73632 28.73626,28.736268 0 0 0 28.73632,-28.73632 28.73626,28.736268 0 0 0 -28.73632,-28.73633 28.73626,28.736268 0 0 0 -0.0625,0 z"/>`;
            }
            if(externalGates[curentGate][1] == "OR"){
                workSpace.innerHTML += `<path id="${curentGate}_${gateID}" class="logicGate ${externalGates[curentGate][0]}LogicGate" transform="translate(${actualMouseX-120}, ${actualMouseY -100}) scale(1.2) " d="m 94.321711,77.5578 c -17.650357,-0.21727 -33.613808,0 -51.860548,0 14.992479,24.32651 19.897266,47.9805 0,69.98103 h 51.860548 c 23.214349,-1.3e-4 43.217129,-34.99052 43.217129,-34.99052 0,0 -20.00254,-34.990373 -43.217129,-34.99051 z"/>`;
            }
            if(externalGates[curentGate][1] == "XOR"){
                workSpace.innerHTML += `<path id="${curentGate}_${gateID}" class="logicGate ${externalGates[curentGate][0]}LogicGate" transform="translate(${actualMouseX-90}, ${actualMouseY -80})  " d="m 27.132696,77.5578 c 7.978242,22.282617 10.721355,44.8271 0,69.98103 M 94.321711,77.5578 c -17.650357,-0.21727 -33.613808,0 -51.860548,0 10.248831,24.32651 11.439432,47.9805 0,69.98103 h 51.860548 c 23.214349,-1.3e-4 43.217129,-34.99052 43.217129,-34.99052 0,0 -20.00254,-34.990373 -43.217129,-34.99051 z"/>`;
            }

            gatesDict[`${actualMouseX}_${actualMouseY}`] = [`${curentGate}_${gateID}`, externalGates[curentGate][3].replace(/location/g, `"${actualMouseX}_${actualMouseY}"`), parseInt(externalGates[curentGate][2]), []];
            for(i = 0; i < gatesDict[`${actualMouseX}_${actualMouseY}`][2]; i++){
                gatesDict[`${actualMouseX}_${actualMouseY}`][3].push(false);
            }
        }
        
        gateID++;

    }else if (gatesDict.hasOwnProperty(`${actualMouseX}_${actualMouseY}`) == true && gatesDict[`${actualMouseX}_${actualMouseY}`][0].split("_")[0] == "INPUT" && curentGate != "addLine" && curentGate != "deleteLine"){
        //INPUT STATE
        if(!(inputDict[gatesDict[actualMouseX + "_" + actualMouseY][0]])){
            document.querySelector(`#${gatesDict[`${actualMouseX}_${actualMouseY}`][0]}`).classList.remove("redLogicGate");
            document.querySelector(`#${gatesDict[`${actualMouseX}_${actualMouseY}`][0]}`).classList.add("greenLogicGate");
            inputDict[gatesDict[actualMouseX + "_" + actualMouseY][0]] = true;
        }else{
            document.querySelector(`#${gatesDict[`${actualMouseX}_${actualMouseY}`][0]}`).classList.remove("greenLogicGate");
            document.querySelector(`#${gatesDict[`${actualMouseX}_${actualMouseY}`][0]}`).classList.add("redLogicGate");
            inputDict[gatesDict[actualMouseX + "_" + actualMouseY][0]] = false;

        }
    }
    
    //TRASH
    if (curentGate == "TRASH") {
        if (gatesDict.hasOwnProperty(`${ actualMouseX }_${ actualMouseY }`) == true) {
            document.querySelector(`#${ gatesDict[actualMouseX + "_" + actualMouseY][0] }`).remove();

            let inputTest = new RegExp("INPUT_");

            delete(outputDict[gatesDict[`${ actualMouseX }_${ actualMouseY }`][0]]);
            delete(inputDict[gatesDict[`${ actualMouseX }_${ actualMouseY }`][0]]); 
            if(inputTest.test(gatesDict[`${ actualMouseX }_${ actualMouseY }`][0])){
                inputCount--;
            }
            delete(gatesDict[`${ actualMouseX }_${ actualMouseY }`]);
            //LINE ERASER
            let tester = new RegExp(`${ actualMouseX }_${ actualMouseY }`);
            for (let [key, value] of Object.entries(linesDict)) {
                if (tester.test(key)) {
                    delete(linesDict[key]);
                    document.querySelector(`#l${key}`).remove();
                }
            }
        }
    }
    
    

    //LINES
    if (curentGate == "addLine" || curentGate == "deleteLine") {
        if (checker) {
            firstLocationX = actualMouseX;
            firstLocationY = actualMouseY;
            checker = false;
        } else {
            if (gatesDict.hasOwnProperty(`${ actualMouseX }_${ actualMouseY }`) == true && gatesDict.hasOwnProperty(`${ firstLocationX }_${ firstLocationY }`) == true ) {
                if (curentGate == "addLine") {
                    let tester = new RegExp("EXTERNAL-");

                    if(tester.test(gatesDict[`${ actualMouseX }_${ actualMouseY }`][0])){
                        if(gatesDict[`${ actualMouseX }_${ actualMouseY }`][2] != 0){
                            workSpace.innerHTML += `<path id="l${firstLocationX}_${firstLocationY}-${actualMouseX}_${actualMouseY}" d="M${firstLocationX +45} ${firstLocationY +35} L${(firstLocationX +35 + actualMouseX -35)/2} ${firstLocationY +35} L${(firstLocationX + actualMouseX)/2} ${actualMouseY +35} L${actualMouseX -55} ${actualMouseY +35}" stroke="white" stroke-width="5" fill="none"/>`;
                            
                            let buffer = 0;
                            for(i in gatesDict[`${ actualMouseX }_${ actualMouseY }`][3]){
                                if(gatesDict[`${ actualMouseX }_${ actualMouseY }`][3][i] == false){
                                    console.log(i);
                                    buffer = i;
                                    break;
                                }
                            }
                            
                            linesDict[`${ firstLocationX }_${ firstLocationY }-${ actualMouseX }_${ actualMouseY }`] = buffer;
                            setState(actualMouseX, actualMouseY, firstLocationX, firstLocationY, buffer);
                            --gatesDict[`${ actualMouseX }_${ actualMouseY }`][2];
                        }
                    }else{
                        workSpace.innerHTML += `<path id="l${firstLocationX}_${firstLocationY}-${actualMouseX}_${actualMouseY}" d="M${firstLocationX +45} ${firstLocationY +35} L${(firstLocationX +35 + actualMouseX -35)/2} ${firstLocationY +35} L${(firstLocationX + actualMouseX)/2} ${actualMouseY +35} L${actualMouseX -55} ${actualMouseY +35}" stroke="white" stroke-width="5" fill="none"/>`;
                        linesDict[`${ firstLocationX }_${ firstLocationY }-${ actualMouseX }_${ actualMouseY }`] = "exist";
                        setState(actualMouseX, actualMouseY, firstLocationX, firstLocationY);

                    }
                }
                if (curentGate == "deleteLine" && linesDict[`${ firstLocationX }_${ firstLocationY }-${ actualMouseX }_${ actualMouseY }`] == "exist") {
                    document.querySelector(`#l${ firstLocationX }_${ firstLocationY }-${ actualMouseX }_${ actualMouseY }`).remove();
                    delete(linesDict[`${ firstLocationX }_${ firstLocationY }-${ actualMouseX }_${ actualMouseY }`]);
                }
                checker = true;
                setState(actualMouseX, actualMouseY, firstLocationX, firstLocationY);
            }
        }

    }
    
    lightTurnOn();
});