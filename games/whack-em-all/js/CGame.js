function CGame(oData){
    var _bSuperHammer;
    var _iScore;    
    var _iCurMultScore;
    var _iCurCharacterHit;
    
    var _iTimeLevelUpElapsed;
    var _iTimeElapsed;
    var _iTimeSuperHammerElaps;
    var _iCurTimeSpawn;
    var _iTimeSpawnElaps;
    
    var _aGrid;
    var _aCharacterToSpawn;

    var _aCharacterSelected;
        
    var _bUpdate;
    var _bOnHitArea = false;
    
    var _oHammer;
    var _oGameArea;
    var _oContainerGrid;
    var _oHitArea;
    var _oInterface;
    var _oAreYouSurePanel;
    var _oEndPanel = null;
    var _oParent;
    
    var _bPokiStart;
    this._init = function(){
        _bPokiStart = false;
        
        setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
        
        _iCurTimeSpawn = _iTimeSpawnElaps = START_SPAWN_TIME;
        _iTimeElapsed = TIME_LEVEL;
        _iTimeLevelUpElapsed = 0;
        _iTimeSuperHammerElaps = 0;
        _bSuperHammer = false;

        _iCurMultScore = 1;
        _iScore = 0;
        _iCurCharacterHit = 0;
        _aCharacterSelected = new Array(0, 0, 0, 0, 0, 0);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg); 
        
        var oSpriteHoleBg = s_oSpriteLibrary.getSprite("game_area");
        _oGameArea = createBitmap(oSpriteHoleBg);
        _oGameArea.regX = oSpriteHoleBg.width/2;
        _oGameArea.regY = oSpriteHoleBg.height/2;
        _oGameArea.x = CANVAS_WIDTH/2;
        _oGameArea.y = CANVAS_HEIGHT/2 + 100;
        s_oStage.addChild(_oGameArea);
        
        _oInterface = new CInterface();
        
        _oContainerGrid = new createjs.Container();
        s_oStage.addChild(_oContainerGrid);
        
        _aCharacterToSpawn = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4];

        this._createCells();   
        
        _oHammer = new CHammer(_oContainerGrid);
        
        _oAreYouSurePanel = new CAreYouSurePanel(s_oStage);
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,this.onConfirmExit,this);
        
        _oEndPanel = new CEndPanel();
                
        _bUpdate = true;
        this._selectCharacter();
        
        s_oGame.setPokiStart(true);
    };
    
    this._createCells = function(){
        var iX = START_X_GRID;
        var iY = START_Y_GRID;
        
        _aGrid = new Array();
        for(var iRow=0; iRow < NUM_ROWS; iRow++){
            _aGrid[iRow] = new Array();
            for(var iCol=0; iCol < NUM_COLS; iCol++){
                _aGrid[iRow][iCol] = new CCharacterInHole(iX,iY,_oContainerGrid, "hole");
                //SHAPE FOR HIT AREA
                _oHitArea = new createjs.Shape();
                _oHitArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(iX-(HOLE_WIDTH/2), iY-HOLE_HEIGHT, HOLE_WIDTH, HOLE_HEIGHT);
                _oContainerGrid.addChild(_oHitArea);
                _oHitArea.on("mousedown", s_oGame._hammerOn, this, false, {iRow: iRow, iCol: iCol});
                iX += HOLE_WIDTH;
            }
            iY += HOLE_HEIGHT;
            iX = START_X_GRID;
        } 
    };
    
    this._selectCharacter = function(){

            var iX;
            var iY;

            var iAttempt =0;
            do{
                iX = Math.floor(Math.random() * (NUM_ROWS));
                iY = Math.floor(Math.random() * (NUM_COLS));
                iAttempt++;
                if(iAttempt === 20){
                    return;
                }

            }while(_aGrid[iX][iY].getValue());



            var iRandIndex = Math.floor(Math.random()*_aCharacterToSpawn.length);
            _aCharacterSelected[((iX*NUM_ROWS)+iY)] = _aCharacterToSpawn[iRandIndex];
            var iRandTime = Math.floor(Math.random() * 1500);
            var iRandTimeWait = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
            _aGrid[iX][iY].spawnCharacter(_aCharacterSelected[((iX*NUM_ROWS)+iY)], iRandTime,iRandTimeWait);
    };
    
    this._hammerOn = function(event, iData){
        if(!_bOnHitArea) {
            _bOnHitArea = true;
            
            _aGrid[iData.iRow][iData.iCol]._hitCell(_aCharacterSelected[(NUM_ROWS*iData.iRow)+iData.iCol],_iCurMultScore);
            _oHammer._showHammer(START_Y_GRID+(HOLE_HEIGHT*iData.iRow)-150, START_X_GRID+(HOLE_WIDTH*iData.iCol));
            
            playSound("hammer",1,false);
            
            _bOnHitArea = false;
        }
    };
    
    this._hammerOff = function(){
        _oHammer.unload();
    };


    
    this._scoreModifier = function(iValue){
        
        _iScore += (CHARACTER_POINTS[iValue] * _iCurMultScore);
        if(_iScore < 0 ){
            _iScore = 0;
        }else if(_iScore > s_iBestScore){
            s_iBestScore = _iScore;
            
            _oInterface.refreshBestScore();
        }
        
        _oInterface.refreshScore(_iScore);
        
        if(CHARACTER_POINTS[iValue] > 0){
            _iCurCharacterHit++;
        }
    };
    
    this.tremble = function(){
        var xShifting = 10;
        var yShifting = 30;

        createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting), y: Math.round(Math.random()*yShifting) }, 50).call(function() {
            createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting*0.8), y:-Math.round(Math.random()*yShifting*0.8) }, 50).call(function() {
                createjs.Tween.get(s_oStage).to({y:0, x:0 }, 50);
            });
        });
        
    };
    
    
    this.unload = function(){
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }
        
        
        for(var i=0; i<NUM_ROWS; i++){
            for(var j=0; j<NUM_COLS; j++){
                _aGrid[i][j].unload();
            }
        }
        this._hammerOff();
        
        s_oGame = null;
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren(); 
    };
    
    this.onExit = function(){
        _oAreYouSurePanel.show();
    };
    
    this.onConfirmExit = function(){
        s_oMain.pokiShowCommercial( ()=>{
            s_oGame.unload();
        
            $(s_oMain).trigger("show_interlevel_ad");
            $(s_oMain).trigger("end_session");
            s_oMain.gotoMenu();
        });
    };

    this.gameOver = function(){   
        s_oGame.setPokiStart(false);
        
        _oEndPanel.show(_iScore);
        saveItem("whackemall_best_score",s_iBestScore);
    };
    
    this.setPokiStart = function(bVal){       
        if(bVal && !_bPokiStart){
            PokiSDK.gameplayStart();
            _bPokiStart = true;
        }else if(!bVal && _bPokiStart) {
            PokiSDK.gameplayStop();
            _bPokiStart = false;
        }
    };
    
    this.update = function(){
        if(_bUpdate){
            //REFRESH TIME BAR
            _iTimeElapsed -= s_iTimeElaps;
            _oInterface.refreshTime(_iTimeElapsed / (TIME_LEVEL) ); 
            if (_iTimeElapsed < 0){
                _bUpdate = false;
                _oInterface.refreshTimeText(formatTime(0));
                this.gameOver();
            }else{
                _oInterface.refreshTimeText(formatTime(_iTimeElapsed));
            }
            
            //REFRESH TIME FOR LEVEL UP
            _iTimeLevelUpElapsed += s_iTimeElaps;
            if(_iTimeLevelUpElapsed > TIME_OFFSET_PER_SPAWN_DECREASE){
                _iTimeLevelUpElapsed = 0;
                _iCurTimeSpawn -= OFFSET_SPAWN_TIME;
                if(_iCurTimeSpawn < 0){
                    _iCurTimeSpawn = 0;
                }
            }
            
            //REFRESH TIME FOR NEXT SPAWN
            _iTimeSpawnElaps -= s_iTimeElaps;
            if(_iTimeSpawnElaps < 0){
                _iTimeSpawnElaps = _iCurTimeSpawn;
                this._selectCharacter();
            }
            
            //CHECK IF SUPERHAMMER MUST BE ACTIVATED
            _iTimeSuperHammerElaps += s_iTimeElaps;
            if(_bSuperHammer){
                if(_iTimeSuperHammerElaps > SUPER_HAMMER_TIME){
                    _bSuperHammer = false;
                    _iCurMultScore = 1;
                    _oHammer.setState(0);
                    _oInterface.hideSuperHammer();
                }
            }else if(!_bSuperHammer && _iTimeSuperHammerElaps > TIME_SUPER_HAMMER_CHECK){
                _iTimeSuperHammerElaps = 0;
                if(_iCurCharacterHit >= 3){
                    _bSuperHammer = true;
                    _iCurMultScore = SUPER_HAMMER_MULT;
                    
                    PokiSDK.happyTime(1);
                    
                    _oHammer.setState(1);
                    _oInterface.showSuperHammer();
                }
                _iCurCharacterHit = 0;
            } 
        }
    };

    s_oGame=this;
    
    _oParent=this;
    
    TIME_LEVEL = oData.level_time;
    
    this._init();
}

var s_oGame;
