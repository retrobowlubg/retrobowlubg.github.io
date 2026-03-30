function CCharacterInHole(iX,iY,oParentContainer){
    var _iX;
    var _iY;
    var _iMaskWidth;
    var _iMaskHeight;
    
    var _oParent = this;
    var _oCell;
    var _oMask;
    
    var _bCellOccupied;
    var _bHit;
    
    var _aPosToStayX = new Array();
    var _aPosToStayY = new Array();
    var _aScoreNum = new Array();
    var _aScoreNumShadow = new Array();
    var _aCharacter = new Array();
    var aCharacterSprite = new Array(CHARACTER_NUM);
    
    this._init = function(iX,iY,oParentContainer){
        _iX = iX;
        _iY = iY;
        
        aCharacterSprite[0] = {   
                    images: [s_oSpriteLibrary.getSprite('character_0')], 
                    // width, height & registration point of each sprite
                    frames: {width: CHARACTER_WIDTH[0], height: CHARACTER_HEIGHT[0], regX: CHARACTER_WIDTH[0]/2, regY: CHARACTER_HEIGHT[0]}, 
                    animations: {start:[0], idle:[0, 16, "idle"], hit:[17,29,"hit_stop"],hit_stop:[29]}
                };
        aCharacterSprite[1] = {   
                    images: [s_oSpriteLibrary.getSprite('character_1')], 
                    // width, height & registration point of each sprite
                    frames: {width: CHARACTER_WIDTH[1], height: CHARACTER_HEIGHT[1], regX: CHARACTER_WIDTH[1]/2, regY: CHARACTER_HEIGHT[1]}, 
                    animations: {start:[0], idle:[0, 16, "idle"], hit:[17,29,"hit_stop"],hit_stop:[29]}
                };
        aCharacterSprite[2] = {   
                    images: [s_oSpriteLibrary.getSprite('character_2')], 
                    // width, height & registration point of each sprite
                    frames: {width: CHARACTER_WIDTH[2], height: CHARACTER_HEIGHT[2], regX: CHARACTER_WIDTH[2]/2, regY: CHARACTER_HEIGHT[2]}, 
                    animations: {start:[0], idle:[0, 16, "idle"], hit:[17,29,"hit_stop"],hit_stop:[29]}
                };
        aCharacterSprite[3] = {   
                    images: [s_oSpriteLibrary.getSprite('character_3')], 
                    // width, height & registration point of each sprite
                    frames: {width: CHARACTER_WIDTH[3], height: CHARACTER_HEIGHT[3], regX: CHARACTER_WIDTH[3]/2, regY: CHARACTER_HEIGHT[3]}, 
                    animations: {start:[0], idle:[0, 16, "idle"], hit:[17,29,"hit_stop"],hit_stop:[29]}
                };
        aCharacterSprite[4] = {   
                    images: [s_oSpriteLibrary.getSprite('character_4')], 
                    // width, height & registration point of each sprite
                    frames: {width: CHARACTER_WIDTH[4], height: CHARACTER_HEIGHT[4], regX: CHARACTER_WIDTH[4]/2, regY: CHARACTER_HEIGHT[4]}, 
                    animations: {start:[0], idle:[0, 16, "idle"], hit:[17,29,"hit_stop"],hit_stop:[29]}
                };

        _bCellOccupied = false;
        _bHit = false;
        
        _iMaskWidth = HOLE_WIDTH;
        _iMaskHeight = BIGGER_HEIGHT;
        
        
        _oMask = new createjs.Shape();
        _oMask.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(iX-(HOLE_WIDTH/2), iY-HOLE_HEIGHT - 30, _iMaskWidth, _iMaskHeight);
        oParentContainer.addChild(_oMask);
            
        for(var i = 0; i<CHARACTER_NUM; i++){
            var oSpriteSheetCharacter = new createjs.SpriteSheet(aCharacterSprite[i]);
            _aCharacter.push (createSprite(oSpriteSheetCharacter, "start", 0, 0, CHARACTER_WIDTH[i], CHARACTER_HEIGHT[i]));
            _aCharacter[i].x = iX;
            _aPosToStayX.push(iX);
            _aCharacter[i].y = iY+HOLE_HEIGHT+50;
            _aPosToStayY.push(iY+HOLE_HEIGHT+50);
            _aCharacter[i].rotation = 0;
            _aCharacter[i].stop;
            oParentContainer.addChild(_aCharacter[i]);
            _aCharacter[i].mask = _oMask;
            
            _aScoreNumShadow.push(new createjs.Text(CHARACTER_POINTS[i],"60px "+FONT, "#000000"));
            _aScoreNumShadow[i].x = iX+2;
            _aScoreNumShadow[i].y = iY-148;
            _aScoreNumShadow[i].textAlign = "center";
            _aScoreNumShadow[i].textBaseline = "alphabetic";
            _aScoreNumShadow[i].lineWidth = 200;
            _aScoreNumShadow[i].visible = false;
            s_oStage.addChild(_aScoreNumShadow[i]);
            
            var szColor = "#ffb557";
            if(i === CHARACTER_NUM-1){
                szColor = "#ff3131";
            }
            _aScoreNum.push(new createjs.Text(CHARACTER_POINTS[i],"60px "+FONT, szColor));
            _aScoreNum[i].x = iX;
            _aScoreNum[i].y = iY-150;
            _aScoreNum[i].textAlign = "center";
            _aScoreNum[i].textBaseline = "alphabetic";
            _aScoreNum[i].lineWidth = 200;
            _aScoreNum[i].visible = false;
            s_oStage.addChild(_aScoreNum[i]); 
        }
        
        var oSpriteHole = s_oSpriteLibrary.getSprite('terrain_hole');
        _oCell = createBitmap(oSpriteHole, oSpriteHole.width,oSpriteHole.height);
        _oCell.regX = oSpriteHole.width/2;
        _oCell.regY = oSpriteHole.height/2;
        _oCell.x = iX;
        _oCell.y = iY;
        _oCell.rotation = 0;
        oParentContainer.addChild(_oCell);  
    };
    
    this.spawnCharacter = function(iCharacter, iTimeSpawn,iTimeWait){
        _aCharacter[iCharacter].gotoAndPlay("idle");
        createjs.Tween.get(_aCharacter[iCharacter] ).wait(iTimeSpawn).to({y:_aCharacter[iCharacter].y-HOLE_HEIGHT-50 }, 500, createjs.Ease.cubicOut)
                .wait(iTimeWait).call(function() {_oParent.deleteCharacter(iCharacter);});
        _bCellOccupied = true;
    };
    
    this.deleteCharacter = function(iCharacter){
        
        createjs.Tween.get(_aCharacter[iCharacter] ).to({y:_aPosToStayY[iCharacter] }, 300, createjs.Ease.cubicIn).call(function() {
                                                            _aCharacter[iCharacter].gotoAndStop("start");
                                                            _bCellOccupied = false;
                                                            _bHit = false;
                                                        });  
    };
    
    this._hitCell = function(iCharacter,iMult){
        if(_bCellOccupied && !_bHit){
            _bHit = true;
            s_oGame._scoreModifier(iCharacter);
            
            _aCharacter[iCharacter].gotoAndPlay("hit");
            
            createjs.Tween.get(_aCharacter[iCharacter], {override:true} ).wait(500).to({y:_aPosToStayY[iCharacter] }, 500, createjs.Ease.cubicIn).call(function(){
                _bCellOccupied = false;
                _bHit = false;
            });
                                                                                                                                        
            
            if(iCharacter === 4 ){
                playSound("bomb",1,false);
                s_oGame.tremble();
            }else{
                playSound("hit",1,false);
            }
            
            var szScore = "";
            if(CHARACTER_POINTS[iCharacter] > 0){
                szScore = "+";
            }
            
            szScore += (iMult*CHARACTER_POINTS[iCharacter])
            _aScoreNum[iCharacter].text = szScore;
            _aScoreNum[iCharacter].visible = true;
            
            createjs.Tween.get(_aScoreNum[iCharacter] ).to({y:_aScoreNum[iCharacter].y-50}, 1500);
            createjs.Tween.get(_aScoreNum[iCharacter] ).to({alpha:0}, 2000).call(function() {_aScoreNum[iCharacter].visible = false;
                                                                                                               _aScoreNum[iCharacter].y+=50;
                                                                                                               _aScoreNum[iCharacter].alpha = 1;
                                                                                                              });
            _aScoreNumShadow[iCharacter].visible = true;  
            _aScoreNumShadow[iCharacter].text = szScore;
            createjs.Tween.get(_aScoreNumShadow[iCharacter] ).to({y:_aScoreNumShadow[iCharacter].y-50}, 1500);
            createjs.Tween.get(_aScoreNumShadow[iCharacter] ).to({alpha:0}, 2000).call(function() {_aScoreNumShadow[iCharacter].visible = false;
                                                                                                                           _aScoreNumShadow[iCharacter].y+=50;
                                                                                                                           _aScoreNumShadow[iCharacter].alpha = 1;
                                                                                                                          });
        }
    };
    
    this.getValue = function(){
        return _bCellOccupied;
    };
    
    this.unload = function(i){
        for(var i = 0; i<CHARACTER_NUM; i++){
            _aCharacter.pop();
            _aScoreNumShadow.pop();
            _aScoreNum.pop();
        }
        _aScoreNumShadow.pop();
        _aScoreNum.pop();
    };
    
    this._init(iX,iY,oParentContainer);
    
}